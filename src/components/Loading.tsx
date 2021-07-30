import * as React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./Button";
import { MessageModal } from "./modal/MessageModal";
import "./Loading.scss";

export function LoadingActive() {
    const { t } = useTranslation();

    return <MessageModal variant="loading" title={t("loading.active")} />;
}

interface LoadingSuccessProps {
    title?: string;
}
export function LoadingSuccess(props: LoadingSuccessProps) {
    const { t } = useTranslation();

    return <MessageModal variant="success" title={props.title ?? t("loading.success")} />;
}

interface LoadingFailureProps {
    onRetry: () => void;
    onCancel: () => void;
    message?: string;
}

export function LoadingFailure(props: LoadingFailureProps) {
    const { t } = useTranslation();

    return (
        <MessageModal
            variant="failure"
            title={props.message ?? t("loading.failure")}
            showClose
            onClose={props.onCancel}
            showCancel
            onCancel={props.onCancel}
        >
            <Button onClick={props.onRetry}>{t("loading.retry")}</Button>
        </MessageModal>
    );
}
