import * as React from "react";
import { Plugins } from "@capacitor/core";
import { useTranslation } from "react-i18next";
import { List, ListItem } from "../../components/List";
import { Text } from "../../components/Typography";
import { logger } from "../../utils/logger";
import { configuration } from "../../configuration";
import elflaLogo from "../../assets/images/elfla-logo.jpeg";
import "./About.scss";

export function About() {
    const { t } = useTranslation();

    const [appVersion, setAppVersion] = React.useState("");

    React.useEffect(() => {
        Plugins.Device.getInfo()
            .then(({ appVersion, appBuild }) => {
                setAppVersion(`${appVersion} (${appBuild})`);
            })
            .catch((error) => {
                console.error("Failed to get device info", error);
            });
    }, []);

    function contactUs() {
        // There's no Mail app on iOS simulator, so nothing should open
        window.open("mailto:" + configuration.support.supportEmail);
    }

    function openTermsOfUse() {
        Plugins.Browser.open({
            url: configuration.support.termsOfUseUrl,
            presentationStyle: "popover",
        });
    }

    function openPrivacyPolicy() {
        Plugins.Browser.open({
            url: configuration.support.privacyPolicyUrl,
            presentationStyle: "popover",
        });
    }

    async function shareDebugInfo() {
        try {
            const uri = await logger.getLogFileUri();

            await Plugins.Share.share({
                dialogTitle: t("about.debug.title"),
                title: t("about.debug.title"),
                url: uri,
            });
        } catch (error) {
            logger.error({ message: "Failed to share debug info", error });
        }
    }

    return (
        <div className="about">
            <div className="about__description">
                <Text>{t("about.description")}</Text>
                <Text>{t("about.euSupportNotice")}</Text>
                <img className="about__description__elfla-logo" src={elflaLogo} alt="ELFLA logo" />
            </div>

            <List className="about__actions">
                <ListItem title={t("about.contactUs")} onClick={contactUs} />
                <ListItem title={t("about.termsOfUse")} onClick={openTermsOfUse} />
                <ListItem title={t("about.privacyPolicy")} onClick={openPrivacyPolicy} />
                <ListItem title={t("about.debugInfo")} onClick={shareDebugInfo} />
            </List>

            <Text className="about__app-version">{t("about.appVersion", { version: appVersion })}</Text>
        </div>
    );
}
