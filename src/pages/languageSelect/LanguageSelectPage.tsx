import * as React from "react";
import { Plugins } from "@capacitor/core";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/Button";
import { SegmentedControl, SegmentedControlItem } from "../../components/SegmentedControl";
import { StartupPageLayout } from "../../components/StartupPageLayout";
import { Title } from "../../components/Typography";
import { StorageKey } from "../../types/storage";
import "./LanguageSelectPage.scss";

interface LanguageSelectPageProps {
    onNextButtonClick: () => void;
}

export function LanguageSelectPage(props: LanguageSelectPageProps) {
    const { t, i18n } = useTranslation();

    React.useEffect(() => {
        Plugins.SplashScreen.hide();
    }, []);

    function onLanguageChange(language: string) {
        i18n.changeLanguage(language);
        Plugins.Storage.set({ key: StorageKey.Language, value: language });
    }

    function onNextButtonClick() {
        onLanguageChange(i18n.language);
        props.onNextButtonClick();
    }

    return (
        <StartupPageLayout>
            <div className="language-select-page">
                <Title size="small">{t("languageSelect.title")}</Title>
                <SegmentedControl name="language" value={i18n.language} onChange={onLanguageChange}>
                    <SegmentedControlItem value="lv" label={t("language.lv")} />
                    <SegmentedControlItem value="en" label={t("language.en")} />
                    <SegmentedControlItem value="ru" label={t("language.ru")} />
                </SegmentedControl>
                <Button onClick={onNextButtonClick}>{t("languageSelect.next")}</Button>
            </div>
        </StartupPageLayout>
    );
}
