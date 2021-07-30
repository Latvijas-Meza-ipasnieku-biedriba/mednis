import * as React from "react";
import { match } from "ts-pattern";
import { useTranslation } from "react-i18next";
import { Collapsible, CollapsibleItem } from "../../components/Collapsible";
import { FullScreenModal } from "../../components/modal/FullScreenModal";
import { ImageCheckbox } from "../../components/Checkbox";
import { ImageRadio } from "../../components/Radio";
import { logger } from "../../utils/logger";
import { useMapSettingsContext } from "../../hooks/useMapSettings";
import { useDistrictsContext } from "../../hooks/useDistrictsContext";
import { configuration } from "../../configuration";

interface MapSettingsProps {
    onClose: () => void;
}

export function MapSettings(props: MapSettingsProps) {
    const { t } = useTranslation();

    const { state, dispatch } = useMapSettingsContext();
    const districts = useDistrictsContext();

    if (state.status !== "loaded") {
        return null;
    }

    return (
        <FullScreenModal title={t("map.settings.title")} showCloseButton onCloseButtonClick={props.onClose}>
            <Collapsible>
                {configuration.map.serviceGroups.map((serviceGroup) => (
                    <CollapsibleItem key={serviceGroup.id} title={t(serviceGroup.title)}>
                        <div className="service-grid">
                            {serviceGroup.services.map((serviceId) => {
                                const service = configuration.map.services.find((service) => service.id === serviceId);

                                const checked = state.settings.visibleServiceIds.includes(serviceId);

                                function onChange() {
                                    dispatch({ type: "toggleService", serviceGroupId: serviceGroup.id, serviceId });
                                }

                                if (!service) {
                                    logger.error(
                                        `Missing service "${serviceId}" for service group "${serviceGroup.id}"`
                                    );
                                    return null;
                                }

                                // Hide districts service when districts are not available
                                if (service.id === "districts" && districts.length === 0) {
                                    return null;
                                }

                                return match(serviceGroup.selectionMode)
                                    .with("single", () => (
                                        <ImageRadio
                                            key={serviceId}
                                            name={`${serviceGroup.id}-service`}
                                            value={serviceId}
                                            label={t(service.title)}
                                            image={service.thumbnail}
                                            checked={checked}
                                            onChange={onChange}
                                        />
                                    ))
                                    .with("single-checkable", "multiple", () => (
                                        <ImageCheckbox
                                            key={serviceId}
                                            id={`${serviceGroup.id}-${serviceId}-service`}
                                            value={serviceId}
                                            label={t(service.title)}
                                            image={service.thumbnail}
                                            checked={checked}
                                            onChange={onChange}
                                        />
                                    ))
                                    .exhaustive();
                            })}
                        </div>
                    </CollapsibleItem>
                ))}
            </Collapsible>
        </FullScreenModal>
    );
}
