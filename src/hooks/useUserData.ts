import * as React from "react";
import { Plugins } from "@capacitor/core";
import { Profile, ProfileBasicInfo } from "../types/profile";
import { StorageKey } from "../types/storage";
import { UserData } from "../types/userData";
import { getProfileBasicInfoFromStorage } from "../utils/profile";
import { EditQueueEntry, getEditQueue } from "./useEditQueue";

export interface UserDataContext {
    userData?: UserData;
    updateProfileBasicInfo: (profileBasicInfo: ProfileBasicInfo) => void;
    updateEditQueue: (editQueue: EditQueueEntry[]) => Promise<void>;
}

export const UserDataContext = React.createContext<UserDataContext | null>(null);

export function useUserDataContext() {
    const context = React.useContext(UserDataContext);

    if (context === null) {
        throw new Error("UserDataContext not initialized");
    }

    return context;
}

export function useUserData(profile?: Profile): UserDataContext {
    const [userData, setUserData] = React.useState<UserData>();

    React.useEffect(() => {
        if (!profile) {
            setUserData(undefined);
            return;
        }

        getUserDataFromStorage().then((userData) => {
            const currentUserData = userData
                ? userData.find((userDataEntry) => userDataEntry.userId === profile.id)
                : undefined;

            if (!currentUserData) {
                return getEditQueue().then((editQueueFromStorage) => {
                    return getProfileBasicInfoFromStorage().then((profileBasicInfo) => {
                        const userDataArray = userData ?? [];
                        const editQueue = editQueueFromStorage ?? [];
                        if (profileBasicInfo) {
                            setUserData({ userId: profile.id, isCurrentUser: true, profileBasicInfo, editQueue });
                            return saveUserDataToStorage([
                                ...userDataArray,
                                { userId: profile.id, isCurrentUser: true, profileBasicInfo, editQueue },
                            ]);
                        }
                        setUserData({ userId: profile.id, isCurrentUser: true, editQueue });
                        return saveUserDataToStorage([
                            ...userDataArray,
                            { userId: profile.id, isCurrentUser: true, editQueue },
                        ]);
                    });
                });
            }

            const updatedUserData = { ...currentUserData, isCurrentUser: true };
            setUserData(updatedUserData);
            updateCurrentUserData(updatedUserData);
        });
    }, [profile]);

    const updateProfileBasicInfo = React.useCallback(
        (profileBasicInfo) => {
            if (userData) {
                userData.profileBasicInfo = profileBasicInfo;
                updateCurrentUserData(userData);
            }
        },
        [userData]
    );

    const updateEditQueue = React.useCallback(
        (editQueue) => {
            if (userData) {
                userData.editQueue = editQueue;
                return updateCurrentUserData(userData);
            }
            return Promise.resolve();
        },
        [userData]
    );

    return {
        userData,
        updateProfileBasicInfo,
        updateEditQueue,
    };
}

export function getUserDataFromStorage(): Promise<UserData[]> {
    return Plugins.Storage.get({ key: StorageKey.UserData }).then((result) => {
        if (result.value) {
            return JSON.parse(result.value);
        }
    });
}

function updateCurrentUserData(currentUserData: UserData): Promise<void> {
    return getUserDataFromStorage().then((userData) => {
        if (userData) {
            const updatedUserData = userData.map((userDataEntry) => {
                if (userDataEntry.userId === currentUserData.userId) {
                    return { ...currentUserData, isCurrentUser: true };
                }

                return { ...userDataEntry, isCurrentUser: false };
            });

            if (!updatedUserData.some((userDataEntry) => userDataEntry.userId === currentUserData.userId)) {
                updatedUserData.push({ ...currentUserData, isCurrentUser: true });
            }

            return saveUserDataToStorage(updatedUserData);
        }
    });
}

export function saveUserDataToStorage(userData: UserData[]): Promise<void> {
    return Plugins.Storage.set({ key: StorageKey.UserData, value: JSON.stringify(userData) });
}
