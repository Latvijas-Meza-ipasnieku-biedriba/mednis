import * as React from "react";
import { useTranslation } from "react-i18next";
import { IconButton, LinkButton } from "./Button";
import { Map } from "./map/Map";
import { MapLayers } from "./map/MapLayers";
import { Marker } from "./map/Marker";
import { NewSpinner } from "./NewSpinner";
import { ReactComponent as MarkerIcon } from "../assets/icons/marker.svg";
import { Text, Title } from "./Typography";
import { PositionResult } from "../hooks/useCurrentPosition";
import "./CurrentPosition.scss";

interface CurrentPositionProps {
    positionResult: PositionResult;
    showFetchPositionButtonOnMap?: boolean;
}

export function CurrentPosition(props: CurrentPositionProps) {
    const { t } = useTranslation();
    const { status, position, fetchPosition } = props.positionResult;

    return (
        <div className="current-position">
            {status === "loading" && (
                <div className="current-position-loading">
                    <NewSpinner />
                    <Title size="small">{t("currentPosition.loading")}</Title>
                </div>
            )}

            {status === "success" && position && (
                <div className="current-position-success">
                    <Map id="current-position" center={position} zoom={16}>
                        <MapLayers />

                        <Marker position={position} />

                        {props.showFetchPositionButtonOnMap && (
                            <div className="map__controls-top-right">
                                <IconButton
                                    size="small"
                                    borderRadius="full"
                                    icon="marker"
                                    title={t("currentPosition.fetchPosition")}
                                    onClick={fetchPosition}
                                />
                            </div>
                        )}
                    </Map>
                </div>
            )}

            {status === "failure" && (
                <div className="current-position-failure">
                    <Title size="small">{t("currentPosition.failure.title")}</Title>
                    <Text>{t("currentPosition.failure.message")}</Text>
                    <LinkButton onClick={fetchPosition} iconRight={<MarkerIcon />}>
                        {t("currentPosition.failure.button")}
                    </LinkButton>
                </div>
            )}
        </div>
    );
}
