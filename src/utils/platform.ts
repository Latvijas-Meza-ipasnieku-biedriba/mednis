import { Capacitor } from "@capacitor/core";

enum Platform {
    iOS = "ios",
    Android = "android",
}

export function isIOS() {
    return Capacitor.getPlatform() === Platform.iOS;
}

export function isAndroid() {
    return Capacitor.getPlatform() === Platform.Android;
}
