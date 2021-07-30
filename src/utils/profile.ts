import { Profile, ProfileBasicInfo } from "../types/profile";
import { HunterCardType } from "../types/classifiers";
import { Plugins } from "@capacitor/core";
import { StorageKey } from "../types/storage";

export function hasValidSeasonCard(profile: Profile) {
    return (
        profile.hunterCards?.filter(
            (hunterCard) =>
                hunterCard.cardType.id === HunterCardType.Season &&
                new Date(hunterCard.validFrom) <= new Date() &&
                new Date(hunterCard.validTo) >= new Date()
        ).length > 0
    );
}

export function isValidHunter(profile: Profile) {
    if (!profile.isHunter) {
        return false;
    }
    if (!profile.validHuntersCardNumber) {
        return false;
    }

    return true;
}

export function getProfileBasicInfoFromStorage(): Promise<ProfileBasicInfo> {
    return Plugins.Storage.get({ key: StorageKey.ProfileBasicInfo }).then((result) => {
        if (result.value) {
            return JSON.parse(result.value);
        }
    });
}
