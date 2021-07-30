import * as React from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { MemberRoles } from "../../../types/mtl";
import { Button, LinkButton } from "../../../components/Button";
import { Icon } from "../../../components/Icon";
import { Checkbox, CheckboxGroup } from "../../../components/Checkbox";
import { LoadingActive, LoadingSuccess } from "../../../components/Loading";
import { MessageModal } from "../../../components/modal/MessageModal";
import { FullScreenModal } from "../../../components/modal/FullScreenModal";
import { client } from "../../../utils/client";
import { reloadMemberships } from "../../../hooks/useMembershipQuery";
import { configuration } from "../../../configuration";
import "./ManageMemberRoles.scss";

interface ManageMemberRolesProps {
    cardNumber: string;
    clickedDistrictId: number;
    currentRoles: MemberRoles[];
    onCancel: () => void;
}

interface ManageMemberRolesState {
    checkedRoles: { [role: string]: boolean };
}

interface UpdaterMemberBody {
    cardNumber: string;
    districts: number[];
    add: MemberRoles[];
    remove: MemberRoles[];
}

export function ManageMemberRoles(props: ManageMemberRolesProps) {
    const { t } = useTranslation();

    const mutation = useMutation((updateMember: UpdaterMemberBody) =>
        client.post(configuration.api.endpoints.roles, updateMember)
    );

    const [memberToManageRoles, setMemberToManageRoles] = React.useState<ManageMemberRolesState>({
        checkedRoles: Object.keys(MemberRoles)
            .filter((role) => role !== MemberRoles.Member)
            .reduce(
                (acc: { [role: string]: boolean }, curr) => (
                    (acc[curr] = props.currentRoles.includes(getMemberRoleFromString(curr))), acc
                ),
                {}
            ),
    });

    React.useEffect(() => {
        if (mutation.isSuccess) {
            setTimeout(() => {
                reloadMemberships();
                mutation.reset();
                props.onCancel();
            }, 3000);
        }
    }, [props, mutation]);

    function onRoleChecked(checked: boolean, role: string) {
        setMemberToManageRoles((memberToManageRoles) => ({
            ...memberToManageRoles,
            checkedRoles: {
                ...memberToManageRoles.checkedRoles,
                [role]: checked,
            },
        }));
    }

    function onSubmit() {
        const rolesToAdd: MemberRoles[] = [];
        const rolesToRemove: MemberRoles[] = [];

        Object.entries(memberToManageRoles.checkedRoles).forEach(([role, checked]) => {
            const memberRole: MemberRoles = getMemberRoleFromString(role);
            if (checked && !props.currentRoles.includes(memberRole)) {
                rolesToAdd.push(memberRole);
            }
            if (!checked && props.currentRoles.includes(memberRole)) {
                rolesToRemove.push(memberRole);
            }
        });

        mutation.mutate({
            cardNumber: props.cardNumber,
            districts: [props.clickedDistrictId],
            add: rolesToAdd,
            remove: rolesToRemove,
        });
    }

    function onCancel() {
        mutation.reset();
        props.onCancel();
    }

    return (
        <FullScreenModal
            onBackButtonClick={props.onCancel}
            title={`${t("mtl.hunterCardNumberShort")} ${props.cardNumber}`}
            showBackButton
        >
            <div className="manage-member-roles">
                <CheckboxGroup>
                    {Object.keys(MemberRoles)
                        .filter((memberRole) => getMemberRoleFromString(memberRole) !== MemberRoles.Member)
                        .map((memberRole) => {
                            const roleEnum: MemberRoles = getMemberRoleFromString(memberRole);
                            return (
                                <div className="manage-member-roles__role" key={roleEnum}>
                                    <Icon
                                        className="manage-member-roles__role__icon"
                                        name={configuration.mtl.memberIcons[roleEnum] ?? "user"}
                                    />
                                    <Checkbox
                                        id={roleEnum}
                                        disabled={roleEnum !== MemberRoles.Administrator}
                                        checked={memberToManageRoles.checkedRoles[memberRole] ?? false}
                                        label={t(`mtl.memberRoles.${roleEnum}`)}
                                        onChange={(checked: boolean) => onRoleChecked(checked, memberRole)}
                                    />
                                </div>
                            );
                        })}
                </CheckboxGroup>

                <div className="manage-member-roles__buttons">
                    <Button className="manage-member-roles__buttons__submit" onClick={onSubmit}>
                        {t("mtl.save")}
                    </Button>

                    <LinkButton
                        className="manage-member-roles__buttons__cancel"
                        iconRight={<Icon name="cross" />}
                        onClick={onCancel}
                    >
                        {t("mtl.cancel")}
                    </LinkButton>
                </div>
            </div>

            {mutation.isLoading && <LoadingActive />}

            {mutation.isSuccess && <LoadingSuccess />}

            {mutation.isError && (
                <MessageModal
                    title={t("mtl.manageMemberRoles.failure.title")}
                    variant="failure"
                    onClose={onCancel}
                    showClose
                >
                    <Button onClick={onCancel}>{t("mtl.manageMemberRoles.failure.close")}</Button>
                </MessageModal>
            )}
        </FullScreenModal>
    );
}

function getMemberRoleFromString(memberRole: string): MemberRoles {
    return MemberRoles[memberRole as keyof typeof MemberRoles];
}
