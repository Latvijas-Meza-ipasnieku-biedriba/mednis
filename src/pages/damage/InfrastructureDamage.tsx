import * as React from "react";
import { useTranslation } from "react-i18next";
import { NewOptionGroup } from "../../components/OptionGroup";
import { TextInput } from "../../components/TextInput";
import { getActiveClassifiers, getResponsibleSpeciesForInfrastructureDamage } from "../../utils/filterClassifiers";
import { useClassifiersContext } from "../../hooks/useClassifiersContext";
import { InfrastructureDamageType, Species } from "../../types/classifiers";

export interface InfrastructureDamageState {
    type?: number;
    otherType: string;
    responsibleSpecies?: number;
    otherResponsibleSpecies: string;
}

interface InfrastructureDamageProps {
    damage: InfrastructureDamageState;
    onChange: (update: Partial<InfrastructureDamageState>) => void;
}

export function InfrastructureDamage(props: InfrastructureDamageProps) {
    const { t, i18n } = useTranslation();
    const classifiers = useClassifiersContext();
    const typeClassifiers = getActiveClassifiers(classifiers, "infrastructureType");
    const typeOptions = typeClassifiers.map((classifier) => ({
        label: classifier.description[i18n.language],
        value: String(classifier.id),
    }));
    const responsibleSpeciesClassifiers = getResponsibleSpeciesForInfrastructureDamage(classifiers);
    const responsibleSpeciesOptions = responsibleSpeciesClassifiers.map((classifier) => ({
        label: classifier.description[i18n.language],
        value: String(classifier.id),
    }));

    function onTypeChange(type: string) {
        props.onChange({ type: Number(type) });
    }

    function onOtherTypeChange(otherType: string) {
        props.onChange({ otherType });
    }

    function onResponsibleSpeciesChange(responsibleSpecies: string) {
        props.onChange({ responsibleSpecies: Number(responsibleSpecies) });
    }

    function onOtherResponsibleSpeciesChange(otherResponsibleSpecies: string) {
        props.onChange({ otherResponsibleSpecies });
    }

    return (
        <>
            <NewOptionGroup
                label={t("damage.infrastructure.type")}
                name="infrastructureDamageType"
                options={typeOptions}
                value={props.damage.type?.toString() ?? ""}
                onChange={onTypeChange}
            />

            {props.damage.type === InfrastructureDamageType.Other && (
                <TextInput
                    id="otherInfrastructureDamageType"
                    label={t("damage.infrastructure.otherType")}
                    value={props.damage.otherType}
                    onChange={onOtherTypeChange}
                />
            )}

            <NewOptionGroup
                label={t("damage.infrastructure.responsibleSpecies")}
                name="responsibleSpecies"
                options={responsibleSpeciesOptions}
                value={props.damage.responsibleSpecies?.toString() ?? ""}
                onChange={onResponsibleSpeciesChange}
            />

            {props.damage.responsibleSpecies === Species.Other && (
                <TextInput
                    id="otherResponsibleSpecies"
                    label={t("damage.infrastructure.otherResponsibleSpecies")}
                    value={props.damage.otherResponsibleSpecies}
                    onChange={onOtherResponsibleSpeciesChange}
                />
            )}
        </>
    );
}
