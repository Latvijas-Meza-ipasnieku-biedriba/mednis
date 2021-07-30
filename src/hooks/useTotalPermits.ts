import React from "react";
import { Permit } from "../types/permits";
import { useHunterContext } from "./useHunterContext";
import { usePermitsContext } from "./usePermitsContext";

export function useTotalPermits(): Permit[] {
    const permitContext = usePermitsContext();
    const hunterContext = useHunterContext();

    const districtId = hunterContext.hunterConfig.selectedDistrict;
    const totalPermits = React.useMemo(() => {
        return districtId
            ? permitContext.filter((permit) => permit.isValidForAllDistricts || permit.huntingDistrictId === districtId)
            : [];
    }, [permitContext, districtId]);

    return totalPermits;
}
