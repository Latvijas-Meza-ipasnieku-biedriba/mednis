import * as React from "react";
import { createMachine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import { useTranslation } from "react-i18next";
import { MessageModal } from "../../components/modal/MessageModal";
import { Modal } from "../../components/modal/Modal";
import { NumPad } from "../../components/pin/NumPad";
import { PinDisplay } from "../../components/pin/PinDisplay";
import { Title } from "../../components/Typography";
import { saveAuthenticationPin } from "../../utils/secureStorage";
import { configuration } from "../../configuration";
import "./PinSetup.scss";

interface PinSetupProps {
    onClose: () => void;
    onSuccess: () => void;
    onFailure: () => void;
}

export function PinSetup({ onClose, onSuccess, onFailure }: PinSetupProps) {
    const { t } = useTranslation();
    const [state, send] = useMachine(() => createPinSetupMachine({ pinLength: configuration.pin.pinLength }));

    const isSuccess = state.matches("success");
    React.useEffect(() => {
        if (isSuccess) {
            onSuccess();

            const timeout = setTimeout(() => {
                onClose();
            }, 3000);
            return () => {
                clearTimeout(timeout);
            };
        }
    }, [isSuccess, onSuccess, onClose]);

    const isFailure = state.matches("failure");
    React.useEffect(() => {
        if (isFailure) {
            onFailure();

            const timeout = setTimeout(() => {
                onClose();
            }, 3000);
            return () => {
                clearTimeout(timeout);
            };
        }
    }, [isFailure, onFailure, onClose]);

    if (isSuccess) {
        return <MessageModal variant="success" title={t("settings.pin.setup.success")} showClose onClose={onClose} />;
    }

    if (isFailure) {
        return <MessageModal variant="failure" title={t("settings.pin.setup.failure")} showClose onClose={onClose} />;
    }

    function onEnterDigit(digit: number) {
        send({ type: "enterDigit", digit });
    }

    function onRemoveDigit() {
        send({ type: "removeDigit" });
    }

    return (
        <Modal showClose onClose={onClose} showCancel onCancel={onClose}>
            <div className="pin-setup">
                {state.matches("entering") && (
                    <>
                        <Title size="small">{t("settings.pin.setup.enteringTitle")}</Title>
                        <PinDisplay length={4} filled={state.context.pin.length} />
                    </>
                )}
                {state.matches("confirming") && (
                    <>
                        <Title size="small">{t("settings.pin.setup.confirmingTitle")}</Title>
                        <PinDisplay length={4} filled={state.context.pinConfirmation.length} />
                    </>
                )}
                <NumPad onEnterDigit={onEnterDigit} onRemoveDigit={onRemoveDigit} />
            </div>
        </Modal>
    );
}

interface PinSetupMachineContext {
    pin: string;
    pinConfirmation: string;
}

type PinSetupMachineEvent =
    | {
          type: "enterDigit";
          digit: number;
      }
    | { type: "removeDigit" };

interface PinSetupMachineOptions {
    pinLength: number;
}

function createPinSetupMachine(options: PinSetupMachineOptions) {
    return createMachine<PinSetupMachineContext, PinSetupMachineEvent>(
        {
            id: "pinSetup",
            initial: "entering",
            context: {
                pin: "",
                pinConfirmation: "",
            },
            states: {
                entering: {
                    initial: "active",
                    states: {
                        active: {
                            on: {
                                enterDigit: [
                                    {
                                        target: "waitingForLastDigitToAppear",
                                        cond: "isPinCompleted",
                                        actions: ["appendDigitToPin"],
                                    },
                                    { actions: ["appendDigitToPin"] },
                                ],
                                removeDigit: {
                                    actions: ["removeDigitFromPin"],
                                },
                            },
                        },
                        waitingForLastDigitToAppear: {
                            after: {
                                150: "#pinSetup.confirming",
                            },
                        },
                    },
                },
                confirming: {
                    initial: "active",
                    states: {
                        active: {
                            on: {
                                enterDigit: [
                                    {
                                        target: "comparing",
                                        cond: "isPinConfirmationCompleted",
                                        actions: ["appendDigitToPinConfirmation"],
                                    },
                                    { actions: ["appendDigitToPinConfirmation"] },
                                ],
                                removeDigit: {
                                    actions: ["removeDigitFromPinConfirmation"],
                                },
                            },
                        },
                        comparing: {
                            after: {
                                150: [
                                    {
                                        target: "#pinSetup.success",
                                        cond: "isPinMatch",
                                    },
                                    {
                                        target: "#pinSetup.failure",
                                    },
                                ],
                            },
                        },
                    },
                },
                success: {
                    type: "final",
                    entry: ["savePinToStorage"],
                },
                failure: { type: "final" },
            },
        },
        {
            guards: {
                isPinCompleted: (context, event) =>
                    event.type === "enterDigit" ? context.pin.length + 1 === options.pinLength : false,
                isPinMatch: (context) => context.pin === context.pinConfirmation,
                isPinConfirmationCompleted: (context, event) =>
                    event.type === "enterDigit" ? context.pinConfirmation.length + 1 === options.pinLength : false,
            },
            actions: {
                appendDigitToPin: assign({
                    pin: (context, event) => (event.type === "enterDigit" ? context.pin + event.digit : context.pin),
                }),
                removeDigitFromPin: assign({
                    pin: (context) => context.pin.slice(0, -1),
                }),
                appendDigitToPinConfirmation: assign({
                    pinConfirmation: (context, event) =>
                        event.type === "enterDigit" ? context.pinConfirmation + event.digit : context.pinConfirmation,
                }),
                removeDigitFromPinConfirmation: assign({
                    pinConfirmation: (context) => context.pinConfirmation.slice(0, -1),
                }),
                savePinToStorage: (context) => {
                    saveAuthenticationPin(context.pin);
                },
            },
        }
    );
}
