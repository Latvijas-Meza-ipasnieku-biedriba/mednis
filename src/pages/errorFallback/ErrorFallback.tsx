import * as React from "react";
import { Plugins } from "@capacitor/core";
import { FallbackProps } from "react-error-boundary";
import { useTranslation } from "react-i18next";
import { Button, LinkButton } from "../../components/Button";
import { StartupPageLayout } from "../../components/StartupPageLayout";
import { Title, Text } from "../../components/Typography";
import { logger } from "../../utils/logger";
import { configuration } from "../../configuration";
import "./ErrorFallback.scss";

export function ErrorFallback(props: FallbackProps) {
    const { t } = useTranslation();

    const { message: error, stack } = props.error;

    React.useEffect(() => {
        logger.error({ message: "ErrorFallback caught an error", error, stack });
    }, [error, stack]);

    function restartApp() {
        document.location.href = "index.html";
    }

    async function sendDebugInfo() {
        try {
            const uri = await logger.getLogFileUri();

            await Plugins.Share.share({
                dialogTitle: t("about.debugInfo"),
                title: t("about.debugInfo"),
                url: uri,
            });
        } catch (error) {
            logger.error({ message: "Failed to share debug info", error });
        }
    }

    return (
        <StartupPageLayout>
            <div className="error-fallback">
                <Title size="small" className="error-fallback__title">
                    {t("errorFallback.title")}
                </Title>
                <Text className="error-fallback__description">
                    {t("errorFallback.description", { supportEmail: configuration.support.supportEmail })}
                </Text>
                <Button className="error-fallback__restart-app" onClick={restartApp}>
                    {t("errorFallback.restartApp")}
                </Button>
                <LinkButton className="error-fallback__send-debug-info" onClick={sendDebugInfo}>
                    {t("errorFallback.sendDebugInfo")}
                </LinkButton>
            </div>
        </StartupPageLayout>
    );
}
