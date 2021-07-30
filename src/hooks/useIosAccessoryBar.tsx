import * as React from "react";
import { Plugins } from "@capacitor/core";

export function useIosAccessoryBar() {
    React.useEffect(() => {
        Plugins.Device.getInfo().then((info) => {
            if (info.platform === "ios") {
                Plugins.Keyboard.setAccessoryBarVisible({ isVisible: true });
            }
        });
    }, []);
}
