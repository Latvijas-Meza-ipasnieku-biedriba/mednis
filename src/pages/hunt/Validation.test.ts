import { LimitedPreyState } from "./LimitedPreyForm";
import { UnlimitedPreyState } from "./UnlimitedPreyForm";
import { isLimitedPreyValid, isUnlimitedPreyValid } from "./Validation";
import { HuntedType } from "../../types/classifiers";

const position = { lat: 56.918666, lng: 24.091752 };

const validLimitedPreyState: LimitedPreyState = {
    position,
    species: "1",
    strapNumber: "128848",
    huntingLicenseNumber: "128848",
    type: "1",
    gender: "1",
    age: "1",
    notes: "",
    photo: { path: "...", webPath: "..." },
    permit: "1",
    observedSignsOfDisease: false,
    reportGuid: "",
    huntingDistrictId: 0,
    hunterCardNumber: "",
    isHunterForeigner: false,
    foreignerPermitNumber: "",
};

const validUnlimitedPreyState: UnlimitedPreyState = {
    position,
    species: "1",
    subspecies: "",
    count: 1,
    notes: "",
    photo: { path: "...", webPath: "..." },
    observedSignsOfDisease: false,
    reportGuid: "",
};

describe("isLimitedPreyValid", () => {
    it("returns true for valid state", () => {
        const result = isLimitedPreyValid(validLimitedPreyState);
        expect(result).toBe(true);
    });

    it("returns false for missing position", () => {
        const result = isLimitedPreyValid({ ...validLimitedPreyState, position: undefined });
        expect(result).toBe(false);
    });

    it("returns false for missing species", () => {
        const result = isLimitedPreyValid({ ...validLimitedPreyState, species: "" });
        expect(result).toBe(false);
    });

    it("returns false for missing strapNumber", () => {
        const result = isLimitedPreyValid({ ...validLimitedPreyState, strapNumber: "" });
        expect(result).toBe(false);
    });

    it("returns false for missing huntingLicenseNumber", () => {
        const result = isLimitedPreyValid({ ...validLimitedPreyState, huntingLicenseNumber: "" });
        expect(result).toBe(false);
    });

    it("returns false for missing type", () => {
        const result = isLimitedPreyValid({ ...validLimitedPreyState, type: "" });
        expect(result).toBe(false);
    });

    it("returns false for missing gender", () => {
        const result = isLimitedPreyValid({ ...validLimitedPreyState, type: "" });
        expect(result).toBe(false);
    });

    it("returns false for missing photo", () => {
        const result = isLimitedPreyValid({ ...validLimitedPreyState, photo: undefined });
        expect(result).toBe(false);
    });

    it("returns false for missing permit", () => {
        const result = isLimitedPreyValid({ ...validLimitedPreyState, permit: "" });
        expect(result).toBe(false);
    });

    it("returns true for missing photo + injured type", () => {
        const result = isLimitedPreyValid({
            ...validLimitedPreyState,
            type: String(HuntedType.Injured),
            photo: undefined,
        });
        expect(result).toBe(true);
    });

    it("returns false for missing foreignerPermitNumber if isHunterForeigner is true", () => {
        const result = isLimitedPreyValid({
            ...validLimitedPreyState,
            isHunterForeigner: true,
            foreignerPermitNumber: "",
        });
        expect(result).toBe(false);
    });
});

describe("isUnlimitedPreyValid", () => {
    it("returns true for valid state", () => {
        const result = isUnlimitedPreyValid(validUnlimitedPreyState);
        expect(result).toBe(true);
    });

    it("returns false for missing position", () => {
        const result = isUnlimitedPreyValid({ ...validUnlimitedPreyState, position: undefined });
        expect(result).toBe(false);
    });

    it("returns false for missing species", () => {
        const result = isUnlimitedPreyValid({ ...validUnlimitedPreyState, species: "" });
        expect(result).toBe(false);
    });

    // TODO: test missing subspecies

    it("returns false for missing photo", () => {
        const result = isUnlimitedPreyValid({ ...validUnlimitedPreyState, photo: undefined });
        expect(result).toBe(false);
    });
});
