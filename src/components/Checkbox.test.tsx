import * as React from "react";
import { Checkbox } from "./Checkbox";
import { render, screen, fireEvent } from "@testing-library/react";

function Example() {
    const [checked, setChecked] = React.useState(false);

    return <Checkbox id="example" label="Example" checked={checked} onChange={setChecked} />;
}
it("toggles", () => {
    render(<Example />);

    const input = screen.getByRole("checkbox", { name: "Example" });
    expect(input).not.toBeChecked();

    fireEvent.click(input);
    expect(input).toBeChecked();
});
