import * as React from "react";
import { useService } from "@xstate/react";
import { AuthenticatedApp } from "./AuthenticatedApp";
import { LoadingApp } from "./LoadingApp";
import { UnauthenticatedApp } from "./UnauthenticatedApp";
import { useAppLaunchedLog } from "./useAppLaunchedLog";
import { useIosAccessoryBar } from "./hooks/useIosAccessoryBar";
import { useStoredLanguageToInitI18n } from "./hooks/useStoredLanguageToInitI18n";
import { authenticationService } from "./utils/authenticationService";
import "./App.scss";

export function App() {
    useAppLaunchedLog();
    useStoredLanguageToInitI18n();
    useIosAccessoryBar();

    const [state] = useService(authenticationService);

    return (
        <div className="app">
            {state.matches("loading") && <LoadingApp />}
            {state.matches("loggedIn") && <AuthenticatedApp />}
            {state.matches("loggedOut") && <UnauthenticatedApp />}
        </div>
    );
}
