import * as React from "react";
import { Plugins } from "@capacitor/core";
import { useMapContext } from "./Map";
import { StorageKey } from "../../types/storage";

interface MapPostition {
    center: { lat: number; lng: number };
    zoom: number;
}

interface MapPositionPersistenceProps {
    mapId: string;
}

export function MapPositionPersistence({ mapId }: MapPositionPersistenceProps) {
    const { map } = useMapContext();

    const storageKey = `${StorageKey.MapPosition}-${mapId}`;

    // Restore position
    React.useEffect(() => {
        let ignore = false;

        Plugins.Storage.get({ key: storageKey }).then((result) => {
            if (ignore) {
                return;
            }

            if (result.value) {
                const { center, zoom } = JSON.parse(result.value) as MapPostition;
                map.setView(center, zoom);
            }
        });

        return () => {
            ignore = true;
        };
    }, [map, storageKey]);

    // Persist position
    React.useEffect(() => {
        function onMoveEnd() {
            const center = map.getCenter();
            const zoom = map.getZoom();
            const position: MapPostition = { center, zoom };
            Plugins.Storage.set({ key: storageKey, value: JSON.stringify(position) });
        }

        map.addEventListener("moveend", onMoveEnd);

        return () => {
            map.removeEventListener("moveend", onMoveEnd);
        };
    }, [map, storageKey]);

    return <></>;
}
