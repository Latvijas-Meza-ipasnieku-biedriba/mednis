import * as React from "react";
import { match } from "ts-pattern";
import { Layer } from "./Layer";
import { DistrictsLayer } from "./DistrictsLayer";
import { FeaturesLayer } from "./FeaturesLayer";
import { logger } from "../../utils/logger";
import { useMapSettingsContext } from "../../hooks/useMapSettings";
import { MapPane } from "../../types/map";
import { configuration } from "../../configuration";

export function MapLayers() {
    const { state } = useMapSettingsContext();

    if (state.status !== "loaded") {
        return null;
    }

    return (
        <>
            {configuration.map.serviceGroups.map((serviceGroup) =>
                serviceGroup.services.map((serviceId) => {
                    // Ignore hidden services
                    if (!state.settings.visibleServiceIds.includes(serviceId)) {
                        return null;
                    }

                    const service = configuration.map.services.find((service) => service.id === serviceId);
                    const pane = serviceGroup.isBasemapServiceGroup ? MapPane.Basemap : MapPane.Layer;

                    // Ignore missing services
                    if (!service) {
                        logger.error(`Missing service "${serviceId}" for service group "${serviceGroup.id}"`);
                        return null;
                    }

                    if (service.type === "Custom") {
                        return match<string, React.ReactNode>(serviceId)
                            .with("districts", () => <DistrictsLayer key={serviceId} pane={pane} />)
                            .with("observations", () => (
                                <FeaturesLayer key={serviceId} type="observations" pane={pane} />
                            ))
                            .with("damages", () => <FeaturesLayer key={serviceId} type="damages" pane={pane} />)
                            .otherwise(() => null);
                    }

                    return <Layer key={serviceId} service={service} pane={pane} />;
                })
            )}
        </>
    );
}
