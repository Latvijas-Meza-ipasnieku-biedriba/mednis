import * as React from "react";
import { Plugins } from "@capacitor/core";

/**
 * TabBar should not be visible when keyboard is open
 *
 * Window resizes when keyboard appears and since TabBar is at the bottom of screen, it's moved to top of keyboard,
 * which is a strange look for a mobile application
 */
export function useTabBarVisible() {
    const [tabBarVisible, setTabBarVisible] = React.useState(true);

    React.useEffect(() => {
        const handle = Plugins.Keyboard.addListener("keyboardWillShow", () => {
            setTabBarVisible(false);
        });

        return () => {
            handle.remove();
        };
    }, []);

    React.useEffect(() => {
        const handle = Plugins.Keyboard.addListener("keyboardWillHide", () => {
            setTabBarVisible(true);
        });

        return () => {
            handle.remove();
        };
    }, []);

    return tabBarVisible;
}
