import * as React from "react";
import { Plugins } from "@capacitor/core";
import { match } from "ts-pattern";
import { Errors } from "../types/classifiers";
import { StorageKey } from "../types/storage";
import { logger } from "../utils/logger";
import { useApplyEdits } from "./useApplyEdits";
import { IconName } from "../components/Icon";
import { Edit, FeatureLayer } from "../types/edit";
import { useNetworkConnected } from "./useNetworkConnected";
import { useUserDataContext } from "./useUserData";
import { reloadPermits } from "./usePermitsQuery";
import { getAttributesFromEditQueueEntry } from "../utils/editQueue";
import { PhotoReference } from "../types/photo";
import { configuration } from "../configuration";

export type EditQueueEntryState =
    | { status: "success" }
    | { status: "pending" }
    | { status: "active" }
    | { status: "error"; error?: string };

export interface EditQueueEntry {
    title: string;
    icon: IconName;
    state: EditQueueEntryState;
    edits: Edit[];
    photo?: PhotoReference;
}

type AddToQueueStatus = "idle" | "loading" | "success" | "failure";

interface EditQueueInitialState {
    status: "loading";
    addToQueueStatus?: AddToQueueStatus;
}

interface EditQueueActiveState {
    status: "active";
    editQueue: EditQueueEntry[];
    addToQueueStatus?: AddToQueueStatus;
    reloadPermits: boolean;
}

interface EditQueueIdleState {
    status: "idle";
    editQueue: EditQueueEntry[];
    addToQueueStatus?: AddToQueueStatus;
    reloadPermits: boolean;
}

interface EditQueuePending {
    status: "pending";
    editQueue: EditQueueEntry[];
    addToQueueStatus?: AddToQueueStatus;
    reloadPermits: boolean;
}

type EditQueueState = EditQueueActiveState | EditQueueIdleState | EditQueuePending;

interface AddEditToQueueAction {
    type: "addEditToQueue";
    editQueueEntry: EditQueueEntry;
}

interface EditSyncStartAction {
    type: "editSyncStart";
    editQueueEntry: EditQueueEntry;
}

interface EditSyncErrorAction {
    type: "editSyncError";
    editQueueEntry: EditQueueEntry;
    error?: string;
}

interface EditSyncSuccessAction {
    type: "editSyncSuccess";
    editQueueEntry: EditQueueEntry;
}

interface EditQueueResetAction {
    type: "editQueueReset";
    editQueue: EditQueueEntry[];
}

interface EditQueueStartSyncAction {
    type: "startEditQueueSync";
}

interface EditQueueSyncFinishedAction {
    type: "editQueueSyncFinished";
}

interface EditQueueResetAddAction {
    type: "resetEditQueueAdd";
}

interface RetryFailedEditQueueEntryAction {
    type: "retryFailedEditQueueEntry";
    editQueueEntry: EditQueueEntry;
}

type EditQueueAction =
    | AddEditToQueueAction
    | EditSyncStartAction
    | EditSyncSuccessAction
    | EditSyncErrorAction
    | EditQueueResetAction
    | EditQueueStartSyncAction
    | EditQueueSyncFinishedAction
    | EditQueueResetAddAction
    | RetryFailedEditQueueEntryAction;

type EditQueueDispatch = (action: EditQueueAction) => void;

const EditQueueContext = React.createContext<
    | {
          state: EditQueueState;
          dispatch: EditQueueDispatch;
      }
    | { state: EditQueueInitialState }
>({ state: { status: "loading" } });

