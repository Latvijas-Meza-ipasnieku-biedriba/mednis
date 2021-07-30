import * as React from "react";
import { Features } from "../types/features";

export const FeaturesContext = React.createContext<Features | null>(null);

export function useFeaturesContext() {
    const context = React.useContext(FeaturesContext);

    if (context === null) {
        throw new Error("FeaturesContext not initialized");
    }

    return context;
}
