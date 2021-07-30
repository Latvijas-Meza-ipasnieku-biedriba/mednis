import * as React from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { useButton } from "@react-aria/button";
import { Icon, IconName } from "../../components/Icon";
import "./NumPad.scss";

interface NumPadProps {
    onEnterDigit: (digit: number) => void;
    onRemoveDigit: () => void;
}

export function NumPad(props: NumPadProps) {
    const { t } = useTranslation();

    return (
        <div className="num-pad">
            <NPDigitButton digit={1} onClick={props.onEnterDigit} />
            <NPDigitButton digit={2} onClick={props.onEnterDigit} />
            <NPDigitButton digit={3} onClick={props.onEnterDigit} />
            <NPDigitButton digit={4} onClick={props.onEnterDigit} />
            <NPDigitButton digit={5} onClick={props.onEnterDigit} />
            <NPDigitButton digit={6} onClick={props.onEnterDigit} />
            <NPDigitButton digit={7} onClick={props.onEnterDigit} />
            <NPDigitButton digit={8} onClick={props.onEnterDigit} />
            <NPDigitButton digit={9} onClick={props.onEnterDigit} />
            <NPSpacer />
            <NPDigitButton digit={0} onClick={props.onEnterDigit} />
            <NPIconButton icon="backspace" onClick={props.onRemoveDigit} title={t("general.delete")} />
        </div>
    );
}

interface NPDigitButtonProps {
    digit: number;
    onClick: (digit: number) => void;
}

export function NPDigitButton(props: NPDigitButtonProps) {
    const ref = React.useRef<HTMLButtonElement>(null);
    const { buttonProps, isPressed } = useButton({ onPress: () => props.onClick(props.digit) }, ref);

    const className = classNames("np-digit-button", { "np-digit-button--pressed": isPressed });

    return (
        <button {...buttonProps} className={className} ref={ref}>
            {props.digit}
        </button>
    );
}

interface NPIconButtonProps {
    icon: IconName;
    title: string;
    onClick: () => void;
}

export function NPIconButton(props: NPIconButtonProps) {
    const ref = React.useRef<HTMLButtonElement>(null);
    const { buttonProps, isPressed } = useButton({ onPress: props.onClick }, ref);

    const className = classNames("np-icon-button", { "np-icon-button--pressed": isPressed });

    return (
        <button {...buttonProps} ref={ref} className={className} title={props.title}>
            <Icon name={props.icon} />
        </button>
    );
}

export function NPSpacer() {
    return <div className="np-spacer"></div>;
}
