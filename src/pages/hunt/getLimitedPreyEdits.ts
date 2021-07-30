import { LimitedPreyState } from "./LimitedPreyForm";
import { Edit, Feature, FeatureLayer, Geometry, LimitedHuntReportAttributes } from "../../types/edit";
import { HuntedType } from "../../types/classifiers";
import { getDefaultAttributeBase } from "../../utils/editAttributes";

export function getLimitedPreyEdits(limitedPrey: LimitedPreyState, previouslyInjured?: boolean): Edit[] {
    const injuredDate = Number(limitedPrey.type) === HuntedType.Injured ? new Date().toISOString() : undefined;

    const feature: Feature<LimitedHuntReportAttributes> = {
        geometry: getLimitedPreyGeometry(limitedPrey),
        attributes: {
            notes: limitedPrey.notes,
            speciesId: Number(limitedPrey.species),
            genderId: Number(limitedPrey.gender),
            ageId: Number(limitedPrey.age),
            huntTypeId: Number(limitedPrey.type),
            permitId: Number(limitedPrey.permit),
            diseaseSigns: limitedPrey.observedSignsOfDisease,
            usedDate: new Date().toISOString(),
            reportId: limitedPrey.reportId,
            reportGuid: limitedPrey.reportGuid,
            injuredDate,
            huntingDistrictId: limitedPrey.huntingDistrictId,
            hunterCardNumber: !limitedPrey.isHunterForeigner ? limitedPrey.hunterCardNumber : "",
            isHunterForeigner: limitedPrey.isHunterForeigner,
            foreignerPermitNumber: limitedPrey.isHunterForeigner ? limitedPrey.foreignerPermitNumber : "",
            ...getDefaultAttributeBase(),
        },
    };

    const edit: Edit = { id: FeatureLayer.LimitedHuntReport };
    if (previouslyInjured) {
        edit.updates = [feature];
    } else {
        edit.adds = [feature];
    }

    return [edit];
}

function getLimitedPreyGeometry(limitedPrey: LimitedPreyState): Geometry {
    return {
        x: limitedPrey.position?.lng ?? 0,
        y: limitedPrey.position?.lat ?? 0,
    };
}
