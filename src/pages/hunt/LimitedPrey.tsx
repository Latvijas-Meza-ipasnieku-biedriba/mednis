import * as React from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { LimitedPreyForm } from "./LimitedPreyForm";
import { LimitedPreySubspecies } from "./LimitedPreySubspecies";
import { useSpeciesContext } from "../../hooks/useSpecies";

export function LimitedPrey() {
    const { i18n } = useTranslation();
    const params = useParams<{ species: string; subspecies?: string; permit?: string }>();
    const history = useHistory();
    const speciesContext = useSpeciesContext();

    let limitedSpecies = speciesContext.limitedSpecies?.find((species) => species.id === Number(params.species));
    if (params.subspecies) {
        limitedSpecies = limitedSpecies?.subspecies?.find(
            (species) => species.permitTypeId === Number(params.subspecies)
        );
    }

    React.useEffect(() => {
        if (!limitedSpecies) {
            history.goBack();
        }
    }, [limitedSpecies, history]);

    if (!limitedSpecies) {
        return null;
    }

    const title = limitedSpecies?.description ? limitedSpecies.description[i18n.language] : "";

    if (params.permit) {
        return <LimitedPreyForm title={title} species={limitedSpecies} permitId={params.permit} />;
    }

    if (limitedSpecies?.subspecies) {
        const subspecies = speciesContext.limitedSpecies?.find((species) => species.id === Number(params.species))
            ?.subspecies;

        return <LimitedPreySubspecies title={title} subspecies={subspecies ?? []} />;
    }

    return <LimitedPreyForm title={title} species={limitedSpecies} />;
}
