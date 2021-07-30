export enum FeatureLayer {
    DirectlyObservedAnimalsObservation = 1,
    SignsOfPresenceObservation,
    DeadObservation,
    AgriculturalLandDamage,
    ForestDamage,
    InfrastructureDamage,
    UnlimitedHuntReport,
    LimitedHuntReport,
}

export interface Geometry {
    /**
     * Longitude
     */
    x: number;
    /**
     * Latitude
     */
    y: number;
}

export interface Feature<T> {
    geometry?: Geometry;
    attributes: T;
}

export interface AttributeBase {
    guid: string;
    reportCreated: string;
}

export interface DirectlyObservedAnimalsObservationAttributes extends AttributeBase {
    notes: string;
    speciesId: number;
    genderId: number;
    ageId: number;
    count: number;
    diseaseSignIds: number[];
    diseaseSignNotes: string;
}

export interface SignsOfPresenceObservationAttributes extends AttributeBase {
    notes: string;
    speciesId: number;
    observedSignIds: number[];
    observedSignNotes: string;
    count: number;
}

export interface DeadObservationAttributes extends AttributeBase {
    notes: string;
    speciesId: number;
    genderId: number;
    deathTypeId: number;
    ageId: number;
    count: number;
    diseaseSignIds: number[];
    diseaseSignNotes: string;
}

export interface AgriculturalLandDamageAttributes extends AttributeBase {
    notes: string;
    agriculturalLandTypeId: number;
    speciesId: number;
    otherSpecies: string;
    count?: number;
    damagedArea?: number;
}

export interface ForestDamageAttributes extends AttributeBase {
    notes: string;
    damagedArea: number;
    forestProtectionDone: boolean;
    damagedTreeSpeciesIds: number[];
    damageVolumeTypeId: number;
    responsibleAnimalSpeciesId: number;
    otherResponsibleAnimalSpecies: string;
    damageTypeIds: number[];
}

export interface InfrastructureDamageAttributes extends AttributeBase {
    notes: string;
    infrastructureTypeId: number;
    otherInfrastructureType: string;
    responsibleAnimalSpeciesId: number;
    otherResponsibleAnimalSpecies: string;
}

export interface LimitedHuntReportAttributes extends AttributeBase {
    notes: string;
    speciesId: number;
    huntTypeId: number;
    genderId: number;
    ageId: number;
    permitId: number;
    diseaseSigns: boolean;
    usedDate: string;
    injuredDate?: string;
    reportId?: string;
    reportGuid: string;
    huntingDistrictId: number;
    hunterCardNumber: string;
    isHunterForeigner: boolean;
    foreignerPermitNumber: string;
}

export interface UnlimitedHuntReportAttributes extends AttributeBase {
    notes: string;
    speciesId: number;
    diseaseSigns: boolean;
    count: number;
    reportGuid: string;
}

interface EditBase<T, U> {
    id: T;
    adds?: Feature<U>[];
    updates?: Feature<U>[];
    // deletes?: number<U>[]; // TODO
}

export interface EditResponse {
    id: number;
    error?: EditResponseError;
}

export interface EditResponseError {
    code: number;
    description: string;
}

export type Edit =
    | EditBase<FeatureLayer.DirectlyObservedAnimalsObservation, DirectlyObservedAnimalsObservationAttributes>
    | EditBase<FeatureLayer.SignsOfPresenceObservation, SignsOfPresenceObservationAttributes>
    | EditBase<FeatureLayer.DeadObservation, DeadObservationAttributes>
    | EditBase<FeatureLayer.AgriculturalLandDamage, AgriculturalLandDamageAttributes>
    | EditBase<FeatureLayer.ForestDamage, ForestDamageAttributes>
    | EditBase<FeatureLayer.InfrastructureDamage, InfrastructureDamageAttributes>
    | EditBase<FeatureLayer.LimitedHuntReport, LimitedHuntReportAttributes>
    | EditBase<FeatureLayer.UnlimitedHuntReport, UnlimitedHuntReportAttributes>;
