import * as React from "react";
import { useTranslation } from "react-i18next";
import { Checkbox, CheckboxGroup } from "../../components/Checkbox";
import { Label } from "../../components/Typography";
import { Stepper } from "../../components/Stepper";
import { TextInput } from "../../components/TextInput";
import { getActiveClassifiers } from "../../utils/filterClassifiers";
import { useClassifiersContext } from "../../hooks/useClassifiersContext";
import { ObservedSigns } from "../../types/classifiers";
import { configuration } from "../../configuration";

export interface SignsOfPresenceState {
    observedSigns: {
        [sign: number]: boolean;
    };
    observedSignsNotes: string;
    count: number;
}

interface SignsOfPresenceProps {
    signsOfPresence: SignsOfPresenceState;
    onChange: (update: (signsOfPresence: SignsOfPresenceState) => SignsOfPresenceState) => void;
}

export function SignsOfPresence(props: SignsOfPresenceProps) {
    const { t, i18n } = useTranslation();
    const classifiers = useClassifiersContext();
    const observedSignsClassifiers = getActiveClassifiers(classifiers, "observedSigns");

    function onObservedSignClick(sign: number) {
        return (checked: boolean) => {
            props.onChange((signsOfPresence) => {
                return { ...signsOfPresence, observedSigns: { ...signsOfPresence.observedSigns, [sign]: checked } };
            });
        };
    }

    function onObservedSignsNotesChange(observedSignsNotes: string) {
        props.onChange((signsOfPresence) => {
            return { ...signsOfPresence, observedSignsNotes };
        });
    }

    function onCountChange(count: number) {
        props.onChange((signsOfPresence) => {
            return { ...signsOfPresence, count };
        });
    }

    return (
        <>
            <CheckboxGroup label={t("observations.observedSigns")}>
                {observedSignsClassifiers.map(({ id, description }) => {
                    const checkboxId = `observed-signs-${id}`;

                    return (
                        <Checkbox
                            key={checkboxId}
                            id={checkboxId}
                            checked={props.signsOfPresence.observedSigns[id] ?? false}
                            onChange={onObservedSignClick(id)}
                            label={description[i18n.language]}
                        />
                    );
                })}
            </CheckboxGroup>

            {props.signsOfPresence.observedSigns[ObservedSigns.Other] && (
                <TextInput
                    id="observedSignsNotes"
                    value={props.signsOfPresence.observedSignsNotes}
                    onChange={onObservedSignsNotesChange}
                    label={t("observations.observedSignsNotes")}
                />
            )}

            <Label>{t("observations.count")}</Label>
            <Stepper
                value={props.signsOfPresence.count}
                onChange={onCountChange}
                minValue={configuration.observations.signsOfPresence.count.min}
                maxValue={configuration.observations.signsOfPresence.count.max}
            />
        </>
    );
}
