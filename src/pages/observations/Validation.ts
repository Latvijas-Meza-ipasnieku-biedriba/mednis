import { ObservationsState } from "./Observations";
import { AnimalsState } from "./Animals";
import { SignsOfPresenceState } from "./SignsOfPresence";
import { DeadAnimalsState } from "./DeadAnimals";
import { ObservationType, ObservedSigns, Species } from "../../types/classifiers";

export function isAnimalsStateValid(animals: AnimalsState): boolean {
    for (const { gender, age, count, observedSignsOfDisease, signsOfDisease } of animals) {
        if (!gender || !age || !count) {
            return false;
        }

        if (observedSignsOfDisease) {
            if (Object.values(signsOfDisease).every((disease) => !disease)) {
                return false;
            }
        }
    }

    return true;
}

export function isSignsOfPresenceStateValid({
    observedSigns,
    observedSignsNotes,
    count,
}: SignsOfPresenceState): boolean {
    if (!count) {
        return false;
    }

    if (Object.values(observedSigns).every((disease) => !disease)) {
        return false;
    }

    if (observedSigns[ObservedSigns.Other] && !observedSignsNotes) {
        return false;
    }

    return true;
}

export function isDeadAnimalsStateValid({
    gender,
    deathType,
    age,
    count,
    observedSignsOfDisease,
    signsOfDisease,
}: DeadAnimalsState): boolean {
    if (!gender || !deathType || !age || !count) {
        return false;
    }

    if (observedSignsOfDisease) {
        if (Object.values(signsOfDisease).every((disease) => !disease)) {
            return false;
        }
    }

    return true;
}

export function isObservationsStateValid({
    position,
    species,
    otherMammals,
    birds,
    photo,
    type,
    animals,
    signsOfPresence,
    deadAnimals,
}: ObservationsState): boolean {
    if (!position || !species) {
        return false;
    }

    if (species === Species.OtherMammals && !otherMammals) {
        return false;
    }

    if (species === Species.Birds && !birds) {
        return false;
    }

    if (type === ObservationType.DirectlyObservedAnimals) {
        return isAnimalsStateValid(animals);
    }

    // Photo is optional for ObservationType.DirectlyObservedAnimals, mandatory for others
    if (!photo) {
        return false;
    }

    if (type === ObservationType.SignsOfPresence) {
        return isSignsOfPresenceStateValid(signsOfPresence);
    }

    if (type === ObservationType.Dead) {
        return isDeadAnimalsStateValid(deadAnimals);
    }

    return false;
}
