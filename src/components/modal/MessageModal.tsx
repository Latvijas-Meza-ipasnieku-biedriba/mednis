import * as React from "react";
import { Icon } from "../Icon";
import { Modal } from "./Modal";
import { NewSpinner } from "../NewSpinner";
import { Title, Text } from "../Typography";
import "./MessageModal.scss";

interface MessageModalProps {
    variant: "loading" | "success" | "failure" | "delete";
    title: string;
    description?: string;
    children?: React.ReactNode;
    showCancel?: boolean;
    onCancel?: () => void;
    showClose?: boolean;
    onClose?: () => void;
}

export function MessageModal(props: MessageModalProps) {
    return (
        <Modal
            className="message-modal"
            showCancel={props.showCancel}
            onCancel={props.onCancel}
            showClose={props.showClose}
            onClose={props.onClose}
        >
            <div className="message-modal__icon">
                {props.variant === "loading" && <NewSpinner />}
                {props.variant === "success" && <Icon name="success" />}
                {props.variant === "failure" && <Icon name="failure" />}
                {props.variant === "delete" && <Icon name="delete" />}
            </div>

            <div className="message-modal__text">
                <Title className="message-modal__text__title">{props.title}</Title>
                {props.description && <Text className="message-modal__text__description">{props.description}</Text>}
            </div>

            {props.children && <div className="message-modal__custom-content">{props.children}</div>}
        </Modal>
    );
}
