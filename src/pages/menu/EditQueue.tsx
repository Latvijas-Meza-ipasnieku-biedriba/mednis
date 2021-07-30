import * as React from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "../../components/Icon";
import { LoadingFailure } from "../../components/Loading";
import { EditQueueEntry } from "../../hooks/useEditQueue";
import { NewSpinner } from "../../components/NewSpinner";
import { format } from "date-fns";
import { match } from "ts-pattern";
import { getAttributesFromEditQueueEntry, getGroupedEditQueueByType } from "../../utils/editQueue";
import { Collapsible, CollapsibleItem } from "../../components/Collapsible";
import { useEditQueueContext } from "../../hooks/useEditQueue";
import "./EditQueue.scss";

export interface EditQueueState {
    firstName: string;
    lastName: string;
    photo: string;
}

interface ErrorDialogState {
    open: boolean;
    message: string;
    editQueueEntry?: EditQueueEntry;
}
const initialErrorDialogState: ErrorDialogState = {
    open: false,
    message: "",
};

export function EditQueue() {
    const editQueueContext = useEditQueueContext();
    const { t } = useTranslation();
    const [errorDialog, setErrorDialog] = React.useState<ErrorDialogState>(initialErrorDialogState);

    if (editQueueContext.state.status === "loading") {
        return <></>;
    }

    const queuedEdits = editQueueContext.state.editQueue;

    function onEditClicked(editQueueEntry: EditQueueEntry) {
        if (!("dispatch" in editQueueContext)) {
            return;
        }

        if (editQueueContext.state.status !== "idle") {
            return;
        }
        if (editQueueEntry.state.status === "error") {
            const error = editQueueEntry.state.status === "error" ? editQueueEntry.state.error : "";
            setErrorDialog({ open: true, message: error ?? t("loading.failure"), editQueueEntry });
        }
        if (editQueueEntry.state.status === "pending") {
            editQueueContext.dispatch({ type: "editSyncStart", editQueueEntry });
        }
    }

    function retryFailedEdit() {
        if (!("dispatch" in editQueueContext)) {
            return;
        }
        if (errorDialog.editQueueEntry) {
            editQueueContext.dispatch({
                type: "retryFailedEditQueueEntry",
                editQueueEntry: errorDialog.editQueueEntry,
            });
        }
        clearErrorDialog();
    }

    function clearErrorDialog() {
        setErrorDialog(initialErrorDialogState);
    }

    return (
        <div className="edit-queue">
            {queuedEdits && (
                <Collapsible>
                    {Object.entries(getGroupedEditQueueByType(queuedEdits)).map(([group, entries]) => {
                        return (
                            <CollapsibleItem key={group} title={t(`${group}.title`)}>
                                {entries?.map((editQueueEntry) => (
                                    <EditQueueItem
                                        key={JSON.stringify(editQueueEntry)}
                                        editQueueEntry={editQueueEntry}
                                        onItemClicked={() => onEditClicked(editQueueEntry)}
                                    />
                                ))}
                            </CollapsibleItem>
                        );
                    })}
                </Collapsible>
            )}

            {errorDialog.open && errorDialog.editQueueEntry && (
                <LoadingFailure onRetry={retryFailedEdit} onCancel={clearErrorDialog} message={errorDialog.message} />
            )}
        </div>
    );
}

interface EditQueueItemProps {
    editQueueEntry: EditQueueEntry;
    onItemClicked: () => void;
}

export function EditQueueItem(props: EditQueueItemProps) {
    const attributes = getAttributesFromEditQueueEntry(props.editQueueEntry);
    if (!attributes) {
        return <></>;
    }

    const reportDate = format(new Date(attributes.reportCreated), "dd.MM.yyyy HH:mm:ss");

    return (
        <div className="edit-queue-item" onClick={props.onItemClicked}>
            <div className="edit-queue-item__left">
                <Icon name={props.editQueueEntry.icon} />
            </div>
            <div className="edit-queue-item__center">
                <span className="edit-queue-item__center__title">{props.editQueueEntry.title}</span>
                <div className="edit-queue-item__center__details">
                    <span className="edit-queue-item__center__details__report-date">{reportDate}</span>
                </div>
            </div>
            <div className="edit-queue-item__right">
                {match(props.editQueueEntry.state.status)
                    .with("pending", () => (
                        <Icon
                            name="pending"
                            className="edit-queue-item__right__icon edit-queue-item__right__icon--pending"
                        />
                    ))
                    .with("active", () => <NewSpinner />)
                    .with("success", () => (
                        <Icon
                            name="valid"
                            className="edit-queue-item__right__icon edit-queue-item__right__icon--success"
                        />
                    ))
                    .with("error", () => (
                        <Icon
                            name="invalid"
                            className="edit-queue-item__right__icon edit-queue-item__right__icon--failure"
                        />
                    ))
                    .exhaustive()}
            </div>
        </div>
    );
}
