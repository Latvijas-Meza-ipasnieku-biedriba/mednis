import * as React from "react";
import "./SegmentedControl.scss";

interface SegmentedControlItemProps {
    value: string;
    label: string;
    name?: string;
    checked?: boolean;
    disabled?: boolean;
    onChange?: (value: string) => void;
}

export function SegmentedControlItem(props: SegmentedControlItemProps) {
    const id = `${props.name}-${props.value}`;

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        props.onChange?.(event.target.value);
    }

    return (
        <div className="segmented-control-item">
            <input
                type="radio"
                id={id}
                name={props.name}
                value={props.value}
                checked={props.checked}
                onChange={onChange}
                disabled={props.disabled}
            />
            <label htmlFor={id}>{props.label}</label>
        </div>
    );
}

interface SegmentedControlProps {
    name: string;
    value: string;
    disabled?: boolean;
    children: React.ReactElement<SegmentedControlItemProps>[];
    onChange: (value: string) => void;
}

export function SegmentedControl(props: SegmentedControlProps) {
    return (
        <div className="segmented-control">
            {React.Children.map(props.children, (child: React.ReactElement<SegmentedControlItemProps>) => {
                const { name, disabled, onChange } = props;
                const checked = child.props.value === props.value;

                return React.cloneElement(child, {
                    name,
                    checked,
                    disabled: disabled ?? child.props.disabled,
                    onChange,
                });
            })}
        </div>
    );
}
