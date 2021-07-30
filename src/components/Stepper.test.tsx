import * as React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { Stepper } from "./Stepper";

interface ExampleProps {
    defaultValue: number;
    minValue?: number;
    maxValue?: number;
}
function Example(props: ExampleProps) {
    const [count, setCount] = React.useState(props.defaultValue);

    return <Stepper value={count} onChange={setCount} minValue={props.minValue} maxValue={props.maxValue} />;
}

it("should increment and decrement", () => {
    render(<Example defaultValue={0} />);

    fireEvent.click(screen.getByRole("button", { name: "Increment" }));
    expect(screen.getByText("1")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Decrement" }));
    expect(screen.getByText("0")).toBeInTheDocument();
});

it("should handle min value", () => {
    render(<Example defaultValue={0} minValue={-1} />);

    fireEvent.click(screen.getByRole("button", { name: "Decrement" }));
    expect(screen.getByText("-1")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Decrement" }));
    expect(screen.getByText("-1")).toBeInTheDocument();
});

it("should handle max value", () => {
    render(<Example defaultValue={0} maxValue={1} />);

    fireEvent.click(screen.getByRole("button", { name: "Increment" }));
    expect(screen.getByText("1")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Increment" }));
    expect(screen.getByText("1")).toBeInTheDocument();
});
