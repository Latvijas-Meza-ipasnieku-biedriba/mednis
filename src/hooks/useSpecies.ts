import * as React from "react";
import { useTranslation } from "react-i18next";
import { IconName } from "../components/Icon";
import { configuration } from "../configuration";
import { LimitedSpecies, LimitedSpeciesType, LimitedSpeciesGender, UnlimitedSpecies } from "../types/hunt";
import {
    Classifiers,
    HuntedType,
    HuntingSeasonClassifierOption,
    PermitTypeClassifierOption,
    Species,
} from "../types/classifiers";
import { isSpeciesValidForInjured } from "../utils/hunt";

interface SpeciesResult {
    limitedSpecies: LimitedSpecies[];
    unlimitedSpecies: UnlimitedSpecies[];
}

export function useSpecies(classifiers?: Classifiers): SpeciesResult {
    const { i18n } = useTranslation();

    if (!classifiers) {
        return { limitedSpecies: [], unlimitedSpecies: [] };
    }

    const limitedSpeciesClassifier = classifiers.species.options.filter((species) => species.isLimited);

    const limitedSpecies: LimitedSpecies[] = limitedSpeciesClassifier.map((species) => {
        const speciesIcon: IconName = configuration.hunt.speciesIcons[species.id as Species] ?? "animals";
        const permitTypes = classifiers.permitTypes.options.filter(
            (permitType) => permitType.species.id === species.id
        );
        const speciesTerm = getTermStringFromPermitTypeArray(permitTypes);
        const speciesTypes = permitTypes.length > 0 ? getSpeciesTypesFromPermits(classifiers, permitTypes[0]) : [];
        const speciesPermitTypeId = permitTypes.length === 1 ? permitTypes[0].id : 0;

        let subSpecies: Omit<LimitedSpecies, "subspecies">[] | undefined;
        if (permitTypes.length > 1) {
            subSpecies = permitTypes.map((permitType) => {
                const subspeciesTerm = getTermStringFromPermitType(permitType);
                const subspeciesTypes = getSpeciesTypesFromPermits(classifiers, permitType);

                return {
                    id: species.id,
                    permitTypeId: permitType.id,
                    icon: speciesIcon,
                    description: permitType.description,
                    term: subspeciesTerm,
                    types: subspeciesTypes,
                };
            });
        }

        return {
            id: species.id,
            permitTypeId: speciesPermitTypeId,
            description: species.description,
            icon: speciesIcon,
            subspecies: subSpecies,
            term: speciesTerm,
            types: speciesTypes,
        };
    });

    const unlimitedSpeciesClassifier = classifiers.species.options.filter((species) => !species.isLimited);

    const unlimitedSpecies: UnlimitedSpecies[] = unlimitedSpeciesClassifier
        .filter((species) => species.isMainGroupHunt)
        .map((species) => {
            const speciesIcon: IconName = configuration.hunt.speciesIcons[species.id as Species] ?? "animals";

            const huntingSeason = classifiers.huntingSeasons.options.find(
                (huntingSeason) => huntingSeason.speciesId === species.id
            );
            let speciesTerm: string | undefined = undefined;
            if (huntingSeason) {
                speciesTerm = getTermStringFromHuntingSeason(huntingSeason);
            }

            let subSpecies: { value: string; label: string }[] | undefined;
            const subSpeciesClassifier = unlimitedSpeciesClassifier.filter(
                (subSpecies) => subSpecies.subspeciesOf === species.code
            );
            if (subSpeciesClassifier.length) {
                subSpecies = subSpeciesClassifier
                    .sort((a, b) => (a.listOrderHunt ?? Infinity) - (b.listOrderHunt ?? Infinity))
                    .map((subSpecies) => {
                        return {
                            value: String(subSpecies.id),
                            label: subSpecies.description[i18n.language],
                        };
                    });

                if (!huntingSeason) {
                    const subSpeciesIds = subSpeciesClassifier.map((subSpecies) => subSpecies.id);
                    const subSpeciesHuntingSeasons = classifiers.huntingSeasons.options.filter((huntingSeason) =>
                        subSpeciesIds.includes(huntingSeason.speciesId)
                    );
                    speciesTerm = getTermStringFromHuntingSeasonArray(subSpeciesHuntingSeasons);
                }
            }

            return {
                id: species.id,
                description: species.description,
                icon: speciesIcon,
                subspecies: subSpecies,
                term: speciesTerm,
            };
        });

    return { limitedSpecies, unlimitedSpecies };
}

export const SpeciesContext = React.createContext<SpeciesResult | null>(null);

export function useSpeciesContext() {
    const context = React.useContext(SpeciesContext);

    if (context === null) {
        throw new Error("SpeciesContext not initialized");
    }

    return context;
}

