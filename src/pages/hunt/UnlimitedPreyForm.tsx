import * as React from "react";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { Button } from "../../components/Button";
import { Checkbox } from "../../components/Checkbox";
import { CurrentPosition } from "../../components/CurrentPosition";
import { Label } from "../../components/Typography";
import { LoadingActive, LoadingSuccess } from "../../components/Loading";
import { Page, PageContent, PageHeader } from "../../components/Page";
import { Photo } from "../../components/photo/Photo";
import { ReadOnlyInput } from "../../components/ReadOnlyInput";
import { Select, SelectOption } from "../../components/Select";
import { Stepper } from "../../components/Stepper";
import { TextInput } from "../../components/TextInput";
import { useCurrentPosition } from "../../hooks/useCurrentPosition";
import { isUnlimitedPreyValid } from "./Validation";
import { useSpeciesContext } from "../../hooks/useSpecies";
import { getUnlimitedPreyEdits } from "./getUnlimitedPreyEdits";
import { EditQueueEntry, useEditQueueContext } from "../../hooks/useEditQueue";
import { Species } from "../../types/classifiers";
import { PhotoReference } from "../../types/photo";
import { configuration } from "../../configuration";
import "./UnlimitedPreyForm.scss";

export interface UnlimitedPreyState {
    position?: { lat: number; lng: number };
    species: string;
    subspecies: string;
    count: number;
    notes: string;
    photo?: PhotoReference;
    observedSignsOfDisease: boolean;
    reportGuid: string;
}

export function UnlimitedPreyForm() {
    const { t, i18n } = useTranslation();
    const params = useParams<{ species: string }>();
    const history = useHistory();
    const editQueueContext = useEditQueueContext();

    const [unlimitedPrey, setUnlimitedPrey] = React.useState<UnlimitedPreyState>({
        species: String(params.species),
        subspecies: "",
        count: configuration.hunt.count.defaultValue,
        notes: "",
        observedSignsOfDisease: false,
        reportGuid: uuid(),
    });

    const speciesContext = useSpeciesContext();
    const speciesClassifier = speciesContext.unlimitedSpecies.find(
        (species) => String(species.id) === unlimitedPrey.species
    );

    const positionResult = useCurrentPosition();
    const { position } = positionResult;

    React.useEffect(() => {
        setUnlimitedPrey((unlimitedPrey) => ({
            ...unlimitedPrey,
            position,
        }));
    }, [position]);

    React.useEffect(() => {
        if (editQueueContext.state.addToQueueStatus === "success") {
            setTimeout(() => {
                if ("dispatch" in editQueueContext) {
                    editQueueContext.dispatch({ type: "resetEditQueueAdd" });
                }
                history.goBack();
            }, 3000);
        }
    }, [editQueueContext, history]);

    if (editQueueContext.state.status === "loading") {
        return <></>;
    }

    function onSpeciesChange(species: string) {
        setUnlimitedPrey((unlimitedPrey) => ({ ...unlimitedPrey, subspecies: species }));
    }

    function onCountChange(count: number) {
        setUnlimitedPrey((unlimitedPrey) => ({ ...unlimitedPrey, count }));
    }

    function onNotesChange(notes: string) {
        setUnlimitedPrey((unlimitedPrey) => ({ ...unlimitedPrey, notes }));
    }

    function onPhotoChange(photo?: PhotoReference) {
        setUnlimitedPrey((unlimitedPrey) => ({ ...unlimitedPrey, photo }));
    }

    function onObservedSignsOfDiseaseChange(observedSignsOfDisease: boolean) {
        setUnlimitedPrey((unlimitedPrey) => ({ ...unlimitedPrey, observedSignsOfDisease }));
    }

    function onSubmit() {
        if (!("dispatch" in editQueueContext)) {
            return;
        }

        const edits = getUnlimitedPreyEdits(unlimitedPrey);
        let speciesTitle: string | undefined;
        let subspeciesTitle: string | undefined;
        const speciesFromContext = speciesContext.unlimitedSpecies.find(
            (unlimitedSpecies) => String(unlimitedSpecies.id) === unlimitedPrey.species
        );
        if (unlimitedPrey.subspecies) {
            speciesTitle = speciesFromContext?.subspecies?.find(
                (subspecies) => subspecies.value === unlimitedPrey.subspecies
            )?.label;
        } else {
            subspeciesTitle = speciesFromContext?.description
                ? speciesFromContext?.description[i18n.language]
                : t("hunt.unlimitedSpecies");
        }

        const editQueueEntry: EditQueueEntry = {
            title: `${t("hunt.type.hunted")} - ${subspeciesTitle ?? speciesTitle}`,
            icon: configuration.hunt.speciesIcons[Number(unlimitedPrey.species) as Species],
            state: { status: "pending" },
            edits,
            photo: unlimitedPrey.photo,
        };
        editQueueContext.dispatch({ type: "addEditToQueue", editQueueEntry });
    }

    const locationData = unlimitedPrey.position
        ? `x: ${unlimitedPrey.position.lat.toFixed(5)}, y: ${unlimitedPrey.position.lng.toFixed(5)}`
        : "";

    const submitDisabled = !isUnlimitedPreyValid(unlimitedPrey, speciesClassifier);

    return (
        <>
            <Page className="unlimited-prey-form">
                <PageHeader
                    title={speciesClassifier?.description ? speciesClassifier.description[i18n.language] : ""}
                    showBackButton
                    onBackButtonClick={history.goBack}
                />
                <PageContent>
                    <CurrentPosition positionResult={positionResult} showFetchPositionButtonOnMap />
                    <ReadOnlyInput id="locationData" label={t("hunt.locationData")} value={locationData} />
                    {speciesClassifier?.subspecies && (
                        <>
                            <Label>{t("hunt.species")}</Label>
                            <Select id="species" value={unlimitedPrey.subspecies} onChange={onSpeciesChange}>
                                {speciesClassifier.subspecies.map((subspecies) => (
                                    <SelectOption key={subspecies.value} value={subspecies.value}>
                                        {subspecies.label}
                                    </SelectOption>
                                ))}
                            </Select>
                        </>
                    )}
                    <Label>{t("hunt.count")}</Label>
                    <Stepper
                        value={unlimitedPrey.count}
                        onChange={onCountChange}
                        minValue={configuration.hunt.count.min}
                        maxValue={configuration.hunt.count.max}
                    />
                    <TextInput
                        id="notes"
                        label={t("hunt.notes")}
                        value={unlimitedPrey.notes}
                        onChange={onNotesChange}
                    />
                    <Label>{t("hunt.photo")}</Label>
                    <Photo photo={unlimitedPrey.photo} onPhotoChange={onPhotoChange} mode="camera" />
                    <Checkbox
                        id="observedSignsOfDisease"
                        label={t("hunt.observedSignsOfDisease")}
                        checked={unlimitedPrey.observedSignsOfDisease}
                        onChange={onObservedSignsOfDiseaseChange}
                    />
                    <Button onClick={onSubmit} disabled={submitDisabled}>
                        {t("hunt.submit")}
                    </Button>
                </PageContent>
            </Page>

            {editQueueContext.state.addToQueueStatus === "loading" && <LoadingActive />}

            {editQueueContext.state.addToQueueStatus === "success" && (
                <LoadingSuccess title={t("editQueue.add.success")} />
            )}
        </>
    );
}
