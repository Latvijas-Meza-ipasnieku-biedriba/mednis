import * as React from "react";
import { PermissionType, Plugins } from "@capacitor/core";
import { isAndroid } from "../utils/platform";

interface PositionState {
    status: "loading" | "success" | "failure";
    position?: L.LatLngLiteral;
}

export interface PositionResult extends PositionState {
    fetchPosition: () => void;
}

export function useCurrentPosition(): PositionResult {
    const [state, setState] = React.useState<PositionState>({ status: "loading" });

    React.useEffect(() => {
        if (state.status === "loading") {
            let cancelled = false;

            getCurrentPosition()
                .then((position) => {
                    if (!cancelled) {
                        setState({ status: "success", position });
                    }
                })
                .catch(() => {
                    if (!cancelled) {
                        setState({ status: "failure" });
                    }
                });

            return () => {
                cancelled = true;
            };
        }
    }, [state.status]);

    const fetchPosition = React.useCallback(() => setState({ status: "loading" }), []);

    return { ...state, fetchPosition };
}

function getCurrentPosition(): Promise<{ lat: number; lng: number }> {
    // WebView geolocation seems to return better results than Capacitor's plugin on Android
    // Since WebView's geolocation requires secure context (HTTPS) and it's really tricky to get working with webpack's
    // dev server, we'll fall back to Capacitor's plugin during development
    if (isAndroid() && process.env.NODE_ENV === "production") {
        Plugins.Permissions.query({ name: PermissionType.Geolocation }).then((result) => {
            if (result.state === "denied") {
                return Promise.reject(new Error("Geolocation permissions denied"));
            }

            if (result.state === "prompt") {
                if (Plugins.Geolocation.requestPermissions) {
                    return Plugins.Geolocation.requestPermissions().then(() => getCurrentPosition());
                }

                return Promise.reject(new Error("Cannot request Geolocation permissions"));
            }

            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    ({ coords }) => {
                        resolve({ lat: coords.latitude, lng: coords.longitude });
                    },
                    (error) => {
                        reject(error);
                    },
                    { enableHighAccuracy: true, timeout: 10_000, maximumAge: 0 }
                );
            });
        });
    }

    return Plugins.Geolocation.getCurrentPosition({ enableHighAccuracy: true }).then(({ coords }) => {
        return { lat: coords.latitude, lng: coords.longitude };
    });
}
