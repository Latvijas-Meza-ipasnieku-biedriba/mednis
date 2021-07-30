import * as React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { MessageModal } from "../modal/MessageModal";
import { PhotoPreview } from "./PhotoPreview";
import { PhotoSelect, PhotoSelectMode } from "./PhotoSelect";
import { PhotoReference } from "../../types/photo";
import "./Photo.scss";

interface PhotoProps {
    photo?: PhotoReference;
    onPhotoChange: (photo?: PhotoReference) => void;
    mode?: PhotoSelectMode;
}

export function Photo(props: PhotoProps) {
    const { t } = useTranslation();

    const [removeConfirmationOpen, setRemoveConfirmationOpen] = React.useState(false);
    const [previewOpen, setPreviewOpen] = React.useState(false);

    function onOpenRemoveConfirmation() {
        setRemoveConfirmationOpen(true);
    }

    function onCloseRemoveConfirmation() {
        setRemoveConfirmationOpen(false);
    }

    function removePhoto() {
        onCloseRemoveConfirmation();
        props.onPhotoChange();
    }

    function onOpenPreview() {
        setPreviewOpen(true);
    }

    function onClosePreview() {
        setPreviewOpen(false);
    }

    if (!props.photo) {
        return <PhotoSelect mode={props.mode ?? "prompt"} onSelect={props.onPhotoChange} />;
    }

    return (
        <>
            <div className="photo">
                <button type="button" className="photo__open" onClick={onOpenPreview} aria-label={t("photo.open")}>
                    <img src={props.photo?.webPath} />
                </button>
                <button
                    type="button"
                    className="photo__remove"
                    onClick={onOpenRemoveConfirmation}
                    aria-label={t("photo.remove.label")}
                >
                    <Icon name="trash" />
                </button>
            </div>

            {removeConfirmationOpen && (
                <MessageModal
                    variant="delete"
                    title={t("photo.remove.title")}
                    showCancel
                    onCancel={onCloseRemoveConfirmation}
                    showClose
                    onClose={onCloseRemoveConfirmation}
                >
                    <Button onClick={removePhoto}>{t("photo.remove.remove")}</Button>
                </MessageModal>
            )}

            {previewOpen && <PhotoPreview photo={props.photo?.webPath} onClose={onClosePreview} />}
        </>
    );
}
