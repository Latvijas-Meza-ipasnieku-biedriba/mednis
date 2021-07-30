import * as React from "react";
import { Plugins } from "@capacitor/core";
import { StorageKey } from "../types/storage";
import { LimitedPreyState } from "../pages/hunt/LimitedPreyForm";

export function useInjuredAnimalState(permitId?: string) {
    const [injuredAnimalStates, setInjuredAnimalStates] = React.useState<LimitedPreyState[]>();

    React.useEffect(() => {
        if (permitId) {
            getInjuredAnimalStatesFromStorage()
                .then((injuredAnimalStates) => setInjuredAnimalStates(injuredAnimalStates))
                .catch((error) => console.error(`Failed to load injured animal States from storage: ${error.message}`));
        }
    }, []);

    return injuredAnimalStates?.find((injuredAnimalState) => injuredAnimalState.permit === permitId);
}

export function getInjuredAnimalStatesFromStorage(): Promise<LimitedPreyState[]> {
    return Plugins.Storage.get({ key: StorageKey.InjuredAnimals }).then((result) => {
        if (result.value) {
            return JSON.parse(result.value);
        }
    });
}

export function saveInjuredAnimalStatesToStorage(injuredAnimalStates: LimitedPreyState[]): Promise<void> {
    return Plugins.Storage.set({ key: StorageKey.InjuredAnimals, value: JSON.stringify(injuredAnimalStates) });
}
