import { DamageState } from "./Damage";
import { ForestDamageState } from "./ForestDamage";
import { LandDamageState } from "./LandDamage";
import { InfrastructureDamageState } from "./InfrastructureDamage";
import { isLandDamageValid, isForestDamageValid, isInfrastructureDamageValid, isDamageValid } from "./Validation";
import {
    AgriculturalLandType,
    DamageType,
    DamageVolumeType,
    ForestDamageType,
    InfrastructureDamageType,
    Species,
    TreeSpecies,
} from "../../types/classifiers";
import { classifiers } from "../../__mocks__/classifiers";

const position = { lat: 56.918666, lng: 24.091752 };

const validLandDamageState: LandDamageState = {
    type: AgriculturalLandType.Cropping,
    species: Species.Moose,
    customSpecies: "",
    otherSpecies: "",
    area: "1.2",
    count: 1,
};

const validForestDamageState: ForestDamageState = {
    area: "123",
    standProtection: "yes",
    damagedTreeSpecies: { [TreeSpecies.Pine]: true },
    damageVolumeType: DamageVolumeType.LessThanFivePercent,
    responsibleSpecies: Species.Moose,
    otherResponsibleSpecies: "",
    damageTypes: { [ForestDamageType.TreetopBittenOffOrBroken]: true },
};

const validInfrastructureDamageState: InfrastructureDamageState = {
    type: InfrastructureDamageType.Road,
    otherType: "",
    responsibleSpecies: Species.Beaver,
    otherResponsibleSpecies: "",
};

const validDamageState: DamageState = {
    position,
    photo: { path: "...", webPath: "..." },
    notes: "",
    type: DamageType.AgriculturalLand,
    land: validLandDamageState,
    forest: validForestDamageState,
    infrastructure: validInfrastructureDamageState,
};

describe("isLandDamageValid", () => {
    it("returns true for valid state", () => {
        const result = isLandDamageValid(validLandDamageState, classifiers);
        expect(result).toBe(true);
    });

    it("returns false for missing type", () => {
        const result = isLandDamageValid({ ...validLandDamageState, type: undefined }, classifiers);
        expect(result).toBe(false);
    });

    it("returns false for missing subtype", () => {
        const result = isLandDamageValid(
            {
                ...validLandDamageState,
                type: AgriculturalLandType.Other,
                subtype: undefined,
            },
            classifiers
        );
        expect(result).toBe(false);
    });

    it("returns false for missing species", () => {
        const result = isLandDamageValid({ ...validLandDamageState, species: undefined }, classifiers);
        expect(result).toBe(false);
    });

    it("returns false for missing other type's species", () => {
        const result = isLandDamageValid(
            {
                ...validLandDamageState,
                type: AgriculturalLandType.Other,
                subtype: AgriculturalLandType.Beekeeping,
                species: undefined,
            },
            classifiers
        );
        expect(result).toBe(false);
    });

    it("returns false for missing customSpecies", () => {
        const result = isLandDamageValid(
            {
                ...validLandDamageState,
                type: AgriculturalLandType.Other,
                subtype: AgriculturalLandType.Other,
                customSpecies: "",
            },
            classifiers
        );
        expect(result).toBe(false);
    });

    it("returns false for missing otherSpecies", () => {
        const result = isLandDamageValid(
            {
                ...validLandDamageState,
                type: AgriculturalLandType.Livestock,
                species: Species.Other,
                otherSpecies: "",
            },
            classifiers
        );
        expect(result).toBe(false);
    });

    it("returns false for missing area when cropping is selected", () => {
        const result = isLandDamageValid(
            {
                ...validLandDamageState,
                type: AgriculturalLandType.Cropping,
                area: "",
            },
            classifiers
        );
        expect(result).toBe(false);
    });

    it("returns false for missing area when other is selected", () => {
        const result = isLandDamageValid(
            {
                ...validLandDamageState,
                type: AgriculturalLandType.Other,
                area: "",
            },
            classifiers
        );
        expect(result).toBe(false);
    });

    it("returns false for invalid count when livestock is selected", () => {
        const result = isLandDamageValid(
            {
                ...validLandDamageState,
                type: AgriculturalLandType.Livestock,
                count: 0,
            },
            classifiers
        );
        expect(result).toBe(false);
    });

    it("returns false for invalid count when beekeeping is selected", () => {
        const result = isLandDamageValid(
            {
                ...validLandDamageState,
                type: AgriculturalLandType.Beekeeping,
                count: 0,
            },
            classifiers
        );
        expect(result).toBe(false);
    });

    it("returns false for invalid count when poultry is selected", () => {
        const result = isLandDamageValid(
            {
                ...validLandDamageState,
                type: AgriculturalLandType.Poultry,
                count: 0,
            },
            classifiers
        );
        expect(result).toBe(false);
    });
});

