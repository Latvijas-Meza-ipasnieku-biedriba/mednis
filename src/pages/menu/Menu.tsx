import * as React from "react";
import { useService } from "@xstate/react";
import { useTranslation } from "react-i18next";
import { FullScreenModal } from "../../components/modal/FullScreenModal";
import { MenuList, MenuListItem } from "../../components/MenuList";
import { FullWidthButton } from "../../components/FullWidthButton";
import { Profile } from "./Profile";
import { Settings } from "./Settings";
import { About } from "./About";
import { EditQueue } from "./EditQueue";
import { authenticationService } from "../../utils/authenticationService";

interface MenuProps {
    onCloseButtonClick: () => void;
}

export function Menu(props: MenuProps) {
    const { t } = useTranslation();
    const [, send] = useService(authenticationService);

    const [isProfilePageOpen, setIsProfilePageOpen] = React.useState(false);
    const [isQueuePageOpen, setIsQueuePageOpen] = React.useState(false);
    const [isSettingsPageOpen, setIsSettingsPageOpen] = React.useState(false);
    const [isAboutPageOpen, setIsAboutPageOpen] = React.useState(false);

    function onProfilePageOpen() {
        setIsProfilePageOpen(true);
    }

    function onProfilePageClose() {
        setIsProfilePageOpen(false);
    }

    function onQueuePageOpen() {
        setIsQueuePageOpen(true);
    }

    function onQueuePageClose() {
        setIsQueuePageOpen(false);
    }

    function onSettingsPageOpen() {
        setIsSettingsPageOpen(true);
    }

    function onSettingsPageClose() {
        setIsSettingsPageOpen(false);
    }

    function onAboutPageOpen() {
        setIsAboutPageOpen(true);
    }

    function onAboutPageClose() {
        setIsAboutPageOpen(false);
    }

    function onLogoutButtonClick() {
        send({ type: "logout" });
    }

    return (
        <FullScreenModal
            title={t("profile.title")}
            showCloseButton
            onCloseButtonClick={props.onCloseButtonClick}
            fullWidthContent
        >
            <MenuList>
                <MenuListItem title={t("menu.profile")} icon="user" onClick={onProfilePageOpen} paddedItem />
                <MenuListItem title={t("menu.editQueue")} icon="register" onClick={onQueuePageOpen} paddedItem />
                <MenuListItem title={t("menu.settings")} icon="settings" onClick={onSettingsPageOpen} paddedItem />
                <MenuListItem title={t("menu.aboutApp")} icon="info" onClick={onAboutPageOpen} paddedItem />
            </MenuList>
            <FullWidthButton title={t("menu.exit")} icon="exit" onButtonClick={onLogoutButtonClick} />
            {isProfilePageOpen && (
                <FullScreenModal
                    title={t("menu.profile")}
                    showBackButton
                    showCloseButton
                    onBackButtonClick={onProfilePageClose}
                    onCloseButtonClick={props.onCloseButtonClick}
                >
                    <Profile />
                </FullScreenModal>
            )}
            {isQueuePageOpen && (
                <FullScreenModal
                    title={t("menu.editQueue")}
                    showBackButton
                    showCloseButton
                    onBackButtonClick={onQueuePageClose}
                    onCloseButtonClick={props.onCloseButtonClick}
                >
                    <EditQueue />
                </FullScreenModal>
            )}
            {isSettingsPageOpen && (
                <FullScreenModal
                    title={t("menu.settings")}
                    showBackButton
                    showCloseButton
                    onBackButtonClick={onSettingsPageClose}
                    onCloseButtonClick={props.onCloseButtonClick}
                >
                    <Settings />
                </FullScreenModal>
            )}
            {isAboutPageOpen && (
                <FullScreenModal
                    title={t("menu.aboutApp")}
                    showBackButton
                    showCloseButton
                    onBackButtonClick={onAboutPageClose}
                    onCloseButtonClick={props.onCloseButtonClick}
                >
                    <About />
                </FullScreenModal>
            )}
        </FullScreenModal>
    );
}
