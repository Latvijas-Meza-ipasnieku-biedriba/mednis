import { ObservationsState } from "./Observations";
import { ObservationType, ObservedSigns, Species } from "../../types/classifiers";
import { Edit, Feature, FeatureLayer, DirectlyObservedAnimalsObservationAttributes, Geometry } from "../../types/edit";
import { getDefaultAttributeBase } from "../../utils/editAttributes";

export function getObservationEdits(observations: ObservationsState): Edit[] {
    if (observations.type === ObservationType.DirectlyObservedAnimals) {
        return getDirectlyObservedAnimalsObservationEdits(observations);
    }

    if (observations.type === ObservationType.SignsOfPresence) {
        return getSignsOfPresenceObservationEdits(observations);
    }

    if (observations.type === ObservationType.Dead) {
        return getDeadObservationEdits(observations);
    }

    throw new Error(`Unknown observations type: ${observations.type}`);
}

function getDirectlyObservedAnimalsObservationEdits(observations: ObservationsState): Edit[] {
    const edits: Edit[] = [];

    const features: Feature<DirectlyObservedAnimalsObservationAttributes>[] = observations.animals.map((animal) => {
        const diseaseSignIds: number[] = [];
        let diseaseSignNotes = "";

        if (animal.observedSignsOfDisease) {
            for (const [id, checked] of Object.entries(animal.signsOfDisease)) {
                if (checked) {
                    diseaseSignIds.push(Number(id));
                }
            }

            diseaseSignNotes = animal.notesOnDiseases;
        }

        const feature: Feature<DirectlyObservedAnimalsObservationAttributes> = {
            geometry: getObservationsGeometry(observations),
            attributes: {
                notes: observations.notes,
                speciesId: getObservationsSpeciesId(observations),
                genderId: animal.gender ?? 0,
                ageId: animal.age ?? 0,
                count: animal.count,
                diseaseSignIds,
                diseaseSignNotes,
                ...getDefaultAttributeBase(),
            },
        };

        return feature;
    });

    edits.push({
        id: FeatureLayer.DirectlyObservedAnimalsObservation,
        adds: features,
    });

    return edits;
}

function getSignsOfPresenceObservationEdits(observations: ObservationsState): Edit[] {
    const edits: Edit[] = [];
    const observedSignIds: number[] = [];

    for (const [id, checked] of Object.entries(observations.signsOfPresence.observedSigns)) {
        if (checked) {
            observedSignIds.push(Number(id));
        }
    }

    let observedSignNotes = "";
    const isOtherObservedSignChecked = observations.signsOfPresence.observedSigns[ObservedSigns.Other];
    if (isOtherObservedSignChecked) {
        observedSignNotes = observations.signsOfPresence.observedSignsNotes;
    }

    edits.push({
        id: FeatureLayer.SignsOfPresenceObservation,
        adds: [
            {
                geometry: getObservationsGeometry(observations),
                attributes: {
                    notes: observations.notes,
                    speciesId: getObservationsSpeciesId(observations),
                    observedSignIds,
                    observedSignNotes,
                    count: observations.signsOfPresence.count,
                    ...getDefaultAttributeBase(),
                },
            },
        ],
    });

    return edits;
}

function getDeadObservationEdits(observations: ObservationsState): Edit[] {
    const edits: Edit[] = [];

    const diseaseSignIds: number[] = [];
    let diseaseSignNotes = "";

    if (observations.deadAnimals.observedSignsOfDisease) {
        for (const [id, checked] of Object.entries(observations.deadAnimals.signsOfDisease)) {
            if (checked) {
                diseaseSignIds.push(Number(id));
            }
        }

        diseaseSignNotes = observations.deadAnimals.notesOnDiseases;
    }

    edits.push({
        id: FeatureLayer.DeadObservation,
        adds: [
            {
                geometry: getObservationsGeometry(observations),
                attributes: {
                    notes: observations.notes,
                    speciesId: getObservationsSpeciesId(observations),
                    genderId: observations.deadAnimals.gender ?? 0,
                    deathTypeId: observations.deadAnimals.deathType ?? 0,
                    ageId: observations.deadAnimals.age ?? 0,
                    count: observations.deadAnimals.count,
                    diseaseSignIds,
                    diseaseSignNotes,
                    ...getDefaultAttributeBase(),
                },
            },
        ],
    });

    return edits;
}

function getObservationsGeometry(observations: ObservationsState): Geometry {
    return {
        x: observations.position?.lng ?? 0,
        y: observations.position?.lat ?? 0,
    };
}

function getObservationsSpeciesId(observations: ObservationsState): number {
    let speciesId = observations.species;
    if (speciesId === Species.OtherMammals) {
        speciesId = observations.otherMammals;
    } else if (speciesId === Species.Birds) {
        speciesId = observations.birds;
    }

    return speciesId ?? 0;
}
