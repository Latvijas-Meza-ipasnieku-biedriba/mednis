import { IconName } from "../components/Icon";

export interface LimitedSpecies {
    id: number;
    permitTypeId: number;
    icon: IconName;
    description?: {
        lv: string;
        en: string;
        ru: string;
        [locale: string]: string;
    };
    term?: string;
    types?: LimitedSpeciesType[];
    subspecies?: Omit<LimitedSpecies, "subspecies">[];
}

export interface LimitedSpeciesType {
    id: number;
    isDefault?: boolean;
    genders?: LimitedSpeciesGender[];
}

export interface LimitedSpeciesGender {
    id: number;
    isDefault?: boolean;
    ages?: LimitedSpeciesGender[];
}

export interface LimitedSpeciesAge {
    id: number;
    isDefault?: boolean;
}

export interface UnlimitedSpecies {
    id: number;
    icon: IconName;
    description?: {
        lv: string;
        en: string;
        ru: string;
        [locale: string]: string;
    };
    term?: string;
    subspecies?: { value: string; label: string }[];
}
