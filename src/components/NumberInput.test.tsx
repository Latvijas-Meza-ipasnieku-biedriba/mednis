import * as React from "react";
import { NumberInput } from "./NumberInput";
import { render, screen, fireEvent } from "@testing-library/react";

function Form() {
    const [value, setValue] = React.useState("");

    return (
        <form>
            <NumberInput id="test" label="Test" value={value} onChange={setValue} />
        </form>
    );
}
it("updates value when typed", () => {
    render(<Form />);

    const input = screen.getByRole("spinbutton", { name: "Test" });

    const testValue = 123.45;
    fireEvent.change(input, { target: { value: testValue } });
    expect(input).toHaveValue(testValue);
});
