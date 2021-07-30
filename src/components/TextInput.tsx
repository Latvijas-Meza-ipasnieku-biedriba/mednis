import * as React from "react";
import { Label } from "./Typography";
import "./TextInput.scss";

interface TextInputProps {
    id: string;
    label?: string;
    value: string;
    disabled?: boolean;
    placeholder?: string;
    onChange: (value: string) => void;
}

export function TextInput(props: TextInputProps) {
    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        props.onChange(event.target.value);
    }

    return (
        <>
            {props.label && <Label htmlFor={props.id}>{props.label}</Label>}
            <input
                type="text"
                className="text-input"
                id={props.id}
                value={props.value}
                placeholder={props.placeholder}
                onChange={onChange}
                disabled={props.disabled}
            />
        </>
    );
}
