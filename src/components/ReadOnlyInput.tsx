import * as React from "react";
import { Label } from "./Typography";
import "./ReadOnlyInput.scss";
import classNames from "classnames";

interface ReadOnlyInputProps {
    id: string;
    label: string;
    value: string;
    iconLeft?: React.ReactNode;
}

export function ReadOnlyInput(props: ReadOnlyInputProps) {
    const inputDivClassName = classNames("read-only-input__value", {
        "read-only-input__value--with-icon": props.iconLeft,
    });
    return (
        <div className="read-only-input">
            <Label htmlFor={props.id}>{props.label}</Label>
            <div className={inputDivClassName}>
                {props.iconLeft}
                <input type="text" id={props.id} value={props.value} readOnly />
            </div>
        </div>
    );
}
