import * as React from "react";
import * as L from "leaflet";
import * as esri from "esri-leaflet";
import { MapServiceCustom, MapService, MapPane } from "../../types/map";
import { useMapContext } from "./Map";

interface LayerProps {
    service: Exclude<MapService, MapServiceCustom>;
    pane: MapPane;
}

export function Layer(props: LayerProps) {
    const { map } = useMapContext();
    const layerRef = React.useRef<L.Layer>();

    React.useEffect(() => {
        getLayer(props.service, props.pane)
            .then((layer) => {
                layerRef.current = layer;
                layerRef.current.addTo(map);
            })
            .catch((error) => {
                console.error("Failed to get layer for service", { error, service: props.service });
            });

        return () => {
            layerRef.current?.removeFrom(map);
        };
    }, [map, props.service, props.pane]);

    return <></>;
}

function getLayer(service: Exclude<MapService, MapServiceCustom>, pane: MapPane): Promise<L.Layer> {
    switch (service.type) {
        case "WmsTiled":
            return Promise.resolve(
                L.tileLayer.wms(service.url, {
                    layers: service.layers.join(","),
                    format: service.imageFormat ?? "image/png",
                    pane,
                    minZoom: service.minZoom,
                    maxZoom: service.maxZoom,
                    maxNativeZoom: service.maxNativeZoom,
                    transparent: service.transparent,
                })
            );
        case "AgsTiled":
            return Promise.resolve(
                esri.tiledMapLayer({
                    url: service.url,
                    pane,
                    minZoom: service.minZoom,
                    maxZoom: service.maxZoom,
                    maxNativeZoom: service.maxNativeZoom,
                })
            );
        case "AgsDynamic":
            return Promise.resolve(
                esri.dynamicMapLayer({
                    url: service.url,
                    f: "image",
                    pane,
                    minZoom: service.minZoom,
                    maxZoom: service.maxZoom,
                })
            );
    }
}
