import * as React from "react";
import { Icon } from "./Icon";
import "./NewSpinner.scss";

export function NewSpinner() {
    return (
        <div className="new-spinner">
            <Icon name="loading" />
        </div>
    );
}
