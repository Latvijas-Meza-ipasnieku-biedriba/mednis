import React from "react";
import { Permit, StrapStatus } from "../types/permits";
import { useHunterContext } from "./useHunterContext";
import { usePermitsContext } from "./usePermitsContext";

export function useValidPermits(): Permit[] {
    const permitContext = usePermitsContext();
    const hunterContext = useHunterContext();

    const districtId = hunterContext.hunterConfig.selectedDistrict;
    const validPermits = React.useMemo(() => {
        return districtId ? getValidPermits(permitContext, districtId) : [];
    }, [permitContext, districtId]);

    return validPermits;
}

function isPermitValid(permit: Permit, districtId?: number) {
    if (permit.strapStatusId !== StrapStatus.Unused || !permit.isPaid) {
        return false;
    }

    if (!permit.isReportEditingEnabled) {
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

export function getValidPermits(permits: Permit[], districtId?: number) {
    return permits.filter((permit) => isPermitValid(permit, districtId));
}
