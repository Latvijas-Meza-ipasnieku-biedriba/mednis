import * as React from "react";
import { Plugins } from "@capacitor/core";
import { useService } from "@xstate/react";
import { useTranslation, Trans } from "react-i18next";
import { Button, LinkButton } from "../../components/Button";
import { Checkbox } from "../../components/Checkbox";
import { Icon } from "../../components/Icon";
import { StartupPageLayout } from "../../components/StartupPageLayout";
import { Title } from "../../components/Typography";
import { authenticationService } from "../../utils/authenticationService";
import { configuration } from "../../configuration";
import "./LoginPage.scss";

export function LoginPage() {
    const { t } = useTranslation();
    const [state, send] = useService(authenticationService);
    const { agreementsAccepted } = state.context;

    React.useEffect(() => {
        Plugins.SplashScreen.hide();
    }, []);

    function onLogin() {
        send({ type: "login" });
    }

    function onRegister() {
        send({ type: "register" });
    }

    function onAgreementsToggle() {
        send({ type: "toggleAgreements" });
    }

    function onTermsAndConditionsOpen() {
        Plugins.Browser.open({
            url: configuration.support.termsOfUseUrl,
            presentationStyle: "popover",
        });
    }

    function onPrivacyPolicyOpen() {
        Plugins.Browser.open({
            url: configuration.support.privacyPolicyUrl,
            presentationStyle: "popover",
        });
    }

    return (
        <StartupPageLayout>
            <div className="login-page">
                <Title size="small">{t("login.title")}</Title>
                <Button className="login-button" onClick={onLogin}>
                    {t("login.login")}
                </Button>
                <LinkButton
                    className="register-button"
                    onClick={onRegister}
                    iconRight={<Icon name="userNew" />}
                    disabled={!agreementsAccepted}
                >
                    {t("login.register")}
                </LinkButton>
                <Checkbox
                    id="agreements"
                    className="agreements"
                    checked={agreementsAccepted}
                    onChange={onAgreementsToggle}
                    label={
                        <Trans
                            i18nKey="login.agreements"
                            components={{
                                1: <a href="#" onClick={onTermsAndConditionsOpen} />,
                                2: <a href="#" onClick={onPrivacyPolicyOpen} />,
                            }}
                        />
                    }
                />
            </div>
        </StartupPageLayout>
    );
}
