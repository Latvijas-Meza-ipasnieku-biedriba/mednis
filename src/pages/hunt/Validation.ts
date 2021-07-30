import { LimitedPreyState } from "./LimitedPreyForm";
import { UnlimitedPreyState } from "./UnlimitedPreyForm";
import { UnlimitedSpecies } from "../../types/hunt";
import { HuntedType } from "../../types/classifiers";

export function isLimitedPreyValid(limitedPrey: LimitedPreyState): boolean {
    const {
        position,
        species,
        strapNumber,
        huntingLicenseNumber,
        type,
        gender,
        age,
        photo,
        permit,
        isHunterForeigner,
        foreignerPermitNumber,
    } = limitedPrey;
    if (!position || !species || !strapNumber || !huntingLicenseNumber || !type || !gender || !age || !permit) {
        return false;
    }

    if (type !== String(HuntedType.Injured) && !photo) {
        return false;
    }

    if (isHunterForeigner && !foreignerPermitNumber) {
        return false;
    }

    return true;
}

export function isUnlimitedPreyValid(
    unlimitedPrey: UnlimitedPreyState,
    unlimitedSpeciesontext?: UnlimitedSpecies
): boolean {
    const { position, species, subspecies, photo } = unlimitedPrey;

    if (!position || !species) {
        return false;
    }

    if (unlimitedSpeciesontext?.subspecies && !subspecies) {
        return false;
    }

    if (!photo) {
        return false;
    }

    return true;
}
