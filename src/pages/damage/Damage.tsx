import * as React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/Button";
import { CurrentPosition } from "../../components/CurrentPosition";
import { ForestDamage, ForestDamageState } from "./ForestDamage";
import { Icon } from "../../components/Icon";
import { InfrastructureDamage, InfrastructureDamageState } from "./InfrastructureDamage";
import { Label } from "../../components/Typography";
import { LandDamage, LandDamageState } from "./LandDamage";
import { LoadingActive, LoadingSuccess } from "../../components/Loading";
import { Photo } from "../../components/photo/Photo";
import { RadioButton, RadioButtonGroup } from "../../components/Radio";
import { TextInput } from "../../components/TextInput";
import { TitleBar } from "../../components/TitleBar";
import { getActiveClassifiers } from "../../utils/filterClassifiers";
import { getDamageEdits } from "./getDamageEdits";
import { isDamageValid } from "./Validation";
import { useClassifiersContext } from "../../hooks/useClassifiersContext";
import { useCurrentPosition } from "../../hooks/useCurrentPosition";
import { Classifiers, DamageType } from "../../types/classifiers";
import { EditQueueEntry, useEditQueueContext } from "../../hooks/useEditQueue";
import { PhotoReference } from "../../types/photo";
import { configuration } from "../../configuration";
import "./Damage.scss";

export interface DamageState {
    position?: { lat: number; lng: number };
    notes: string;
    type?: number;
    land: LandDamageState;
    forest: ForestDamageState;
    infrastructure: InfrastructureDamageState;
    photo?: PhotoReference;
}

function getDefaultDamageState(classifiers: Classifiers): DamageState {
    return {
        notes: "",
        land: {
            customSpecies: "",
            otherSpecies: "",
            area: "",
            count: configuration.damage.land.count.defaultValue,
        },
        forest: {
            area: "",
            standProtection: configuration.damage.forest.standProtection.defaultValue ?? "",
            damagedTreeSpecies: {},
            damageVolumeType:
                classifiers.damageVolumeType.defaultValue ?? configuration.damage.forest.defaultDamageVolumeType,
            responsibleSpecies: configuration.damage.forest.defaultResponsibleSpecies,
            otherResponsibleSpecies: "",
            damageTypes: {},
        },
        infrastructure: {
            type: classifiers.infrastructureType.defaultValue ?? configuration.damage.infrastructure.defaultType,
            otherType: "",
            responsibleSpecies: configuration.damage.infrastructure.defaultResponsibleSpecies,
            otherResponsibleSpecies: "",
        },
    };
}

export function Damage() {
    const { t, i18n } = useTranslation();
    const classifiers = useClassifiersContext();
    const editQueueContext = useEditQueueContext();
    const damageTypeClassifiers = getActiveClassifiers(classifiers, "damageType");
    const [damage, setDamage] = React.useState<DamageState>(() => getDefaultDamageState(classifiers));

    const positionResult = useCurrentPosition();
    const { position, fetchPosition } = positionResult;

    React.useEffect(() => {
        setDamage((damage) => ({
            ...damage,
            position,
        }));
    }, [position]);

    React.useEffect(() => {
        if (editQueueContext.state.addToQueueStatus === "success") {
            setTimeout(() => {
                // Remove confirmation
                if ("dispatch" in editQueueContext) {
                    editQueueContext.dispatch({ type: "resetEditQueueAdd" });
                }
                // Reset form to default values
                setDamage(getDefaultDamageState(classifiers));
                // Update position
                fetchPosition();
            }, 3000);
        }
    }, [fetchPosition, classifiers, editQueueContext]);

    if (editQueueContext.state.status === "loading") {
        return <></>;
    }

    function onNotesChange(notes: string) {
        setDamage((damage) => ({
            ...damage,
            notes,
        }));
    }

    function onTypeChange(type: string) {
        setDamage((damage) => ({
            ...damage,
            type: Number(type),
        }));
    }

    function onLandChange(update: (landDamage: LandDamageState) => LandDamageState) {
        setDamage((damage) => ({
            ...damage,
            land: update(damage.land),
        }));
    }

    function onForestChange(update: (damage: ForestDamageState) => ForestDamageState) {
        setDamage((damage) => ({
            ...damage,
            forest: update(damage.forest),
        }));
    }

    function onInfrastructureChange(update: Partial<InfrastructureDamageState>) {
        setDamage((damage) => ({
            ...damage,
            infrastructure: { ...damage.infrastructure, ...update },
        }));
    }

    function onPhotoChange(photo?: PhotoReference) {
        setDamage((damage) => ({
            ...damage,
            photo,
        }));
    }

    function onSubmit() {
        if (!("dispatch" in editQueueContext)) {
            return;
        }

        const edits = getDamageEdits(damage, classifiers);
        const typeTitle = damageTypeClassifiers.find((damageType) => damageType.id === damage.type)?.description[
            i18n.language
        ];
        const editQueueEntry: EditQueueEntry = {
            title: typeTitle ?? t("damage.title"),
            icon: configuration.damage.typeIcons[damage.type as DamageType],
            state: { status: "pending" },
            edits,
            photo: damage.photo,
        };
        editQueueContext.dispatch({ type: "addEditToQueue", editQueueEntry });
    }

    const isSaveEnabled = isDamageValid(damage, classifiers);

    return (
        <div className="damage">
            <div className="damage__header">
                <TitleBar title={t("damage.title")} position={damage.position} onFetchPosition={fetchPosition} />

                <CurrentPosition positionResult={positionResult} />

                <div className="damage__header__fields">
                    <TextInput id="notes" label={t("damage.notes")} value={damage.notes} onChange={onNotesChange} />

                    <Label>{t("damage.type")}</Label>
                    <RadioButtonGroup
                        name="damageType"
                        className="type"
                        value={damage.type?.toString() ?? ""}
                        onChange={onTypeChange}
                    >
                        {damageTypeClassifiers.map(({ id, description }) => (
                            <RadioButton key={`damageType-${id}`} value={String(id)}>
                                <Icon name={configuration.damage.typeIcons[id as DamageType] ?? "cross"} />
                                <span>{description[i18n.language]}</span>
                            </RadioButton>
                        ))}
                    </RadioButtonGroup>
                </div>
            </div>

            <div className="damage__content">
                {damage.type === DamageType.AgriculturalLand && (
                    <LandDamage damage={damage.land} onChange={onLandChange} />
                )}

                {damage.type === DamageType.Forest && <ForestDamage damage={damage.forest} onChange={onForestChange} />}

                {damage.type === DamageType.Infrastructure && (
                    <InfrastructureDamage damage={damage.infrastructure} onChange={onInfrastructureChange} />
                )}
            </div>

            {damage.type && (
                <div className="damage__footer">
                    <Label>{t("damage.photo")}</Label>
                    <Photo photo={damage.photo} onPhotoChange={onPhotoChange} />

                    <Button className="damage__footer__submit" onClick={onSubmit} disabled={!isSaveEnabled}>
                        {t("damage.saveAndSend")}
                    </Button>
                </div>
            )}

            {editQueueContext.state.addToQueueStatus === "loading" && <LoadingActive />}

            {editQueueContext.state.addToQueueStatus === "success" && (
                <LoadingSuccess title={t("editQueue.add.success")} />
            )}
        </div>
    );
}
