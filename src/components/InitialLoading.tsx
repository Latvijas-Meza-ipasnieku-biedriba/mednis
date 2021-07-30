import * as React from "react";
import { Button } from "./Button";
import { MessageModal } from "./modal/MessageModal";
import "./InitialLoading.scss";
import { useTranslation } from "react-i18next";

export function InitialLoadingActive() {
    const { t } = useTranslation();

    return (
        <div className="initial-loading">
            <MessageModal variant="loading" title={t("initialLoading.active")} />
        </div>
    );
}

interface InitialLoadingFailedProps {
    onRetry: () => void;
}

export function InitialLoadingFailed(props: InitialLoadingFailedProps) {
    const { t } = useTranslation();

    return (
        <div className="initial-loading">
            <MessageModal variant="failure" title={t("initialLoading.failure")}>
                <Button onClick={props.onRetry}>{t("initialLoading.retry")}</Button>
            </MessageModal>
        </div>
    );
}
