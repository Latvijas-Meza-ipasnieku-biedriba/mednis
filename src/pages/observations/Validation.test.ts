import { v4 as uuid } from "uuid";
import {
    isAnimalsStateValid,
    isSignsOfPresenceStateValid,
    isDeadAnimalsStateValid,
    isObservationsStateValid,
} from "./Validation";
import { AnimalsState } from "./Animals";
import { DeadAnimalsState } from "./DeadAnimals";
import { ObservationsState } from "./Observations";
import { SignsOfPresenceState } from "./SignsOfPresence";
import {
    Age,
    DeathType,
    Gender,
    ObservationType,
    ObservedSigns,
    SignOfDisease,
    Species,
} from "../../types/classifiers";

const position = { lat: 56.918666, lng: 24.091752 };

const validAnimalsState: AnimalsState = [
    {
        id: uuid(),
        gender: Gender.Male,
        age: Age.LessThanOneYear,
        count: 1,
        observedSignsOfDisease: true,
        signsOfDisease: {
            [SignOfDisease.CoordinationDisordersAlteredGait]: true,
        },
        notesOnDiseases: "Something something",
        isCollapsed: false,
    },
];

const validSignsOfPresenceState: SignsOfPresenceState = {
    observedSigns: {
        [ObservedSigns.Excrement]: true,
    },
    observedSignsNotes: "",
    count: 1,
};

const validDeadAnimalsState: DeadAnimalsState = {
    gender: Gender.Male,
    deathType: DeathType.HitByAVehicle,
    age: Age.LessThanOneYear,
    count: 1,
    observedSignsOfDisease: true,
    signsOfDisease: {
        [SignOfDisease.CoordinationDisordersAlteredGait]: true,
    },
    notesOnDiseases: "Something something",
};

const validObservationsState: ObservationsState = {
    position,
    photo: { path: "...", webPath: "..." },
    notes: "",
    type: ObservationType.DirectlyObservedAnimals,
    species: Species.Moose,
    animals: validAnimalsState,
    signsOfPresence: validSignsOfPresenceState,
    deadAnimals: validDeadAnimalsState,
};

describe("isAnimalsStateValid", () => {
    it("returns true for valid state", () => {
        const result = isAnimalsStateValid(validAnimalsState);
        expect(result).toBe(true);
    });

    it("returns true for valid state without signsOfDisease", () => {
        const result = isAnimalsStateValid([{ ...validAnimalsState[0], observedSignsOfDisease: false }]);
        expect(result).toBe(true);
    });

    it("returns false for missing gender", () => {
        const result = isAnimalsStateValid([{ ...validAnimalsState[0], gender: undefined }]);
        expect(result).toBe(false);
    });

    it("returns false for missing age", () => {
        const result = isAnimalsStateValid([{ ...validAnimalsState[0], age: undefined }]);
        expect(result).toBe(false);
    });

    it("returns false for missing count", () => {
        const result = isAnimalsStateValid([{ ...validAnimalsState[0], count: 0 }]);
        expect(result).toBe(false);
    });

    it("returns false for missing signsOfDisease", () => {
        const result = isAnimalsStateValid([
            { ...validAnimalsState[0], observedSignsOfDisease: true, signsOfDisease: {} },
        ]);
        expect(result).toBe(false);
    });

    it("returns false for missing signsOfDisease", () => {
        const result = isAnimalsStateValid([
            { ...validAnimalsState[0], observedSignsOfDisease: true, signsOfDisease: {} },
        ]);
        expect(result).toBe(false);
    });
});

describe("isSignsOfPresenceStateValid", () => {
    it("returns true for valid state", () => {
        const result = isSignsOfPresenceStateValid(validSignsOfPresenceState);
        expect(result).toBe(true);
    });

    it("returns false for missing observedSigns", () => {
        const result = isSignsOfPresenceStateValid({ ...validSignsOfPresenceState, observedSigns: {} });
        expect(result).toBe(false);
    });

    it("returns false for missing observedSignsNotes", () => {
        const result = isSignsOfPresenceStateValid({
            ...validSignsOfPresenceState,
            observedSigns: { [ObservedSigns.Other]: true },
            observedSignsNotes: "",
        });
        expect(result).toBe(false);
    });

    it("returns false for missing count", () => {
        const result = isSignsOfPresenceStateValid({ ...validSignsOfPresenceState, count: 0 });
        expect(result).toBe(false);
    });
});

