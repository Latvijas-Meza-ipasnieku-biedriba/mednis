import * as React from "react";
import { useService } from "@xstate/react";
import { LanguageSelectPage } from "./pages/languageSelect/LanguageSelectPage";
import { LoadingPage } from "./pages/loading/LoadingPage";
import { LoginPage } from "./pages/loginPage/LoginPage";
import { authenticationService } from "./utils/authenticationService";

export function UnauthenticatedApp() {
    const [state, send] = useService(authenticationService);

    function onLanguageEntered() {
        send({ type: "languageEntered" });
    }

    if (state.matches({ loggedOut: "enteringLanguage" })) {
        return <LanguageSelectPage onNextButtonClick={onLanguageEntered} />;
    }

    if (state.matches({ loggedOut: "idle" })) {
        return <LoginPage />;
    }

    return <LoadingPage />;
}
