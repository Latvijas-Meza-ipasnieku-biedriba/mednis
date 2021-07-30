import * as React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { Modal } from "../modal/Modal";
import "./PhotoPrompt.scss";

interface PhotoPromptProps {
    onClose: () => void;
    onChoosePhoto: () => void;
    onCapturePhoto: () => void;
    onViewPhoto?: () => void;
    showViewPhotoAction?: boolean;
}

export function PhotoPrompt(props: PhotoPromptProps) {
    const { t } = useTranslation();

    return (
        <Modal showCancel onCancel={props.onClose} showClose onClose={props.onClose}>
            <div className="photo-prompt">
                <Button icon={<Icon name="browse" />} onClick={props.onChoosePhoto}>
                    {t("photo.prompt.chooseFromPhotos")}
                </Button>
                <Button icon={<Icon name="camera" />} onClick={props.onCapturePhoto}>
                    {t("photo.prompt.capture")}
                </Button>
                {props.showViewPhotoAction && (
                    <Button icon={<Icon name="picture" />} onClick={props.onViewPhoto}>
                        {t("photo.prompt.view")}
                    </Button>
                )}
            </div>
        </Modal>
    );
}