describe("isDeadAnimalsStateValid", () => {
    it("returns true for valid state", () => {
        const result = isDeadAnimalsStateValid(validDeadAnimalsState);
        expect(result).toBe(true);
    });

    it("returns true for valid state without signsOfDisease", () => {
        const result = isDeadAnimalsStateValid({ ...validDeadAnimalsState, observedSignsOfDisease: false });
        expect(result).toBe(true);
    });

    it("returns false for missing gender", () => {
        const result = isDeadAnimalsStateValid({ ...validDeadAnimalsState, gender: undefined });
        expect(result).toBe(false);
    });

    it("returns false for missing deathType", () => {
        const result = isDeadAnimalsStateValid({ ...validDeadAnimalsState, deathType: undefined });
        expect(result).toBe(false);
    });

    it("returns false for missing age", () => {
        const result = isDeadAnimalsStateValid({ ...validDeadAnimalsState, age: undefined });
        expect(result).toBe(false);
    });

    it("returns false for missing count", () => {
        const result = isDeadAnimalsStateValid({ ...validDeadAnimalsState, count: 0 });
        expect(result).toBe(false);
    });

    it("returns false for missing signsOfDisease", () => {
        const result = isDeadAnimalsStateValid({
            ...validDeadAnimalsState,
            observedSignsOfDisease: true,
            signsOfDisease: {},
        });
        expect(result).toBe(false);
    });
});

describe("isObservationsStateValid", () => {
    it("returns true for valid state", () => {
        const result = isObservationsStateValid(validObservationsState);
        expect(result).toBe(true);
    });

    it("returns false for missing species", () => {
        const result = isObservationsStateValid({ ...validObservationsState, species: undefined });
        expect(result).toBe(false);
    });

    it("returns false for missing otherMammals", () => {
        const result = isObservationsStateValid({
            ...validObservationsState,
            species: Species.OtherMammals,
            otherMammals: undefined,
        });
        expect(result).toBe(false);
    });

    it("returns false for missing birds", () => {
        const result = isObservationsStateValid({
            ...validObservationsState,
            species: Species.Birds,
            birds: undefined,
        });
        expect(result).toBe(false);
    });

    it("returns false for invalid animals state", () => {
        const result = isObservationsStateValid({
            ...validObservationsState,
            animals: [{ ...validAnimalsState[0], gender: undefined }],
        });
        expect(result).toBe(false);
    });

    it("returns false for invalid signsOfPresence state", () => {
        const result = isObservationsStateValid({
            ...validObservationsState,
            type: ObservationType.SignsOfPresence,
            signsOfPresence: { ...validSignsOfPresenceState, observedSigns: {} },
        });
        expect(result).toBe(false);
    });

    it("returns false for invalid deadAnimals state", () => {
        const result = isObservationsStateValid({
            ...validObservationsState,
            type: ObservationType.Dead,
            deadAnimals: { ...validDeadAnimalsState, gender: undefined },
        });
        expect(result).toBe(false);
    });

    it("returns false for missing position", () => {
        const result = isObservationsStateValid({
            ...validObservationsState,
            position: undefined,
        });
        expect(result).toBe(false);
    });

    it("returns true for missing photo - directly observed animals", () => {
        const result = isObservationsStateValid({
            ...validObservationsState,
        });
        expect(result).toBe(true);
    });

    it("returns false for missing photo - signs of presence", () => {
        const result = isObservationsStateValid({
            ...validObservationsState,
            type: ObservationType.SignsOfPresence,
            signsOfPresence: validSignsOfPresenceState,
            photo: undefined,
        });
        expect(result).toBe(false);
    });

    it("returns false for missing photo - dead animals", () => {
        const result = isObservationsStateValid({
            ...validObservationsState,
            type: ObservationType.Dead,
            deadAnimals: validDeadAnimalsState,
            photo: undefined,
        });
        expect(result).toBe(false);
    });

    it("returns false for missing type", () => {
        const result = isObservationsStateValid({
            ...validObservationsState,
            type: undefined,
        });
        expect(result).toBe(false);
    });
});
