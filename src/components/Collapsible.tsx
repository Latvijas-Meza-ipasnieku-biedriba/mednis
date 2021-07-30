import * as React from "react";
import classNames from "classnames";
import { Icon } from "./Icon";
import { Badge } from "./Badge";
import "./Collapsible.scss";

interface CollapsibleProps {
    children: React.ReactNode;
}

export function Collapsible(props: CollapsibleProps) {
    return <div className="collapsible">{props.children}</div>;
}

interface CollapsibleItemProps {
    title: string;
    children: React.ReactNode;
    badgeCount?: number;
    contentRight?: React.ReactNode;
    collapsedByDefault?: boolean;
    className?: string;
}

export function CollapsibleItem(props: CollapsibleItemProps) {
    const [isCollapsed, setIsCollapsed] = React.useState(props.collapsedByDefault ?? false);

    function onToggle() {
        setIsCollapsed((isCollapsed) => !isCollapsed);
    }

    const className = classNames("collapsible-item", { "collapsible-item--collapsed": isCollapsed }, props.className);

    return (
        <div className={className}>
            <button type="button" className="collapsible-item__header" onClick={onToggle}>
                {props.title}
                {props.badgeCount && <Badge count={props.badgeCount} />}
                {props.contentRight && <div className="collapsible-item__header__right">{props.contentRight}</div>}
                <Icon name={isCollapsed ? "chevronDown" : "chevronUp"} />
            </button>
            {!isCollapsed && <div className="collapsible-item__content">{props.children}</div>}
        </div>
    );
}
