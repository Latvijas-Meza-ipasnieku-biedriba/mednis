import * as React from "react";
import { useTranslation } from "react-i18next";
import { IconButton } from "../../components/Button";
import { Map } from "../../components/map/Map";
import { MapLayers } from "../../components/map/MapLayers";
import { MapPositionPersistence } from "../../components/map/MapPositionPersistence";
import { MapSettings } from "./MapSettings";
import { Menu } from "../menu/Menu";
import { ReturnHome } from "../../components/map/ReturnHome";
import { Scale } from "../../components/map/Scale";
import { TrackPosition } from "../../components/map/TrackPosition";
import "./MapPage.scss";

export function MapPage() {
    const { t } = useTranslation();

    const [isMapSettingsOpen, setIsMapSettingsOpen] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    function onMenuOpen() {
        setIsMenuOpen(true);
    }

    function onMenuClose() {
        setIsMenuOpen(false);
    }

    function onMapSettingsOpen() {
        setIsMapSettingsOpen(true);
    }

    function onMapSettingsClose() {
        setIsMapSettingsOpen(false);
    }

    return (
        <div className="map-page">
            <Map id="main-map">
                <MapLayers />
                <MapPositionPersistence mapId="main-map" />

                <div className="map-controls-top-left">
                    <IconButton title={t("profile.title")} icon="userSettings" onClick={onMenuOpen} />
                </div>

                <div className="map-controls-top-right">
                    <div className="map-controls-top-right__buttons">
                        <ReturnHome />
                        <TrackPosition />
                    </div>
                    <Scale />
                </div>

                <div className="map-controls-bottom-left">
                    <IconButton title={t("map.settings.title")} icon="layers" onClick={onMapSettingsOpen} />
                </div>
            </Map>

            {isMapSettingsOpen && <MapSettings onClose={onMapSettingsClose} />}

            {isMenuOpen && <Menu onCloseButtonClick={onMenuClose} />}
        </div>
    );
}
