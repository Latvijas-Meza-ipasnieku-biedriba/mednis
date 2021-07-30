import * as React from "react";
import { useTranslation } from "react-i18next";
import { Animals, AnimalsState } from "./Animals";
import { getDefaultAnimalsItemState } from "./AnimalsItem";
import { Button } from "../../components/Button";
import { CurrentPosition } from "../../components/CurrentPosition";
import { Dead, DeadAnimalsState } from "./DeadAnimals";
import { Label } from "../../components/Typography";
import { LoadingActive, LoadingSuccess } from "../../components/Loading";
import { ObservationsSpecies } from "./ObservationsSpecies";
import { ObservationsType } from "./ObservationsType";
import { Photo } from "../../components/photo/Photo";
import { SignsOfPresence, SignsOfPresenceState } from "./SignsOfPresence";
import { TextInput } from "../../components/TextInput";
import { TitleBar } from "../../components/TitleBar";
import { isObservationsStateValid } from "./Validation";
import { useClassifiersContext } from "../../hooks/useClassifiersContext";
import { useCurrentPosition } from "../../hooks/useCurrentPosition";
import { getObservationEdits } from "./getObservationEdits";
import { Classifiers, ObservationType, Species } from "../../types/classifiers";
import { EditQueueEntry, useEditQueueContext } from "../../hooks/useEditQueue";
import { getObservationSpecies } from "../../utils/filterClassifiers";
import { PhotoReference } from "../../types/photo";
import { configuration } from "../../configuration";
import "./Observations.scss";

function getDefaultObservationsState(classifiers: Classifiers): ObservationsState {
    return {
        notes: "",
        animals: [getDefaultAnimalsItemState(classifiers)],
        signsOfPresence: {
            observedSigns: {},
            observedSignsNotes: "",
            count: configuration.observations.signsOfPresence.count.defaultValue,
        },
        deadAnimals: {
            gender: classifiers.gender.defaultValue ?? configuration.observations.deadAnimals.defaultGender,
            deathType: classifiers.deathType.defaultValue ?? configuration.observations.deadAnimals.defaultDeathType,
            age: classifiers.age.defaultValue ?? configuration.observations.deadAnimals.defaultAge,
            count: configuration.observations.deadAnimals.count.defaultValue ?? 1,
            observedSignsOfDisease: false,
            signsOfDisease: {},
            notesOnDiseases: "",
        },
    };
}

export interface ObservationsState {
    position?: { lat: number; lng: number };
    notes: string;
    type?: number;
    species?: number;
    otherMammals?: number;
    birds?: number;
    animals: AnimalsState;
    signsOfPresence: SignsOfPresenceState;
    deadAnimals: DeadAnimalsState;
    photo?: PhotoReference;
}

