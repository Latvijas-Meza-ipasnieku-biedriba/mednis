import * as React from "react";
import { NewSpinner } from "../../components/NewSpinner";
import { StartupPageLayout } from "../../components/StartupPageLayout";
import "./LoadingPage.scss";

export function LoadingPage() {
    return (
        <StartupPageLayout>
            <div className="loading-page">
                <NewSpinner />
            </div>
        </StartupPageLayout>
    );
}
