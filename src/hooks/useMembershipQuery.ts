import * as React from "react";
import { useQuery } from "react-query";
import { Plugins } from "@capacitor/core";
import { queryClient } from "../reactQuery";
import { StorageKey } from "../types/storage";
import { Membership } from "../types/mtl";
import { client } from "../utils/client";
import { logger } from "../utils/logger";
import { configuration } from "../configuration";

export function useMembershipQuery(enabled?: boolean) {
    return useQuery(StorageKey.Memberships, getMemberships, {
        onSuccess: (memberships: Membership[]) => {
            logger.log("Memberships loaded");
            saveMembershipsToStorage(memberships);
        },
        onError: (error) => {
            logger.error({ message: "Failed to load memberships", error });
        },
        enabled,
    });
}

export function useStoredMembershipQueryData() {
    const [memberships, setMemberships] = React.useState<Membership[]>();

    React.useEffect(() => {
        getMembershipsFromStorage()
            .then((memberships) => setMemberships(memberships))
            .catch((error) => console.error(`Failed to load memberships from storage: ${error.message}`));
    }, []);

    React.useEffect(() => {
        if (memberships) {
            queryClient.setQueryData(StorageKey.Memberships, memberships);
        }
    }, [memberships]);
}

export function reloadMemberships() {
    queryClient.invalidateQueries(StorageKey.Memberships);
}

function getMemberships(): Promise<Membership[]> {
    return client.get(configuration.api.endpoints.memberships).then((response) => response.data);
}

function getMembershipsFromStorage(): Promise<Membership[]> {
    return Plugins.Storage.get({ key: StorageKey.Memberships }).then((result) => {
        if (result.value) {
            return JSON.parse(result.value);
        }
    });
}

function saveMembershipsToStorage(memberships: Membership[]): Promise<void> {
    return Plugins.Storage.set({ key: StorageKey.Memberships, value: JSON.stringify(memberships) });
}
