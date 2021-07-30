import { OAuth2ClientPlugin, OAuth2RefreshTokenOptions } from "@byteowls/capacitor-oauth2";
import { Plugins } from "@capacitor/core";
import { match } from "ts-pattern";
import { assign, createMachine, interpret } from "xstate";
import { configuration } from "../configuration";
import { queryClient } from "../reactQuery";
import { AuthenticateResultAndroid, AuthenticateResultIOS, AuthenticationTokens } from "../types/authentication";
import { StorageKey } from "../types/storage";
import { isAndroid } from "./platform";
import {
    getAuthenticationTokens,
    saveAuthenticationTokens,
    removeAuthenticationTokens,
    getAuthenticationPin,
} from "./secureStorage";
import { clearUserData } from "./storage";
import { isTokenValid } from "./token";

export type AuthenticationMachineContext = {
    tokens?: AuthenticationTokens;
    agreementsAccepted: boolean;
};

export type AuthenticationMachineEvent =
    | { type: "sessionAvailable"; tokens: AuthenticationTokens }
    | { type: "sessionMissing" }
    | { type: "pinAvailable" }
    | { type: "pinMissing" }
    | { type: "pinValid" }
    | { type: "pinInvalid" }
    | { type: "networkAvailable" }
    | { type: "networkUnavailable" }
    | { type: "refreshSession" }
    | { type: "refreshSessionSuccess"; tokens: AuthenticationTokens }
    | { type: "refreshSessionFailure" }
    | { type: "logout" }
    | { type: "languageAvailable" }
    | { type: "languageMissing" }
    | { type: "languageEntered" }
    | { type: "login" }
    | { type: "register" }
    | { type: "toggleAgreements" }
    | { type: "loginSuccess"; tokens: AuthenticationTokens }
    | { type: "loginFailure" }
    | { type: "registerSuccess"; tokens: AuthenticationTokens }
    | { type: "registerFailure" };

