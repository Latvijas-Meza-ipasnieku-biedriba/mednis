import * as React from "react";
import "./StartupPageLayout.scss";

interface StartupPageLayoutProps {
    children: React.ReactNode;
}

export function StartupPageLayout(props: StartupPageLayoutProps) {
    return (
        <div className="startup-page-layout">
            <div className="startup-page-layout__content">{props.children}</div>
        </div>
    );
}
