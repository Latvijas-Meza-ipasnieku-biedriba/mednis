import * as React from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "../../components/Icon";
import { Label } from "../../components/Typography";
import { RadioButton, RadioButtonGroup } from "../../components/Radio";
import { Select, SelectOption } from "../../components/Select";
import { getObservationBirds, getObservationOtherMammals, getObservationSpecies } from "../../utils/filterClassifiers";
import { useClassifiersContext } from "../../hooks/useClassifiersContext";
import { MainObservationSpecies, Species } from "../../types/classifiers";
import { configuration } from "../../configuration";

interface ObservationsSpeciesProps {
    species?: number;
    onSpeciesChange: (species: number) => void;
    otherMammals?: number;
    onOtherMammalsChange: (otherMammals: number) => void;
    birds?: number;
    onBirdsChange: (birds: number) => void;
}

export function ObservationsSpecies(props: ObservationsSpeciesProps) {
    const { t, i18n } = useTranslation();
    const classifiers = useClassifiersContext();
    const speciesClassifiers = getObservationSpecies(classifiers);
    const otherMammalsClassifiers = getObservationOtherMammals(classifiers, i18n.language);
    const birdsClassifiers = getObservationBirds(classifiers, i18n.language);

    function onSpeciesChange(species: string) {
        props.onSpeciesChange(Number(species));
    }

    function onOtherMammalsChange(otherMammals: string) {
        props.onOtherMammalsChange(Number(otherMammals));
    }

    function onBirdsChange(birds: string) {
        props.onBirdsChange(Number(birds));
    }

    return (
        <>
            <Label secondaryLabel={t("observations.species.secondary")}>{t("observations.species.primary")}</Label>
            <RadioButtonGroup
                name="species"
                className="species"
                value={props.species?.toString() ?? ""}
                onChange={onSpeciesChange}
            >
                {speciesClassifiers.map(({ id, description }) => (
                    <RadioButton key={`species-${id}`} value={String(id)}>
                        <Icon name={configuration.observations.speciesIcons[id as MainObservationSpecies] ?? "cross"} />
                        {description[i18n.language]}
                    </RadioButton>
                ))}
            </RadioButtonGroup>

            {props.species === Species.OtherMammals && (
                <>
                    <Label htmlFor="other-mammals">{t("observations.otherMammals")}</Label>
                    <Select
                        id="other-mammals"
                        value={props.otherMammals?.toString() ?? ""}
                        onChange={onOtherMammalsChange}
                    >
                        {otherMammalsClassifiers.map(({ id, description }) => (
                            <SelectOption key={`otherMammals-${id}`} value={String(id)}>
                                {description[i18n.language]}
                            </SelectOption>
                        ))}
                    </Select>
                </>
            )}

            {props.species === Species.Birds && (
                <>
                    <Label htmlFor="birds">{t("observations.birds")}</Label>
                    <Select id="birds" value={props.birds?.toString() ?? ""} onChange={onBirdsChange}>
                        {birdsClassifiers.map(({ id, description }) => (
                            <SelectOption key={`birds-${id}`} value={String(id)}>
                                {description[i18n.language]}
                            </SelectOption>
                        ))}
                    </Select>
                </>
            )}
        </>
    );
}
