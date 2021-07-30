import * as React from "react";
import { useTranslation } from "react-i18next";
import { configuration } from "../../configuration";
import { IconButton } from "../Button";
import { useMapContext } from "./Map";

export function ReturnHome() {
    const { t } = useTranslation();
    const { map } = useMapContext();

    function onReturnHome() {
        map.setView(configuration.map.initialPosition.center, configuration.map.initialPosition.zoom);
    }

    return (
        <IconButton size="small" borderRadius="full" icon="house" title={t("map.returnHome")} onClick={onReturnHome} />
    );
}
