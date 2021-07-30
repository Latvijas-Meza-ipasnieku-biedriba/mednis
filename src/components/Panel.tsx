import * as React from "react";
import { CSSTransition } from "react-transition-group";
import { ReactComponent as XIcon } from "../assets/icons/x.svg";
import Hammer from "react-hammerjs";
import "./Panel.scss";

interface PanelProps {
    isOpen: boolean;
    title?: string;
    hideBackdrop?: boolean;
    onClose: () => void;
    children: React.ReactNode;
    placement: "top" | "right" | "bottom" | "left";
}

export function Panel(props: PanelProps) {
    let swipeDirection:
        | "DIRECTION_NONE"
        | "DIRECTION_LEFT"
        | "DIRECTION_RIGHT"
        | "DIRECTION_UP"
        | "DIRECTION_DOWN"
        | "DIRECTION_HORIZONTAL"
        | "DIRECTION_VERTICAL"
        | "DIRECTION_ALL";

    switch (props.placement) {
        case "top":
            swipeDirection = "DIRECTION_UP";
            break;
        case "right":
            swipeDirection = "DIRECTION_RIGHT";
            break;
        case "bottom":
            swipeDirection = "DIRECTION_DOWN";
            break;
        case "left":
            swipeDirection = "DIRECTION_LEFT";
            break;
    }

    return (
        <CSSTransition in={props.isOpen} timeout={200} classNames="fade" mountOnEnter unmountOnExit>
            <div className={`panel panel-${props.placement}`} role="dialog">
                {!props.hideBackdrop && (
                    <div className="panel__backdrop" onClick={props.onClose} data-testid="panel-backdrop"></div>
                )}
                <CSSTransition in={props.isOpen} timeout={200} classNames={`slide-${props.placement}`} appear>
                    <Hammer onSwipe={props.onClose} direction={swipeDirection}>
                        <div className="panel__content" data-testid="panel-content">
                            <div className="panel__content-header">
                                <b>{props.title}</b>
                                <button type="button" aria-label="Close" onClick={props.onClose}>
                                    <XIcon />
                                </button>
                            </div>
                            <div>{props.children}</div>
                        </div>
                    </Hammer>
                </CSSTransition>
            </div>
        </CSSTransition>
    );
}
