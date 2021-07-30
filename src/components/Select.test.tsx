import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select, SelectOption } from "./Select";

function FruitSelect() {
    const [value, setValue] = React.useState("");
    return (
        <form>
            <label htmlFor="fruit">Fruit</label>
            <Select id="fruit" value={value} onChange={setValue}>
                <SelectOption value="apple">Apple</SelectOption>
                <SelectOption value="orange">Orange</SelectOption>
            </Select>
        </form>
    );
}

it("can select value", () => {
    render(<FruitSelect />);

    const select = screen.getByRole("combobox", { name: "Fruit" });

    expect(select).toHaveValue("");
    expect(select).toHaveTextContent("Izvēlies vērtību");

    userEvent.selectOptions(select, "apple");
    expect(select).toHaveValue("apple");
    expect(select).toHaveTextContent("Apple");

    userEvent.selectOptions(select, "orange");
    expect(select).toHaveValue("orange");
    expect(select).toHaveTextContent("Orange");
});
