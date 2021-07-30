import * as React from "react";
import classNames from "classnames";
import "./Switch.scss";

interface SwitchProps {
    id: string;
    label: string;
    checked: boolean;
    className?: string;
    disabled?: boolean;
    onChange: (checked: boolean) => void;
}

export function Switch(props: SwitchProps) {
    const className = classNames("switch", props.className);

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        props.onChange(event.target.checked);
    }

    return (
        <div className={className}>
            <input
                type="checkbox"
                id={props.id}
                checked={props.checked}
                onChange={onChange}
                disabled={props.disabled}
            />
            <label htmlFor={props.id}>{props.label}</label>
        </div>
    );
}