describe("isForestDamageValid", () => {
    it("returns true for valid state", () => {
        const result = isForestDamageValid(validForestDamageState);
        expect(result).toBe(true);
    });

    it("returns false for missing area", () => {
        const result = isForestDamageValid({ ...validForestDamageState, area: "" });
        expect(result).toBe(false);
    });

    it("returns false for missing standProtection", () => {
        const result = isForestDamageValid({ ...validForestDamageState, standProtection: "" });
        expect(result).toBe(false);
    });

    it("returns false for missing damageVolumeType", () => {
        const result = isForestDamageValid({ ...validForestDamageState, damageVolumeType: undefined });
        expect(result).toBe(false);
    });

    it("returns false for missing damagedTreeSpecies", () => {
        const result = isForestDamageValid({ ...validForestDamageState, damagedTreeSpecies: {} });
        expect(result).toBe(false);
    });

    it("returns false for missing otherDamagedTreeSpecies", () => {
        const result = isForestDamageValid({
            ...validForestDamageState,
            damagedTreeSpecies: { [TreeSpecies.Other]: true },
            otherDamagedTreeSpecies: undefined,
        });
        expect(result).toBe(false);
    });

    it("returns false for missing responsibleSpecies", () => {
        const result = isForestDamageValid({ ...validForestDamageState, responsibleSpecies: undefined });
        expect(result).toBe(false);
    });

    it("returns false for missing otherResponsibleSpecies", () => {
        const result = isForestDamageValid({
            ...validForestDamageState,
            responsibleSpecies: Species.Other,
            otherResponsibleSpecies: "",
        });
        expect(result).toBe(false);
    });

    it("returns false for missing damageTypes", () => {
        const result = isForestDamageValid({ ...validForestDamageState, damageTypes: {} });
        expect(result).toBe(false);
    });
});

describe("isInfrastructureDamageValid", () => {
    it("returns true for valid state", () => {
        const result = isInfrastructureDamageValid(validInfrastructureDamageState);
        expect(result).toBe(true);
    });

    it("returns false for missing type", () => {
        const result = isInfrastructureDamageValid({ ...validInfrastructureDamageState, type: undefined });
        expect(result).toBe(false);
    });

    it("returns false for missing otherType", () => {
        const result = isInfrastructureDamageValid({
            ...validInfrastructureDamageState,
            type: InfrastructureDamageType.Other,
            otherType: "",
        });
        expect(result).toBe(false);
    });

    it("returns false for missing responsibleSpecies", () => {
        const result = isInfrastructureDamageValid({
            ...validInfrastructureDamageState,
            responsibleSpecies: undefined,
        });
        expect(result).toBe(false);
    });

    it("returns false for missing otherResponsibleSpecies", () => {
        const result = isInfrastructureDamageValid({
            ...validInfrastructureDamageState,
            responsibleSpecies: Species.Other,
            otherResponsibleSpecies: "",
        });
        expect(result).toBe(false);
    });
});

describe("isDamageValid", () => {
    it("returns true for valid state", () => {
        const result = isDamageValid(validDamageState, classifiers);
        expect(result).toBe(true);
    });

    it("returns false for missing position", () => {
        const result = isDamageValid({ ...validDamageState, position: undefined }, classifiers);
        expect(result).toBe(false);
    });

    it("returns false for missing photo", () => {
        const result = isDamageValid({ ...validDamageState, photo: undefined }, classifiers);
        expect(result).toBe(false);
    });

    it("returns false for invalid type", () => {
        const result = isDamageValid({ ...validDamageState, type: undefined }, classifiers);
        expect(result).toBe(false);
    });

    it("returns false for invalid land state", () => {
        const result = isDamageValid(
            {
                ...validDamageState,
                type: DamageType.AgriculturalLand,
                land: { ...validLandDamageState, type: undefined },
            },
            classifiers
        );
        expect(result).toBe(false);
    });

    it("returns false for invalid forest state", () => {
        const result = isDamageValid(
            {
                ...validDamageState,
                type: DamageType.Forest,
                forest: { ...validForestDamageState, area: "" },
            },
            classifiers
        );
        expect(result).toBe(false);
    });

    it("returns false for invalid infrastructure state", () => {
        const result = isDamageValid(
            {
                ...validDamageState,
                type: DamageType.Infrastructure,
                infrastructure: { ...validInfrastructureDamageState, type: undefined },
            },
            classifiers
        );
        expect(result).toBe(false);
    });
});
