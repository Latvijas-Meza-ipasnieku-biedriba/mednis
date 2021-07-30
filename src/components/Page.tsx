import * as React from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { Icon } from "./Icon";
import "./Page.scss";

interface PageProps {
    children: React.ReactNode;
    className?: string;
}

export function Page(props: PageProps) {
    const className = classNames("page", props.className);
    return <div className={className}>{props.children}</div>;
}

interface PageHeaderProps {
    title: string;
    showBackButton?: boolean;
    onBackButtonClick?: () => void;
    showCloseButton?: boolean;
    onCloseButtonClick?: () => void;
    className?: string;
}

export function PageHeader(props: PageHeaderProps) {
    const { t } = useTranslation();
    const className = classNames("page-header", props.className);

    return (
        <div className={className}>
            <div className="page-header__content">
                {props.showBackButton && (
                    <button
                        type="button"
                        className="page-header__content__back"
                        onClick={props.onBackButtonClick}
                        title={t("modal.back")}
                    >
                        <Icon name="arrowLeft" />
                    </button>
                )}

                <h1 className="page-header__content__title">{props.title}</h1>

                {props.showCloseButton && (
                    <button
                        type="button"
                        className="page-header__content__close"
                        onClick={props.onCloseButtonClick}
                        title={t("modal.close")}
                    >
                        <Icon name="cross" />
                    </button>
                )}
            </div>
        </div>
    );
}

interface PageContentProps {
    children: React.ReactNode;
    className?: string;
}

export function PageContent(props: PageContentProps) {
    const className = classNames("page-content", props.className);
    return <div className={className}>{props.children}</div>;
}
