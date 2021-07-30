import * as React from "react";
import { IconButton } from "./Button";
import "./Stepper.scss";

interface StepperProps {
    value: number;
    onChange: (value: number) => void;
    minValue?: number;
    maxValue?: number;
}

export function Stepper(props: StepperProps) {
    function onIncrement() {
        const newValue = props.value + 1;

        if (!props.maxValue) {
            props.onChange(newValue);
            return;
        }

        if (newValue <= props.maxValue) {
            props.onChange(newValue);
        }
    }

    function onDecrement() {
        const newValue = props.value - 1;

        if (!props.minValue) {
            props.onChange(newValue);
            return;
        }

        if (newValue >= props.minValue) {
            props.onChange(newValue);
        }
    }

    return (
        <div className="stepper">
            <IconButton size="small" borderRadius="full" icon="minus" onClick={onDecrement} title="Decrement" />
            <span className="stepper__label">{props.value}</span>
            <IconButton size="small" borderRadius="full" icon="plus" onClick={onIncrement} title="Increment" />
        </div>
    );
}
