import { Plugins } from "@capacitor/core";
import { StorageKey } from "../types/storage";

export function clearUserData() {
    Plugins.Storage.remove({
        key: StorageKey.Permits,
    })
        .then(() => console.log("Permits removed from storage"))
        .catch((error) => console.error("Failed to remove permits from storage", error));
    Plugins.Storage.remove({
        key: StorageKey.Profile,
    })
        .then(() => console.log("Profile removed from storage"))
        .catch((error) => console.error("Failed to remove profile from storage", error));
    Plugins.Storage.remove({
        key: StorageKey.ProfileBasicInfo,
    })
        .then(() => console.log("ProfileBasicInfo removed from storage"))
        .catch((error) => console.error("Failed to remove profileBasicInfo from storage", error));
    Plugins.Storage.remove({
        key: StorageKey.Memberships,
    })
        .then(() => console.log("Memberships removed from storage"))
        .catch((error) => console.error("Failed to remove memberships from storage", error));
    Plugins.Storage.remove({
        key: StorageKey.HunterConfig,
    })
        .then(() => console.log("HunterConfig removed from storage"))
        .catch((error) => console.error("Failed to remove hunterConfig from storage", error));
    Plugins.Storage.remove({
        key: StorageKey.EditQueue,
    })
        .then(() => console.log("EditQueue removed from storage"))
        .catch((error) => console.error("Failed to remove editQueue from storage", error));
}
