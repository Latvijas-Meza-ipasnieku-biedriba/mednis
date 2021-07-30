import * as React from "react";
import { useTranslation } from "react-i18next";
import "./Select.scss";

interface SelectOptionProps {
    value: string;
    disabled?: boolean;
    children: React.ReactNode;
}

export function SelectOption(props: SelectOptionProps) {
    return (
        <option value={props.value} disabled={props.disabled}>
            {props.children}
        </option>
    );
}

interface SelectProps {
    id: string;
    value: string;
    children: React.ReactNode;
    onChange: (value: string) => void;
    disabled?: boolean;
    defaultOptionEnabled?: boolean;
}

export function Select(props: SelectProps) {
    const { t } = useTranslation();

    function onChange(event: React.ChangeEvent<HTMLSelectElement>) {
        props.onChange(event.target.value);
    }

    return (
        <select className="select" id={props.id} value={props.value} onChange={onChange} disabled={props.disabled}>
            <SelectOption value="" disabled={!props.defaultOptionEnabled}>
                {t("select.selectOption")}
            </SelectOption>
            {props.children}
        </select>
    );
}
