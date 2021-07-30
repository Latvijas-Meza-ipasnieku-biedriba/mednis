import * as React from "react";
import classNames from "classnames";
import "./PinDisplay.scss";

interface PinDisplayProps {
    length: number;
    filled: number;
}

export function PinDisplay(props: PinDisplayProps) {
    const dots: number[] = [];

    for (let i = 1; i <= props.length; i++) {
        dots.push(i);
    }

    return (
        <div className="pin-display">
            {dots.map((dot) => (
                <PinDisplayDot key={dot} filled={dot <= props.filled} />
            ))}
        </div>
    );
}

interface PinDisplayDotProps {
    filled: boolean;
}

export function PinDisplayDot(props: PinDisplayDotProps) {
    const className = classNames("pin-display-dot", { "pin-display-dot--filled": props.filled });
    return <span className={className} />;
}