function getSpeciesTypesFromPermits(
    classifiers: Classifiers,
    permitType: PermitTypeClassifierOption
): LimitedSpeciesType[] | undefined {
    const permitAllowances = classifiers.permitAllowances.options.filter(
        (permitAllowance) => permitAllowance.permitTypeId === permitType.id
    );

    let defaultType = classifiers.huntedType.defaultValue;
    const defaultPermitAllowance = permitAllowances.find((permitAllowance) => permitAllowance.isDefault);
    if (defaultPermitAllowance) {
        defaultType = isSpeciesValidForInjured(permitType.species.id)
            ? defaultPermitAllowance.isValidForKilled
                ? HuntedType.Hunted
                : HuntedType.Injured
            : HuntedType.Hunted;
    }

    const types: LimitedSpeciesType[] = classifiers.huntedType.options?.flatMap((type) => {
        if (type.id === HuntedType.Injured && !isSpeciesValidForInjured(permitType.species.id)) {
            return [];
        }

        const genders: LimitedSpeciesGender[] = [];
        const filteredPermitAllowances = permitAllowances.filter((permitAllowance) =>
            type.id === HuntedType.Hunted ? permitAllowance.isValidForKilled : true
        );
        filteredPermitAllowances.forEach((permitAllowance) => {
            const gender = genders.find((gender) => gender.id === permitAllowance.genderId) ?? {
                id: permitAllowance.genderId,
            };
            if (!gender.ages) {
                gender.ages = [];
            }
            gender.ages.push({
                id: permitAllowance.ageId,
                isDefault: permitAllowance.isDefault,
            });

            if (!gender.isDefault) {
                gender.isDefault = permitAllowance.isDefault;
            }

            if (!genders.find((gender) => gender.id === permitAllowance.genderId)) {
                genders.push(gender);
            }
        });

        return [
            {
                id: type.id,
                isDefault: defaultType ? defaultType === type.id : false,
                genders,
            },
        ];
    });

    return types;
}

function getTermStringFromPermitTypeArray(permitTypes: PermitTypeClassifierOption[]): string | undefined {
    if (permitTypes.length === 0) {
        return undefined;
    }
    if (permitTypes.length === 1) {
        return getTermStringFromPermitType(permitTypes[0]);
    }

    const sortedPermitTypes = [...permitTypes];

    const earliestStartPermitType = sortedPermitTypes.sort(
        (a, b) =>
            (a.seasonStartMonth ?? Infinity) - (b.seasonStartMonth ?? Infinity) ||
            (a.seasonStartDay ?? Infinity) - (b.seasonStartDay ?? Infinity)
    )[0];

    const latestEndPermitType = sortedPermitTypes.sort(
        (a, b) =>
            (b.seasonEndMonth ?? Infinity) - (a.seasonEndMonth ?? Infinity) ||
            (b.seasonEndDay ?? Infinity) - (a.seasonEndDay ?? Infinity)
    )[0];

    return getTermStringFromSeasonDays(
        earliestStartPermitType.seasonStartDay,
        earliestStartPermitType.seasonStartMonth,
        latestEndPermitType.seasonEndDay,
        latestEndPermitType.seasonEndMonth
    );
}

function getTermStringFromPermitType(permitType: PermitTypeClassifierOption): string | undefined {
    return getTermStringFromSeasonDays(
        permitType.seasonStartDay,
        permitType.seasonStartMonth,
        permitType.seasonEndDay,
        permitType.seasonEndMonth
    );
}

function getTermStringFromHuntingSeasonArray(huntingSeasons: HuntingSeasonClassifierOption[]): string | undefined {
    if (huntingSeasons.length === 0) {
        return undefined;
    }
    if (huntingSeasons.length === 1) {
        return getTermStringFromHuntingSeason(huntingSeasons[0]);
    }

    const sortedHuntingSeasons = [...huntingSeasons];

    const earliestStartHuntingSeason = sortedHuntingSeasons.sort(
        (a, b) =>
            (a.seasonStartMonth ?? Infinity) - (b.seasonStartMonth ?? Infinity) ||
            (a.seasonStartDay ?? Infinity) - (b.seasonStartDay ?? Infinity)
    )[0];

    const latestEndHuntingSeason = sortedHuntingSeasons.sort(
        (a, b) =>
            (b.seasonEndMonth ?? Infinity) - (a.seasonEndMonth ?? Infinity) ||
            (b.seasonEndDay ?? Infinity) - (a.seasonEndDay ?? Infinity)
    )[0];

    return getTermStringFromSeasonDays(
        earliestStartHuntingSeason.seasonStartDay,
        earliestStartHuntingSeason.seasonStartMonth,
        latestEndHuntingSeason.seasonEndDay,
        latestEndHuntingSeason.seasonEndMonth
    );
}

function getTermStringFromHuntingSeason(huntingSeason: HuntingSeasonClassifierOption): string | undefined {
    return getTermStringFromSeasonDays(
        huntingSeason.seasonStartDay,
        huntingSeason.seasonStartMonth,
        huntingSeason.seasonEndDay,
        huntingSeason.seasonEndMonth
    );
}

function getTermStringFromSeasonDays(
    startDay: number,
    startMonth: number,
    endDay: number,
    endMonth: number
): string | undefined {
    if (startDay === 1 && startMonth === 1 && endDay === 31 && endMonth === 12) {
        return undefined;
    }
    return `${startDay.toString().padStart(2, "0")}.${startMonth
        .toString()
        .padStart(2, "0")}. - ${endDay.toString().padStart(2, "0")}.${endMonth.toString().padStart(2, "0")}.`;
}