function editQueueReducer(state: EditQueueState, action: EditQueueAction): EditQueueState {
    return match<{ state: EditQueueState; action: EditQueueAction }, EditQueueState>({ state, action })
        .with({ action: { type: "editQueueReset" } }, ({ action }) => {
            const newState: EditQueueState = { ...state, status: "idle", editQueue: action.editQueue };
            return newState;
        })
        .with({ state: { addToQueueStatus: "idle" }, action: { type: "addEditToQueue" } }, ({ action }) => {
            const editQueue = [...state.editQueue];
            editQueue.push(action.editQueueEntry);
            const newState: EditQueueState = { ...state, editQueue, addToQueueStatus: "success" };
            return newState;
        })
        .with({ state: { addToQueueStatus: "success" }, action: { type: "resetEditQueueAdd" } }, () => {
            const newState: EditQueueState = { ...state, addToQueueStatus: "idle" };
            return newState;
        })
        .with({ state: { addToQueueStatus: "failure" }, action: { type: "resetEditQueueAdd" } }, () => {
            const newState: EditQueueState = { ...state, addToQueueStatus: "idle" };
            return newState;
        })
        .with({ state: { status: "idle" }, action: { type: "startEditQueueSync" } }, () => {
            const editQueue = state.editQueue;
            logger.log({ message: "Edit queue sync started", editQueue });

            const newState: EditQueueState = { ...state, status: "pending" };
            return newState;
        })
        .with({ state: { status: "idle" }, action: { type: "editSyncStart" } }, ({ action }) => {
            const editQueue = [...state.editQueue];
            const entryIndex = editQueue.findIndex(
                (editFromQueue) => JSON.stringify(editFromQueue) === JSON.stringify(action.editQueueEntry)
            );
            if (entryIndex !== -1) {
                const editFromQueue = editQueue[entryIndex];
                editFromQueue.state.status = "active";
                editQueue[entryIndex] = editFromQueue;
            }
            const newState: EditQueueState = { ...state, status: "active", editQueue };
            return newState;
        })
        .with({ state: { status: "pending" }, action: { type: "editSyncStart" } }, ({ action }) => {
            const editQueue = [...state.editQueue];
            const entryIndex = editQueue.findIndex(
                (editFromQueue) => JSON.stringify(editFromQueue) === JSON.stringify(action.editQueueEntry)
            );
            if (entryIndex !== -1) {
                const editFromQueue = editQueue[entryIndex];
                editFromQueue.state.status = "active";
                editQueue[entryIndex] = editFromQueue;
            }
            const newState: EditQueueState = { ...state, status: "active", editQueue };
            return newState;
        })
        .with({ state: { status: "active" }, action: { type: "editSyncSuccess" } }, ({ action }) => {
            const editQueue = [...state.editQueue];
            const entryIndex = editQueue.findIndex(
                (editFromQueue) => JSON.stringify(editFromQueue) === JSON.stringify(action.editQueueEntry)
            );
            if (entryIndex !== -1) {
                const editFromQueue = editQueue[entryIndex];
                editFromQueue.state.status = "success";
                editQueue[entryIndex] = editFromQueue;
            }

            let reloadPermits = false;
            // Reload permits if this was the last LimitedHunt edit in queue
            if (action.editQueueEntry.edits[0].id === FeatureLayer.LimitedHuntReport) {
                if (
                    !editQueue.some(
                        (editQueueEntry) =>
                            editQueueEntry.edits[0].id === FeatureLayer.LimitedHuntReport &&
                            (editQueueEntry.state.status === "pending" || editQueueEntry.state.status === "active")
                    )
                ) {
                    reloadPermits = true;
                }
            }

            const newState: EditQueueState = { ...state, status: "pending", editQueue, reloadPermits };
            return newState;
        })
        .with({ state: { status: "active" }, action: { type: "editSyncError" } }, ({ action }) => {
            const editQueue = [...state.editQueue];
            const entryIndex = editQueue.findIndex(
                (editFromQueue) => JSON.stringify(editFromQueue) === JSON.stringify(action.editQueueEntry)
            );
            if (entryIndex !== -1) {
                const editFromQueue = editQueue[entryIndex];
                editFromQueue.state = { status: "error", error: action.error };
                editQueue[entryIndex] = editFromQueue;
            }
            const newState: EditQueueState = { ...state, status: "pending", editQueue, reloadPermits: false };
            return newState;
        })
        .with({ state: { status: "pending" }, action: { type: "editQueueSyncFinished" } }, () => {
            logger.log({ message: "Edit queue sync finished" });
            const newState: EditQueueState = { ...state, status: "idle", reloadPermits: false };
            return newState;
        })
        .with({ state: { status: "active" }, action: { type: "editQueueSyncFinished" } }, () => {
            logger.log({ message: "Edit queue sync finished" });
            const newState: EditQueueState = { ...state, status: "idle", reloadPermits: false };
            return newState;
        })
        .with({ action: { type: "retryFailedEditQueueEntry" } }, ({ state, action }) => {
            const editQueue = [...state.editQueue];
            const entryIndex = editQueue.findIndex(
                (editFromQueue) => JSON.stringify(editFromQueue) === JSON.stringify(action.editQueueEntry)
            );
            if (entryIndex !== -1) {
                const editFromQueue = editQueue[entryIndex];
                editFromQueue.state = { status: "pending" };
                editQueue[entryIndex] = editFromQueue;
            }
            const status = state.status === "idle" ? "pending" : state.status;
            const newState: EditQueueState = { ...state, status, editQueue };
            return newState;
        })
        .otherwise(() => state);
}

interface EditQueueProviderProps {
    children: React.ReactNode;
}

