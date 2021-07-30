import { AgriculturalLandType, ClassifierOption, Classifiers } from "../types/classifiers";

export function getActiveClassifiers(classifiers: Classifiers, classifier: keyof Classifiers) {
    return classifiers[classifier].options.filter(isOptionActive);
}

export function getObservationSpecies(classifiers: Classifiers) {
    const filteredOptions = classifiers.species.options.filter(
        (option) => isOptionActive(option) && option.isMainGroupObservation
    );

    // For these options 'listOrderObservation' should be present, if not - put them at the end
    filteredOptions.sort((a, b) => (a.listOrderObservation ?? Infinity) - (b.listOrderObservation ?? Infinity));

    return filteredOptions;
}

export function getObservationOtherMammals(classifiers: Classifiers, language: string) {
    const filteredOptions = classifiers.species.options.filter((option) => {
        // Ignore null values by checking for false
        return isOptionActive(option) && option.isMainGroupObservation === false && option.isMammal;
    });

    filteredOptions.sort(sortOptionsByDescription(language));

    return filteredOptions;
}

export function getObservationBirds(classifiers: Classifiers, language: string) {
    const filteredOptions = classifiers.species.options.filter((option) => {
        // Ignore null values by checking for false
        return isOptionActive(option) && option.isMainGroupObservation === false && option.isMammal === false;
    });

    filteredOptions.sort(sortOptionsByDescription(language));

    return filteredOptions;
}

export function getAgriculturalLandTypes(classifiers: Classifiers) {
    const filteredOptions = classifiers.agriculturalLandType.options.filter((option) => {
        const isOtherType = option.isMainType === undefined;
        return isOptionActive(option) && (option.isMainType || isOtherType);
    });

    return filteredOptions;
}

export function getAgriculturalLandSubtypes(classifiers: Classifiers) {
    const filteredOptions = classifiers.agriculturalLandType.options.filter((option) => {
        const isSubtype = option.isMainType === false;
        const isOtherSubtype = option.isMainType === undefined;
        return isOptionActive(option) && (isSubtype || isOtherSubtype);
    });

    return filteredOptions;
}

export function getAgriculturalLandSpecies(classifiers: Classifiers, language: string, type?: AgriculturalLandType) {
    const filteredOptions = classifiers.species.options.filter((option) => {
        const isAgriculturalLandSpecies =
            (type === AgriculturalLandType.Cropping && option.doesDamageCrops) ||
            (type === AgriculturalLandType.Livestock && option.doesDamageLivestock) ||
            (type === AgriculturalLandType.Poultry && option.doesDamagePoultry) ||
            (type === AgriculturalLandType.Beekeeping && option.doesDamageBees);
        return isOptionActive(option) && isAgriculturalLandSpecies;
    });

    filteredOptions.sort(sortOptionsByDescription(language));

    return filteredOptions;
}

export function getDamagedTreeSpecies(classifiers: Classifiers) {
    const filteredOptions = classifiers.treeSpecies.options.filter(
        (option) => isOptionActive(option) && option.isMainGroupDamage
    );

    // For these options 'listOrder' should be present, if not - put them at the end
    filteredOptions.sort((a, b) => (a.listOrder ?? Infinity) - (b.listOrder ?? Infinity));

    return filteredOptions;
}

export function getOtherDamagedTreeSpecies(classifiers: Classifiers, language: string) {
    const filteredOptions = classifiers.treeSpecies.options.filter(
        (option) => isOptionActive(option) && option.isMainGroupDamage === false
    );

    filteredOptions.sort(sortOptionsByDescription(language));

    return filteredOptions;
}

export function getResponsibleSpeciesForForestDamage(classifiers: Classifiers) {
    const filteredOptions = classifiers.species.options.filter(
        (option) => isOptionActive(option) && option.doesDamageForest === true
    );

    // Sorting by id is a temporary solution for putting "Other" value as the last one
    filteredOptions.sort((a, b) => a.id - b.id);

    return filteredOptions;
}

export function getResponsibleSpeciesForInfrastructureDamage(classifiers: Classifiers) {
    const filteredOptions = classifiers.species.options.filter(
        (option) => isOptionActive(option) && option.doesDamageInfrastructure === true
    );

    return filteredOptions;
}

export function isOptionActive(option: ClassifierOption) {
    const currentDate = new Date();

    if (option.activeFrom && new Date(option.activeFrom) > currentDate) {
        return false;
    }

    if (option.activeTo && new Date(option.activeTo) < currentDate) {
        return false;
    }

    return true;
}

function sortOptionsByDescription(language: string) {
    return (a: ClassifierOption, b: ClassifierOption) =>
        (a.description[language] ?? "").localeCompare(b.description[language] ?? "");
}
