import * as React from "react";
import { useTranslation } from "react-i18next";
import { AnimalsItemState, AnimalsItem, getDefaultAnimalsItemState } from "./AnimalsItem";
import { LinkButton, Button } from "../../components/Button";
import { MessageModal } from "../../components/modal/MessageModal";
import { ReactComponent as PlusIcon } from "../../assets/icons/plus.svg";
import { useClassifiersContext } from "../../hooks/useClassifiersContext";
import { useListRefs } from "../../hooks/useListRefs";
import { configuration } from "../../configuration";
import "./Animals.scss";

export type AnimalsState = AnimalsItemState[];

interface AnimalsProps {
    animals: AnimalsItemState[];
    onChange: (update: (animals: AnimalsItemState[]) => AnimalsItemState[]) => void;
}

export function Animals(props: AnimalsProps) {
    const { t } = useTranslation();

    const [itemToDelete, setItemToDelete] = React.useState<AnimalsItemState>();

    const classifiers = useClassifiersContext();
    const { listRefs, createListRef } = useListRefs(props.animals.length);

    // Scroll to item when added
    const currentCount = props.animals.length;
    const countRef = React.useRef(currentCount);
    React.useEffect(() => {
        if (countRef.current < currentCount) {
            const itemRef = listRefs.current[currentCount - 1];
            if (itemRef) {
                itemRef.scrollIntoView({ block: "center", behavior: "smooth" });
            }
        }

        countRef.current = currentCount;
    }, [listRefs, currentCount]);

    function onItemChange(id: string) {
        return (update: Partial<AnimalsItemState> | ((prevState: AnimalsItemState) => AnimalsItemState)) => {
            props.onChange((animals) =>
                animals.map((item) => {
                    if (item.id === id) {
                        if (typeof update === "function") {
                            return update(item);
                        }

                        return { ...item, ...update };
                    }

                    return item;
                })
            );
        };
    }

    function deleteItem(id: string) {
        props.onChange((animals) => {
            const filtered = animals.filter((item) => item.id !== id);

            // Only item should never be collapsed
            if (filtered.length === 1) {
                filtered[0] = { ...filtered[0], isCollapsed: false };
            }

            return filtered;
        });
    }

    function onDeleteItem(item: AnimalsItemState) {
        return () => {
            const defaultItemState = getDefaultAnimalsItemState(classifiers);
            const isFormChanged =
                item.gender !== defaultItemState.gender ||
                item.age !== defaultItemState.age ||
                item.count !== defaultItemState.count ||
                item.observedSignsOfDisease !== defaultItemState.observedSignsOfDisease;
            // ignore signsOfDisease -> available when observedSignsOfDisease is checked
            // ignore notesOnDiseases -> available when observedSignsOfDisease is checked
            // ignore isCollapsed -> visual state, not related to data
            // ignore id -> always different

            if (isFormChanged) {
                // Open confirmation modal
                setItemToDelete(item);
            } else {
                deleteItem(item.id);
            }
        };
    }

    function onConfirmDeleteItem() {
        if (itemToDelete) {
            deleteItem(itemToDelete.id);
        }

        // Close confirmation modal
        setItemToDelete(undefined);
    }

    function onCancelDeleteItem() {
        // Close confirmation modal
        setItemToDelete(undefined);
    }

    function onAddItem() {
        props.onChange((animals) => {
            if (animals.length === configuration.observations.animals.maxCount) {
                return animals;
            }

            return [...animals, getDefaultAnimalsItemState(classifiers)];
        });
    }

    return (
        <div className="animals">
            <div className="animals__content">
                {props.animals.map((item, index) => (
                    <AnimalsItem
                        key={item.id}
                        ref={createListRef(index)}
                        item={item}
                        onChange={onItemChange(item.id)}
                        showHeader={props.animals.length > 1}
                        onDelete={onDeleteItem(item)}
                    />
                ))}
            </div>

            {props.animals.length < configuration.observations.animals.maxCount && (
                <div className="animals__footer">
                    <LinkButton onClick={onAddItem} iconRight={<PlusIcon />}>
                        {t("observations.addAnother")}
                    </LinkButton>
                </div>
            )}

            {itemToDelete && (
                <MessageModal
                    variant="delete"
                    title={t("observations.deleteAnimalsItem.title")}
                    showCancel
                    onCancel={onCancelDeleteItem}
                    showClose
                    onClose={onCancelDeleteItem}
                >
                    <Button onClick={onConfirmDeleteItem}>{t("observations.deleteAnimalsItem.delete")}</Button>
                </MessageModal>
            )}
        </div>
    );
}