const authenticationMachine = createMachine<AuthenticationMachineContext, AuthenticationMachineEvent>(
    {
        id: "authentication",
        initial: "loading",
        context: {
            agreementsAccepted: false,
        },
        states: {
            loading: {
                initial: "verifyingSession",
                states: {
                    verifyingSession: {
                        invoke: { src: "verifySession" },
                        on: {
                            sessionAvailable: { target: "validatingSession", actions: ["assignTokensToContext"] },
                            sessionMissing: { target: "#authentication.loggedOut" },
                        },
                    },
                    validatingSession: {
                        always: [
                            { target: "verifyingPin", cond: "isAccessTokenActive" },
                            { target: "verifyingNetworkStatus", cond: "isRefreshTokenActive" },
                            { target: "#authentication.loggedOut" },
                        ],
                    },
                    verifyingNetworkStatus: {
                        invoke: { src: "verifyNetworkStatus" },
                        on: {
                            networkAvailable: "refreshingSession",
                            networkUnavailable: "verifyingPin",
                        },
                    },
                    refreshingSession: {
                        invoke: { src: "refreshSession" },
                        on: {
                            refreshSessionSuccess: "verifyingPin",
                            refreshSessionFailure: "#authentication.loggedOut",
                        },
                    },
                    verifyingPin: {
                        invoke: { src: "verifyPin" },
                        on: {
                            pinAvailable: "validatingPin",
                            pinMissing: "#authentication.loggedIn",
                        },
                    },
                    validatingPin: {
                        on: {
                            pinValid: "#authentication.loggedIn",
                            pinInvalid: "#authentication.loggedOut",
                        },
                    },
                },
            },
            loggedIn: {
                initial: "idle",
                states: {
                    idle: {
                        on: { refreshSession: "refreshingSession" },
                    },
                    refreshingSession: {
                        invoke: { src: "refreshSession" },
                        on: {
                            refreshSessionSuccess: "idle",
                            refreshSessionFailure: "#authentication.loggedOut", // TODO remove tokens + user data
                        },
                    },
                },
                on: {
                    logout: {
                        target: "#authentication.loggedOut",
                        actions: "logout",
                    },
                },
            },
            loggedOut: {
                entry: [
                    "removeTokensFromContext",
                    "removeTokensFromStorage",
                    "removeUserDataFromStorage",
                    "clearQueryClient",
                ],
                initial: "verifyingLanguage",
                states: {
                    verifyingLanguage: {
                        invoke: { src: "verifyLanguage" },
                        on: {
                            languageAvailable: "idle",
                            languageMissing: "enteringLanguage",
                        },
                    },
                    enteringLanguage: {
                        on: {
                            languageEntered: "idle",
                        },
                    },
                    idle: {
                        on: {
                            login: "loggingIn",
                            register: { target: "registering", cond: "agreementsAccepted" },
                            toggleAgreements: { actions: "toggleAgreements" },
                        },
                    },
                    loggingIn: {
                        invoke: { src: "login" },
                        on: {
                            loginSuccess: {
                                target: "#authentication.loggedIn",
                                actions: ["assignTokensToContext", "saveTokensToStorage"],
                            },
                            loginFailure: "idle",
                        },
                    },
                    registering: {
                        invoke: { src: "register" },
                        on: {
                            registerSuccess: {
                                target: "#authentication.loggedIn",
                                actions: ["assignTokensToContext", "saveTokensToStorage"],
                            },
                            registerFailure: "idle",
                        },
                    },
                },
            },
        },
    },
    {
        guards: {
            isAccessTokenActive: (context) => {
                if (context.tokens) {
                    return isTokenValid(context.tokens.accessToken);
                }
                return false;
            },
            isRefreshTokenActive: (context) => {
                if (context.tokens) {
                    return isTokenValid(context.tokens.refreshToken);
                }
                return false;
            },
            agreementsAccepted: (context) => {
                return context.agreementsAccepted;
            },
        },
        services: {
            verifySession: () => async (send) => {
                const tokens = await getAuthenticationTokens();

                if (tokens) {
                    send({ type: "sessionAvailable", tokens });
                } else {
                    send({ type: "sessionMissing" });
                }
            },
            verifyPin: () => async (send) => {
                const pin = await getAuthenticationPin();

                if (pin) {
                    send({ type: "pinAvailable" });
                } else {
                    send({ type: "pinMissing" });
                }
            },
            verifyNetworkStatus: () => async (send) => {
                const networkStatus = await Plugins.Network.getStatus();

                if (networkStatus.connected) {
                    send({ type: "networkAvailable" });
                } else {
                    send({ type: "networkUnavailable" });
                }
            },
            verifyLanguage: () => async (send) => {
                const { value: language } = await Plugins.Storage.get({ key: StorageKey.Language });

                if (language) {
                    send({ type: "languageAvailable" });
                } else {
                    send({ type: "languageMissing" });
                }
            },
            refreshSession: (context) => async (send) => {
                if (!context.tokens) {
                    send({ type: "refreshSessionFailure" });
                    return;
                }

                try {
                    const options: OAuth2RefreshTokenOptions = {
                        appId: configuration.oidc.clientId,
                        accessTokenEndpoint: configuration.oidc.tokenEndpoint.signIn,
                        scope: configuration.oidc.scope,
                        refreshToken: context.tokens.refreshToken.value,
                    };

                    const authenticateResult = await (Plugins.OAuth2Client as OAuth2ClientPlugin).refreshToken(options);
                    const tokens = getTokensFromAuthenticationResult(authenticateResult);

                    send({ type: "refreshSessionSuccess", tokens });
                    saveAuthenticationTokens(tokens);
                } catch (error) {
                    send({ type: "refreshSessionFailure" });
                }
            },
            login: () => async (send) => {
                try {
                    const options = {
                        appId: configuration.oidc.clientId,
                        authorizationBaseUrl: configuration.oidc.authorizationEndpoint.signIn,
                        accessTokenEndpoint: configuration.oidc.tokenEndpoint.signIn,
                        scope: configuration.oidc.scope,
                        responseType: "code",
                        pkceEnabled: true,
                        android: {
                            redirectUrl: configuration.oidc.callbackUri,
                            handleResultOnNewIntent: true,
                            handleResultOnActivityResult: true,
                        },
                        ios: {
                            redirectUrl: configuration.oidc.callbackUri,
                        },
                    };

                    const authenticateResult = await (Plugins.OAuth2Client as OAuth2ClientPlugin).authenticate(options);
                    const tokens = getTokensFromAuthenticationResult(authenticateResult);

                    send({ type: "loginSuccess", tokens });
                } catch (error) {
                    send({ type: "loginFailure" });
                }
            },
            register: () => async (send) => {
                try {
                    const options = {
                        appId: configuration.oidc.clientId,
                        authorizationBaseUrl: configuration.oidc.authorizationEndpoint.signUp,
                        accessTokenEndpoint: configuration.oidc.tokenEndpoint.signUp,
                        scope: configuration.oidc.scope,
                        responseType: "code",
                        pkceEnabled: true,
                        android: {
                            redirectUrl: configuration.oidc.callbackUri,
                            handleResultOnNewIntent: true,
                            handleResultOnActivityResult: true,
                        },
                        ios: {
                            redirectUrl: configuration.oidc.callbackUri,
                        },
                    };

                    const authenticateResult = await (Plugins.OAuth2Client as OAuth2ClientPlugin).authenticate(options);
                    const tokens = getTokensFromAuthenticationResult(authenticateResult);

                    send({ type: "registerSuccess", tokens });
                } catch (error) {
                    send({ type: "registerFailure" });
                }
            },
        },
        actions: {
            toggleAgreements: assign({
                agreementsAccepted: (context, event) => !context.agreementsAccepted,
            }),
            assignTokensToContext: assign({
                tokens: (context, event) =>
                    match<AuthenticationMachineEvent, AuthenticationTokens | undefined>(event)
                        .with(
                            { type: "sessionAvailable" },
                            { type: "refreshSessionSuccess" },
                            { type: "loginSuccess" },
                            { type: "registerSuccess" },
                            (event) => event.tokens
                        )
                        .otherwise(() => context.tokens),
            }),
            removeTokensFromContext: assign({
                tokens: (context, event) => undefined,
            }),
            saveTokensToStorage: (context, event) => {
                const { tokens } = context;
                if (tokens) {
                    saveAuthenticationTokens(tokens);
                }
            },
            removeTokensFromStorage: (context, event) => {
                removeAuthenticationTokens();
            },
            removeUserDataFromStorage: (context, event) => {
                clearUserData();
            },
            clearQueryClient: (context, event) => {
                queryClient.clear();
            },
            logout: (context, event) => {
                const logoutUrl = new URL(configuration.oidc.logout.endpoint);
                logoutUrl.searchParams.set("post_logout_redirect_uri", configuration.oidc.logout.callbackUri);

                Plugins.Browser.open({ url: logoutUrl.toString() });

                const listenerHandle = Plugins.App.addListener("appUrlOpen", (appUrlOpen) => {
                    if (appUrlOpen.url === configuration.oidc.logout.callbackUri) {
                        Plugins.Browser.close();
                        listenerHandle.remove();
                    }
                });
            },
        },
    }
);

