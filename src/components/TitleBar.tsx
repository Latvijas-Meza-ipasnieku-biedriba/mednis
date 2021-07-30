import * as React from "react";
import { IconButton } from "./Button";
import { Title, Text } from "./Typography";
import "./TitleBar.scss";

interface TitleBarProps {
    title: string;
    position?: { lat: number; lng: number };
    onFetchPosition: () => void;
}

export function TitleBar(props: TitleBarProps) {
    return (
        <div className="title-bar">
            <Title>{props.title}</Title>
            <div className="position-container">
                {props.position && (
                    <Text className="position">
                        {props.position.lat.toFixed(5)}, {props.position.lng.toFixed(5)}
                    </Text>
                )}
                <IconButton
                    size="small"
                    borderRadius="full"
                    icon="marker"
                    title="Locate"
                    className="fetch-position"
                    onClick={props.onFetchPosition}
                />
            </div>
        </div>
    );
}
