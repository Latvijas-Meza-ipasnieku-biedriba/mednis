import * as React from "react";
import classNames from "classnames";
import "./Button.scss";
import { Icon, IconName } from "./Icon";

interface ButtonProps {
    children: React.ReactNode;
    variant?: "default" | "danger";
    className?: string;
    disabled?: boolean;
    icon?: React.ReactNode;
    type?: "button" | "reset" | "submit";
    onClick?: () => void;
}

export function Button(props: ButtonProps) {
    const className = classNames(
        "button",
        { "button--with-icon": props.icon, "button--danger": props.variant === "danger" },
        props.className
    );

    return (
        <button type={props.type ?? "button"} className={className} onClick={props.onClick} disabled={props.disabled}>
            {props.children}
            {props.icon && <span className="icon-right">{props.icon}</span>}
        </button>
    );
}

interface IconButtonProps {
    title: string;
    icon: IconName;
    onClick: () => void;
    className?: string;
    disabled?: boolean;
    size?: "default" | "small";
    borderRadius?: "default" | "full";
}

export function IconButton(props: IconButtonProps) {
    const className = classNames(
        "icon-button",
        { "icon-button--small": props.size === "small", "icon-button--full-radius": props.borderRadius === "full" },
        props.className
    );

    return (
        <button
            type="button"
            className={className}
            onClick={props.onClick}
            disabled={props.disabled}
            title={props.title}
        >
            <Icon name={props.icon} />
        </button>
    );
}

interface LinkButtonProps {
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
    onClick?: () => void;
}

export function LinkButton(props: LinkButtonProps) {
    const className = classNames("link-button", props.className);

    return (
        <button type="button" className={className} onClick={props.onClick} disabled={props.disabled}>
            {props.iconLeft && <span className="icon icon-left">{props.iconLeft}</span>}
            {props.children}
            {props.iconRight && <span className="icon icon-right">{props.iconRight}</span>}
        </button>
    );
}
