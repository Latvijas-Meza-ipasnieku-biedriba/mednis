import * as React from "react";
import { Icon, IconName } from "./Icon";
import classNames from "classnames";
import "./MenuList.scss";

interface MenuListProps {
    children: React.ReactNode;
}

export function MenuList(props: MenuListProps) {
    return <div className="menu-list">{props.children}</div>;
}

interface MenuListItemProps {
    title: string;
    icon?: IconName;
    onClick: () => void;
    paddedItem?: boolean;
}

export function MenuListItem(props: MenuListItemProps) {
    const className = classNames("menu-list-item", {
        "menu-list-item--padded": props.paddedItem,
    });
    return (
        <button type="button" className={className} onClick={props.onClick}>
            {props.icon && <Icon name={props.icon} />}
            <span>{props.title}</span>
        </button>
    );
}
