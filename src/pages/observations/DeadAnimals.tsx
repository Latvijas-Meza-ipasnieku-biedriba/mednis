import * as React from "react";
import { useTranslation } from "react-i18next";
import { Label } from "../../components/Typography";
import { NewOptionGroup } from "../../components/OptionGroup";
import { Stepper } from "../../components/Stepper";
import { Switch } from "../../components/Switch";
import { getActiveClassifiers } from "../../utils/filterClassifiers";
import { useClassifiersContext } from "../../hooks/useClassifiersContext";
import { Checkbox, CheckboxGroup } from "../../components/Checkbox";
import { TextInput } from "../../components/TextInput";
import { configuration } from "../../configuration";

export interface DeadAnimalsState {
    gender?: number;
    deathType?: number;
    age?: number;
    count: number;
    observedSignsOfDisease: boolean;
    signsOfDisease: {
        [disease: number]: boolean;
    };
    notesOnDiseases: string;
}

export interface DeadAnimalsProps {
    deadAnimals: DeadAnimalsState;
    onChange: (update: (deadAnimals: DeadAnimalsState) => DeadAnimalsState) => void;
}

export function Dead(props: DeadAnimalsProps) {
    const { t, i18n } = useTranslation();
    const classifiers = useClassifiersContext();
    const genderClassifiers = getActiveClassifiers(classifiers, "gender");
    const genderOptions = genderClassifiers.map((classifier) => ({
        label: classifier.description[i18n.language],
        value: String(classifier.id),
    }));
    const deathTypeClassifiers = getActiveClassifiers(classifiers, "deathType");
    const deathTypeOptions = deathTypeClassifiers.map((classifier) => ({
        label: classifier.description[i18n.language],
        value: String(classifier.id),
    }));
    const ageClassifiers = getActiveClassifiers(classifiers, "age");
    const ageOptions = ageClassifiers.map((classifier) => ({
        label: classifier.description[i18n.language],
        value: String(classifier.id),
    }));
    const signsOfDiseaseClassifiers = getActiveClassifiers(classifiers, "signsOfDisease");

    function onGenderChange(gender: string) {
        props.onChange((deadAnimals) => {
            return { ...deadAnimals, gender: Number(gender) };
        });
    }

    function onDeathTypeChange(deathType: string) {
        props.onChange((deadAnimals) => {
            return { ...deadAnimals, deathType: Number(deathType) };
        });
    }

    function onAgeChange(age: string) {
        props.onChange((deadAnimals) => {
            return { ...deadAnimals, age: Number(age) };
        });
    }

    function onCountChange(count: number) {
        props.onChange((deadAnimals) => {
            return { ...deadAnimals, count };
        });
    }

    function onObservedSignsOfDiseaseChange(observedSignsOfDisease: boolean) {
        props.onChange((deadAnimals) => {
            return { ...deadAnimals, observedSignsOfDisease };
        });
    }

    function onDiseaseClicked(disease: number) {
        return (checked: boolean) => {
            props.onChange((deadAnimals) => {
                return { ...deadAnimals, signsOfDisease: { ...deadAnimals.signsOfDisease, [disease]: checked } };
            });
        };
    }

    function onDiseaseNotesChanged(notesOnDiseases: string) {
        props.onChange((deadAnimals) => {
            return { ...deadAnimals, notesOnDiseases };
        });
    }

    return (
        <>
            <NewOptionGroup
                label={t("observations.gender")}
                name="gender"
                options={genderOptions}
                value={props.deadAnimals.gender?.toString() ?? ""}
                onChange={onGenderChange}
            />

            <NewOptionGroup
                label={t("observations.deathType")}
                name="deathType"
                options={deathTypeOptions}
                value={props.deadAnimals.deathType?.toString() ?? ""}
                onChange={onDeathTypeChange}
            />

            <NewOptionGroup
                label={t("observations.age")}
                name="age"
                options={ageOptions}
                value={props.deadAnimals.age?.toString() ?? ""}
                onChange={onAgeChange}
            />

            <Label>{t("observations.count")}</Label>
            <Stepper
                value={props.deadAnimals.count}
                onChange={onCountChange}
                minValue={configuration.observations.deadAnimals.count.min}
                maxValue={configuration.observations.deadAnimals.count.max}
            />

            <Switch
                id="observedSignsOfDisease"
                checked={props.deadAnimals.observedSignsOfDisease}
                onChange={onObservedSignsOfDiseaseChange}
                label={t("observations.observedSignsOfDisease")}
            />

            {props.deadAnimals.observedSignsOfDisease && (
                <>
                    <CheckboxGroup label={t("observations.signsOfDisease")}>
                        {signsOfDiseaseClassifiers.map(({ id, description }) => {
                            const checkboxId = `signsOfDisease-${id}`;
                            return (
                                <Checkbox
                                    key={checkboxId}
                                    id={checkboxId}
                                    checked={props.deadAnimals.signsOfDisease[id] ?? false}
                                    onChange={onDiseaseClicked(id)}
                                    label={description[i18n.language]}
                                />
                            );
                        })}
                    </CheckboxGroup>

                    <TextInput
                        id="notesOnDiseases"
                        label={t("observations.notesOnDiseases")}
                        value={props.deadAnimals.notesOnDiseases}
                        onChange={onDiseaseNotesChanged}
                    />
                </>
            )}
        </>
    );
}
