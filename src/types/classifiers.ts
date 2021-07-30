export interface ClassifierOption {
    id: number;
    description: { lv: string; en: string; ru: string; [language: string]: string };
    activeFrom?: string;
    activeTo?: string;
    modifiedDate?: string;
    code?: string;
    vmdCode?: string;
}

export interface SpeciesClassifierOption extends ClassifierOption {
    isMainGroupObservation?: boolean;
    isMammal?: boolean;
    doesDamageBees?: boolean;
    doesDamageCrops?: boolean;
    doesDamageForest?: boolean;
    doesDamageInfrastructure?: boolean;
    doesDamageLivestock?: boolean;
    doesDamagePoultry?: boolean;
    listOrderObservation?: number;
    isLimited?: boolean;
    isMainGroupHunt?: boolean;
    listOrderHunt?: number;
    subspeciesOf?: string;
}

export interface PermitTypeClassifierOption extends ClassifierOption {
    seasonEndMonth: number;
    seasonEndDay: number;
    seasonStartDay: number;
    seasonStartMonth: number;
    species: SpeciesClassifierOption;
}

export interface PermitAllowanceClassifierOption extends ClassifierOption {
    permitTypeId: number;
    genderId: number;
    ageId: number;
    isValidForKilled: boolean;
    isComplex?: boolean;
    isDefault?: boolean;
}

export interface HuntingSeasonClassifierOption extends ClassifierOption {
    speciesId: number;
    seasonStartDay: number;
    seasonStartMonth: number;
    seasonEndDay: number;
    seasonEndMonth: number;
}

export interface AgriculturalLandTypeClassifierOption extends ClassifierOption {
    isMainType?: boolean;
    isCountable?: boolean;
}

interface TreeSpeciesClassifierOption extends ClassifierOption {
    isMainGroupDamage: boolean;
    listOrder?: number;
}

interface ErrorMessageClassifierOption extends ClassifierOption {
    isUserFriendly?: boolean;
}

interface Classifier<T = ClassifierOption> {
    defaultValue?: number;
    options: T[];
}

export interface Classifiers {
    age: Classifier;
    agriculturalLandType: Classifier<AgriculturalLandTypeClassifierOption>;
    species: Classifier<SpeciesClassifierOption>;
    damagedAreaType: Classifier;
    damageType: Classifier;
    damageVolumeType: Classifier;
    deathType: Classifier;
    signsOfDisease: Classifier;
    forestDamageType: Classifier;
    gender: Classifier;
    huntedType: Classifier<ClassifierOption>;
    infrastructureType: Classifier;
    observationType: Classifier;
    observedSigns: Classifier;
    treeSpecies: Classifier<TreeSpeciesClassifierOption>;
    dogBreeds: Classifier;
    dogSubBreeds: Classifier;
    huntersCardTypes: Classifier;
    huntingSeasons: Classifier<HuntingSeasonClassifierOption>;
    permitAllowances: Classifier<PermitAllowanceClassifierOption>;
    permitTypes: Classifier<PermitTypeClassifierOption>;
    strapStatuses: Classifier;
    errorMessages: Classifier<ErrorMessageClassifierOption>;
}

export enum ObservationType {
    DirectlyObservedAnimals = 1,
    SignsOfPresence = 2,
    Dead = 3,
}

export enum Species {
    Moose = 1,
    RedDeer = 2,
    RoeDeer = 3,
    WildBoar = 4,
    Lynx = 5,
    Wolf = 6,
    WesternCapercaillie = 7,
    BlackGrouse = 8,
    Fox = 9,
    Raccoon = 10,
    Beaver = 11,
    Badger = 12,
    Hare = 13,
    EuropeanHare = 14,
    MountainHare = 15,
    Marten = 16,
    EuropeanPineMarten = 17,
    BeechMarten = 18,
    Polecat = 19,
    AmericanMink = 20,
    RaccoonDog = 21,
    Muskrat = 22,
    FallowDeer = 23,
    Mouflon = 24,
    SikaDeer = 25,
    Nutria = 26,
    BobakMarmot = 27,
    GoldenJackal = 28,
    Bear = 29,
    OtherMammals = 30,
    Birds = 31,
    HazelGrouse = 32,
    Rackelhahn = 33,
    Pheasant = 34,
    CommonWoodPigeon = 35,
    DomesticPigeon = 36,
    EurasianWoodcock = 37,
    HoodedCrow = 38,
    EurasianMagpie = 39,
    BeanGoose = 40,
    GreaterWhiteFrontedGoose = 41,
    CanadaGoose = 42,
    GreylagGoose = 43,
    EurasianCoot = 44,
    EurasianTeal = 45,
    Gadwall = 46,
    NorthernShoveler = 47,
    Mallard = 48,
    Garganey = 49,
    EurasianWigeon = 50,
    NorthernPintail = 51,
    TuftedDuck = 52,
    GreaterScaup = 53,
    CommonScoter = 54,
    CommonGoldeneye = 55,
    Other = 56,
}

export type MainObservationSpecies =
    | Species.Moose
    | Species.RedDeer
    | Species.RoeDeer
    | Species.WildBoar
    | Species.Lynx
    | Species.Wolf
    | Species.Beaver
    | Species.EuropeanPineMarten
    | Species.OtherMammals
    | Species.Birds;

export enum Gender {
    Male = 1,
    Female = 2,
    Unspecified = 3,
}

export enum Age {
    LessThanOneYear = 1,
    Young = 2,
    MiddleAged = 3,
    Old = 4,
    Unspecified = 5,
}

export enum ObservedSigns {
    Footprints = 1,
    Excrement = 2,
    LairOrNest = 3,
    Reproduction = 4,
    Other = 5,
}

export enum DeathType {
    HitByAVehicle = 1,
    Died = 2,
    FallenPreyToPredators = 3,
}

export enum SignOfDisease {
    CoordinationDisordersAlteredGait = 1,
    InadequateReactionToSoundsHumans = 2,
    InjuriesFracturesLameness = 3,
    CoughingSneezing = 4,
    FurSkin = 5,
    SalivationDiarrhoeaDischarge = 6,
}

export enum DamageType {
    AgriculturalLand = 1,
    Forest = 2,
    Infrastructure = 3,
}

export enum AgriculturalLandType {
    Cropping = 1,
    Livestock = 2,
    Beekeeping = 3,
    Poultry = 4,
    Other = 5,
}

export type MainAgriculturalLandType =
    | AgriculturalLandType.Cropping
    | AgriculturalLandType.Livestock
    | AgriculturalLandType.Other;

export enum TreeSpecies {
    Pine = 1,
    Other = 2,
    Spruce = 3,
    Birch = 4,
    BlackAlder = 6,
    Aspen = 8,
    WhiteAlder = 9,
    // ... other species without EN translation
}

export enum DamageVolumeType {
    LessThanFivePercent = 1,
    MoreThanFivePercent = 2,
}

export enum ForestDamageType {
    TreetopBittenOffOrBroken = 1,
    TreesGnawed = 2,
    FrayedBark = 3,
    FeedingOnShoots = 4,
    FloodedForestStand = 5,
}

export enum InfrastructureDamageType {
    Road = 1,
    MeliorationSystem = 2,
    Other = 3,
}

export enum HuntedType {
    Hunted = 1,
    Injured = 2,
}

export enum HunterCardType {
    Hunter = 1,
    HuntManager = 2,
    Season = 3,
}

export enum Errors {
    RequestAlreadyProcessed = 5701,
}
