import * as React from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { Link, useRouteMatch } from "react-router-dom";
import { format } from "date-fns";
import { ReadOnlyInput } from "../../components/ReadOnlyInput";
import { Badge } from "../../components/Badge";
import { Icon, IconName } from "../../components/Icon";
import { useValidPermits } from "../../hooks/useValidPermits";
import { useInjuredAnimalPermits } from "../../hooks/useInjuredAnimalPermits";
import { useClassifiersContext } from "../../hooks/useClassifiersContext";
import { useProfileContext } from "../../hooks/useProfileContext";
import { useHunterContext } from "../../hooks/useHunterContext";
import { LimitedSpecies, UnlimitedSpecies } from "../../types/hunt";
import "./PreyList.scss";

interface InjuredAnimalListProps {
    species: LimitedSpecies[];
}

export function InjuredAnimalList(props: InjuredAnimalListProps) {
    const { i18n } = useTranslation();
    const match = useRouteMatch();
    const injuredAnimalPermits = useInjuredAnimalPermits();
    const classifiersContext = useClassifiersContext();

    return (
        <div className="prey-list">
            {injuredAnimalPermits.map((permit) => {
                const species = props.species.find((species) => species.id === permit.permitType.species.id);
                if (!species) {
                    return null;
                }

                const permitAllowance = classifiersContext.permitAllowances.options.find(
                    (permitAllowance) => permitAllowance.id === permit.permitAllowanceId
                );

                if (!permitAllowance) {
                    return null;
                }

                let linkTo = `${match.url}/limited/${species.id}`;
                if (permitAllowance.isComplex) {
                    linkTo += `/${permit.permitType.id}`;
                }
                linkTo += `/injured/${permit.value}`;

                const permitInjuredDate = permit.injuredDate ? new Date(permit.injuredDate) : new Date(); // TODO: remove temporary check after injuredDate is implemented
                const injuredDate = format(permitInjuredDate, "dd.MM.yyyy HH:mm:ss");

                return (
                    <InjuredAnimal
                        key={permit.value}
                        icon={species.icon}
                        type={permit.permitType.description[i18n.language]}
                        linkTo={linkTo}
                        injuredDate={injuredDate}
                    />
                );
            })}
        </div>
    );
}

interface LimitedPreyListProps {
    type: "species" | "subspecies";
    species: LimitedSpecies[];
}

export function LimitedPreyList(props: LimitedPreyListProps) {
    const { t, i18n } = useTranslation();
    const match = useRouteMatch();
    const validPermits = useValidPermits();
    const profileContext = useProfileContext();
    const hunterContext = useHunterContext();
    const selectedDistrictName = profileContext.memberships.find(
        (membership) => membership.huntingDistrictId === hunterContext.hunterConfig.selectedDistrict
    )?.huntingDistrict.descriptionLv;

    return (
        <div className="prey-list">
            {selectedDistrictName && (
                <ReadOnlyInput id="district" label={`${t("mtl.district")}:`} value={selectedDistrictName} />
            )}
            {props.species.map((species) => {
                const linkTo =
                    props.type === "species"
                        ? `${match.url}/limited/${species.id}`
                        : `${match.url}/${species.permitTypeId}`;

                const permitCount = validPermits.filter((permit) => {
                    if (props.type === "species") {
                        return permit.permitType.species.id === species.id;
                    }
                    return permit.permitType.id === species.permitTypeId;
                }).length;

                return (
                    <Prey
                        key={`${species.id}_${species.permitTypeId}`}
                        icon={species.icon}
                        type={species.description ? species.description[i18n.language] : ""}
                        term={species.term ?? t("hunt.unlimitedTerm")}
                        linkTo={linkTo}
                        permitCount={permitCount}
                    />
                );
            })}
        </div>
    );
}

interface UnlimitedPreyListProps {
    species: UnlimitedSpecies[];
}

export function UnlimitedPreyList(props: UnlimitedPreyListProps) {
    const { t, i18n } = useTranslation();
    const match = useRouteMatch();

    return (
        <div className="prey-list">
            {props.species.map((species) => {
                return (
                    <Prey
                        key={species.id}
                        icon={species.icon}
                        type={species.description ? species.description[i18n.language] : ""}
                        term={species.term ?? t("hunt.unlimitedTerm")}
                        linkTo={`${match.url}/unlimited/${species.id}`}
                    />
                );
            })}
        </div>
    );
}

interface PreyProps {
    icon: IconName;
    type: string;
    term: string;
    linkTo: string;
    permitCount?: number;
}

function Prey(props: PreyProps) {
    const isDisabled = props.permitCount === 0;
    const preyClassNames = classNames("prey", { "prey--disabled": isDisabled });

    return (
        <Link to={isDisabled ? "#" : props.linkTo} className={preyClassNames}>
            <div className="prey__left">
                <Icon name={props.icon} />
            </div>
            <div className="prey__right">
                <span className="prey__right__type">{props.type}</span>
                <div className="prey__right__details">
                    <span className="prey__right__details__term">{props.term}</span>
                    {(props.permitCount || props.permitCount === 0) && (
                        <PreyPermits count={props.permitCount} term={props.term} />
                    )}
                </div>
            </div>
        </Link>
    );
}

interface PreyPermitsProps {
    count: number;
    term: string;
}

function PreyPermits(props: PreyPermitsProps) {
    const { t } = useTranslation();

    return (
        <div className="prey__right__details__permits">
            {props.count === 0 ? (
                <>
                    <span className="prey__right__details__permits__no__permits">
                        <Icon name="notAvailable" />
                    </span>
                    <span className="prey__right__details__permits__label">{t("hunt.noPermits")}</span>
                </>
            ) : (
                <>
                    <span className="prey__right__details__permits__count">
                        <Badge count={props.count} />
                    </span>
                    <span className="prey__right__details__permits__label">{t("hunt.permits")}</span>
                </>
            )}
        </div>
    );
}

interface InjuredAnimalProps {
    icon: IconName;
    type: string;
    linkTo: string;
    injuredDate: string;
}

function InjuredAnimal(props: InjuredAnimalProps) {
    return (
        <Link to={props.linkTo} className="prey">
            <div className="prey__left">
                <Icon name={props.icon} />
            </div>
            <div className="prey__right">
                <span className="prey__right__type">{props.type}</span>
                <div className="prey__right__details">
                    <span className="prey__right__details__injured-date">{props.injuredDate}</span>
                </div>
            </div>
        </Link>
    );
}
