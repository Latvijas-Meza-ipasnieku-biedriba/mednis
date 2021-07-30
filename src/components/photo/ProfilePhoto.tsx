import * as React from "react";
import { useTranslation } from "react-i18next";
import { PhotoPreview } from "./PhotoPreview";
import { ProfilePhotoSelect } from "./ProfilePhotoSelect";
import { PhotoPrompt } from "./PhotoPrompt";
import { MessageModal } from "../modal/MessageModal";
import { usePhotoCapture } from "../../hooks/usePhotoCapture";
import { PhotoReference } from "../../types/photo";
import "./ProfilePhoto.scss";

interface ProfilePhotoProps {
    photo: PhotoReference | string | undefined;
    onPhotoChange: (photo: PhotoReference) => void;
}

export function ProfilePhoto(props: ProfilePhotoProps) {
    const { t } = useTranslation();
    const { capturePhoto, choosePhoto } = usePhotoCapture(onPhotoSuccess, onPhotoFailure);

    const [promptOpen, setPromptOpen] = React.useState(false);
    const [previewOpen, setPreviewOpen] = React.useState(false);
    const [photoFailureMessageOpen, setPhotoFailureMessageOpen] = React.useState(false);

    function onSelectPhoto() {
        setPromptOpen(true);
    }

    function onClosePrompt() {
        setPromptOpen(false);
    }

    function onOpenPreview() {
        setPreviewOpen(true);
    }

    function onClosePreview() {
        setPreviewOpen(false);
    }

    function onPhotoSuccess(photo: PhotoReference) {
        props.onPhotoChange(photo);
        onClosePrompt();
    }

    function onPhotoFailure() {
        setPhotoFailureMessageOpen(true);
    }

    function onClosePromptFailureMessage() {
        setPhotoFailureMessageOpen(false);
    }

    return (
        <>
            {props.photo ? (
                <div className="profile-photo">
                    <button
                        type="button"
                        className="profile-photo__edit"
                        onClick={onSelectPhoto}
                        aria-label={t("photo.edit")}
                    >
                        <img src={typeof props.photo === "string" ? props.photo : props.photo.webPath} />
                        <div className="profile-photo__edit__title">
                            <span>{t("photo.edit")}</span>
                        </div>
                    </button>
                </div>
            ) : (
                <ProfilePhotoSelect onSelect={onSelectPhoto} />
            )}

            {promptOpen && (
                <PhotoPrompt
                    onClose={onClosePrompt}
                    onCapturePhoto={capturePhoto}
                    onChoosePhoto={choosePhoto}
                    onViewPhoto={onOpenPreview}
                    showViewPhotoAction={!!props.photo}
                />
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

            {previewOpen && props.photo && (
                <PhotoPreview
                    photo={typeof props.photo === "string" ? props.photo : props.photo.webPath}
                    onClose={onClosePreview}
                />
            )}
        </>
    );
}
