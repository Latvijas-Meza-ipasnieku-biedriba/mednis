import * as React from "react";
import { render, screen } from "@testing-library/react";
import { ReadOnlyInput } from "./ReadOnlyInput";

describe("ReadOnlyInput", () => {
    it("renders label + read only input", () => {
        const label = "Favorite fruit";
        const value = "Apple";

        render(<ReadOnlyInput id="favorite-fruit" label={label} value={value} />);

        expect(screen.getByRole("textbox", { name: label })).toHaveValue(value);
    });
});
