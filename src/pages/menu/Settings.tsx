import * as React from "react";
import { useTranslation } from "react-i18next";
import { Plugins } from "@capacitor/core";
import { Button } from "../../components/Button";
import { Label } from "../../components/Typography";
import { List, ListItem } from "../../components/List";
import { MessageModal } from "../../components/modal/MessageModal";
import { PinSetup } from "./PinSetup";
import { SegmentedControl, SegmentedControlItem } from "../../components/SegmentedControl";
import { StorageKey } from "../../types/storage";
import { getAuthenticationPin, removeAuthenticationPin } from "../../utils/secureStorage";
import "./Settings.scss";

interface SettingsState {
    pinStatus: "loading" | "available" | "missing";
    isPinSetupOpen: boolean;
    isPinDeleteConfirmationOpen: boolean;
    isPinDeletedConfirmationOpen: boolean;
}

export function Settings() {
    const { t, i18n } = useTranslation();
    const [state, setState] = React.useState<SettingsState>({
        pinStatus: "loading",
        isPinSetupOpen: false,
        isPinDeleteConfirmationOpen: false,
        isPinDeletedConfirmationOpen: false,
    });

    // Check if PIN is configured
    React.useEffect(() => {
        if (state.pinStatus === "loading") {
            getAuthenticationPin().then((pin) => {
                setState((state) => ({ ...state, pinStatus: pin ? "available" : "missing" }));
            });
        }
    }, [state.pinStatus]);

    // Close PIN deleted confirmation
    React.useEffect(() => {
        if (state.isPinDeletedConfirmationOpen) {
            const timeout = setTimeout(closePinDeletedConfirmation, 3000);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [state.isPinDeletedConfirmationOpen]);

    function onLanguageChange(language: string) {
        i18n.changeLanguage(language);
        Plugins.Storage.set({ key: StorageKey.Language, value: language });
    }

    function openPinSetup() {
        setState((state) => ({ ...state, isPinSetupOpen: true }));
    }

    function openPinDeleteConfirmation() {
        setState((state) => ({ ...state, isPinDeleteConfirmationOpen: true }));
    }

    function closePinDeleteConfirmation() {
        setState((state) => ({ ...state, isPinDeleteConfirmationOpen: false }));
    }

    function closePinDeletedConfirmation() {
        setState((state) => ({ ...state, isPinDeletedConfirmationOpen: false }));
    }

    async function deletePin() {
        await removeAuthenticationPin();

        setState((state) => ({
            ...state,
            pinStatus: "missing",
            isPinDeleteConfirmationOpen: false,
            isPinDeletedConfirmationOpen: true,
        }));
    }

    const closePinSetup = React.useCallback(() => {
        setState((state) => ({ ...state, isPinSetupOpen: false }));
    }, []);

    const reloadPinStatus = React.useCallback(() => {
        setState((state) => ({ ...state, pinStatus: "loading" }));
    }, []);

    return (
        <div className="settings">
            <Label>{t("settings.language.label")}</Label>
            <SegmentedControl name="language" value={i18n.language} onChange={onLanguageChange}>
                <SegmentedControlItem value="lv" label={t("settings.language.lv")} />
                <SegmentedControlItem value="en" label={t("settings.language.en")} />
                <SegmentedControlItem value="ru" label={t("settings.language.ru")} />
            </SegmentedControl>

            <Label>{t("settings.pin.label")}</Label>
            <List>
                {state.pinStatus === "available" && (
                    <>
                        <ListItem title={t("settings.pin.actions.change")} onClick={openPinSetup} />
                        <ListItem title={t("settings.pin.actions.delete")} onClick={openPinDeleteConfirmation} />
                    </>
                )}
                {state.pinStatus === "missing" && (
                    <>
                        <ListItem title={t("settings.pin.actions.setup")} onClick={openPinSetup} />
                    </>
                )}
            </List>

            {state.isPinSetupOpen && (
                <PinSetup onClose={closePinSetup} onSuccess={reloadPinStatus} onFailure={reloadPinStatus} />
            )}

            {state.isPinDeleteConfirmationOpen && (
                <MessageModal
                    variant="delete"
                    title={t("settings.pin.deleteConfirmation.title")}
                    showCancel
                    onCancel={closePinDeleteConfirmation}
                    showClose
                    onClose={closePinDeleteConfirmation}
                >
                    <Button variant="danger" onClick={deletePin}>
                        {t("settings.pin.deleteConfirmation.delete")}
                    </Button>
                </MessageModal>
            )}

            {state.isPinDeletedConfirmationOpen && (
                <MessageModal
                    variant="success"
                    title={t("settings.pin.deletedConfirmation.title")}
                    showClose
                    onClose={closePinDeletedConfirmation}
                />
            )}
        </div>
    );
}
