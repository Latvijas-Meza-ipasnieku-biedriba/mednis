import * as React from "react";
import { Profile } from "../types/profile";

export const ProfileContext = React.createContext<Profile | null>(null);

export function useProfileContext() {
    const context = React.useContext(ProfileContext);

    if (context === null) {
        throw new Error("ProfileContext not initialized");
    }

    return context;
}
