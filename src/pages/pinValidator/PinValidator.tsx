import * as React from "react";
import { Plugins } from "@capacitor/core";
import { useMachine } from "@xstate/react";
import { useTranslation } from "react-i18next";
import { NumPad } from "../../components/pin/NumPad";
import { PinDisplay } from "../../components/pin/PinDisplay";
import { StartupPageLayout } from "../../components/StartupPageLayout";
import { Text, Title } from "../../components/Typography";
import { LoadingPage } from "../loading/LoadingPage";
import { createPinValidatorMachine } from "../../utils/createPinValidatorMachine";
import { configuration } from "../../configuration";
import "./PinValidator.scss";

interface PinValidatorProps {
    onValid: () => void;
    onInvalid: () => void;
}

export function PinValidator({ onValid, onInvalid }: PinValidatorProps) {
    const { t } = useTranslation();
    const [state, send] = useMachine(() =>
        createPinValidatorMachine({ allowedAttempts: configuration.pin.maxValidationAttemptCount })
    );
    const { remainingAttempts, configuredPin, pin } = state.context;

    React.useEffect(() => {
        Plugins.SplashScreen.hide();
    }, []);

    const isSuccess = state.matches("success");
    React.useEffect(() => {
        if (isSuccess) {
            onValid();
        }
    }, [isSuccess, onValid]);

    const isFailure = state.matches("failure");
    React.useEffect(() => {
        if (isFailure) {
            onInvalid();
        }
    }, [isFailure, onInvalid]);

    if (state.matches("loading")) {
        return <LoadingPage />;
    }

    function onEnterDigit(digit: number) {
        send({ type: "enterDigit", digit });
    }

    function onRemoveDigit() {
        send({ type: "removeDigit" });
    }

    return (
        <StartupPageLayout>
            <div className="pin-validator">
                <Title size="small">{t("pinValidator.title")}</Title>
                {remainingAttempts !== configuration.pin.maxValidationAttemptCount && (
                    <Text>{t("pinValidator.message", { remainingAttempts })}</Text>
                )}
                <PinDisplay length={configuredPin.length} filled={pin.length} />
                <NumPad onEnterDigit={onEnterDigit} onRemoveDigit={onRemoveDigit} />
            </div>
        </StartupPageLayout>
    );
}
