import * as React from "react";
import classNames from "classnames";
import "./Tag.scss";

interface TagProps {
    text: string;
    className?: string;
}

export function Tag(props: TagProps) {
    const className = classNames("tag", props.className);
    return <span className={className}>{props.text}</span>;
}
