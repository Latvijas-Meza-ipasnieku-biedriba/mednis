import * as React from "react";
import { useTranslation } from "react-i18next";
import { Icon, IconName } from "../../../components/Icon";
import { configuration } from "../../../configuration";
import { Member, MemberRoles } from "../../../types/mtl";
import "./DistrictMemberList.scss";

interface DistrictMemberListProps {
    id: number;
    title: string;
    members: Member[];
    onRemoveMemberClicked: (cardNumber: string, clickedDistrictId: number) => void;
    onManageMemberRolesClicked: (cardNumber: string, clickedDistrictId: number) => void;
}

export function DistrictMemberList(props: DistrictMemberListProps) {
    return (
        <div className="district-member-list">
            {props.members.map((member) => {
                const highestRole = member.roles.sort((a, b) => {
                    if (configuration.mtl.memberRoleSortOrder[a] < configuration.mtl.memberRoleSortOrder[b]) return -1;
                    if (configuration.mtl.memberRoleSortOrder[a] > configuration.mtl.memberRoleSortOrder[b]) return 1;
                    return 0;
                })[0];
                const icon: IconName = configuration.mtl.memberIcons[highestRole] ?? "user";
                return (
                    <DistrictMember
                        key={`${props.title}-${member.id}`}
                        id={member.id}
                        icon={icon}
                        cardNumber={member.cardNumber}
                        onDeleteButtonClick={() => props.onRemoveMemberClicked(member.cardNumber, props.id)}
                        onMemberClick={() => props.onManageMemberRolesClicked(member.cardNumber, props.id)}
                        showDeleteButton={!member.roles.includes(MemberRoles.Trustee)}
                    />
                );
            })}
        </div>
    );
}

interface DistrictMemberProps {
    id: number;
    icon: IconName;
    cardNumber: string;
    showDeleteButton?: boolean;
    onMemberClick?: (cardNumber: string) => void;
    onDeleteButtonClick?: (cardNumber: string) => void;
}

export function DistrictMember(props: DistrictMemberProps) {
    const { t } = useTranslation();

    function onDeleteButtonClick() {
        if (props.onDeleteButtonClick) {
            props.onDeleteButtonClick(props.cardNumber);
        }
    }

    function onMemberClick() {
        if (props.onMemberClick) {
            props.onMemberClick(props.cardNumber);
        }
    }

    return (
        <div className="district-member">
            <button className="district-member__left" onClick={onMemberClick}>
                <Icon name={props.icon} />
                <span>{`${t("mtl.hunterCardNumberShort")} ${props.cardNumber}`}</span>
            </button>
            {props.showDeleteButton && (
                <button className="district-member__right" onClick={onDeleteButtonClick}>
                    <Icon name="trash" />
                </button>
            )}
        </div>
    );
}
