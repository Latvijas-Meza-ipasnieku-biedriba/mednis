import * as React from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "../../components/Icon";
import { Label } from "../../components/Typography";
import { NumberInput } from "../../components/NumberInput";
import { RadioButton, RadioButtonGroup } from "../../components/Radio";
import { Select, SelectOption } from "../../components/Select";
import { Stepper } from "../../components/Stepper";
import { TextInput } from "../../components/TextInput";
import {
    getAgriculturalLandSpecies,
    getAgriculturalLandSubtypes,
    getAgriculturalLandTypes,
} from "../../utils/filterClassifiers";
import { useClassifiersContext } from "../../hooks/useClassifiersContext";
import {
    AgriculturalLandType,
    AgriculturalLandTypeClassifierOption,
    MainAgriculturalLandType,
    Species,
} from "../../types/classifiers";
import { configuration } from "../../configuration";

export interface LandDamageState {
    type?: number;
    subtype?: number;
    species?: number;
    customSpecies: string;
    otherSpecies: string;
    area: string;
    count: number;
}

interface LandDamageProps {
    damage: LandDamageState;
    onChange: (update: (landDamage: LandDamageState) => LandDamageState) => void;
}

export function LandDamage(props: LandDamageProps) {
    const { t, i18n } = useTranslation();
    const classifiers = useClassifiersContext();
    const typeClassifiers = getAgriculturalLandTypes(classifiers);
    const subtypeClassifiers = getAgriculturalLandSubtypes(classifiers);
    const speciesClassifiers = getAgriculturalLandSpecies(classifiers, i18n.language, props.damage.type);
    const subspeciesClassifiers = getAgriculturalLandSpecies(classifiers, i18n.language, props.damage.subtype);

    function onChange(update: Partial<LandDamageState>) {
        props.onChange((damage) => ({ ...damage, ...update }));
    }

    function onTypeChange(type: string) {
        onChange({ type: Number(type), species: undefined });
    }

    function onSubtypeChange(subtype: string) {
        onChange({ subtype: Number(subtype), species: undefined });
    }

    function onSpeciesChange(species: string) {
        onChange({ species: Number(species) });
    }

    function onCustomSpeciesChange(customSpecies: string) {
        onChange({ customSpecies });
    }

    function onOtherSpeciesChange(otherSpecies: string) {
        onChange({ otherSpecies });
    }

    function onAreaChange(area: string) {
        onChange({ area });
    }

    function onCountChange(count: number) {
        onChange({ count });
    }

    const isSubtypeVisible = props.damage.type === AgriculturalLandType.Other;
    const isSpeciesVisible = props.damage.type && props.damage.type !== AgriculturalLandType.Other;
    const isSubspeciesVisible =
        isSubtypeVisible && props.damage.subtype && props.damage.subtype !== AgriculturalLandType.Other;
    const isCustomSpeciesVisible = isSubtypeVisible && props.damage.subtype === AgriculturalLandType.Other;
    const isOtherSpeciesVisible = props.damage.species === Species.Other;

    const isAreaVisible = isLandDamageAreaVisible(
        props.damage.type ?? 0,
        props.damage.subtype ?? 0,
        classifiers.agriculturalLandType.options
    );
    const isCountVisible = isLandDamageCountVisible(
        props.damage.type ?? 0,
        props.damage.subtype ?? 0,
        classifiers.agriculturalLandType.options
    );

    return (
        <>
            <Label>{t("damage.land.type")}</Label>
            <RadioButtonGroup
                name="landType"
                className="type"
                value={props.damage.type?.toString() ?? ""}
                onChange={onTypeChange}
            >
                {typeClassifiers.map(({ id, description }) => (
                    <RadioButton key={`landType-${id}`} value={String(id)}>
                        <Icon name={configuration.damage.land.typeIcons[id as MainAgriculturalLandType] ?? "cross"} />
                        {description[i18n.language]}
                    </RadioButton>
                ))}
            </RadioButtonGroup>

            {isSubtypeVisible && (
                <>
                    <Label>{t("damage.land.subtype")}</Label>
                    <Select id="landSubtype" value={props.damage.subtype?.toString() ?? ""} onChange={onSubtypeChange}>
                        {subtypeClassifiers.map(({ id, description }) => (
                            <SelectOption key={`landSubtype-${id}`} value={String(id)}>
                                {description[i18n.language]}
                            </SelectOption>
                        ))}
                    </Select>
                </>
            )}

            {isSpeciesVisible && (
                <>
                    <Label htmlFor="landSpecies">{t("damage.land.species")}</Label>
                    <Select id="landSpecies" value={props.damage.species?.toString() ?? ""} onChange={onSpeciesChange}>
                        {speciesClassifiers.map(({ id, description }) => (
                            <SelectOption key={`landSpecies-${id}`} value={String(id)}>
                                {description[i18n.language]}
                            </SelectOption>
                        ))}
                    </Select>
                </>
            )}

            {isSubspeciesVisible && (
                <>
                    <Label htmlFor="landSpecies">{t("damage.land.species")}</Label>
                    <Select id="landSpecies" value={props.damage.species?.toString() ?? ""} onChange={onSpeciesChange}>
                        {subspeciesClassifiers.map(({ id, description }) => (
                            <SelectOption key={`landSpecies-${id}`} value={String(id)}>
                                {description[i18n.language]}
                            </SelectOption>
                        ))}
                    </Select>
                </>
            )}

            {isCustomSpeciesVisible && (
                <TextInput
                    id="customLandSpecies"
                    label={t("damage.land.species")}
                    value={props.damage.customSpecies}
                    onChange={onCustomSpeciesChange}
                />
            )}

            {isOtherSpeciesVisible && (
                <TextInput
                    id="otherLandSpecies"
                    label={t("damage.land.otherSpecies")}
                    value={props.damage.otherSpecies}
                    onChange={onOtherSpeciesChange}
                />
            )}

            {isAreaVisible && (
                <NumberInput
                    id="area"
                    label={t("damage.land.area.primary")}
                    secondaryLabel={t("damage.land.area.secondary")}
                    value={props.damage.area}
                    onChange={onAreaChange}
                />
            )}

            {isCountVisible && (
                <>
                    <Label>{t("damage.land.count")}</Label>
                    <Stepper
                        value={props.damage.count}
                        onChange={onCountChange}
                        minValue={configuration.damage.land.count.min}
                        maxValue={configuration.damage.land.count.max}
                    />
                </>
            )}
        </>
    );
}

export function isLandDamageAreaVisible(
    type: AgriculturalLandType,
    subtype: AgriculturalLandType,
    typeClassifierOptions: AgriculturalLandTypeClassifierOption[]
): boolean {
    let isAreaVisible = false;

    const selectedType = type === AgriculturalLandType.Other ? subtype : type;
    if (selectedType) {
        const selectedTypeClassifier = typeClassifierOptions.find((option) => option.id === selectedType);
        if (!selectedTypeClassifier?.isCountable) {
            isAreaVisible = true;
        }
    }

    return isAreaVisible;
}

export function isLandDamageCountVisible(
    type: AgriculturalLandType,
    subtype: AgriculturalLandType,
    typeClassifierOptions: AgriculturalLandTypeClassifierOption[]
): boolean {
    let isCountVisible = false;

    const selectedType = type === AgriculturalLandType.Other ? subtype : type;
    if (selectedType) {
        const selectedTypeClassifier = typeClassifierOptions.find((option) => option.id === selectedType);
        if (selectedTypeClassifier?.isCountable) {
            isCountVisible = true;
        }
    }

    return isCountVisible;
}
