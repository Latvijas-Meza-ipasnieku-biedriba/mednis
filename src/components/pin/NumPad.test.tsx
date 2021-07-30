import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { NumPad } from "./NumPad";

function Example() {
    const [display, setDisplay] = React.useState("");

    function onDigitClick(digit: number) {
        setDisplay((display) => display + digit);
    }

    function onBackspaceClick() {
        setDisplay((display) => display.slice(0, display.length - 1));
    }

    return (
        <>
            <span data-testid="display">{display}</span>
            <NumPad onEnterDigit={onDigitClick} onRemoveDigit={onBackspaceClick} />
        </>
    );
}

describe("NumPad", () => {
    it("should be possible to enter all digits", () => {
        render(<Example />);

        const display = screen.getByTestId("display");

        expect(display).toHaveTextContent("");

        const expectedResult = "0123456789";

        expectedResult.split("").forEach((digit) => {
            fireEvent.click(screen.getByRole("button", { name: digit }));
        });

        expect(display).toHaveTextContent(expectedResult);
    });

    it("should be possible to delete last digit", () => {
        render(<Example />);

        const display = screen.getByTestId("display");

        fireEvent.click(screen.getByRole("button", { name: "1" }));
        expect(display).toHaveTextContent("1");

        fireEvent.click(screen.getByRole("button", { name: "Dzēst" }));
        expect(display).toHaveTextContent("");
    });
});
