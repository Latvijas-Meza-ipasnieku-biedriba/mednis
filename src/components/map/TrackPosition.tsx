import * as React from "react";
import * as L from "leaflet";
import { Plugins } from "@capacitor/core";
import { useTranslation } from "react-i18next";
import { IconButton } from "../Button";
import { MessageModal } from "../modal/MessageModal";
import { useMapContext } from "./Map";
import locationPinIcon from "../../assets/icons/location-pin.svg";
import "./TrackPosition.scss";

export function TrackPosition() {
    const { t } = useTranslation();
    const { map } = useMapContext();
    const { status, toggle, reset } = useTrackPosition(map);

    return (
        <>
            {status === "loading" && (
                <IconButton
                    size="small"
                    borderRadius="full"
                    icon="targetBackground"
                    title={t("map.position.disable")}
                    onClick={toggle}
                    className="track-position--loading"
                />
            )}

            {status === "active" && (
                <IconButton
                    size="small"
                    borderRadius="full"
                    icon="targetActive"
                    title={t("map.position.disable")}
                    onClick={toggle}
                />
            )}

            {status === "background" && (
                <IconButton
                    size="small"
                    borderRadius="full"
                    icon="targetBackground"
                    title={t("map.position.resume")}
                    onClick={toggle}
                />
            )}

            {(status === "idle" || status === "error") && (
                <IconButton
                    size="small"
                    borderRadius="full"
                    icon="target"
                    title={t("map.position.enable")}
                    onClick={toggle}
                />
            )}

            {status === "error" && (
                <MessageModal
                    variant="failure"
                    title={t("map.position.failure.title")}
                    description={t("map.position.failure.message")}
                    showClose
                    onClose={reset}
                />
            )}
        </>
    );
}

type State =
    | { status: "idle" | "loading" | "error" }
    | { status: "active" | "background"; position: { lat: number; lng: number }; accuracy: number };

type Action =
    | { type: "position_success"; position: { lat: number; lng: number }; accuracy: number }
    | { type: "position_failure" | "toggle" | "map_move" | "reset" };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "toggle":
            switch (state.status) {
                case "idle":
                    return { status: "loading" };
                case "loading":
                    return { status: "idle" };
                case "error":
                    return { status: "loading" };
                case "active":
                    return { status: "idle" };
                case "background":
                    return { ...state, status: "active" };
            }
        // Fallthrough should never occur because of exhaustive switch above
        // eslint-disable-next-line no-fallthrough
        case "position_success":
            if (state.status === "loading") {
                return {
                    status: "active",
                    position: action.position,
                    accuracy: action.accuracy,
                };
            }

            if (state.status === "active" || state.status === "background") {
                return {
                    status: state.status,
                    position: action.position,
                    accuracy: action.accuracy,
                };
            }

            return state;
        case "position_failure":
            return { status: "error" };
        case "map_move":
            if (state.status === "active") {
                return { ...state, status: "background" };
            }

            return state;
        case "reset":
            if (state.status === "error") {
                return { status: "idle" };
            }

            return state;
    }
}

function useTrackPosition(map: L.Map) {
    const [state, dispatch] = React.useReducer(reducer, { status: "idle" });

    // Watch position and accuracy changes
    React.useEffect(() => {
        let id: string;

        if (state.status === "loading" || state.status === "active" || state.status === "background") {
            id = Plugins.Geolocation.watchPosition(
                {
                    enableHighAccuracy: true,
                    timeout: 3000,
                    maximumAge: 30000,
                },
                (result, error) => {
                    if (error) {
                        console.error("Failed to watch position", error);
                        dispatch({ type: "position_failure" });
                        return;
                    }

                    dispatch({
                        type: "position_success",
                        position: { lat: result.coords.latitude, lng: result.coords.longitude },
                        accuracy: result.coords.accuracy,
                    });
                }
            );
        }

        return () => {
            Plugins.Geolocation.clearWatch({ id });
        };
    }, [state.status]);

    // Add position with accuracy to map
    React.useEffect(() => {
        let circle: L.Circle;
        let marker: L.Marker;

        if (state.status === "active" || state.status === "background") {
            circle = L.circle(state.position, state.accuracy, {
                opacity: 0.5,
                stroke: false,
                fillColor: "#3ED6CA",
            }).addTo(map);

            marker = L.marker(state.position, {
                icon: L.icon({
                    iconUrl: locationPinIcon,
                    iconSize: [32, 32],
                    iconAnchor: [16, 16],
                }),
            }).addTo(map);
        }

        return () => {
            circle?.removeFrom(map);
            marker?.removeFrom(map);
        };
    });

    // Keep map centered on position
    React.useEffect(() => {
        if (state.status === "active") {
            let zoom = map.getZoom();

            if (zoom < 12) {
                zoom = 12;
            }

            map.setView(state.position, zoom);
        }
    });

    // Trigger background status on map pan and/or zoom
    React.useEffect(() => {
        function onMoveStart() {
            dispatch({ type: "map_move" });
        }

        if (state.status === "active") {
            map.on("movestart", onMoveStart);
        }

        return () => {
            map.off("movestart", onMoveStart);
        };
    });

    const toggle = React.useCallback(() => {
        dispatch({ type: "toggle" });
    }, []);

    const reset = React.useCallback(() => {
        dispatch({ type: "reset" });
    }, []);

    return { status: state.status, toggle, reset };
}
