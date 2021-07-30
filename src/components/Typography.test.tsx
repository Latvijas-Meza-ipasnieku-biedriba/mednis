import * as React from "react";
import { Title, Text, Label } from "./Typography";
import { render, screen } from "@testing-library/react";

describe("Title", () => {
    it("renders correctly", () => {
        const { rerender } = render(<Title size="largest">Largest title</Title>);

        expect(screen.getByRole("heading")).toHaveTextContent("Largest title");
        expect(screen.getByRole("heading").tagName).toBe("H1");

        rerender(<Title size="large">Large title</Title>);
        expect(screen.getByRole("heading")).toHaveTextContent("Large title");
        expect(screen.getByRole("heading").tagName).toBe("H2");

        rerender(<Title size="medium">Medium title</Title>);
        expect(screen.getByRole("heading")).toHaveTextContent("Medium title");
        expect(screen.getByRole("heading").tagName).toBe("H3");

        rerender(<Title size="small">Small title</Title>);
        expect(screen.getByRole("heading")).toHaveTextContent("Small title");
        expect(screen.getByRole("heading").tagName).toBe("H4");

        rerender(<Title>Default title</Title>);
        expect(screen.getByRole("heading")).toHaveTextContent("Default title");
        expect(screen.getByRole("heading").tagName).toBe("H3");
    });
});

describe("Text", () => {
    it("renders correctly", () => {
        render(<Text>Text</Text>);

        expect(screen.getByText("Text")).toBeInTheDocument();
        expect(screen.getByText("Text").tagName).toBe("P");
    });

    it("adds bold class", () => {
        render(<Text bold>Text</Text>);

        expect(screen.getByText("Text")).toHaveClass("text-bold");
    });
});

describe("Label", () => {
    it("links label to input", () => {
        render(
            <>
                <Label htmlFor="test-input">Test label</Label>
                <input id="test-input" type="text" value="Test" readOnly />
            </>
        );

        expect(screen.getByRole("textbox", { name: "Test label" })).toHaveValue("Test");
    });

    it("adds secondary label", () => {
        const primaryLabel = "Primary label";
        const secondaryLabel = "Secondary label";

        render(<Label secondaryLabel={secondaryLabel}>{primaryLabel}</Label>);

        expect(screen.getByText(primaryLabel)).toBeInTheDocument();
        expect(screen.getByText(`(${secondaryLabel})`)).toBeInTheDocument();
    });
});
