import * as React from "react";
import classNames from "classnames";
import "./Badge.scss";

interface BadgeProps {
    count: number;
    className?: string;
}

export function Badge(props: BadgeProps) {
    const className = classNames("badge", props.className);

    return <span className={className}>{props.count}</span>;
}
