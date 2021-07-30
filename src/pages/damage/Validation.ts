import { DamageState } from "./Damage";
import { ForestDamageState } from "./ForestDamage";
import { InfrastructureDamageState } from "./InfrastructureDamage";
import { isLandDamageAreaVisible, isLandDamageCountVisible, LandDamageState } from "./LandDamage";
import {
    AgriculturalLandType,
    Classifiers,
    DamageType,
    InfrastructureDamageType,
    Species,
    TreeSpecies,
} from "../../types/classifiers";

export function isLandDamageValid(
    { type, subtype, species, customSpecies, otherSpecies, area, count }: LandDamageState,
    classifiers: Classifiers
): boolean {
    if (!type) {
        return false;
    }

    const isOtherType = type === AgriculturalLandType.Other;
    const isOtherSubtype = subtype === AgriculturalLandType.Other;
    if (isOtherType && isOtherSubtype && !customSpecies) {
        return false;
    }

    if (isOtherType && !subtype) {
        return false;
    }

    if (isOtherType && !isOtherSubtype && !species) {
        return false;
    }

    if (!isOtherType && !species) {
        return false;
    }

    const isOtherSpecies = species === Species.Other;
    if (isOtherSpecies && !otherSpecies) {
        return false;
    }

    const isAreaVisible = isLandDamageAreaVisible(type ?? 0, subtype ?? 0, classifiers.agriculturalLandType.options);
    if (isAreaVisible && !area) {
        return false;
    }

    const isCountVisible = isLandDamageCountVisible(type ?? 0, subtype ?? 0, classifiers.agriculturalLandType.options);
    if (isCountVisible && !count) {
        return false;
    }

    return true;
}

export function isForestDamageValid({
    area,
    standProtection,
    damageVolumeType,
    damagedTreeSpecies,
    otherDamagedTreeSpecies,
    responsibleSpecies,
    otherResponsibleSpecies,
    damageTypes,
}: ForestDamageState): boolean {
    if (!area || !standProtection || !damageVolumeType || !responsibleSpecies) {
        return false;
    }

    // Must have at least one checked type
    if (Object.values(damagedTreeSpecies).every((treeSpecies) => !treeSpecies)) {
        return false;
    }

    const isOtherDamagedTreeSpeciesChecked = damagedTreeSpecies[TreeSpecies.Other];
    if (isOtherDamagedTreeSpeciesChecked && !otherDamagedTreeSpecies) {
        return false;
    }

    const isOtherResponsibleSpeciesChecked = responsibleSpecies === Species.Other;
    if (isOtherResponsibleSpeciesChecked && !otherResponsibleSpecies) {
        return false;
    }

    // Must have at least one checked type
    if (Object.values(damageTypes).every((type) => !type)) {
        return false;
    }

    return true;
}

export function isInfrastructureDamageValid({
    type,
    otherType,
    responsibleSpecies,
    otherResponsibleSpecies,
}: InfrastructureDamageState): boolean {
    const isOtherDamageType = type === InfrastructureDamageType.Other;
    if (isOtherDamageType && !otherType) {
        return false;
    }

    if (!isOtherDamageType && !type) {
        return false;
    }

    const isOtherResponsibleSpecies = responsibleSpecies === Species.Other;
    if (isOtherResponsibleSpecies && !otherResponsibleSpecies) {
        return false;
    }

    if (!isOtherResponsibleSpecies && !responsibleSpecies) {
        return false;
    }

    return true;
}

export function isDamageValid(
    { position, photo, type, land, forest, infrastructure }: DamageState,
    classifiers: Classifiers
): boolean {
    if (!position || !photo) {
        return false;
    }

    if (type === DamageType.AgriculturalLand) {
        return isLandDamageValid(land, classifiers);
    }

    if (type === DamageType.Forest) {
        return isForestDamageValid(forest);
    }

    if (type === DamageType.Infrastructure) {
        return isInfrastructureDamageValid(infrastructure);
    }

    return false;
}
