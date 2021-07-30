import * as React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Icon } from "./Icon";
import { Badge } from "./Badge";
import { useInjuredAnimalPermits } from "../hooks/useInjuredAnimalPermits";
import { useAvailablePages } from "../hooks/useAvailablePages";
import "./TabBar.scss";

interface TabBarItemProps {
    linkTo: string;
    icon: React.ReactNode;
    label: string;
    badgeCount?: number;
}

function TabBarItem(props: TabBarItemProps) {
    return (
        <>
            <NavLink to={props.linkTo} className="tab-bar-item" activeClassName="tab-bar-item--active">
                {props.badgeCount && props.badgeCount > 0 ? <Badge count={props.badgeCount} /> : null}
                {props.icon}
                {props.label}
            </NavLink>
        </>
    );
}

export function TabBar() {
    const { t } = useTranslation();
    const injuredAnimalPermits = useInjuredAnimalPermits();
    const { isHuntPageVisible, isMtlPageVisible } = useAvailablePages();

    return (
        <div className="tab-bar">
            <nav className="tab-bar-inner">
                <TabBarItem linkTo="/map" icon={<Icon name="map" />} label={t("tabs.map")} />
                <TabBarItem linkTo="/observations" icon={<Icon name="observations" />} label={t("tabs.observations")} />
                <TabBarItem linkTo="/damage" icon={<Icon name="damage" />} label={t("tabs.damage")} />
                {isHuntPageVisible && (
                    <TabBarItem
                        linkTo="/hunt"
                        icon={<Icon name="hunt" />}
                        label={t("tabs.hunt")}
                        badgeCount={injuredAnimalPermits.length}
                    />
                )}
                {isMtlPageVisible && <TabBarItem linkTo="/mtl" icon={<Icon name="mtl" />} label={t("tabs.mtl")} />}
            </nav>
        </div>
    );
}
