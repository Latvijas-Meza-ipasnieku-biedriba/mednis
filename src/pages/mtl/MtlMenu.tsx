import * as React from "react";
import { useTranslation } from "react-i18next";
import { Link, useRouteMatch } from "react-router-dom";
import { IconButton } from "../../components/Button";
import { Icon } from "../../components/Icon";
import { Select, SelectOption } from "../../components/Select";
import { Label } from "../../components/Typography";
import { useHunterContext } from "../../hooks/useHunterContext";
import { useMembershipContext } from "../../hooks/useMembershipContext";
import { useProfileContext } from "../../hooks/useProfileContext";
import { reloadMemberships } from "../../hooks/useMembershipQuery";
import { Menu } from "../menu/Menu";
import "./MtlMenu.scss";

export function MtlMenu() {
    const { t } = useTranslation();
    const match = useRouteMatch();
    const memberships = useMembershipContext();
    const profileContext = useProfileContext();
    const hunterContext = useHunterContext();

    React.useEffect(() => {
        reloadMemberships();
    }, []);

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    function onMenuOpen() {
        setIsMenuOpen(true);
    }

    function onMenuClose() {
        setIsMenuOpen(false);
    }

    function onSelectedDistrictChange(districtId: string) {
        hunterContext.onSelectedDistrictChange(Number(districtId));
    }

    return (
        <div className="mtl-menu">
            <div className="mtl-menu__controls-top">
                <div className="mtl-menu__controls-top__left">
                    <IconButton title={t("profile.title")} icon="userSettings" onClick={onMenuOpen} />
                </div>
                <div className="mtl-menu__controls-top__right">
                    <div className="mtl-menu__controls-top__right__district">
                        <Label htmlFor="huntingDistrict">{`${t("mtl.district")}:`}</Label>
                        <Select
                            id="huntingDistrict"
                            value={
                                String(hunterContext.hunterConfig.selectedDistrict) ?? String(memberships[0].id) ?? ""
                            }
                            onChange={onSelectedDistrictChange}
                            disabled={profileContext.memberships.length === 1}
                        >
                            {profileContext.memberships.map((membership) => (
                                <SelectOption
                                    key={`huntingDistrict-${membership.huntingDistrictId}`}
                                    value={String(membership.huntingDistrictId)}
                                >
                                    {membership.huntingDistrict.descriptionLv}
                                </SelectOption>
                            ))}
                        </Select>
                    </div>
                </div>
            </div>

            <div className="mtl-menu__controls-bottom">
                <Link className="mtl-menu__controls-bottom__link" to={`${match.url}/permits`}>
                    <Icon name="tag" />
                    <span>{t("mtl.permits")}</span>
                </Link>

                {/* TODO: Uncomment when implementing statistics */}
                {/* <Link
                    className="mtl-menu__controls-bottom__link"
                    to={`${match.url}/statistics`}
                >
                    <Icon name="statistics" />
                    <span>{t("mtl.statistics")}</span>
                </Link> */}

                {memberships.length > 0 && (
                    <Link className="mtl-menu__controls-bottom__link" to={`${match.url}/manage-members`}>
                        <Icon name="members" />
                        <span>{t("mtl.memberManagement")}</span>
                    </Link>
                )}
            </div>
            {isMenuOpen && <Menu onCloseButtonClick={onMenuClose} />}
        </div>
    );
}