export function Observations() {
    const { t, i18n } = useTranslation();
    const classifiers = useClassifiersContext();
    const editQueueContext = useEditQueueContext();
    const [observations, setObservations] = React.useState<ObservationsState>(() =>
        getDefaultObservationsState(classifiers)
    );

    const positionResult = useCurrentPosition();
    const { position, fetchPosition } = positionResult;

    React.useEffect(() => {
        setObservations((observations) => ({
            ...observations,
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
                setObservations(getDefaultObservationsState(classifiers));
                // Update position
                fetchPosition();
            }, 3000);
        }
    }, [fetchPosition, classifiers, editQueueContext]);

    if (editQueueContext.state.status === "loading") {
        return <></>;
    }

    function onNotesChange(notes: string) {
        setObservations((observations) => ({
            ...observations,
            notes,
        }));
    }

    function onTypeChange(type: number) {
        setObservations((observations) => ({
            ...observations,
            type,
        }));
    }

    function onSpeciesChange(species: number) {
        setObservations((observations) => ({
            ...observations,
            species,
        }));
    }

    function onOtherMammalsChange(otherMammals: number) {
        setObservations((observations) => ({
            ...observations,
            otherMammals,
        }));
    }

    function onBirdsChange(birds: number) {
        setObservations((observations) => ({
            ...observations,
            birds,
        }));
    }

    function onAnimalsChange(update: (animals: AnimalsState) => AnimalsState) {
        setObservations((observations) => ({
            ...observations,
            animals: update(observations.animals),
        }));
    }

    function onSignsOfPresenceChange(update: (signsOfPresence: SignsOfPresenceState) => SignsOfPresenceState) {
        setObservations((observations) => ({
            ...observations,
            signsOfPresence: update(observations.signsOfPresence),
        }));
    }

    function onDeadAnimalsChange(update: (deadAnimals: DeadAnimalsState) => DeadAnimalsState) {
        setObservations((observations) => ({
            ...observations,
            deadAnimals: update(observations.deadAnimals),
        }));
    }

    function onPhotoChange(photo?: PhotoReference) {
        setObservations((observations) => ({
            ...observations,
            photo,
        }));
    }

    function onSubmit() {
        if (!("dispatch" in editQueueContext)) {
            return;
        }

        const edits = getObservationEdits(observations);
        const typeTitle = classifiers.observationType.options.find(
            (observationType) => observationType.id === observations.type
        )?.description[i18n.language];
        const speciesTitle = getObservationSpecies(classifiers).find((species) => species.id === observations.species)
            ?.description[i18n.language];
        const editQueueEntry: EditQueueEntry = {
            title: `${typeTitle} - ${speciesTitle}`,
            icon: configuration.observations.typeIcons[observations.type as ObservationType],
            state: { status: "pending" },
            edits,
            photo: observations.photo,
        };
        editQueueContext.dispatch({ type: "addEditToQueue", editQueueEntry });
    }

    const isSaveAndSendEnabled = isObservationsStateValid(observations);
    const isContentAndFooterVisible =
        observations.type &&
        observations.species &&
        ((observations.species === Species.OtherMammals && observations.otherMammals) ||
            (observations.species === Species.Birds && observations.birds) ||
            (observations.species !== Species.OtherMammals && observations.species !== Species.Birds));

    return (
        <div className="observations">
            <div className="observations__header">
                <TitleBar
                    title={t("observations.title")}
                    position={observations.position}
                    onFetchPosition={fetchPosition}
                />

                <CurrentPosition positionResult={positionResult} />

                <div className="observations__header__fields">
                    <TextInput
                        id="notes"
                        label={t("observations.notes")}
                        value={observations.notes}
                        onChange={onNotesChange}
                    />

                    <ObservationsType
                        type={observations.type}
                        onChange={onTypeChange}
                        animalsObservationsItemCount={observations.animals.length}
                    />

                    {observations.type && (
                        <ObservationsSpecies
                            species={observations.species}
                            onSpeciesChange={onSpeciesChange}
                            otherMammals={observations.otherMammals}
                            onOtherMammalsChange={onOtherMammalsChange}
                            birds={observations.birds}
                            onBirdsChange={onBirdsChange}
                        />
                    )}
                </div>
            </div>

            {isContentAndFooterVisible && (
                <>
                    <div className="observations__content">
                        {observations.type === ObservationType.DirectlyObservedAnimals && (
                            <Animals animals={observations.animals} onChange={onAnimalsChange} />
                        )}

                        {observations.type === ObservationType.SignsOfPresence && (
                            <SignsOfPresence
                                signsOfPresence={observations.signsOfPresence}
                                onChange={onSignsOfPresenceChange}
                            />
                        )}

                        {observations.type === ObservationType.Dead && (
                            <Dead deadAnimals={observations.deadAnimals} onChange={onDeadAnimalsChange} />
                        )}
                    </div>

                    <div className="observations__footer">
                        <Label>{t("observations.photo")}</Label>
                        <Photo photo={observations.photo} onPhotoChange={onPhotoChange} />

                        <Button
                            className="observations__footer__submit"
                            disabled={!isSaveAndSendEnabled}
                            onClick={onSubmit}
                        >
                            {t("observations.saveAndSend")}
                        </Button>
                    </div>
                </>
            )}

            {editQueueContext.state.addToQueueStatus === "loading" && <LoadingActive />}

            {editQueueContext.state.addToQueueStatus === "success" && (
                <LoadingSuccess title={t("editQueue.add.success")} />
            )}
        </div>
    );
}
