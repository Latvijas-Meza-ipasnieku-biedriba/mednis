import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

it("renders", () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole("button", { name: "Test" })).toBeInTheDocument();
});

it("appends className", () => {
    render(<Button className="test">Test</Button>);
    expect(screen.getByRole("button", { name: "Test" })).toHaveClass("test");
});

it("calls onClick", () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Test</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Test" }));
    expect(onClick).toHaveBeenCalledTimes(1);
});
