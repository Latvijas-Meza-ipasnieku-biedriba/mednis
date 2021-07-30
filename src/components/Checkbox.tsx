import * as React from "react";
import classNames from "classnames";
import { Label } from "./Typography";
import "./Checkbox.scss";

interface CheckboxProps {
    id: string;
    label: React.ReactNode;
    checked: boolean;
    className?: string;
    disabled?: boolean;
    onChange: (checked: boolean) => void;
}

export function Checkbox(props: CheckboxProps) {
    const className = classNames("checkbox", props.className);

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

interface CheckboxGroupProps {
    label?: string;
    className?: string;
    disabled?: boolean;
    children: React.ReactElement<CheckboxProps>[];
    checkAllOption?: React.ReactElement<CheckAllOptionProps>;
}

export function CheckboxGroup(props: CheckboxGroupProps) {
    const className = classNames("checkbox-group", props.className);

    return (
        <>
            {props.label && <Label>{props.label}</Label>}
            <div className={className}>
                {props.checkAllOption &&
                    React.cloneElement(props.checkAllOption, {
                        disabled: props.disabled ?? props.checkAllOption.props.disabled,
                    })}
                {React.Children.map(props.children, (child: React.ReactElement<CheckboxProps>) => {
                    return React.cloneElement(child, {
                        disabled: props.disabled ?? child.props.disabled,
                    });
                })}
            </div>
        </>
    );
}

interface ImageCheckboxProps {
    id: string;
    value: string;
    label: string;
    image: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export function ImageCheckbox(props: ImageCheckboxProps) {
    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        props.onChange(event.target.checked);
    }

    return (
        <label className="image-checkbox">
            <input type="checkbox" id={props.id} value={props.value} onChange={onChange} checked={props.checked} />
            <img src={props.image} aria-hidden />
            {props.label}
        </label>
    );
}

interface CheckAllOptionProps {
    id: string;
    label: string;
    checked: boolean;
    someOptionsChecked?: boolean;
    className?: string;
    disabled?: boolean;
    onChange: (checkedState: boolean) => void;
}

export function CheckAllOption(props: CheckAllOptionProps) {
    const className = classNames("checkbox check-all", props.className, {
        "checked-some": props.someOptionsChecked,
    });

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
