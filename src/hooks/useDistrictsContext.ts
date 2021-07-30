import * as React from "react";
import { District } from "../types/districts";

export const DistrictsContext = React.createContext<District[] | null>(null);

export function useDistrictsContext() {
    const context = React.useContext(DistrictsContext);

    if (context === null) {
        throw new Error("DistrictsContext not initialized");
    }

    return context;
}
