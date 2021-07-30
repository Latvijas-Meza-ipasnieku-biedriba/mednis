import * as React from "react";
import { useTranslation } from "react-i18next";
import { Collapsible, CollapsibleItem } from "../../components/Collapsible";
import { InjuredAnimalList, LimitedPreyList, UnlimitedPreyList } from "./PreyList";
import { Page, PageContent, PageHeader } from "../../components/Page";
import { useSpeciesContext } from "../../hooks/useSpecies";
import { useInjuredAnimalPermits } from "../../hooks/useInjuredAnimalPermits";

export function RegisterPrey() {
    const { t } = useTranslation();
    const speciesContext = useSpeciesContext();
    const injuredAnimalPermits = useInjuredAnimalPermits();

    return (
        <Page>
            <PageHeader title={t("hunt.registerPrey")} />
            <PageContent className="register-prey">
                <Collapsible>
                    {injuredAnimalPermits.length > 0 ? (
                        <CollapsibleItem title={t("hunt.injuredAnimals")} badgeCount={injuredAnimalPermits.length}>
                            <InjuredAnimalList species={speciesContext.limitedSpecies} />
                        </CollapsibleItem>
                    ) : null}
                    <CollapsibleItem title={t("hunt.limitedSpecies")} className="collapsible-item--limited-prey-list">
                        <LimitedPreyList species={speciesContext.limitedSpecies} type="species" />
                    </CollapsibleItem>
                    <CollapsibleItem title={t("hunt.unlimitedSpecies")}>
                        <UnlimitedPreyList species={speciesContext.unlimitedSpecies} />
                    </CollapsibleItem>
                </Collapsible>
            </PageContent>
        </Page>
    );
}
