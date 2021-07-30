import * as React from "react";
import classNames from "classnames";
import { v4 as uuid } from "uuid";
import { useTranslation } from "react-i18next";
import { Checkbox, CheckboxGroup } from "../../components/Checkbox";
import { Icon } from "../../components/Icon";
import { NewOptionGroup } from "../../components/OptionGroup";
import { Stepper } from "../../components/Stepper";
import { Switch } from "../../components/Switch";
import { TextInput } from "../../components/TextInput";
import { Title, Label } from "../../components/Typography";
import { getActiveClassifiers } from "../../utils/filterClassifiers";
import { useClassifiersContext } from "../../hooks/useClassifiersContext";
import { Classifiers } from "../../types/classifiers";
import { configuration } from "../../configuration";
import "./AnimalsItem.scss";

export function getDefaultAnimalsItemState(classifiers: Classifiers): AnimalsItemState {
    return {
        id: uuid(),
        gender: classifiers.gender.defaultValue ?? configuration.observations.animals.defaultGender,
        age: classifiers.age.defaultValue ?? configuration.observations.animals.defaultAge,
        isCollapsed: false,
        count: configuration.observations.animals.count.defaultValue ?? 1,
        observedSignsOfDisease: false,
        signsOfDisease: {},
        notesOnDiseases: "",
    };
}

export interface AnimalsItemState {
    id: string;
    isCollapsed: boolean;
    gender?: number;
    age?: number;
    count: number;
    observedSignsOfDisease: boolean;
    signsOfDisease: {
        [disease: string]: boolean;
    };
    notesOnDiseases: string;
}

interface AnimalsItemProps {
    item: AnimalsItemState;
    showHeader: boolean;
    onDelete: () => void;
    onChange: (update: Partial<AnimalsItemState> | ((prevState: AnimalsItemState) => AnimalsItemState)) => void;
}

export const AnimalsItem = React.forwardRef<HTMLDivElement, AnimalsItemProps>((props, ref) => {
    const { t, i18n } = useTranslation();
    const classifiers = useClassifiersContext();
    const genderClassifiers = getActiveClassifiers(classifiers, "gender");
    const genderOptions = genderClassifiers.map((classifier) => ({
        label: classifier.description[i18n.language],
        value: String(classifier.id),
    }));
    const ageClassifiers = getActiveClassifiers(classifiers, "age");
    const ageOptions = ageClassifiers.map((classifier) => ({
        label: classifier.description[i18n.language],
        value: String(classifier.id),
    }));
    const signsOfDiseaseClassifiers = getActiveClassifiers(classifiers, "signsOfDisease");

    function onToggle() {
        props.onChange((item) => {
            return { ...item, isCollapsed: !item.isCollapsed };
        });
    }

    function onGenderChange(gender: string) {
        props.onChange({ gender: Number(gender) });
    }

    function onAgeChange(age: string) {
        props.onChange({ age: Number(age) });
    }

    function onCountChange(count: number) {
        props.onChange({ count });
    }

    function onObservedSignsOfDiseaseChange(observedSignsOfDisease: boolean) {
        props.onChange({ observedSignsOfDisease });
    }

    function onDiseaseClicked(disease: number) {
        return (checked: boolean) => {
            props.onChange((item) => {
                return { ...item, signsOfDisease: { ...item.signsOfDisease, [disease]: checked } };
            });
        };
    }

    function onDiseaseNotesChanged(notesOnDiseases: string) {
        props.onChange({ notesOnDiseases });
    }

    const className = classNames("animals-item", { "animals-item--collapsed": props.item.isCollapsed });

    return (
        <div className={className} ref={ref}>
            {props.showHeader && <AnimalsItemHeader item={props.item} onToggle={onToggle} onDelete={props.onDelete} />}

            {!props.item.isCollapsed && (
                <div className="animals-item__content">
                    <NewOptionGroup
                        label={t("observations.gender")}
                        name={`gender-${props.item.id}`}
                        options={genderOptions}
                        value={props.item.gender?.toString() ?? ""}
                        onChange={onGenderChange}
                    />

                    <NewOptionGroup
                        label={t("observations.age")}
                        name={`age-${props.item.id}`}
                        options={ageOptions}
                        value={props.item.age?.toString() ?? ""}
                        onChange={onAgeChange}
                    />

                    <Label>{t("observations.count")}</Label>
                    <Stepper
                        value={props.item.count}
                        onChange={onCountChange}
                        minValue={configuration.observations.animals.count.min}
                        maxValue={configuration.observations.animals.count.max}
                    />

                    <Switch
                        id={`observedSignsOfDisease-${props.item.id}`}
                        label={t("observations.observedSignsOfDisease")}
                        checked={props.item.observedSignsOfDisease}
                        onChange={onObservedSignsOfDiseaseChange}
                    />

                    {props.item.observedSignsOfDisease && (
                        <>
                            <CheckboxGroup label={t("observations.signsOfDisease")}>
                                {signsOfDiseaseClassifiers.map(({ id, description }) => {
                                    const checkboxId = `signsOfDisease-${props.item.id}-${id}`;
                                    return (
                                        <Checkbox
                                            key={checkboxId}
                                            id={checkboxId}
                                            checked={props.item.signsOfDisease[id] ?? false}
                                            onChange={onDiseaseClicked(id)}
                                            label={description[i18n.language]}
                                        />
                                    );
                                })}
                            </CheckboxGroup>

                            <TextInput
                                id={`notesOnDiseases-${props.item.id}`}
                                label={t("observations.notesOnDiseases")}
                                value={props.item.notesOnDiseases}
                                onChange={onDiseaseNotesChanged}
                            />
                        </>
                    )}
                </div>
            )}
        </div>
    );
});

AnimalsItem.displayName = "AnimalsItem";

interface AnimalsItemHeaderProps {
    item: AnimalsItemState;
    onToggle: () => void;
    onDelete: () => void;
}

export function AnimalsItemHeader(props: AnimalsItemHeaderProps) {
    const { i18n } = useTranslation();

    const classifiers = useClassifiersContext();
    const genderClassifiers = getActiveClassifiers(classifiers, "gender");
    const genderClassifier = genderClassifiers.find((classifier) => classifier.id === props.item.gender);
    const genderLabel = genderClassifier?.description[i18n.language];
    const ageClassifiers = getActiveClassifiers(classifiers, "age");
    const ageClassifier = ageClassifiers.find((classifier) => classifier.id === props.item.age);
    const ageLabel = ageClassifier?.description[i18n.language];
    const title = `${genderLabel}, ${ageLabel}`;

    return (
        <div className="animals-item__header">
            <button type="button" className="animals-item__header__left" onClick={props.onToggle}>
                <Icon name={props.item.isCollapsed ? "chevronDown" : "chevronUp"} />
                <Title size="small">{title}</Title>
            </button>
            <button type="button" className="animals-item__header__right" onClick={props.onDelete}>
                <Icon name="trash" />
            </button>
        </div>
    );
}
