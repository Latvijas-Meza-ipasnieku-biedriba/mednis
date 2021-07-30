import { EditQueueEntry, getEditQueue } from "../hooks/useEditQueue";
import { getUserDataFromStorage } from "../hooks/useUserData";
import { FeatureLayer } from "../types/edit";

export function isStoredCurrentUserEditQueueIdle() {
    return getUserDataFromStorage().then((userData) => {
        if (userData) {
            const editQueue = userData.find((userDataEntry) => userDataEntry.isCurrentUser)?.editQueue;
            if (editQueue) {
                return !editQueue.some(
                    (editQueueEntry) =>
                        editQueueEntry.state.status !== "success" && editQueueEntry.state.status !== "error"
                );
            }
        }

        // Fallback to general stored editQueue
        return isStoredEditQueueIdle();
    });
}

function isStoredEditQueueIdle() {
    return getEditQueue().then((editQueue) => {
        if (editQueue && editQueue.length > 0) {
            return !editQueue.some(
                (editQueueEntry) => editQueueEntry.state.status !== "success" && editQueueEntry.state.status !== "error"
            );
        }
        return true;
    });
}

export type EditGroups = "observations" | "damage" | "hunt";

export function getGroupedEditQueueByType(editQueue: EditQueueEntry[]) {
    return editQueue.reduce((entryGroup: { [key: string]: EditQueueEntry[] }, editQueueEntry) => {
        let editIdGroup: EditGroups = "observations";
        const editId = editQueueEntry.edits[0].id;
        switch (editId) {
            case FeatureLayer.DirectlyObservedAnimalsObservation:
            case FeatureLayer.SignsOfPresenceObservation:
            case FeatureLayer.DeadObservation:
                editIdGroup = "observations";
                break;
            case FeatureLayer.AgriculturalLandDamage:
            case FeatureLayer.ForestDamage:
            case FeatureLayer.InfrastructureDamage:
                editIdGroup = "damage";
                break;
            case FeatureLayer.UnlimitedHuntReport:
            case FeatureLayer.LimitedHuntReport:
                editIdGroup = "hunt";
                break;
            default:
                throw new Error(`Unknown Edit type: ${editId}`);
        }
        entryGroup[editIdGroup] = (entryGroup[editIdGroup] || []).concat(editQueueEntry);
        return entryGroup;
    }, {});
}

export function getAttributesFromEditQueueEntry(editQueueEntry: EditQueueEntry) {
    return editQueueEntry.edits[0].adds
        ? editQueueEntry.edits[0].adds[0].attributes
        : editQueueEntry.edits[0].updates
        ? editQueueEntry.edits[0].updates[0].attributes
        : undefined;
}
