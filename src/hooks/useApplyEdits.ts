import * as React from "react";
import { useTranslation } from "react-i18next";
import { client } from "../utils/client";
import { Edit, EditResponse, EditResponseError } from "../types/edit";
import { useClassifiersContext } from "./useClassifiersContext";
import { getBase64PhotoAsBlob, getPhotoAsBlob } from "../utils/photo";
import { logger } from "../utils/logger";
import { PhotoReference } from "../types/photo";
import { configuration } from "../configuration";

export function useApplyEdits() {
    const { i18n } = useTranslation();
    const { errorMessages } = useClassifiersContext();
    const [state, dispatch] = React.useReducer(applyEditsReducer, { status: "idle" });

    React.useEffect(() => {
        async function applyEdits() {
            if (state.status !== "loading") {
                return;
            }

            logger.log({ message: "Applying edits", edits: state.edits });

            try {
                const formData = new FormData();
                formData.append("edits", JSON.stringify(state.edits));

                if (state.photo) {
                    let photo: Blob;

                    if (typeof state.photo === "string") {
                        photo = await getBase64PhotoAsBlob(state.photo);
                    } else {
                        photo = await getPhotoAsBlob(state.photo.path);
                    }

                    formData.append("files", photo);
                }

                const response = await client.post(configuration.api.endpoints.applyEdits, formData);

                // TODO: For now we only have one possible edit, should revise this to work with multiple edits later if their status can differ
                const error: EditResponseError = response.data.find((data: EditResponse) => !!data.error)?.error;
                if (error) {
                    const errorDescription = JSON.parse(error.description);
                    let errorMessage = errorMessages.options.find(
                        (errorMessage) => errorMessage.isUserFriendly && errorMessage.id === error.code
                    )?.description[i18n.language];
                    if (errorMessage) {
                        const templateVariables = errorMessage.match(/{([^}]+)}/g);
                        if (templateVariables) {
                            templateVariables.forEach((templateVariable) => {
                                const templateValue = errorDescription[templateVariable.slice(1, -1)];
                                if (templateValue) {
                                    errorMessage = errorMessage?.replace(templateVariable, templateValue);
                                }
                            });
                        }
                    } else {
                        errorMessage = errorDescription.placeholder;
                    }
                    dispatch({ type: "failure", error: { code: error.code, message: errorMessage ?? "" } });
                    logger.error({ message: "Failed to apply edits", error });
                } else {
                    dispatch({ type: "success" });
                    logger.log("Edits applied");
                }
            } catch (error) {
                dispatch({ type: "failure" });
                logger.error({ message: "Failed to apply edits", error });
            }
        }

        applyEdits();
    }, [state]);

    const submit = React.useCallback(
        (edits: Edit[], photo?: PhotoReference) => dispatch({ type: "submit", edits, photo }),
        []
    );
    const retry = React.useCallback(
        (edits: Edit[], photo?: PhotoReference) => dispatch({ type: "retry", edits, photo }),
        []
    );
    const reset = React.useCallback(() => dispatch({ type: "reset" }), []);
    const error = state.status === "failure" || state.status === "loading" ? state.error : { message: "" };
    return { status: state.status, error, submit, retry, reset };
}

type ApplyEditsState =
    | { status: "idle" | "success" }
    | { status: "loading"; edits: Edit[]; photo?: PhotoReference; error?: { code?: number; message: string } }
    | { status: "failure"; error?: { code?: number; message: string } };
type ApplyEditsAction =
    | { type: "submit" | "retry"; edits: Edit[]; photo?: PhotoReference }
    | { type: "success" | "reset" }
    | { type: "failure"; error?: { code?: number; message: string } };

function applyEditsReducer(state: ApplyEditsState, action: ApplyEditsAction): ApplyEditsState {
    switch (action.type) {
        case "submit":
            if (state.status === "idle") {
                return { status: "loading", edits: action.edits, photo: action.photo };
            }

            return state;
        case "success":
            if (state.status === "loading") {
                return { status: "success" };
            }

            return state;
        case "failure":
            if (state.status === "loading") {
                return { status: "failure", error: action.error };
            }

            return state;
        case "retry":
            if (state.status === "failure") {
                return { status: "loading", edits: action.edits, photo: action.photo };
            }

            return state;
        case "reset":
            return { status: "idle" };
        default:
            return state;
    }
}
