import * as React from "react";
import { Membership } from "../types/mtl";

export const MembershipContext = React.createContext<Membership[] | null>(null);

export function useMembershipContext() {
    const context = React.useContext(MembershipContext);

    if (context === null) {
        throw new Error("MembershipContext not initialized");
    }

    return context;
}
