import * as React from "react";
import { Plugins } from "@capacitor/core";
import { useQuery } from "react-query";
import { client } from "../utils/client";
import { queryClient } from "../reactQuery";
import { Classifiers } from "../types/classifiers";
import { StorageKey } from "../types/storage";
import { logger } from "../utils/logger";
import { configuration } from "../configuration";

export function useClassifiersQuery() {
    return useQuery(StorageKey.Classifiers, getClassifiers, {
        onSuccess: (classifiers) => {
            logger.log("Classifiers loaded");
            saveClassifiersToStorage(classifiers);
        },
        onError: (error) => {
            logger.error({ message: "Failed to load classifiers", error });
        },
    });
}

export function useStoredClassifiersQueryData() {
    const [classifiers, setClassifiers] = React.useState<Classifiers>();

    React.useEffect(() => {
        getClassifiersFromStorage()
            .then((classifiers) => setClassifiers(classifiers))
            .catch((error) => console.error(`Failed to load classifiers from storage: ${error.message}`));
    }, []);

    React.useEffect(() => {
        if (classifiers) {
            queryClient.setQueryData(StorageKey.Classifiers, classifiers);
        }
    }, [classifiers]);
}

function getClassifiers(): Promise<Classifiers> {
    return client.get(configuration.api.endpoints.classifiers).then((response) => response.data);
}

function saveClassifiersToStorage(classifiers: Classifiers): Promise<void> {
    return Plugins.Storage.set({ key: StorageKey.Classifiers, value: JSON.stringify(classifiers) });
}

export function getClassifiersFromStorage(): Promise<Classifiers | undefined> {
    return Plugins.Storage.get({ key: StorageKey.Classifiers }).then((result) => {
        if (result.value) {
            return JSON.parse(result.value);
        }
    });
}
