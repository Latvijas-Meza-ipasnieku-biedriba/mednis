import * as React from "react";
import { Panel } from "./Panel";
import { render, screen, fireEvent } from "@testing-library/react";

it("opens panel", () => {
    const onClose = jest.fn();

    const { rerender } = render(
        <Panel isOpen={false} onClose={onClose} placement="bottom">
            Test
        </Panel>
    );

    expect(screen.queryByText("Test")).not.toBeInTheDocument();

    rerender(
        <Panel isOpen onClose={onClose} placement="bottom">
            Test
        </Panel>
    );

    expect(screen.queryByText("Test")).toBeInTheDocument();
});

it("opens panel in the correct position", () => {
    const onClose = jest.fn();

    const { rerender } = render(
        <Panel isOpen onClose={onClose} placement="top">
            Test
        </Panel>
    );

    const panel = screen.getByRole("dialog");
    expect(panel).toHaveClass("panel-top");

    rerender(
        <Panel isOpen onClose={onClose} placement="right">
            Test
        </Panel>
    );
    expect(panel).toHaveClass("panel-right");

    rerender(
        <Panel isOpen onClose={onClose} placement="bottom">
            Test
        </Panel>
    );
    expect(panel).toHaveClass("panel-bottom");

    rerender(
        <Panel isOpen onClose={onClose} placement="left">
            Test
        </Panel>
    );
    expect(panel).toHaveClass("panel-left");
});

it("calls onClose when close button is clicked", () => {
    const onClose = jest.fn();

    render(
        <Panel isOpen onClose={onClose} placement="bottom">
            Test
        </Panel>
    );

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toBeCalledTimes(1);
});

it("calls onClose when backdrop is clicked", () => {
    const onClose = jest.fn();

    render(
        <Panel isOpen onClose={onClose} placement="bottom">
            Test
        </Panel>
    );

    fireEvent.click(screen.getByTestId("panel-backdrop"));

    expect(onClose).toBeCalledTimes(1);
});

it("hides backdrop", () => {
    const onClose = jest.fn();

    render(
        <Panel isOpen onClose={onClose} placement="top" hideBackdrop>
            Test
        </Panel>
    );

    expect(screen.queryByTestId("panel-backdrop")).not.toBeInTheDocument();
});
