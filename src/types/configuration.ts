import { LatLngBoundsExpression } from "leaflet";
import { IconName } from "../components/Icon";
import {
    Age,
    DamageType,
    DamageVolumeType,
    DeathType,
    Gender,
    InfrastructureDamageType,
    MainAgriculturalLandType,
    MainObservationSpecies,
    ObservationType,
    Species,
} from "./classifiers";
import { MapService, MapServiceGroup } from "./map";
import { MemberRoles } from "./mtl";

interface Option {
    value: string;
    translationKey: string;
}

interface OptionGroup {
    defaultValue?: string;
    options: Option[];
}

interface Count {
    defaultValue: number;
    min: number;
    max?: number;
}

interface ApiConfiguration {
    url: string;
    endpoints: {
        applyEdits: string;
        classifiers: string;
        permits: string;
        profile: string;
        memberships: string;
        roles: string;
        districts: string;
        connectVmd: string;
        features: string;
    };
}

interface OidcConfiguration {
    clientId: string;
    authorizationEndpoint: {
        signIn: string;
        signUp: string;
    };
    tokenEndpoint: {
        signIn: string;
        signUp: string;
    };
    logout: {
        endpoint: string;
        callbackUri: string;
    };
    scope: string;
    callbackUri: string;
}

interface VmdConfiguration {
    authorizationEndpoint: string;
    tokenEndpoint: string;
    callbackUri: string;
}

interface PinConfiguration {
    pinLength: number;
    maxValidationAttemptCount: number;
}

interface SupportConfiguration {
    supportEmail: string;
    termsOfUseUrl: string;
    privacyPolicyUrl: string;
}

interface DamageConfiguration {
    typeIcons: Record<DamageType, IconName>;
    land: {
        typeIcons: Record<MainAgriculturalLandType, IconName>;
        count: Count;
    };
    forest: {
        standProtection: OptionGroup;
        defaultDamageVolumeType?: DamageVolumeType;
        defaultResponsibleSpecies?: Species;
    };
    infrastructure: {
        defaultType?: InfrastructureDamageType;
        defaultResponsibleSpecies?: Species;
    };
}

interface EditQueueConfiguration {
    daysToKeepEntriesFor: number;
}

interface FeaturesConfiguration {
    isVmdAccountConnectFeatureEnabled: boolean;
}

interface HuntConfiguration {
    count: Count;
    speciesIcons: Record<Species, IconName>;
    notValidForInjuredSpecies: Species[];
}

export interface MapConfiguration {
    minZoom: number;
    maxZoom: number;
    initialPosition: {
        center: { lat: number; lng: number };
        zoom: number;
    };
    bounds: LatLngBoundsExpression;
    serviceGroups: MapServiceGroup[];
    services: MapService[];
}

interface MtlConfiguration {
    memberIcons: Record<MemberRoles, IconName>;
    memberRoleSortOrder: Record<MemberRoles, number>;
}

interface ObservationsConfiguration {
    typeIcons: Record<ObservationType, IconName>;
    speciesIcons: Record<MainObservationSpecies, IconName>;
    animals: {
        maxCount: number;
        defaultGender?: Gender;
        defaultAge?: Age;
        count: Count;
    };
    signsOfPresence: {
        count: Count;
    };
    deadAnimals: {
        defaultGender?: Gender;
        defaultDeathType?: DeathType;
        defaultAge?: Age;
        count: Count;
    };
}

export interface Configuration {
    api: ApiConfiguration;
    oidc: OidcConfiguration;
    vmd: VmdConfiguration;
    pin: PinConfiguration;
    support: SupportConfiguration;
    damage: DamageConfiguration;
    editQueue: EditQueueConfiguration;
    features: FeaturesConfiguration;
    hunt: HuntConfiguration;
    map: MapConfiguration;
    mtl: MtlConfiguration;
    observations: ObservationsConfiguration;
}
