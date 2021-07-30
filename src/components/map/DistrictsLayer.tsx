import * as React from "react";
import * as L from "leaflet";
import { MapPane } from "../../types/map";
import { useMapContext } from "./Map";
import { useDistrictsContext } from "../../hooks/useDistrictsContext";
import { useHunterContext } from "../../hooks/useHunterContext";

interface DistrictsLayerProps {
    pane: MapPane;
}

export function DistrictsLayer({ pane }: DistrictsLayerProps) {
    const layerRef = React.useRef<L.Layer>();
    const { map } = useMapContext();
    const districts = useDistrictsContext();
    const { hunterConfig } = useHunterContext();
    const { selectedDistrict } = hunterConfig;

    // Add currently selected district to map
    React.useEffect(() => {
        const district = districts.find((district) => district.id === selectedDistrict);

        if (district) {
            layerRef.current = L.geoJSON(district.shapeWgs);
            layerRef.current.addTo(map);

            return () => {
                layerRef.current?.removeFrom(map);
            };
        }
    }, [map, districts, selectedDistrict, pane]);

    return <></>;
}
