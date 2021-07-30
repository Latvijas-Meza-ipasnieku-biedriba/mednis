import * as React from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { Membership } from "../../../types/mtl";
import { Button, LinkButton } from "../../../components/Button";
import { TextInput } from "../../../components/TextInput";
import { CheckAllOption, Checkbox, CheckboxGroup } from "../../../components/Checkbox";
import { LoadingActive, LoadingSuccess } from "../../../components/Loading";
import { Icon } from "../../../components/Icon";
import { MessageModal } from "../../../components/modal/MessageModal";
import { client } from "../../../utils/client";
import { reloadMemberships } from "../../../hooks/useMembershipQuery";
import { configuration } from "../../../configuration";
import "./RegisterMember.scss";

interface RegisterMemberProps {
    memberships: Membership[];
    onCancel: () => void;
}

interface RegisterMemberState {
    hunterCardNumber: string;
    checkedDistricts: { [district: number]: boolean };
}

interface RegisterMemberBody {
    cardNumber: string;
    addToDistrictIds: number[];
}

export function RegisterMember(props: RegisterMemberProps) {
    const { t } = useTranslation();

    const mutation = useMutation((newMember: RegisterMemberBody) =>
        client.post(configuration.api.endpoints.memberships, newMember)
    );

    const [registerMember, setRegisterMember] = React.useState<RegisterMemberState>({
        hunterCardNumber: "",
        checkedDistricts: props.memberships.reduce(
            (acc: { [district: number]: boolean }, curr) => ((acc[curr.id] = false), acc),
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

    function onHunterCardNumberChange(hunterCardNumber: string) {
        setRegisterMember((registerMember) => ({ ...registerMember, hunterCardNumber }));
    }

    function onDistrictChange(checked: boolean, id: number) {
        setRegisterMember((registerMember) => ({
            ...registerMember,
            checkedDistricts: {
                ...registerMember.checkedDistricts,
                [id]: checked,
            },
        }));
    }

    function onDistrictCheckAllOptionChanged(checked: boolean) {
        setRegisterMember((registerMember) => ({
            ...registerMember,
            checkedDistricts: props.memberships.reduce(
                (acc: { [district: number]: boolean }, curr) => ((acc[curr.id] = checked), acc),
                {}
            ),
        }));
    }

    function onSubmit() {
        const districts: number[] = [];
        Object.entries(registerMember.checkedDistricts).forEach(([id, checked]) => {
            if (checked) {
                districts.push(Number(id));
            }
        });

        mutation.mutate({ cardNumber: registerMember.hunterCardNumber, addToDistrictIds: districts });
    }

    function onCancel() {
        mutation.reset();
        props.onCancel();
    }

    const allOptionsChecked = Object.entries(registerMember.checkedDistricts).every(([id, checked]) => checked);
    const someOptionsChecked = allOptionsChecked
        ? false
        : Object.entries(registerMember.checkedDistricts).some(([id, checked]) => checked);

    return (
        <div className="register-member">
            <TextInput
                id="hunterCardNumber"
                value={registerMember.hunterCardNumber}
                onChange={onHunterCardNumberChange}
                placeholder={t("mtl.registerMember.hunterCardNumber")}
            />

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
                {props.memberships.map((membership) => {
                    const checkboxId = `membership-${membership.id}`;

                    return (
                        <Checkbox
                            key={checkboxId}
                            id={checkboxId}
                            checked={registerMember.checkedDistricts[membership.id] ?? false}
                            label={membership.name}
                            onChange={(checked: boolean) => onDistrictChange(checked, membership.id)}
                        />
                    );
                })}
            </CheckboxGroup>

            <Button
                className="register-member__submit"
                onClick={onSubmit}
                disabled={registerMember.hunterCardNumber === "" || (!someOptionsChecked && !allOptionsChecked)}
            >
                {t("mtl.registerMember.addMember")}
            </Button>

            <LinkButton className="register-member__cancel" iconRight={<Icon name="cross" />} onClick={onCancel}>
                {t("mtl.cancel")}
            </LinkButton>

            {mutation.isLoading && <LoadingActive />}

            {mutation.isSuccess && <LoadingSuccess />}

            {mutation.isError && (
                <MessageModal
                    title={t("mtl.registerMember.failure.title")}
                    description={t("mtl.registerMember.failure.description")}
                    variant="failure"
                    onClose={onCancel}
                    showClose
                >
                    <Button onClick={onCancel}>{t("mtl.registerMember.failure.close")}</Button>
                </MessageModal>
            )}
        </div>
    );
}
