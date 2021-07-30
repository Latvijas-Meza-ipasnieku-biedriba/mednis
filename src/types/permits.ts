import { HuntedType, PermitTypeClassifierOption } from "./classifiers";

export interface Permit {
    isFullSeason: boolean;
    isPaid: boolean;
    strapNumber: string;
    validFrom: string;
    validTo: string;
    value: number;
    strapStatusId: StrapStatus;
    permitType: PermitTypeClassifierOption;
    huntedTypeId: HuntedType;
    permitAllowanceId: number;
    injuredDate: string;
    isReportEditingEnabled?: boolean;
    huntingDistrictId: number;
    injuredByCurrentUser?: boolean;
    reportId?: string;
    reportGuid?: string;
    isStrapNumberAssigned: boolean;
    isValidForAllDistricts: boolean;
}

export enum PermitFilterType {
    Issued = "issued",
}

export enum StrapStatus {
    Unused = 1,
    Used = 2,
    Cancelled = 3,
}
