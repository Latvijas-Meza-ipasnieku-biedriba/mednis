import * as React from "react";
import { Permit } from "../types/permits";

export const PermitsContext = React.createContext<Permit[] | null>(null);

export function usePermitsContext() {
    const context = React.useContext(PermitsContext);

    if (context === null) {
        throw new Error("PermitsContext not initialized");
    }

    return context;
}
