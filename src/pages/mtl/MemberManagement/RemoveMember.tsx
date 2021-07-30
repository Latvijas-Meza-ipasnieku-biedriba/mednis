import * as React from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { Membership } from "../../../types/mtl";
import { Button, LinkButton } from "../../../components/Button";
import { Icon } from "../../../components/Icon";
import { CheckAllOption, Checkbox, CheckboxGroup } from "../../../components/Checkbox";
import { LoadingActive, LoadingSuccess } from "../../../components/Loading";
import { MessageModal } from "../../../components/modal/MessageModal";
import { client } from "../../../utils/client";
import { reloadMemberships } from "../../../hooks/useMembershipQuery";
import { configuration } from "../../../configuration";
import "./RemoveMember.scss";

interface RemoveMemberProps {
    cardNumber: string;
    clickedDistrictId: number;
    allMemberships: Membership[];
    onCancel: () => void;
}

export interface RemoveMemberState {
    checkedDistricts: { [district: number]: boolean };
}

export function RemoveMember(props: RemoveMemberProps) {
    const { t } = useTranslation();

    const mutation = useMutation((newMember: { cardNumber: string; removeFromDistrictIds: number[] }) =>
        client.post(configuration.api.endpoints.memberships, newMember)
    );

    const [removeMember, setRemoveMember] = React.useState<RemoveMemberState>({
        checkedDistricts: props.allMemberships.reduce(
            (acc: { [district: number]: boolean }, curr) => ((acc[curr.id] = curr.id === props.clickedDistrictId), acc),
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

    function onDistrictChange(checked: boolean, id: number) {
        setRemoveMember((removeMember) => ({
            ...removeMember,
            checkedDistricts: {
                ...removeMember.checkedDistricts,
                [id]: checked,
            },
        }));
    }

    function onDistrictCheckAllOptionChanged(checked: boolean) {
        setRemoveMember((removeMember) => ({
            ...removeMember,
            checkedDistricts: props.allMemberships.reduce(
                (acc: { [district: number]: boolean }, curr) => ((acc[curr.id] = checked), acc),
                {}
            ),
        }));
    }

    function onSubmit() {
        const districts: number[] = [];
        Object.entries(removeMember.checkedDistricts).forEach(([id, checked]) => {
            if (checked) {
                districts.push(Number(id));
            }
        });

        mutation.mutate({ cardNumber: props.cardNumber, removeFromDistrictIds: districts });
    }

    function onCancel() {
        mutation.reset();
        props.onCancel();
    }

    const allOptionsChecked = Object.entries(removeMember.checkedDistricts).every(([id, checked]) => checked);
    const someOptionsChecked = allOptionsChecked
        ? false
        : Object.entries(removeMember.checkedDistricts).some(([id, checked]) => checked);

    return (
        <MessageModal
            title={
                props.allMemberships.length > 1
                    ? t("mtl.removeMember.removeFromMultipleTitle")
                    : t("mtl.removeMember.removeFromSingleTitle")
            }
            variant="delete"
            onClose={onCancel}
            showClose
        >
            <div className="remove-member">
                {props.allMemberships.length > 1 && (
                    <CheckboxGroup
                        label={t("mtl.huntingDistricts")}
                        checkAllOption={
                            <CheckAllOption
                                key={`district-check-all`}
                                id={"district-check-all"}
                                checked={allOptionsChecked}
                                someOptionsChecked={someOptionsChecked}
                                label={t("mtl.allDistricts")}
                                onChange={(checked: boolean) => onDistrictCheckAllOptionChanged(checked)}
                            />
                        }
                    >
                        {props.allMemberships.map((membership) => {
                            const checkboxId = `membership-${membership.id}`;

                            return (
                                <Checkbox
                                    key={checkboxId}
                                    id={checkboxId}
                                    checked={removeMember.checkedDistricts[membership.id] ?? false}
                                    label={membership.name}
                                    onChange={(checked: boolean) => onDistrictChange(checked, membership.id)}
                                />
                            );
                        })}
                    </CheckboxGroup>
                )}
                <Button className="remove-member__submit" onClick={onSubmit}>
                    {t("mtl.removeMember.remove")}
                </Button>

                <LinkButton className="remove-member__cancel" iconRight={<Icon name="cross" />} onClick={onCancel}>
                    {t("mtl.cancel")}
                </LinkButton>
            </div>

            {mutation.isLoading && <LoadingActive />}

            {mutation.isSuccess && <LoadingSuccess />}

            {mutation.isError && (
                <MessageModal
                    title={t("mtl.removeMember.failure.title")}
                    variant="failure"
                    onClose={onCancel}
                    showClose
                >
                    <Button onClick={onCancel}>{t("mtl.removeMember.failure.close")}</Button>
                </MessageModal>
            )}
        </MessageModal>
    );
}
