import * as React from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "../../components/Badge";
import { Icon } from "../../components/Icon";
import { Label } from "../../components/Typography";
import { RadioButton, RadioButtonGroup } from "../../components/Radio";
import { getActiveClassifiers } from "../../utils/filterClassifiers";
import { useClassifiersContext } from "../../hooks/useClassifiersContext";
import { ObservationType } from "../../types/classifiers";
import { configuration } from "../../configuration";

interface ObservationsTypeProps {
    type?: number;
    onChange: (type: number) => void;
    animalsObservationsItemCount: number;
}

export function ObservationsType(props: ObservationsTypeProps) {
    const { t, i18n } = useTranslation();
    const classifiers = useClassifiersContext();
    const typeClassifiers = getActiveClassifiers(classifiers, "observationType");

    function onChange(rawValue: string) {
        props.onChange(Number(rawValue));
    }

    return (
        <>
            <Label className="type-label">{t("observations.type")}</Label>
            <RadioButtonGroup
                name="observations-type"
                className="type"
                value={props.type?.toString() ?? "no-value"}
                onChange={onChange}
            >
                {typeClassifiers.map(({ id, description }) => {
                    const isDirectlyObservedAnimalsType = id === ObservationType.DirectlyObservedAnimals;
                    const isTypeSelected = props.type === id;
                    const isMoreThanOneItemAdded = props.animalsObservationsItemCount > 1;
                    const isBadgeVisible = isDirectlyObservedAnimalsType && isTypeSelected && isMoreThanOneItemAdded;

                    return (
                        <RadioButton className="type-button" key={`observations-type-${id}`} value={String(id)}>
                            <Icon name={configuration.observations.typeIcons[id as ObservationType] ?? "cross"} />

                            {description[i18n.language]}

                            {isBadgeVisible && (
                                <Badge className="type-button__badge" count={props.animalsObservationsItemCount} />
                            )}
                        </RadioButton>
                    );
                })}
            </RadioButtonGroup>
        </>
    );
}
