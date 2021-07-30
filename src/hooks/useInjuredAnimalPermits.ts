import React from "react";
import { HuntedType } from "../types/classifiers";
import { Permit, StrapStatus } from "../types/permits";
import { useHunterContext } from "./useHunterContext";
import { usePermitsContext } from "./usePermitsContext";

export function useInjuredAnimalPermits(): Permit[] {
    const permitContext = usePermitsContext();
    const hunterContext = useHunterContext();

    const districtId = hunterContext.hunterConfig.selectedDistrict;
    const injuredPermits = districtId ? getInjuredAnimalPermits(permitContext, districtId) : [];
    return injuredPermits;
}

function isInjuredAnimalPermit(permit: Permit, districtId?: number) {
    if (permit.strapStatusId !== StrapStatus.Used) {
        return false;
    }

    if (!permit.isReportEditingEnabled) {
        return false;
    }

    if (!permit.isPaid) {
        return false;
    }

    if (permit.huntedTypeId !== HuntedType.Injured) {
        return false;
    }

    const currentDate = new Date();
    if (permit.validFrom && new Date(permit.validFrom) > currentDate) {
        return false;
    }

    if (permit.validTo && new Date(permit.validTo) < currentDate) {
        return false;
    }

    if (districtId && !permit.isValidForAllDistricts) {
        if (permit.huntingDistrictId !== districtId) {
            return false;
        }
    }

    return true;
}

function getInjuredAnimalPermits(permits: Permit[], districtId?: number) {
    return permits.filter((permit) => isInjuredAnimalPermit(permit, districtId));
}
