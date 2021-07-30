import * as React from "react";
import { useTranslation } from "react-i18next";
import { Icon, IconName } from "./Icon";
import "./FullWidthButton.scss";

interface FullWidthButtonProps {
    title: string;
    icon: IconName;
    onButtonClick: () => void;
}

export function FullWidthButton(props: FullWidthButtonProps) {
    const { t } = useTranslation();
    return (
        <button className="full-width-button" type="button" onClick={props.onButtonClick} title={t("modal.close")}>
            <div className="full-width-button__content">
                <h1 className="full-width-button__content__title">{props.title}</h1>
                <div className="full-width-button__content__icon">
                    <Icon name={props.icon} />
                </div>
            </div>
        </button>
    );
}
