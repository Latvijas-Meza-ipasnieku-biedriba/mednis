import * as React from "react";
import * as L from "leaflet";
import { match } from "ts-pattern";
import { MapPane } from "../../types/map";
import { useMapContext } from "./Map";
import { useFeaturesContext } from "../../hooks/useFeaturesContext";
import mapPinObservationsIcon from "../../assets/icons/map-pin-observations.svg";
import mapPinDamageIcon from "../../assets/icons/map-pin-damage.svg";

interface FeaturesLayerProps {
    type: "observations" | "damages";
    pane: MapPane;
}

export function FeaturesLayer({ type, pane }: FeaturesLayerProps) {
    const { map } = useMapContext();
    const layerRef = React.useRef<L.Layer>();

    const { observations, damages } = useFeaturesContext();

    const features = match(type)
        .with("observations", () => observations)
        .with("damages", () => damages)
        .exhaustive();
    const iconUrl = match(type)
        .with("observations", () => mapPinObservationsIcon)
        .with("damages", () => mapPinDamageIcon)
        .exhaustive();

    React.useEffect(() => {
        const layers = features.map((feature) =>
            L.geoJSON(feature.geometry, {
                pointToLayer: (feature, latLng) => {
                    const icon = L.icon({
                        iconUrl,
                        iconSize: [28, 34],
                        iconAnchor: [14, 34],
                    });
                    return L.marker(latLng, { icon });
                },
            })
        );
        layerRef.current = L.layerGroup(layers, { pane });
        layerRef.current.addTo(map);

        return () => {
            layerRef.current?.removeFrom(map);
        };
    }, [map, features, iconUrl, pane]);

    return <></>;
}
