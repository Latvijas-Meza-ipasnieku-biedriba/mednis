import { DamageState } from "./Damage";
import {
    AgriculturalLandDamageAttributes,
    Edit,
    Feature,
    FeatureLayer,
    ForestDamageAttributes,
    Geometry,
    InfrastructureDamageAttributes,
} from "../../types/edit";
import {
    AgriculturalLandType,
    Classifiers,
    DamageType,
    InfrastructureDamageType,
    Species,
    TreeSpecies,
} from "../../types/classifiers";
import { getDefaultAttributeBase } from "../../utils/editAttributes";

export function getDamageEdits(damage: DamageState, classifiers: Classifiers): Edit[] {
    if (damage.type === DamageType.AgriculturalLand) {
        return getAgriculturalLandDamageEdits(damage, classifiers);
    }

    if (damage.type === DamageType.Forest) {
        return getForestDamageEdits(damage);
    }

    if (damage.type === DamageType.Infrastructure) {
        return getInfrastructureDamageEdits(damage);
    }

    throw new Error(`Unknown damage type: ${damage.type}`);
}

function getAgriculturalLandDamageEdits(damage: DamageState, classifiers: Classifiers): Edit[] {
    const agriculturalLandTypeId =
        damage.land.type === AgriculturalLandType.Other ? damage.land.subtype : damage.land.type;

    const speciesId = damage.land.subtype === AgriculturalLandType.Other ? Species.Other : damage.land.species ?? 0;

    const otherSpecies =
        damage.land.type === AgriculturalLandType.Other && damage.land.subtype === AgriculturalLandType.Other
            ? damage.land.customSpecies
            : damage.land.otherSpecies;

    const feature: Feature<AgriculturalLandDamageAttributes> = {
        geometry: getDamageGeometry(damage),
        attributes: {
            notes: damage.notes,
            agriculturalLandTypeId: agriculturalLandTypeId ?? 0,
            speciesId,
            otherSpecies: speciesId === Species.Other ? otherSpecies : "",
            ...getDefaultAttributeBase(),
        },
    };

    const agriculturalLandTypeClassifier = classifiers.agriculturalLandType.options.find(
        (option) => option.id === agriculturalLandTypeId
    );
    if (agriculturalLandTypeClassifier?.isCountable) {
        feature.attributes.count = damage.land.count;
    } else {
        feature.attributes.damagedArea = Number(damage.land.area);
    }

    return [
        {
            id: FeatureLayer.AgriculturalLandDamage,
            adds: [feature],
        },
    ];
}

function getForestDamageEdits(damage: DamageState): Edit[] {
    const damagedTreeSpeciesIds: number[] = [];
    for (const [id, checked] of Object.entries(damage.forest.damagedTreeSpecies)) {
        if (checked) {
            if (Number(id) === TreeSpecies.Other) {
                damagedTreeSpeciesIds.push(damage.forest.otherDamagedTreeSpecies ?? 0);
            } else {
                damagedTreeSpeciesIds.push(Number(id));
            }
        }
    }

    const otherResponsibleAnimalSpecies =
        damage.forest.responsibleSpecies === Species.Other ? damage.forest.otherResponsibleSpecies : "";

    const damageTypeIds: number[] = [];
    for (const [id, checked] of Object.entries(damage.forest.damageTypes)) {
        if (checked) {
            damageTypeIds.push(Number(id));
        }
    }

    const feature: Feature<ForestDamageAttributes> = {
        geometry: getDamageGeometry(damage),
        attributes: {
            notes: damage.notes,
            damagedArea: Number(damage.forest.area),
            forestProtectionDone: damage.forest.standProtection === "yes", // TODO: rename standProtection to forestProtection and change type to boolean
            damagedTreeSpeciesIds,
            damageVolumeTypeId: damage.forest.damageVolumeType ?? 0,
            responsibleAnimalSpeciesId: damage.forest.responsibleSpecies ?? 0,
            otherResponsibleAnimalSpecies,
            damageTypeIds,
            ...getDefaultAttributeBase(),
        },
    };

    return [
        {
            id: FeatureLayer.ForestDamage,
            adds: [feature],
        },
    ];
}

function getInfrastructureDamageEdits(damage: DamageState): Edit[] {
    const otherInfrastructureType =
        damage.infrastructure.type === InfrastructureDamageType.Other ? damage.infrastructure.otherType : "";

    const otherResponsibleAnimalSpecies =
        damage.infrastructure.responsibleSpecies === Species.Other ? damage.infrastructure.otherResponsibleSpecies : "";

    const feature: Feature<InfrastructureDamageAttributes> = {
        geometry: getDamageGeometry(damage),
        attributes: {
            notes: damage.notes,
            infrastructureTypeId: damage.infrastructure.type ?? 0,
            otherInfrastructureType,
            responsibleAnimalSpeciesId: damage.infrastructure.responsibleSpecies ?? 0,
            otherResponsibleAnimalSpecies,
            ...getDefaultAttributeBase(),
        },
    };

    return [
        {
            id: FeatureLayer.InfrastructureDamage,
            adds: [feature],
        },
    ];
}

function getDamageGeometry(observations: DamageState): Geometry {
    return {
        x: observations.position?.lng ?? 0,
        y: observations.position?.lat ?? 0,
    };
}
