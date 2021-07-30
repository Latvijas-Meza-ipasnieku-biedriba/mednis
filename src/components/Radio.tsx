import * as React from "react";
import classNames from "classnames";
import "./Radio.scss";

interface RadioProps {
    value: string;
    label: string;
    name?: string;
    checked?: boolean;
    disabled?: boolean;
    onChange?: (value: string) => void;
}

export function Radio(props: RadioProps) {
    const id = `${props.name}-${props.value}`;

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        props.onChange?.(event.target.value);
    }

    return (
        <div className="radio">
            <input
                type="radio"
                id={id}
                name={props.name}
                value={props.value}
                checked={props.checked}
                disabled={props.disabled}
                onChange={onChange}
            />
            <label htmlFor={id}>{props.label}</label>
        </div>
    );
}

interface RadioGroupProps {
    name: string;
    value: string;
    className?: string;
    disabled?: boolean;
    children: React.ReactElement<RadioProps>[];
    onChange: (value: string) => void;
}

export function RadioGroup(props: RadioGroupProps) {
    const className = classNames("radio-group", props.className);

    return (
        <div className={className}>
            {React.Children.map(props.children, (child: React.ReactElement<RadioProps>) => {
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

interface RadioButtonProps {
    value: string;
    children: React.ReactNode;
    name?: string;
    checked?: boolean;
    className?: string;
    disabled?: boolean;
    onChange?: (value: string) => void;
}

export function RadioButton(props: RadioButtonProps) {
    const className = classNames("radio-button", props.className);
    const id = `${props.name}-${props.value}`;

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        props.onChange?.(event.target.value);
    }

    return (
        <div className={className}>
            <input
                type="radio"
                id={id}
                name={props.name}
                value={props.value}
                checked={props.checked}
                disabled={props.disabled}
                onChange={onChange}
            />
            <label htmlFor={id}>{props.children}</label>
        </div>
    );
}

interface RadioButtonGroupProps {
    name: string;
    value: string;
    className?: string;
    disabled?: boolean;
    children: React.ReactElement<RadioProps>[];
    onChange: (value: string) => void;
}

export function RadioButtonGroup(props: RadioButtonGroupProps) {
    const className = classNames("radio-button-group-container", props.className);

    return (
        <div className={className}>
            <div className="radio-button-group">
                {React.Children.map(props.children, (child: React.ReactElement<RadioProps>) => {
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
        </div>
    );
}

interface ImageRadioProps {
    name: string;
    value: string;
    label: string;
    image: string;
    checked: boolean;
    onChange: (value: string) => void;
}

export function ImageRadio(props: ImageRadioProps) {
    const id = `${props.name}-${props.value}`;

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        props.onChange(event.target.value);
    }

    return (
        <label className="image-radio">
            <input
                type="radio"
                name={props.name}
                id={id}
                value={props.value}
                onChange={onChange}
                checked={props.checked}
            />
            <img src={props.image} aria-hidden />
            {props.label}
        </label>
    );
}
