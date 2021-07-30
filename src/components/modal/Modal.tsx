import * as React from "react";
import * as ReactDOM from "react-dom";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { Icon } from "../Icon";
import { LinkButton } from "../Button";
import "./Modal.scss";

interface ModalPortalProps {
    children: React.ReactNode;
}

export function ModalPortal(props: ModalPortalProps) {
    const element = document.getElementById("modal-root");

    if (!element) {
        return null;
    }

    return ReactDOM.createPortal(props.children, element);
}

interface ModalProps {
    children: React.ReactNode;
    className?: string;
    showCancel?: boolean;
    onCancel?: () => void;
    showClose?: boolean;
    onClose?: () => void;
}

export function Modal(props: ModalProps) {
    const { t } = useTranslation();

    function onClose() {
        if (props.onClose) {
            props.onClose();
        }
    }

    const className = classNames("modal", props.className);

    return (
        <ModalPortal>
            <div className={className}>
                <div className="modal__content">
                    {props.showClose && (
                        <button className="modal__close" onClick={onClose} aria-label={t("modal.close")}>
                            <Icon name="crossBold" />
                        </button>
                    )}

                    {props.children}

                    {props.showCancel && (
                        <LinkButton
                            className="modal__cancel"
                            iconRight={<Icon name="cross" />}
                            onClick={props.onCancel}
                        >
                            {t("modal.cancel")}
                        </LinkButton>
                    )}
                </div>
            </div>
        </ModalPortal>
    );
}
