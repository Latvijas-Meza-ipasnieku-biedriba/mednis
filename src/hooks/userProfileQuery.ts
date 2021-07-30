import * as React from "react";
import { useQuery } from "react-query";
import { Plugins } from "@capacitor/core";
import { queryClient } from "../reactQuery";
import { StorageKey } from "../types/storage";
import { Profile } from "../types/profile";
import { client } from "../utils/client";
import { logger } from "../utils/logger";
import { configuration } from "../configuration";

export function useProfileQuery() {
    return useQuery(StorageKey.Profile, getProfile, {
        onSuccess: (profile: Profile) => {
            logger.log("Profile loaded");
            saveProfileToStorage(profile);
        },
        onError: (error) => {
            logger.error({ message: "Failed to load profile", error });
        },
    });
}

export function useStoredProfileQueryData() {
    const [profile, setProfile] = React.useState<Profile>();

    React.useEffect(() => {
        getProfileFromStorage()
            .then((profile) => setProfile(profile))
            .catch((error) => console.error(`Failed to load profile from storage: ${error.message}`));
    }, []);

    React.useEffect(() => {
        if (profile) {
            queryClient.setQueryData(StorageKey.Profile, profile);
        }
    }, [profile]);
}

function getProfile(): Promise<Profile> {
    return client.get(configuration.api.endpoints.profile).then((response) => response.data);
}

function getProfileFromStorage(): Promise<Profile> {
    return Plugins.Storage.get({ key: StorageKey.Profile }).then((result) => {
        if (result.value) {
            return JSON.parse(result.value);
        }
    });
}

function saveProfileToStorage(profile: Profile): Promise<void> {
    return Plugins.Storage.set({ key: StorageKey.Profile, value: JSON.stringify(profile) });
}
