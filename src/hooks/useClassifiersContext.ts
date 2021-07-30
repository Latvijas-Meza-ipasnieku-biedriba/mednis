import * as React from "react";
import { Classifiers } from "../types/classifiers";

export const ClassifiersContext = React.createContext<Classifiers | null>(null);

export function useClassifiersContext() {
    const context = React.useContext(ClassifiersContext);

    if (context === null) {
        throw new Error("ClassifiersContext not initialized");
    }

    return context;
}
