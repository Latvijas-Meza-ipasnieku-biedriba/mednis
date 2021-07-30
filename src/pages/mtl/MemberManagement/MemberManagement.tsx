import * as React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Collapsible, CollapsibleItem } from "../../../components/Collapsible";
import { Icon } from "../../../components/Icon";
import { Page, PageContent, PageHeader } from "../../../components/Page";
import { DistrictMember, DistrictMemberList } from "./DistrictMemberList";
import { RegisterMember } from "./RegisterMember";
import { useMembershipContext } from "../../../hooks/useMembershipContext";
import { useProfileContext } from "../../../hooks/useProfileContext";
import { RemoveMember } from "./RemoveMember";
import { MemberRoles, Membership } from "../../../types/mtl";
import { ManageMemberRoles } from "./ManageMemberRoles";
import "./MemberManagement.scss";

export function MemberManagement() {
    const { t } = useTranslation();
    const history = useHistory();
    const memberships = useMembershipContext();
    const profileContext = useProfileContext();

    const [isRegisterMemberOpen, setIsRegisterMemberOpen] = React.useState<boolean>(false);
    const [isRemoveMemberOpen, setIsRemoveMemberOpen] = React.useState<boolean>(false);
    const [isManageMemberRolesOpen, setIsManageMemberRolesOpen] = React.useState<boolean>(false);

    const [memberToRemove, setMemberToRemove] = React.useState<{
        cardNumber: string;
        clickedDistrictId: number;
        allMemberships: Membership[];
    }>();

    const [memberToManageRoles, setMemberToManageRoles] = React.useState<{
        cardNumber: string;
        clickedDistrictId: number;
        currentRoles: MemberRoles[];
    }>();

    function onRegisterMemberClose() {
        setIsRegisterMemberOpen(false);
    }

    function onRegisterMemberOpen() {
        setIsRegisterMemberOpen(true);
    }

    function onRemoveMemberClose() {
        setIsRemoveMemberOpen(false);
    }

    function onRemoveMemberOpen() {
        setIsRemoveMemberOpen(true);
    }

    function onManageMemberRolesClose() {
        setIsManageMemberRolesOpen(false);
    }

    function onManageMemberRolesOpen() {
        setIsManageMemberRolesOpen(true);
    }

    function onRemoveMemberClicked(cardNumber: string, clickedDistrictId: number) {
        const allMemberships = memberships.filter(
            (membership) => membership.members.findIndex((member) => member.cardNumber === cardNumber) !== -1
        );
        setMemberToRemove({ cardNumber, clickedDistrictId, allMemberships });
        onRemoveMemberOpen();
    }

    function onRemoveMemberCancel() {
        setMemberToRemove(undefined);
        onRemoveMemberClose();
    }

    function onManageMemberRolesClicked(cardNumber: string, clickedDistrictId: number) {
        const currentRoles =
            memberships
                .find((membership) => membership.id === clickedDistrictId)
                ?.members.find((member) => member.cardNumber === cardNumber)?.roles ?? [];

        setMemberToManageRoles({ cardNumber, clickedDistrictId, currentRoles });
        onManageMemberRolesOpen();
    }

    function onManageMemberRolesCancel() {
        setMemberToRemove(undefined);
        onManageMemberRolesClose();
    }

    return (
        <Page>
            <PageHeader title={t("mtl.memberManagement")} onBackButtonClick={history.goBack} showBackButton />
            <PageContent className="member-management">
                {isRegisterMemberOpen ? (
                    <RegisterMember memberships={memberships} onCancel={onRegisterMemberClose} />
                ) : (
                    <button className="member-management__register-member" onClick={onRegisterMemberOpen}>
                        <span>{t("mtl.registerMember.title")}</span>
                        <Icon name="plus" />
                    </button>
                )}
                <DistrictMember id={profileContext.id} icon="user" cardNumber={profileContext.validHuntersCardNumber} />
                <Collapsible>
                    {memberships.map((membership) => {
                        return (
                            <CollapsibleItem key={membership.name} title={membership.name}>
                                <DistrictMemberList
                                    id={membership.id}
                                    title={membership.name}
                                    members={membership.members.filter(
                                        (member) => member.cardNumber !== profileContext.validHuntersCardNumber
                                    )}
                                    onRemoveMemberClicked={onRemoveMemberClicked}
                                    onManageMemberRolesClicked={onManageMemberRolesClicked}
                                />
                            </CollapsibleItem>
                        );
                    })}
                </Collapsible>
            </PageContent>
            {isRemoveMemberOpen && memberToRemove && (
                <RemoveMember
                    cardNumber={memberToRemove.cardNumber}
                    clickedDistrictId={memberToRemove.clickedDistrictId}
                    allMemberships={memberToRemove.allMemberships}
                    onCancel={onRemoveMemberCancel}
                />
            )}
            {isManageMemberRolesOpen && memberToManageRoles && (
                <ManageMemberRoles
                    cardNumber={memberToManageRoles.cardNumber}
                    clickedDistrictId={memberToManageRoles.clickedDistrictId}
                    currentRoles={memberToManageRoles.currentRoles.filter((role) => role !== MemberRoles.Member)}
                    onCancel={onManageMemberRolesCancel}
                />
            )}
        </Page>
    );
}
