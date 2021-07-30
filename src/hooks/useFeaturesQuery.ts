import * as React from "react";
import { Plugins } from "@capacitor/core";
import { useQuery } from "react-query";
import { client } from "../utils/client";
import { queryClient } from "../reactQuery";
import { Features } from "../types/features";
import { StorageKey } from "../types/storage";
import { logger } from "../utils/logger";
import { configuration } from "../configuration";

export function useFeaturesQuery() {
    return useQuery(StorageKey.Features, getFeatures, {
        onSuccess: (features) => {
            logger.log("Features loaded");
            saveFeaturesToStorage(features);
        },
        onError: (error) => {
            logger.error({ message: "Failed to load features", error });
        },
    });
}

export function useStoredFeaturesQueryData() {
    const [features, setFeatures] = React.useState<Features>();

    React.useEffect(() => {
        getFeaturesFromStorage()
            .then((features) => setFeatures(features))
            .catch((error) => console.error(`Failed to load features from storage: ${error.message}`));
    }, []);

    React.useEffect(() => {
        if (features) {
            queryClient.setQueryData(StorageKey.Features, features);
        }
    }, [features]);
}

function getFeatures(): Promise<Features> {
    return client.get(configuration.api.endpoints.features).then((response) => response.data);
}

function saveFeaturesToStorage(features: Features): Promise<void> {
    return Plugins.Storage.set({ key: StorageKey.Features, value: JSON.stringify(features) });
}

export function getFeaturesFromStorage(): Promise<Features | undefined> {
    return Plugins.Storage.get({ key: StorageKey.Features }).then((result) => {
        if (result.value) {
            return JSON.parse(result.value);
        }
    });
}
