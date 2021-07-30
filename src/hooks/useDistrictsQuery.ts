import * as React from "react";
import { Plugins } from "@capacitor/core";
import { useQuery } from "react-query";
import { client } from "../utils/client";
import { District } from "../types/districts";
import { logger } from "../utils/logger";
import { queryClient } from "../reactQuery";
import { StorageKey } from "../types/storage";
import { configuration } from "../configuration";

export function useDistrictsQuery(enabled?: boolean) {
    return useQuery(StorageKey.Districts, getDistricts, {
        onSuccess: (districts) => {
            logger.log("Districts loaded");
            saveDistrictsToStorage(districts);
        },
        onError: (error) => {
            logger.error({ message: "Failed to load districts", error });
        },
        enabled,
    });
}

export function useStoredDistrictsQueryData() {
    React.useEffect(() => {
        getDistrictsFromStorage()
            .then((districts) => queryClient.setQueryData(StorageKey.Districts, districts))
            .catch((error) => console.error(`Failed to load districts from storage: ${error.message}`));
    }, []);
}

function getDistricts(): Promise<District[]> {
    return client.get(configuration.api.endpoints.districts).then((response) => response.data);
}

function saveDistrictsToStorage(districts: District[]): Promise<void> {
    return Plugins.Storage.set({ key: StorageKey.Districts, value: JSON.stringify(districts) });
}

export function getDistrictsFromStorage(): Promise<District[] | undefined> {
    return Plugins.Storage.get({ key: StorageKey.Districts }).then((result) => {
        if (result.value) {
            return JSON.parse(result.value);
        }
    });
}
