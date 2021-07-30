import * as React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Collapsible, CollapsibleItem } from "../../components/Collapsible";
import { Icon } from "../../components/Icon";
import { Page, PageContent, PageHeader } from "../../components/Page";
import { ReadOnlyInput } from "../../components/ReadOnlyInput";
import { reloadPermits } from "../../hooks/usePermitsQuery";
import { useSpeciesContext } from "../../hooks/useSpecies";
import { useProfileContext } from "../../hooks/useProfileContext";
import { useHunterContext } from "../../hooks/useHunterContext";
import { useTotalPermits } from "../../hooks/useTotalPermits";
import { useValidPermits } from "../../hooks/useValidPermits";
import { StrapStatus } from "../../types/permits";
import "./Permits.scss";

export function Permits() {
    const { t, i18n } = useTranslation();
    const history = useHistory();
    const speciesContext = useSpeciesContext();
    const profileContext = useProfileContext();
    const hunterContext = useHunterContext();
    const totalPermits = useTotalPermits();
    const validPermits = useValidPermits();

    const selectedDistrictName = profileContext.memberships.find(
        (membership) => membership.huntingDistrictId === hunterContext.hunterConfig.selectedDistrict
    )?.huntingDistrict.descriptionLv;

    React.useEffect(() => {
        reloadPermits();
    }, []);

    return (
        <Page>
            <PageHeader title={t("mtl.permits")} onBackButtonClick={history.goBack} showBackButton />
            <PageContent className="mtl-permits">
                <div className="selected-district">
                    {selectedDistrictName && (
                        <ReadOnlyInput id="district" label={`${t("mtl.district")}:`} value={selectedDistrictName} />
                    )}
                </div>

                <Collapsible>
                    {speciesContext.limitedSpecies.map((limitedSpecies) => {
                        if (!limitedSpecies.subspecies) {
                            const totalCount = totalPermits.filter(
                                (permit) => permit.permitType.id === limitedSpecies.permitTypeId
                            ).length;
                            const availableCount = validPermits.filter(
                                (permit) => permit.permitType.id === limitedSpecies.permitTypeId
                            ).length;
                            const usedCount = totalPermits.filter(
                                (permit) =>
                                    permit.permitType.id === limitedSpecies.permitTypeId &&
                                    permit.strapStatusId !== StrapStatus.Unused
                            ).length;

                            return (
                                <CollapsibleItem
                                    collapsedByDefault
                                    key={`${limitedSpecies.id}-${limitedSpecies.permitTypeId}`}
                                    title={limitedSpecies.description ? limitedSpecies.description[i18n.language] : ""}
                                    contentRight={
                                        <PermitTags availableCount={availableCount} totalCount={totalCount} />
                                    }
                                >
                                    <ReadOnlyInput
                                        id={`issued-${limitedSpecies.id}`}
                                        label={t("mtl.issuedPermits")}
                                        value={String(totalCount)}
                                    />
                                    <ReadOnlyInput
                                        id={`available-${limitedSpecies.id}`}
                                        label={t("mtl.availablePermits")}
                                        value={String(availableCount)}
                                    />
                                    <ReadOnlyInput
                                        id={`used-${limitedSpecies.id}`}
                                        label={t("mtl.usedPermits")}
                                        value={String(usedCount)}
                                    />
                                </CollapsibleItem>
                            );
                        }
                        return limitedSpecies.subspecies.map((subSpecies) => {
                            const totalCount = totalPermits.filter(
                                (permit) => permit.permitType.id === subSpecies.permitTypeId
                            ).length;
                            const availableCount = validPermits.filter(
                                (permit) => permit.permitType.id === subSpecies.permitTypeId
                            ).length;
                            const usedCount = totalPermits.filter(
                                (permit) =>
                                    permit.permitType.id === subSpecies.permitTypeId &&
                                    permit.strapStatusId !== StrapStatus.Unused
                            ).length;

                            return (
                                <CollapsibleItem
                                    collapsedByDefault
                                    key={`${subSpecies.id}-${subSpecies.permitTypeId}`}
                                    title={subSpecies.description ? subSpecies.description[i18n.language] : ""}
                                    contentRight={
                                        <PermitTags availableCount={availableCount} totalCount={totalCount} />
                                    }
                                >
                                    <ReadOnlyInput
                                        id={`issued-${subSpecies.id}`}
                                        label={t("mtl.issuedPermits")}
                                        value={String(totalCount)}
                                    />
                                    <ReadOnlyInput
                                        id={`available-${subSpecies.id}`}
                                        label={t("mtl.availablePermits")}
                                        value={String(availableCount)}
                                    />
                                    <ReadOnlyInput
                                        id={`used-${subSpecies.id}`}
                                        label={t("mtl.usedPermits")}
                                        value={String(usedCount)}
                                    />
                                </CollapsibleItem>
                            );
                        });
                    })}
                </Collapsible>
            </PageContent>
        </Page>
    );
}

interface PermitTagsProps {
    availableCount: number;
    totalCount: number;
}

export function PermitTags(props: PermitTagsProps) {
    return (
        <div className="permit-tags">
            <div className="permit-tags__permit-tag permit-tags__permit-tag--available">
                <Icon name="permitTag" />
                <span className="permit-tags__permit-tag__count">{props.availableCount}</span>
            </div>
            <div className="permit-tags__permit-tag permit-tags__permit-tag--total">
                <Icon name="permitTag" />
                <span className="permit-tags__permit-tag__count">{props.totalCount}</span>
            </div>
        </div>
    );
}
