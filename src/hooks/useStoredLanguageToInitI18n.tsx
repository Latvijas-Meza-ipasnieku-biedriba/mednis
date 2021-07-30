import * as React from "react";
import { Plugins } from "@capacitor/core";
import { useTranslation } from "react-i18next";

export function useStoredLanguageToInitI18n() {
    const { i18n } = useTranslation();

    React.useEffect(() => {
        Plugins.Storage.get({ key: "language" }).then(({ value: language }) => {
            if (language) {
                i18n.changeLanguage(language);
            }
        });
    }, [i18n]);
}
