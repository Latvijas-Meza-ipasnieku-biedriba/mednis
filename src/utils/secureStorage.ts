import { Plugins } from "@capacitor/core";
import { SecureStoragePluginPlugin } from "capacitor-secure-storage-plugin";
import { AuthenticationTokens } from "../types/authentication";
import { SecureStorageKey } from "../types/storage";

export function getAuthenticationTokens(): Promise<AuthenticationTokens | undefined> {
    return (Plugins.SecureStoragePlugin as SecureStoragePluginPlugin)
        .get({ key: SecureStorageKey.AuthenticationTokens })
        .then(({ value }) => {
            const storedAuthenticationTokens: AuthenticationTokens = JSON.parse(value);
            return storedAuthenticationTokens;
        })
        .catch((error) => {
            console.error("Failed to get AuthenticationTokens from SecureStorage", error);
            return undefined;
        });
}

export function saveAuthenticationTokens(tokens: AuthenticationTokens) {
    return (Plugins.SecureStoragePlugin as SecureStoragePluginPlugin)
        .set({ key: SecureStorageKey.AuthenticationTokens, value: JSON.stringify(tokens) })
        .then(({ value }) => console.log("Authentication tokens saved to secure storage", value))
        .catch((error) => console.error("Failed to save authentication tokens to secure storage", error));
}

export function removeAuthenticationTokens() {
    return (Plugins.SecureStoragePlugin as SecureStoragePluginPlugin)
        .remove({ key: SecureStorageKey.AuthenticationTokens })
        .then(({ value }) => console.log("Authentication tokens removed from secure storage", value))
        .catch((error) => console.error("Failed to remove authentication tokens from secure storage", error));
}

export function getAuthenticationPin(): Promise<string | undefined> {
    return (Plugins.SecureStoragePlugin as SecureStoragePluginPlugin)
        .get({ key: SecureStorageKey.AuthenticationPin })
        .then(({ value }) => value)
        .catch((error) => {
            console.error("Failed to get authentication pin from SecureStorage", error);
            return undefined;
        });
}

export function saveAuthenticationPin(pin: string) {
    return (Plugins.SecureStoragePlugin as SecureStoragePluginPlugin)
        .set({ key: SecureStorageKey.AuthenticationPin, value: pin })
        .then(({ value }) => console.log("Authentication pin saved to secure storage", value))
        .catch((error) => console.error("Failed to save authentication pin to secure storage", error));
}

export function removeAuthenticationPin() {
    return (Plugins.SecureStoragePlugin as SecureStoragePluginPlugin)
        .remove({ key: SecureStorageKey.AuthenticationPin })
        .then(({ value }) => console.log("Authentication pin removed from secure storage", value))
        .catch((error) => console.error("Failed to remove authentication pin from secure storage", error));
}

export function getRemainingAuthenticationPinAttempts(): Promise<number | undefined> {
    return (Plugins.SecureStoragePlugin as SecureStoragePluginPlugin)
        .get({ key: SecureStorageKey.RemainingAuthenticationPinAttempts })
        .then(({ value }) => Number(value))
        .catch((error) => {
            console.error("Failed to get remaining authentication pin attempts from SecureStorage", error);
            return undefined;
        });
}

export function saveRemainingAuthenticationPinAttempts(remainingAttempts: number) {
    return (Plugins.SecureStoragePlugin as SecureStoragePluginPlugin)
        .set({ key: SecureStorageKey.RemainingAuthenticationPinAttempts, value: String(remainingAttempts) })
        .then(({ value }) => console.log("Remaining authentication pin attempts saved to secure storage", value))
        .catch((error) =>
            console.error("Failed to save remaining authentication pin attempts to secure storage", error)
        );
}

export function removeRemainingAuthenticationPinAttempts() {
    return (Plugins.SecureStoragePlugin as SecureStoragePluginPlugin)
        .remove({ key: SecureStorageKey.RemainingAuthenticationPinAttempts })
        .then(({ value }) => console.log("Remaining authentication pin attempts removed from secure storage", value))
        .catch((error) => console.error("Failed to remove authentication pin from secure storage", error));
}
