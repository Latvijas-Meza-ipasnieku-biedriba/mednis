import * as React from "react";
import { useTranslation } from "react-i18next";
import { Checkbox, CheckboxGroup } from "../../components/Checkbox";
import { Label } from "../../components/Typography";
import { NewOptionGroup, OptionGroup } from "../../components/OptionGroup";
import { NumberInput } from "../../components/NumberInput";
import { Select, SelectOption } from "../../components/Select";
import { TextInput } from "../../components/TextInput";
import {
    getActiveClassifiers,
    getDamagedTreeSpecies,
    getOtherDamagedTreeSpecies,
    getResponsibleSpeciesForForestDamage,
} from "../../utils/filterClassifiers";
import { useClassifiersContext } from "../../hooks/useClassifiersContext";
import { Species, TreeSpecies } from "../../types/classifiers";
import { configuration } from "../../configuration";

export interface ForestDamageState {
    area: string;
    standProtection: string; // TODO: check whether boolean (checkbox or toggle switch) would be more appropriate
    damagedTreeSpecies: {
        [treeSpecies: number]: boolean;
    };
    otherDamagedTreeSpecies?: number;
    damageVolumeType?: number;
    responsibleSpecies?: number;
    otherResponsibleSpecies: string;
    damageTypes: {
        [type: number]: boolean;
    };
}

interface ForestDamageProps {
    damage: ForestDamageState;
    onChange: (update: (damage: ForestDamageState) => ForestDamageState) => void;
}

export function ForestDamage(props: ForestDamageProps) {
    const { t, i18n } = useTranslation();
    const classifiers = useClassifiersContext();
    const treeSpeciesClassifiers = getDamagedTreeSpecies(classifiers);
    const otherTreeSpeciesClassifiers = getOtherDamagedTreeSpecies(classifiers, i18n.language);
    const damageVolumeTypeClassifiers = getActiveClassifiers(classifiers, "damageVolumeType");
    const damageVolumeTypeOptions = damageVolumeTypeClassifiers.map((classifier) => ({
        label: classifier.description[i18n.language],
        value: String(classifier.id),
    }));
    const responsibleSpeciesClassifiers = getResponsibleSpeciesForForestDamage(classifiers);
    const responsibleSpeciesOptions = responsibleSpeciesClassifiers.map((classifier) => ({
        label: classifier.description[i18n.language],
        value: String(classifier.id),
    }));
    const damageTypeClassifiers = getActiveClassifiers(classifiers, "forestDamageType");

    function onChange(update: Partial<ForestDamageState>) {
        props.onChange((damage) => ({ ...damage, ...update }));
    }

    function onAreaChange(area: string) {
        onChange({ area });
    }

    function onStandProtectionDoneChange(standProtection: string) {
        onChange({ standProtection });
    }

    function onDamagedTreeSpeciesChange(id: number) {
        return (checked: boolean) => {
            props.onChange((damage) => ({
                ...damage,
                damagedTreeSpecies: {
                    ...damage.damagedTreeSpecies,
                    [id]: checked,
                },
            }));
        };
    }

    function onOtherDamagedTreeSpeciesChange(otherDamagedTreeSpecies: string) {
        onChange({ otherDamagedTreeSpecies: Number(otherDamagedTreeSpecies) });
    }

    function onDamageVolumeTypeChange(damageVolumeType: string) {
        onChange({ damageVolumeType: Number(damageVolumeType) });
    }

    function onResponsibleSpeciesChange(responsibleSpecies: string) {
        props.onChange((damage) => ({
            ...damage,
            responsibleSpecies: Number(responsibleSpecies),
        }));
    }

    function onOtherResponsibleSpeciesChange(otherResponsibleSpecies: string) {
        onChange({ otherResponsibleSpecies });
    }

    function onDamageTypeChange(id: number) {
        return (checked: boolean) => {
            props.onChange((damage) => ({
                ...damage,
                damageTypes: { ...damage.damageTypes, [id]: checked },
            }));
        };
    }

    return (
        <>
            <NumberInput
                id="area"
                label={t("damage.forest.area.primary")}
                secondaryLabel={t("damage.forest.area.secondary")}
                value={props.damage.area}
                onChange={onAreaChange}
            />

            <OptionGroup
                label={t("damage.forest.standProtection.label")}
                name="standProtection"
                options={configuration.damage.forest.standProtection.options}
                value={props.damage.standProtection}
                onChange={onStandProtectionDoneChange}
            />

            <CheckboxGroup label={t("damage.forest.damagedTreeSpecies")}>
                {treeSpeciesClassifiers.map(({ id, description }) => {
                    const checkboxId = `damagedTreeSpecies-${id}`;

                    return (
                        <Checkbox
                            key={checkboxId}
                            id={checkboxId}
                            checked={props.damage.damagedTreeSpecies[id] ?? false}
                            label={description[i18n.language]}
                            onChange={onDamagedTreeSpeciesChange(id)}
                        />
                    );
                })}
            </CheckboxGroup>

            {props.damage.damagedTreeSpecies[TreeSpecies.Other] && (
                <>
                    <Label htmlFor="otherDamagedTreeSpecies">{t("damage.forest.otherDamagedTreeSpecies")}</Label>
                    <Select
                        id="otherTreeSpeciesOptions"
                        value={props.damage.otherDamagedTreeSpecies?.toString() ?? ""}
                        onChange={onOtherDamagedTreeSpeciesChange}
                    >
                        {otherTreeSpeciesClassifiers.map(({ id, description }) => (
                            <SelectOption key={`otherTreeSpeciesOptions-${id}`} value={String(id)}>
                                {description[i18n.language]}
                            </SelectOption>
                        ))}
                    </Select>
                </>
            )}

            <NewOptionGroup
                label={t("damage.forest.damageVolumeType")}
                name="damageVolumeType"
                options={damageVolumeTypeOptions}
                value={props.damage.damageVolumeType?.toString() ?? ""}
                onChange={onDamageVolumeTypeChange}
            />

            <NewOptionGroup
                label={t("damage.forest.responsibleSpecies")}
                name="responsibleSpecies"
                options={responsibleSpeciesOptions}
                value={props.damage.responsibleSpecies?.toString() ?? ""}
                onChange={onResponsibleSpeciesChange}
            />

            {props.damage.responsibleSpecies === Species.Other && (
                <TextInput
                    id="otherResponsibleSpecies"
                    label={t("damage.forest.otherResponsibleSpecies")}
                    value={props.damage.otherResponsibleSpecies}
                    onChange={onOtherResponsibleSpeciesChange}
                />
            )}

            <CheckboxGroup label={t("damage.forest.damageTypes")}>
                {damageTypeClassifiers.map(({ id, description }) => {
                    const checkboxId = `forestDamageType-${id}`;

                    return (
                        <Checkbox
                            key={checkboxId}
                            id={checkboxId}
                            checked={props.damage.damageTypes[id] ?? false}
                            label={description[i18n.language]}
                            onChange={onDamageTypeChange(id)}
                        />
                    );
                })}
            </CheckboxGroup>
        </>
    );
}
