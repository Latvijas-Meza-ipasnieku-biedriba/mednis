import * as React from "react";
import { Label } from "./Typography";
import { RadioGroup, Radio, RadioButton } from "./Radio";
import { render, screen, fireEvent } from "@testing-library/react";

function Trivia() {
    const [answer, setAnswer] = React.useState("");

    return (
        <>
            <Label>Which is the correct answer?</Label>
            <RadioGroup name="trivia" value={answer} onChange={setAnswer}>
                <Radio value="B" label="A" />
                <Radio value="C" label="B" />
                <Radio value="A" label="C" />
            </RadioGroup>
        </>
    );
}

it("Radio - changes selection on click", () => {
    render(<Trivia />);

    const A = screen.getByRole("radio", { name: "A" });
    const B = screen.getByRole("radio", { name: "B" });
    const C = screen.getByRole("radio", { name: "C" });

    fireEvent.click(A);
    expect(A).toBeChecked();
    expect(B).not.toBeChecked();
    expect(C).not.toBeChecked();

    fireEvent.click(B);
    expect(A).not.toBeChecked();
    expect(B).toBeChecked();
    expect(C).not.toBeChecked();

    fireEvent.click(C);
    expect(A).not.toBeChecked();
    expect(B).not.toBeChecked();
    expect(C).toBeChecked();
});

function TriviaRB() {
    const [answer, setAnswer] = React.useState("");

    return (
        <>
            <Label>Which is the correct answer?</Label>
            <RadioGroup name="trivia" value={answer} onChange={setAnswer}>
                <RadioButton value="B">A</RadioButton>
                <RadioButton value="C">B</RadioButton>
                <RadioButton value="A">C</RadioButton>
            </RadioGroup>
        </>
    );
}

it("RadioButton - changes selection on click", () => {
    render(<TriviaRB />);

    const A = screen.getByRole("radio", { name: "A" });
    const B = screen.getByRole("radio", { name: "B" });
    const C = screen.getByRole("radio", { name: "C" });

    fireEvent.click(A);
    expect(A).toBeChecked();
    expect(B).not.toBeChecked();
    expect(C).not.toBeChecked();

    fireEvent.click(B);
    expect(A).not.toBeChecked();
    expect(B).toBeChecked();
    expect(C).not.toBeChecked();

    fireEvent.click(C);
    expect(A).not.toBeChecked();
    expect(B).not.toBeChecked();
    expect(C).toBeChecked();
});
