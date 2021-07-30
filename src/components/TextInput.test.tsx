import * as React from "react";
import { TextInput } from "./TextInput";
import { render, screen, fireEvent } from "@testing-library/react";

function Form() {
    const [value, setValue] = React.useState("");

    return (
        <form>
            <TextInput id="test" label="Test" value={value} onChange={setValue} />
        </form>
    );
}
it("updates value when typed", () => {
    render(<Form />);

    const input = screen.getByRole("textbox", { name: "Test" });

    const testValue = "orange";
    fireEvent.change(input, { target: { value: testValue } });
    expect(input).toHaveValue(testValue);
});
