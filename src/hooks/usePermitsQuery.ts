import * as React from "react";
import { useQuery } from "react-query";
import { Plugins } from "@capacitor/core";
import { client } from "../utils/client";
import { queryClient } from "../reactQuery";
import { Permit, PermitFilterType, StrapStatus } from "../types/permits";
import { StorageKey } from "../types/storage";
import { HuntedType, PermitAllowanceClassifierOption } from "../types/classifiers";
import { LimitedPreyState } from "../pages/hunt/LimitedPreyForm";
import { logger } from "../utils/logger";
import { isStoredCurrentUserEditQueueIdle } from "../utils/editQueue";
import { getInjuredAnimalStatesFromStorage, saveInjuredAnimalStatesToStorage } from "./useInjuredAnimalState";
import { configuration } from "../configuration";

export function usePermitsQuery(enabled?: boolean) {
    return useQuery(StorageKey.Permits, getIssuedPermits, {
        onSuccess: (permits: Permit[]) => {
            logger.log("Permits loaded");
            savePermitsToStorage(permits);
        },
        onError: (error) => {
            logger.error({ message: "Failed to load permits", error });
        },
        enabled,
    });
}

export function useStoredPermitsQueryData() {
    const [permits, setPermits] = React.useState<Permit[]>();

    React.useEffect(() => {
        getPermitsFromStorage()
            .then((permits) => setPermits(permits))
            .catch((error) => console.error(`Failed to load permits from storage: ${error.message}`));
    }, []);

    React.useEffect(() => {
        if (permits) {
            queryClient.setQueryData(StorageKey.Permits, permits);
        }
    }, [permits]);
}

export function reloadPermits() {
    queryClient.invalidateQueries(StorageKey.Permits);
}

export function removePermit(
    permitId: number,
    previouslyInjured: boolean,
    limitedPrey: LimitedPreyState,
    permitAllowance?: PermitAllowanceClassifierOption
) {
    // remove permit to display changes locally because we might be offline
    let permits: Permit[] | undefined = queryClient.getQueryData(StorageKey.Permits);
    if (!permits) {
        return [];
    }

    if (previouslyInjured) {
        permits = permits.filter((permit) => permit.value !== permitId);

        // Remove injured animal state from storage
        getInjuredAnimalStatesFromStorage().then((injuredAnimalStates) => {
            if (injuredAnimalStates) {
                saveInjuredAnimalStatesToStorage(
                    injuredAnimalStates.filter((injuredAnimalState) => injuredAnimalState.permit !== String(permitId))
                );
            }
        });
    } else {
        const permit = permits.find((permit) => permit.value === permitId);
        if (permit) {
            if (Number(limitedPrey.type) === HuntedType.Injured) {
                // Add values to display in injured list
                permit.huntedTypeId = Number(limitedPrey.type);
                permit.strapStatusId = StrapStatus.Used;
                permit.injuredDate = new Date().toISOString();
                permit.injuredByCurrentUser = true;
                permit.reportGuid = limitedPrey.reportGuid;
                if (permitAllowance) {
                    permit.permitAllowanceId = permitAllowance.id;
                }
                permits[permits.findIndex((permit) => permit.value === permitId)] = permit;

                // Add injured animal state to storage to refill data when re-opened
                getInjuredAnimalStatesFromStorage().then((injuredAnimalStates) => {
                    const updatedInjuredAnimalStates = injuredAnimalStates
                        ? [...injuredAnimalStates, limitedPrey]
                        : [limitedPrey];
                    saveInjuredAnimalStatesToStorage(updatedInjuredAnimalStates);
                });
            } else {
                permits = permits.filter((permit) => permit.value !== permitId);
            }
        }
    }
    queryClient.setQueryData(StorageKey.Permits, permits);
}

function getIssuedPermits() {
    // Only refetch permits if edit queue is idle
    return isStoredCurrentUserEditQueueIdle().then((isStoredEditQueueIdle) => {
        if (isStoredEditQueueIdle) {
            return getPermits(PermitFilterType.Issued);
        }
        return getPermitsFromStorage();
    });
}

function getPermits(filter: PermitFilterType): Promise<Permit[]> {
    return client.get<Permit[]>(configuration.api.endpoints.permits + "/" + filter).then((response) => response.data);
}

function getPermitsFromStorage(): Promise<Permit[]> {
    return Plugins.Storage.get({ key: StorageKey.Permits }).then((result) => {
        if (result.value) {
            return JSON.parse(result.value);
        }
    });
}

function savePermitsToStorage(permits: Permit[]): Promise<void> {
    return Plugins.Storage.set({ key: StorageKey.Permits, value: JSON.stringify(permits) });
}
