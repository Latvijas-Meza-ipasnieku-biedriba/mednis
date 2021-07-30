import * as React from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { Plugins } from "@capacitor/core";
import { useMutation } from "react-query";
import { client } from "../utils/client";
import { queryClient } from "../reactQuery";
import { StorageKey } from "../types/storage";
import { configuration } from "../configuration";

export enum VmdAccountConnectStatus {
    Idle = "Idle",
    Loading = "Loading",
    Success = "Success",
    Failure = "Failure",
    Skipped = "Skipped",
}

interface VmdAccountConnectIdleState {
    status: VmdAccountConnectStatus.Idle;
    connect: () => void;
    skip: () => void;
}

interface VmdAccountConnectLoadingState {
    status: VmdAccountConnectStatus.Loading;
}

interface VmdAccountConnectSuccessState {
    status: VmdAccountConnectStatus.Success;
}

interface VmdAccountConnectFailureState {
    status: VmdAccountConnectStatus.Failure;
    reset: () => void;
}

interface VmdAccountConnectSkippedState {
    status: VmdAccountConnectStatus.Skipped;
}

type VmdAccountConnectState =
    | VmdAccountConnectIdleState
    | VmdAccountConnectLoadingState
    | VmdAccountConnectSuccessState
    | VmdAccountConnectFailureState
    | VmdAccountConnectSkippedState;

export function useVmdAccountConnect(): VmdAccountConnectState {
    const [temporaryTokens, setTemporaryTokens] = React.useState({ accessToken: "", authToken: "" });

    // Extract token from VMD authentication redirect
    React.useEffect(() => {
        const handle = Plugins.App.addListener("appUrlOpen", (appOpenUrl) => {
            if (appOpenUrl.url.startsWith(configuration.vmd.callbackUri)) {
                Plugins.Browser.close();
                const url = new URL(appOpenUrl.url);
                const authToken = url.searchParams.get("authToken");
                if (authToken) {
                    setTemporaryTokens((temporaryTokens) => ({ ...temporaryTokens, authToken }));
                }
            }
        });
        return () => {
            handle.remove();
        };
    }, []);

    const { mutate: vmdTokenMutate, data: vmdToken, status: vmdTokenStatus, reset: vmdTokenReset } = useMutation(
        getVmdToken,
        {
            retry: 3,
        }
    );

    // Request VMD token
    React.useEffect(() => {
        if (temporaryTokens.authToken) {
            vmdTokenMutate(temporaryTokens);
        }
    }, [temporaryTokens, vmdTokenMutate]);

    const {
        mutate: connectVmdAccountMutate,
        status: connectVmdAccountStatus,
        reset: connectVmdAccountReset,
    } = useMutation(connectVmdAccount, {
        retry: 3,
        onSuccess: () => {
            queryClient.invalidateQueries(StorageKey.Permits);
            queryClient.invalidateQueries(StorageKey.Profile);
            queryClient.invalidateQueries(StorageKey.Memberships);
        },
    });

    // Connect VMD account to authenticated user
    React.useEffect(() => {
        if (vmdToken) {
            connectVmdAccountMutate(vmdToken);
        }
    }, [vmdToken, connectVmdAccountMutate]);

    const connect = React.useCallback(() => {
        const temporaryTokens = { accessToken: uuid(), authToken: "" };
        setTemporaryTokens(temporaryTokens);
        const url = new URL(configuration.vmd.authorizationEndpoint);
        url.searchParams.set("returnUrl", configuration.vmd.callbackUri + "/?authToken=");
        url.searchParams.set("accessToken", temporaryTokens.accessToken);
        Plugins.Browser.open({ url: url.toString() });
    }, []);

    const [isSkipped, setIsSkipped] = React.useState(false);
    const skip = React.useCallback(() => {
        setIsSkipped(true);
        // TODO
    }, []);

    const reset = React.useCallback(() => {
        setTemporaryTokens({ accessToken: "", authToken: "" });
        vmdTokenReset();
        connectVmdAccountReset();
    }, [vmdTokenReset, connectVmdAccountReset]);

    if (isSkipped) {
        return { status: VmdAccountConnectStatus.Skipped };
    }

    if (vmdTokenStatus === "idle" && connectVmdAccountStatus === "idle") {
        return { status: VmdAccountConnectStatus.Idle, connect, skip };
    }

    if (vmdTokenStatus === "loading" || connectVmdAccountStatus === "loading") {
        return { status: VmdAccountConnectStatus.Loading };
    }

    if (vmdTokenStatus === "success" && connectVmdAccountStatus === "success") {
        return { status: VmdAccountConnectStatus.Success };
    }

    return { status: VmdAccountConnectStatus.Failure, reset };
}

interface GetVmdTokenOptions {
    accessToken: string;
    authToken: string;
}

function getVmdToken(options: GetVmdTokenOptions): Promise<string> {
    const url = new URL(configuration.vmd.tokenEndpoint);
    url.searchParams.set("accessToken", options.accessToken);
    url.searchParams.set("authToken", options.authToken);

    return axios
        .post<{ token: string }>(url.toString())
        .then((response) => response.data)
        .then(({ token }) => token);
}

function connectVmdAccount(token: string) {
    return client.post(configuration.api.endpoints.connectVmd + "/" + token);
}
