import * as React from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "../Icon";
import { MessageModal } from "../modal/MessageModal";
import { PhotoPrompt } from "./PhotoPrompt";
import { PhotoReference } from "../../types/photo";
import { usePhotoCapture } from "../../hooks/usePhotoCapture";
import "./PhotoSelect.scss";

export type PhotoSelectMode = "prompt" | "camera" | "photos";

interface PhotoSelectProps {
    mode: PhotoSelectMode;
    onSelect: (photo: PhotoReference) => void;
}

export function PhotoSelect(props: PhotoSelectProps) {
    const { t } = useTranslation();
    const { capturePhoto, choosePhoto } = usePhotoCapture(onPhotoSuccess, onPhotoFailure);

    const [promptOpen, setPromptOpen] = React.useState(false);
    const [photoFailureMessageOpen, setPhotoFailureMessageOpen] = React.useState(false);

    function onSelectPhoto() {
        switch (props.mode) {
            case "prompt":
                setPromptOpen(true);
                break;
            case "camera":
                capturePhoto();
                break;
            case "photos":
                choosePhoto();
                break;
        }
    }

    function onClosePrompt() {
        setPromptOpen(false);
    }

    function onPhotoSuccess(photo: PhotoReference) {
        props.onSelect(photo);
    }

    function onPhotoFailure() {
        setPhotoFailureMessageOpen(true);
    }

    function onClosePromptFailureMessage() {
        setPhotoFailureMessageOpen(false);
    }

    return (
        <>
            <button className="photo-select" onClick={onSelectPhoto} aria-labelledby="photo-select__title">
                <div className="photo-select__icon">
                    <Icon name="picture" />
                </div>
                <span id="photo-select__title" className="photo-select__title">
                    {t("photo.select")}
                </span>
            </button>

            {promptOpen && (
                <PhotoPrompt onClose={onClosePrompt} onCapturePhoto={capturePhoto} onChoosePhoto={choosePhoto} />
            )}

            {photoFailureMessageOpen && (
                <MessageModal
                    variant="failure"
                    title={t("photo.failure.title")}
                    description={t("photo.failure.message")}
                    showClose
                    onClose={onClosePromptFailureMessage}
                />
            )}
        </>
    );
}
