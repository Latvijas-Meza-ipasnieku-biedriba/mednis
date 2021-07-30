import * as React from "react";
import { useMapContext } from "./Map";
import "./Scale.scss";

interface ScaleState {
    label: string;
    width: number;
}

interface ScaleProps {
    maxWidth?: number;
}

export function Scale({ maxWidth = 100 }: ScaleProps) {
    const { map } = useMapContext();
    const [scale, setScale] = React.useState<ScaleState>({ label: "", width: 0 });

    // Based on Leaflet's code for Scale control
    // https://github.com/Leaflet/Leaflet/blob/master/src/control/Control.Scale.js
    const updateScale = React.useCallback(() => {
        const y = map.getSize().y / 2;
        const maxMeters = map.distance(map.containerPointToLatLng([0, y]), map.containerPointToLatLng([maxWidth, y]));
        const meters = getRoundNumber(maxMeters);
        const label = meters < 1000 ? meters + " m" : meters / 1000 + " km";
        const ratio = meters / maxMeters;
        const width = Math.round(maxWidth * ratio);

        setScale({ label, width });
    }, [map, maxWidth]);

    React.useEffect(() => {
        updateScale();
    }, [updateScale]);

    React.useEffect(() => {
        map.on("zoom", updateScale);

        return () => {
            map.off("zoom", updateScale);
        };
    }, [map, updateScale]);

    return (
        <div className="scale" style={{ width: `${scale.width}px` }}>
            {scale.label}
        </div>
    );
}

function getRoundNumber(num: number): number {
    const pow10 = Math.pow(10, (Math.floor(num) + "").length - 1);

    let d = num / pow10;

    if (d >= 10) {
        d = 10;
    } else if (d >= 5) {
        d = 5;
    } else if (d >= 3) {
        d = 3;
    } else if (d >= 2) {
        d = 2;
    } else {
        d = 1;
    }

    return pow10 * d;
}