export function EditQueueProvider(props: EditQueueProviderProps) {
    const [state, dispatch] = React.useReducer(editQueueReducer, {
        status: "idle",
        addToQueueStatus: "idle",
        editQueue: [],
        reloadPermits: false,
    });
    const applyEdits = useApplyEdits();
    const networkConnected = useNetworkConnected();
    const userDataContext = useUserDataContext();

    // Fill edit queue from storage on load
    React.useEffect(() => {
        resetQueue();
    }, []);

    // Start syncing on network connection
    React.useEffect(() => {
        if (networkConnected) {
            resetQueue().then(() => {
                // Network connection sometimes gets reported before phone can actually send data
                setTimeout(() => {
                    // ApplyEdits state may get stuck if network is switching too many times, safer to reset it before restarting sync
                    applyEdits.reset();
                    dispatch({ type: "startEditQueueSync" });
                }, 3000);
            });
        }
    }, [networkConnected]);

    React.useEffect(() => {
        if (applyEdits.status !== "success" && applyEdits.status !== "failure") return;

        const activeEdit = state.editQueue.find((editQueueEntry) => editQueueEntry.state.status === "active");
        if (!activeEdit) return;

        if (applyEdits.status === "success") {
            dispatch({ type: "editSyncSuccess", editQueueEntry: activeEdit });
        }

        if (applyEdits.status === "failure") {
            if (applyEdits.error?.code === Errors.RequestAlreadyProcessed) {
                // This means that the edits were applied while network connection was disrupted
                dispatch({ type: "editSyncSuccess", editQueueEntry: activeEdit });
            } else {
                dispatch({ type: "editSyncError", editQueueEntry: activeEdit, error: applyEdits.error?.message });
            }
        }
        applyEdits.reset();
    }, [applyEdits.status]);

    React.useEffect(() => {
        if (state.status === "pending") {
            const pendingEntries = state.editQueue.filter(
                (editQueueEntry) => editQueueEntry.state.status === "pending"
            );
            if (pendingEntries.length > 0) {
                dispatch({ type: "editSyncStart", editQueueEntry: pendingEntries[0] });
            } else {
                dispatch({ type: "editQueueSyncFinished" });
            }
        }
        if (state.status === "active") {
            const activeEntry = state.editQueue.find((editQueueEntry) => editQueueEntry.state.status === "active");
            if (activeEntry) {
                applyEdits.submit(activeEntry.edits, activeEntry.photo);
            } else {
                // Something went wrong, reset queue
                resetQueue();
            }
        }
    }, [state.status, state.editQueue]);

    React.useEffect(() => {
        if (state.status === "idle" && state.addToQueueStatus === "success" && networkConnected) {
            dispatch({ type: "startEditQueueSync" });
        }
    }, [state.editQueue.length, networkConnected]);

    React.useEffect(() => {
        if (state.editQueue && state.editQueue.length > 0) {
            userDataContext.updateEditQueue(state.editQueue).then(() => {
                if (state.reloadPermits) {
                    reloadPermits();
                }
            });
        }
    }, [state.editQueue]);

    const resetQueue = React.useCallback(() => {
        let editQueue = userDataContext.userData?.editQueue;
        if (editQueue) {
            if (editQueue.length > 0) {
                editQueue = editQueue.flatMap((editQueueEntry) => {
                    const attributes = getAttributesFromEditQueueEntry(editQueueEntry);
                    if (!attributes) {
                        return [];
                    }
                    const removeDate = new Date();
                    removeDate.setDate(removeDate.getDate() - configuration.editQueue.daysToKeepEntriesFor);
                    if (new Date(attributes.reportCreated) < removeDate) {
                        return [];
                    }
                    if (editQueueEntry.state.status === "active" || editQueueEntry.state.status === "error") {
                        editQueueEntry.state = { status: "pending" };
                    }
                    return [editQueueEntry];
                });
            }
            dispatch({ type: "editQueueReset", editQueue });
            return Promise.resolve(editQueue);
        }

        // Fallback to getting info straight from storage
        return getEditQueue().then((editQueue) => {
            if (editQueue.length > 0) {
                editQueue = editQueue.map((editQueueEntry) => {
                    if (editQueueEntry.state.status === "active" || editQueueEntry.state.status === "error") {
                        editQueueEntry.state = { status: "pending" };
                    }
                    return editQueueEntry;
                });
            }
            dispatch({ type: "editQueueReset", editQueue });
        });
    }, [userDataContext.userData?.editQueue]);

    const value = { state, dispatch };

    return <EditQueueContext.Provider value={value}>{props.children}</EditQueueContext.Provider>;
}

export function useEditQueueContext() {
    const context = React.useContext(EditQueueContext);

    if (context === null) {
        throw new Error("EditQueueContext not initialized");
    }

    return context;
}

export function getEditQueue(): Promise<EditQueueEntry[]> {
    return Plugins.Storage.get({ key: StorageKey.EditQueue }).then((result) => {
        if (result.value) {
            return JSON.parse(result.value);
        }
    });
}
