import * as React from "react";
import classNames from "classnames";
import { useButton } from "@react-aria/button";
import { Icon, IconName } from "./Icon";
import "./List.scss";

interface ListProps {
    children: React.ReactNode;
    className?: string;
}

export function List(props: ListProps) {
    const className = classNames("list", props.className);

    return <div className={className}>{props.children}</div>;
}

interface ListItemProps {
    title: string;
    onClick: () => void;
    iconLeft?: IconName;
    iconRight?: IconName;
}

export function ListItem(props: ListItemProps) {
    const ref = React.useRef<HTMLButtonElement>(null);
    const { buttonProps, isPressed } = useButton({ onPress: props.onClick }, ref);

    const className = classNames("list-item", { "list-item--pressed": isPressed });

    return (
        <button {...buttonProps} ref={ref} className={className}>
            {props.iconLeft && (
                <div className="list-item__left-icon">
                    <Icon name={props.iconLeft} />
                </div>
            )}

            <span className="list-item__title">{props.title}</span>

            {props.iconRight && (
                <div className="list-item__right-icon">
                    <Icon name={props.iconRight} />
                </div>
            )}
        </button>
    );
}
