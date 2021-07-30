import * as React from "react";
import { Label } from "./Typography";
import { RadioGroup, Radio } from "./Radio";
import { SegmentedControl, SegmentedControlItem } from "./SegmentedControl";
import { useTranslation } from "react-i18next";

interface Option {
    value: string;
    translationKey: string;
}

interface OptionGroupProps {
    name: string;
    label: string;
    value: string;
    options: Option[];
    disabled?: boolean;
    onChange: (value: string) => void;
}

// TODO: remove once migrated to NewOptionGroup
export function OptionGroup(props: OptionGroupProps) {
    const { t } = useTranslation();

    if (props.options.length < 4) {
        return (
            <>
                <Label>{props.label}</Label>
                <SegmentedControl name={props.name} value={props.value} onChange={props.onChange}>
                    {props.options.map(({ value, translationKey }) => (
                        <SegmentedControlItem
                            key={value}
                            value={value}
                            label={t(translationKey)}
                            disabled={props.disabled}
                        />
                    ))}
                </SegmentedControl>
            </>
        );
    }

    return (
        <>
            <Label>{props.label}</Label>
            <RadioGroup name={props.name} value={props.value} onChange={props.onChange}>
                {props.options.map(({ value, translationKey }) => (
                    <Radio key={value} value={value} label={t(translationKey)} disabled={props.disabled} />
                ))}
            </RadioGroup>
        </>
    );
}

interface NewOptionGroupProps {
    name: string;
    label: string;
    value: string;
    options: { label: string; value: string }[];
    disabled?: boolean;
    onChange: (value: string) => void;
}

export function NewOptionGroup(props: NewOptionGroupProps) {
    if (props.options.length < 4) {
        return (
            <>
                <Label>{props.label}</Label>
                <SegmentedControl name={props.name} value={props.value} onChange={props.onChange}>
                    {props.options.map(({ value, label }) => (
                        <SegmentedControlItem key={value} value={value} label={label} disabled={props.disabled} />
                    ))}
                </SegmentedControl>
            </>
        );
    }

    return (
        <>
            <Label>{props.label}</Label>
            <RadioGroup name={props.name} value={props.value} onChange={props.onChange}>
                {props.options.map(({ value, label }) => (
                    <Radio key={value} value={value} label={label} disabled={props.disabled} />
                ))}
            </RadioGroup>
        </>
    );
}
