import * as React from "react";
import classNames from "classnames";
import "./Typography.scss";

type HeadingTag = "h1" | "h2" | "h3" | "h4";

type TitleSize = "small" | "medium" | "large" | "largest";

const headings: Record<TitleSize, HeadingTag> = {
    small: "h4",
    medium: "h3",
    large: "h2",
    largest: "h1",
};

interface TitleProps {
    size?: TitleSize;
    className?: string;
    children: React.ReactNode;
}
export function Title(props: TitleProps) {
    const Heading = headings[props.size ?? "medium"];
    const className = classNames("title", props.className);

    return <Heading className={className}>{props.children}</Heading>;
}

interface TextProps {
    bold?: boolean;
    className?: string;
    children: React.ReactNode;
}

export function Text(props: TextProps) {
    const className = classNames("text", { "text-bold": props.bold }, props.className);

    return <p className={className}>{props.children}</p>;
}

interface LabelProps {
    htmlFor?: string;
    className?: string;
    secondaryLabel?: string;
    children: React.ReactNode;
}

export function Label(props: LabelProps) {
    const className = classNames("label", props.className);

    return (
        <label className={className} htmlFor={props.htmlFor}>
            {props.children}
            {props.secondaryLabel && <span className="secondaryLabel">({props.secondaryLabel})</span>}
        </label>
    );
}
