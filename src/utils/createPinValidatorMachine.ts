import { createMachine, assign } from "xstate";
import {
    getAuthenticationPin,
    getRemainingAuthenticationPinAttempts,
    removeAuthenticationPin,
    removeRemainingAuthenticationPinAttempts,
    saveRemainingAuthenticationPinAttempts,
} from "./secureStorage";

interface PinValidatorMachineContext {
    configuredPin: string;
    pin: string;
    remainingAttempts: number;
}

type PinValidatorMachineEvent =
    | {
          type: "loadingSuccess";
          configuredPin: string;
          remainingAttempts?: number;
      }
    | {
          type: "loadingFailure";
      }
    | {
          type: "enterDigit";
          digit: number;
      }
    | {
          type: "removeDigit";
      }
    | {
          type: "pinValid";
      }
    | {
          type: "pinInvalid";
      };

interface PinValidatorMachineOptions {
    allowedAttempts: number;
}

export function createPinValidatorMachine(options: PinValidatorMachineOptions) {
    return createMachine<PinValidatorMachineContext, PinValidatorMachineEvent>(
        {
            id: "pinValidatorMachine",
            initial: "loading",
            context: {
                configuredPin: "",
                pin: "",
                remainingAttempts: options.allowedAttempts,
            },
            states: {
                loading: {
                    invoke: { src: "loadConfiguredPinAndRemainingAttempts" },
                    on: {
                        loadingSuccess: {
                            target: "entering",
                            actions: ["assignConfiguredPinToContext", "assignRemainingAttemptsToContext"],
                        },
                        loadingFailure: { target: "failure" },
                    },
                },
                entering: {
                    on: {
                        enterDigit: [
                            { target: "validating", cond: "isPinEntered", actions: ["appendDigitToPin"] },
                            { actions: ["appendDigitToPin"] },
                        ],
                        removeDigit: { actions: ["removeDigitFromPin"] },
                    },
                },
                validating: {
                    after: {
                        // User should see the last digit on display, hence the slight delay
                        150: [
                            { target: "success", cond: "isPinValid" },
                            { target: "failure", cond: "isRemainingAttemptsLimitReached" },
                            {
                                target: "entering",
                                actions: ["clearPin", "decrementRemainingAttempts", "saveRemainingAttemptsToStorage"],
                            },
                        ],
                    },
                },
                success: {
                    type: "final",
                    entry: ["removeRemainingAttemptsFromStorage"],
                },
                failure: {
                    type: "final",
                    entry: ["removeConfiguredPinFromStorage", "removeRemainingAttemptsFromStorage"],
                },
            },
        },
        {
            guards: {
                isPinEntered: (context, event) => {
                    if (event.type === "enterDigit") {
                        return context.pin.length + 1 === context.configuredPin.length;
                    }
                    return context.pin.length === context.configuredPin.length;
                },
                isPinValid: (context) => {
                    return context.configuredPin === context.pin;
                },
                isRemainingAttemptsLimitReached: (context) => {
                    return context.remainingAttempts - 1 === 0;
                },
            },
            services: {
                loadConfiguredPinAndRemainingAttempts: () => async (send) => {
                    const configuredPin = await getAuthenticationPin();
                    const remainingAttempts = await getRemainingAuthenticationPinAttempts();

                    if (configuredPin) {
                        send({
                            type: "loadingSuccess",
                            configuredPin,
                            remainingAttempts,
                        });
                    } else {
                        send({ type: "loadingFailure" });
                    }
                },
                validatePin: (context) => async (send) => {
                    if (context.pin === context.configuredPin) {
                        send({ type: "pinValid" });
                    } else {
                        send({ type: "pinInvalid" });
                    }
                },
            },
            actions: {
                assignConfiguredPinToContext: assign({
                    configuredPin: (context, event) => {
                        if (event.type === "loadingSuccess") {
                            return event.configuredPin;
                        }

                        return context.configuredPin;
                    },
                }),
                assignRemainingAttemptsToContext: assign({
                    remainingAttempts: (context, event) => {
                        if (event.type === "loadingSuccess" && event.remainingAttempts) {
                            return event.remainingAttempts;
                        }

                        return context.remainingAttempts;
                    },
                }),
                appendDigitToPin: assign({
                    pin: (context, event) => {
                        if (event.type === "enterDigit") {
                            return context.pin + event.digit;
                        }

                        return context.pin;
                    },
                }),
                removeDigitFromPin: assign({
                    pin: (context, event) => {
                        if (event.type === "removeDigit") {
                            return context.pin.slice(0, -1);
                        }

                        return context.pin;
                    },
                }),
                clearPin: assign({
                    pin: (context) => {
                        return "";
                    },
                }),
                decrementRemainingAttempts: assign({
                    remainingAttempts: (context) => {
                        return context.remainingAttempts - 1;
                    },
                }),
                removeConfiguredPinFromStorage: (context, event) => {
                    removeAuthenticationPin();
                },
                saveRemainingAttemptsToStorage: (context, event) => {
                    saveRemainingAuthenticationPinAttempts(context.remainingAttempts);
                },
                removeRemainingAttemptsFromStorage: (context, event) => {
                    removeRemainingAuthenticationPinAttempts();
                },
            },
        }
    );
}
