import { UnlimitedPreyState } from "./UnlimitedPreyForm";
import { Edit, Feature, FeatureLayer, Geometry, UnlimitedHuntReportAttributes } from "../../types/edit";
import { getDefaultAttributeBase } from "../../utils/editAttributes";

export function getUnlimitedPreyEdits(unlimitedPrey: UnlimitedPreyState): Edit[] {
    const feature: Feature<UnlimitedHuntReportAttributes> = {
        geometry: getUnlimitedPreyGeometry(unlimitedPrey),
        attributes: {
            notes: unlimitedPrey.notes,
            speciesId: Number(unlimitedPrey.species),
            diseaseSigns: unlimitedPrey.observedSignsOfDisease,
            count: unlimitedPrey.count,
            reportGuid: unlimitedPrey.reportGuid,
            ...getDefaultAttributeBase(),
        },
    };

    return [{ id: FeatureLayer.UnlimitedHuntReport, adds: [feature] }];
}

function getUnlimitedPreyGeometry(unlimitedPrey: UnlimitedPreyState): Geometry {
    return {
        x: unlimitedPrey.position?.lng ?? 0,
        y: unlimitedPrey.position?.lat ?? 0,
    };
}
