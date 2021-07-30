import * as React from "react";
import * as L from "leaflet";
import { useMapContext } from "./Map";
import mapPinIcon from "../../assets/icons/map-pin.svg";

interface MarkerProps {
    position: { lat: number; lng: number };
}

export function Marker(props: MarkerProps) {
    const { map } = useMapContext();
    const markerRef = React.useRef<L.Marker>();

    React.useEffect(() => {
        markerRef.current = L.marker(props.position, {
            icon: L.icon({
                iconUrl: mapPinIcon,
                iconSize: [96, 96],
                iconAnchor: [48, 56],
            }),
        });
        markerRef.current.addTo(map);

        return () => {
            markerRef.current?.removeFrom(map);
        };
    }, [map, props.position]);

    return <></>;
}
