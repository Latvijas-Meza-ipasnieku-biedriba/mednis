import { Plugins } from "@capacitor/core";
import * as React from "react";
import { logger } from "./utils/logger";

export function useAppLaunchedLog() {
    React.useEffect(() => {
        logger.log("App launched");
    }, []);

    React.useEffect(() => {
        Plugins.Device.getInfo().then((deviceInfo) => {
            logger.log({ message: "Device info", ...deviceInfo });
        });
    }, []);
}
