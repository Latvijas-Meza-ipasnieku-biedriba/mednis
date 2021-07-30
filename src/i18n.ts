import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
    lng: "lv",
    fallbackLng: "lv",
    resources: {
        lv: { translation: require("./locales/lv.json") },
        en: { translation: require("./locales/en.json") },
        ru: { translation: require("./locales/ru.json") },
    },
});
