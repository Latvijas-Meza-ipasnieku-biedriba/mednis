import { ClassifierOption } from "./classifiers";
import { PhotoReference } from "./photo";

export interface ProfileConfig {
    huntingDistrictId: number;
}

export interface ProfileBasicInfo {
    firstName: string;
    lastName: string;
    photo: PhotoReference | string | undefined; // Photo used to be stored as a base64 encoded image, remove 'string' after some time
}

export interface Profile {
    id: number;
    vmdId: string;
    validHuntersCardNumber: string;
    validHuntManagerCardNumber: string;
    isHunter: boolean;
    hunterCards: HunterCard[];
    createdOn: string;
    changedOn: string;
    memberships: HuntingMembership[];
}

export interface HunterCard {
    id: number;
    vmdCode: string;
    cardNumber: string;
    cardTypeId: number;
    cardType: ClassifierOption;
    validFrom: string;
    validTo: string;
    createdOn: string;
    changedOn: string;
}

export interface HuntingMembership {
    id: number;
    huntingDistrictId: number;
    huntingDistrict: HuntingDistrict;
    isMember: boolean;
    isHunter: boolean;
    isManager: boolean;
    isAdministrator: boolean;
    isTrustee: boolean;
    createdOn: string;
    changedOn: string;
    createdBy: number;
}

export interface HuntingDistrict {
    id: number;
    code: string;
    vmdCode: string;
    descriptionLv: string;
    trusteeId: number;
    createdOn: string;
}
