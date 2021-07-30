import * as React from "react";
import * as L from "leaflet";
import { configuration } from "../../configuration";
import "./Map.scss";

export const MapContext = React.createContext<{ map: L.Map } | null>(null);

export function useMapContext() {
    const context = React.useContext(MapContext);

    if (context === null) {
        throw new Error("MapContext used outside of <Map /> component");
    }

    return context;
}

interface MapProps {
    id: string;
    children?: React.ReactNode;
    center?: { lat: number; lng: number };
    zoom?: number;
}

export function Map(props: MapProps) {
    const mapRef = React.useRef<L.Map>();
    const [mapLoaded, setMapLoaded] = React.useState(false);

    React.useEffect(() => {
        const options: L.MapOptions = {
            zoomControl: false,
            attributionControl: false,
            minZoom: configuration.map.minZoom,
            maxZoom: configuration.map.maxZoom,
        };
        mapRef.current = L.map(props.id, options);
        mapRef.current.on("load", () => {
            setMapLoaded(true);
        });
        mapRef.current.setMaxBounds(configuration.map.bounds);
        mapRef.current.createPane("basemapPane");
        mapRef.current.createPane("layerPane");

        return () => {
            mapRef.current?.remove();
        };
    }, [props.id]);

    React.useEffect(() => {
        if (mapRef.current) {
            mapRef.current.setView(
                props.center ?? configuration.map.initialPosition.center,
                props.zoom ?? configuration.map.initialPosition.zoom
            );
        }
    }, [props.center, props.zoom]);

    return (
        <div className="map">
            <div id={props.id} className="leaflet-map"></div>

            {mapRef.current && mapLoaded && (
                <MapContext.Provider value={{ map: mapRef.current }}>{props.children}</MapContext.Provider>
            )}
        </div>
    );
}
