import * as React from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "../Icon";
import { ModalPortal } from "./Modal";
import classNames from "classnames";
import "./FullScreenModal.scss";

interface FullScreenModalProps {
    children: React.ReactNode;
    title: string;
    showBackButton?: boolean;
    onBackButtonClick?: () => void;
    showCloseButton?: boolean;
    onCloseButtonClick?: () => void;
    fullWidthContent?: boolean;
}

export function FullScreenModal(props: FullScreenModalProps) {
    const { t } = useTranslation();
    const contentClassName = classNames("full-screen-modal__content", {
        "full-screen-modal__content--full-width": props.fullWidthContent,
    });

    return (
        <ModalPortal>
            <div className="full-screen-modal">
                <div className="full-screen-modal__header">
                    <div className="full-screen-modal__header__content">
                        {props.showBackButton && (
                            <button
                                type="button"
                                className="full-screen-modal__header__content__back"
                                onClick={props.onBackButtonClick}
                                title={t("modal.back")}
                            >
                                <Icon name="arrowLeft" />
                            </button>
                        )}

                        <h1 className="full-screen-modal__header__content__title">{props.title}</h1>

                        {props.showCloseButton && (
                            <button
                                type="button"
                                className="full-screen-modal__header__content__close"
                                onClick={props.onCloseButtonClick}
                                title={t("modal.close")}
                            >
                                <Icon name="cross" />
                            </button>
                        )}
                    </div>
                </div>

                <div className={contentClassName}>{props.children}</div>
            </div>
        </ModalPortal>
    );
}
