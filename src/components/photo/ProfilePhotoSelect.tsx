import * as React from "react";
import { Icon } from "../Icon";
import "./ProfilePhotoSelect.scss";

interface ProfilePhotoSelectProps {
    onSelect: () => void;
}

export function ProfilePhotoSelect(props: ProfilePhotoSelectProps) {
    return (
        <button className="profile-photo-select" onClick={props.onSelect} aria-labelledby="profile-photo-select__title">
            <div className="profile-photo-select__icon">
                <Icon name="camera" />
            </div>
        </button>
    );
}