export const authenticationService = interpret(authenticationMachine).start();

function getTokensFromAuthenticationResult(authenticateResult: any): AuthenticationTokens {
    if (isAndroid()) {
        return getTokensFromAndroidAuthenticationResult(authenticateResult);
    }

    return getTokensFromIosAuthenticationResult(authenticateResult);
}

function getTokensFromAndroidAuthenticationResult(result: AuthenticateResultAndroid): AuthenticationTokens {
    const accessToken = result.access_token;
    const accessTokenExpiresOn =
        (Number(result.additionalParameters.not_before) + Number(result.additionalParameters.expires_on)) * 1000;

    const refreshToken = result.refresh_token;
    const refreshTokenExpiresOn =
        (Number(result.additionalParameters.not_before) +
            Number(result.additionalParameters.refresh_token_expires_in)) *
        1000;

    return {
        accessToken: { value: accessToken, expiresOn: accessTokenExpiresOn },
        refreshToken: { value: refreshToken, expiresOn: refreshTokenExpiresOn },
    };
}

function getTokensFromIosAuthenticationResult(result: AuthenticateResultIOS): AuthenticationTokens {
    const accessToken = result.access_token;
    const accessTokenExpiresOn = (result.not_before + result.expires_in) * 1000;

    const refreshToken = result.refresh_token;
    const refreshTokenExpiresOn = (result.not_before + result.refresh_token_expires_in) * 1000;

    return {
        accessToken: { value: accessToken, expiresOn: accessTokenExpiresOn },
        refreshToken: { value: refreshToken, expiresOn: refreshTokenExpiresOn },
    };
}
