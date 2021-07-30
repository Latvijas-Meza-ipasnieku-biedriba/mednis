import React from "react";
import { Label } from "./Typography";
import "./NumberInput.scss";

interface NumberInputProps {
    id: string;
    label: string;
    secondaryLabel?: string;
    value: string;
    disabled?: boolean;
    placeholder?: string;
    onChange: (value: string) => void;
}

export function NumberInput(props: NumberInputProps) {
    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        props.onChange(event.target.value);
    }

    return (
        <>
            <Label htmlFor={props.id} secondaryLabel={props.secondaryLabel}>
                {props.label}
            </Label>
            <input
                type="number"
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
