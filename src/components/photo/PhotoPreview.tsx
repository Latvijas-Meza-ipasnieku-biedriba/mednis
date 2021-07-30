import * as React from "react";
import { useTranslation } from "react-i18next";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Icon } from "../Icon";
import { ModalPortal } from "../modal/Modal";
import "./PhotoPreview.scss";

interface PhotoPreviewProps {
    photo: string;
    onClose: () => void;
}

export function PhotoPreview(props: PhotoPreviewProps) {
    const { t } = useTranslation();

    const closeButtonRef = React.useRef<HTMLButtonElement>(null);

    React.useEffect(() => {
        closeButtonRef.current?.focus();
    }, []);

    return (
        <ModalPortal>
            <div className="photo-preview">
                <button
                    ref={closeButtonRef}
                    type="button"
                    className="photo-preview__close"
                    aria-label={t("modal.close")}
                    onClick={props.onClose}
                >
                    <Icon name="cross" />
                </button>
                <TransformWrapper>
                    <TransformComponent>
                        <div className="photo-preview__image">
                            <img src={props.photo} />
                        </div>
                    </TransformComponent>
                </TransformWrapper>
            </div>
        </ModalPortal>
    );
}
