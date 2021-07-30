import * as React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { Button } from "../../components/Button";
import { Checkbox } from "../../components/Checkbox";
import { CurrentPosition } from "../../components/CurrentPosition";
import { Label } from "../../components/Typography";
import { LoadingActive, LoadingSuccess } from "../../components/Loading";
import { NewOptionGroup } from "../../components/OptionGroup";
import { Page, PageContent, PageHeader } from "../../components/Page";
import { Photo } from "../../components/photo/Photo";
import { ReadOnlyInput } from "../../components/ReadOnlyInput";
import { TextInput } from "../../components/TextInput";
import { useCurrentPosition } from "../../hooks/useCurrentPosition";
import { isLimitedPreyValid } from "./Validation";
import { LimitedSpecies } from "../../types/hunt";
import { useValidPermits } from "../../hooks/useValidPermits";
import { useInjuredAnimalPermits } from "../../hooks/useInjuredAnimalPermits";
import { removePermit } from "../../hooks/usePermitsQuery";
import { getLimitedPreyEdits } from "./getLimitedPreyEdits";
import { useClassifiersContext } from "../../hooks/useClassifiersContext";
import { useProfileContext } from "../../hooks/useProfileContext";
import { EditQueueEntry, useEditQueueContext } from "../../hooks/useEditQueue";
import { useHunterContext } from "../../hooks/useHunterContext";
import { useInjuredAnimalState } from "../../hooks/useInjuredAnimalState";
import { isMemberTrusteeForDistrict } from "../../utils/memberships";
import { useMembershipContext } from "../../hooks/useMembershipContext";
import { Select, SelectOption } from "../../components/Select";
import { Switch } from "../../components/Switch";
import { PhotoReference } from "../../types/photo";
import { Age, Gender, HuntedType } from "../../types/classifiers";
import "./LimitedPreyForm.scss";

interface LimitedPreyFormProps {
    title: string;
    species: LimitedSpecies;
    permitId?: string;
}

export interface LimitedPreyState {
    position?: { lat: number; lng: number };
    species: string;
    strapNumber: string;
    huntingLicenseNumber: string;
    type: string;
    gender: string;
    age: string;
    notes: string;
    photo?: PhotoReference;
    permit: string;
    observedSignsOfDisease: boolean;
    reportId?: string;
    reportGuid: string;
    huntingDistrictId: number;
    hunterCardNumber: string;
    isHunterForeigner: boolean;
    foreignerPermitNumber: string;
}

export function LimitedPreyForm(props: LimitedPreyFormProps) {
    const { t, i18n } = useTranslation();
    const history = useHistory();

    const injuredAnimalPermits = useInjuredAnimalPermits();
    const validPermits = useValidPermits();
    const classifiersContext = useClassifiersContext();
    const profileContext = useProfileContext();
    const editQueueContext = useEditQueueContext();
    const membershipContext = useMembershipContext();
    const hunterContext = useHunterContext();

    const permit = props.permitId
        ? injuredAnimalPermits.find((permit) => permit.value.toString() === props.permitId)
        : validPermits.find((permit) => permit.permitType.id === props.species.permitTypeId);

    // TODO: This should be taken from classifierContext, when data is fixed
    let defaultTypeId = HuntedType.Hunted;
    let defaultGenderId = Gender.Unspecified;
    let defaultAgeId = Age.Unspecified;

    const defaultTypeConfig = props.species.types?.find((type) => type.isDefault);
    if (defaultTypeConfig) {
        defaultTypeId = defaultTypeConfig.id;
    }
    const defaultGenderConfig = defaultTypeConfig?.genders?.find((gender) => gender.isDefault);
    if (defaultGenderConfig) {
        defaultGenderId = defaultGenderConfig.id;
    }
    const defaultAgeConfig = defaultGenderConfig?.ages?.find((age) => age.isDefault);
    if (defaultAgeConfig) {
        defaultAgeId = defaultAgeConfig.id;
    }

    const [limitedPrey, setLimitedPrey] = React.useState<LimitedPreyState>({
        species: String(props.species.id),
        strapNumber: permit ? permit.strapNumber : "",
        huntingLicenseNumber: profileContext.validHuntersCardNumber,
        type: defaultTypeId ? String(defaultTypeId) : "",
        gender: defaultGenderId ? String(defaultGenderId) : "",
        age: defaultAgeId ? String(defaultAgeId) : "",
        notes: "",
        permit: permit ? String(permit.value) : "",
        observedSignsOfDisease: false,
        reportId: permit ? permit.reportId : "",
        reportGuid: permit && permit.reportGuid ? permit.reportGuid : uuid(),
        huntingDistrictId: Number(hunterContext.hunterConfig.selectedDistrict),
        hunterCardNumber: "",
        isHunterForeigner: false,
        foreignerPermitNumber: "",
    });

    const injuredAnimalState = useInjuredAnimalState(props.permitId);
    React.useEffect(() => {
        if (injuredAnimalState) {
            const { type, gender, age, notes, photo, observedSignsOfDisease } = injuredAnimalState;
            setLimitedPrey((limitedPrey) => ({
                ...limitedPrey,
                type,
                gender,
                age,
                notes,
                photo,
                observedSignsOfDisease,
            }));
        }
    }, [injuredAnimalState]);

    const positionResult = useCurrentPosition();
    const { position } = positionResult;

    React.useEffect(() => {
        setLimitedPrey((limitedPrey) => ({
            ...limitedPrey,
            position,
        }));
    }, [position]);

    React.useEffect(() => {
        if (editQueueContext.state.addToQueueStatus === "success") {
            setTimeout(() => {
                if ("dispatch" in editQueueContext) {
                    editQueueContext.dispatch({ type: "resetEditQueueAdd" });
                }
                if (permit) {
                    const permitAllowance = classifiersContext.permitAllowances.options.find(
                        (permitAllowance) =>
                            permitAllowance.ageId === Number(limitedPrey.age) &&
                            permitAllowance.genderId === Number(limitedPrey.gender) &&
                            permitAllowance.permitTypeId === Number(permit.permitType.id)
                    );

                    removePermit(permit.value, !!props.permitId, limitedPrey, permitAllowance);
                }
                history.push("/hunt");
            }, 3000);
        }
    }, [editQueueContext.state.addToQueueStatus, history]);

    if (editQueueContext.state.status === "loading") {
        return <></>;
    }

    function onTypeChange(type: string) {
        setLimitedPrey((limitedPrey) => {
            const newValue = { ...limitedPrey, type };

            if (props.species.types) {
                const typeConfig = props.species.types.find(({ id }) => id === Number(type));
                if (typeConfig?.genders) {
                    const genderConfig = typeConfig.genders.find(({ id }) => id === Number(limitedPrey.gender));

                    if (limitedPrey.gender && !genderConfig) {
                        newValue.gender = "";
                    }

                    if (genderConfig?.ages) {
                        const ageConfig = genderConfig.ages.find(({ id }) => id === Number(limitedPrey.age));

                        if (limitedPrey.age && !ageConfig) {
                            newValue.age = "";
                        }
                    }
                }
            }

            return newValue;
        });
    }

    function onGenderChange(gender: string) {
        setLimitedPrey((limitedPrey) => {
            const newValue = { ...limitedPrey, gender };

            if (props.species.types) {
                const typeConfig = props.species.types.find(({ id }) => id === Number(limitedPrey.type));
                if (typeConfig?.genders) {
                    const genderConfig = typeConfig.genders.find(({ id }) => id === Number(gender));
                    if (genderConfig?.ages) {
                        const ageConfig = genderConfig.ages.find(({ id }) => id === Number(limitedPrey.age));

                        if (limitedPrey.age && !ageConfig) {
                            newValue.age = "";
                        }
                    }
                }
            }

            return newValue;
        });
    }

    function onAgeChange(age: string) {
        setLimitedPrey((limitedPrey) => ({ ...limitedPrey, age }));
    }

    function onNotesChange(notes: string) {
        setLimitedPrey((limitedPrey) => ({ ...limitedPrey, notes }));
    }

    function onPhotoChange(photo?: PhotoReference) {
        setLimitedPrey((limitedPrey) => ({ ...limitedPrey, photo }));
    }

    function onObservedSignsOfDiseaseChange(observedSignsOfDisease: boolean) {
        setLimitedPrey((limitedPrey) => ({ ...limitedPrey, observedSignsOfDisease }));
    }

    function onHunterCardNumberChange(hunterCardNumber: string) {
        setLimitedPrey((limitedPrey) => ({ ...limitedPrey, hunterCardNumber }));
    }

    function onisHunterForeignerChange(isHunterForeigner: boolean) {
        setLimitedPrey((limitedPrey) => ({ ...limitedPrey, isHunterForeigner }));
    }

    function onForeignerPermitNumberChange(foreignerPermitNumber: string) {
        setLimitedPrey((limitedPrey) => ({ ...limitedPrey, foreignerPermitNumber }));
    }

    function onSubmit() {
        if (!("dispatch" in editQueueContext)) {
            return;
        }

        const edits = getLimitedPreyEdits(limitedPrey, !!props.permitId);
        const huntedTypeTitle: string =
            types.find((type) => type.value === limitedPrey.type)?.label ?? t("hunt.type.hunted");

        const editQueueEntry: EditQueueEntry = {
            title: `${huntedTypeTitle} - ${permit?.isStrapNumberAssigned ? limitedPrey.strapNumber : props.title}`,
            icon: props.species.icon,
            state: { status: "pending" },
            edits,
            photo: limitedPrey.photo,
        };
        editQueueContext.dispatch({ type: "addEditToQueue", editQueueEntry });
    }

    const locationData = limitedPrey.position
        ? `x: ${limitedPrey.position.lat.toFixed(5)}, y: ${limitedPrey.position.lng.toFixed(5)}`
        : "";

    let types = classifiersContext.huntedType.options.map((type) => ({
        value: String(type.id),
        label: type.description[i18n.language],
    }));

    let genders = classifiersContext.gender.options.map((gender) => ({
        value: String(gender.id),
        label: gender.description[i18n.language],
    }));

    let ages = classifiersContext.age.options.map((age) => ({
        value: String(age.id),
        label: age.description[i18n.language],
    }));

    if (props.species.types) {
        types = props.species.types.map((type) => {
            const typeClassifier = classifiersContext.huntedType.options.find(
                (classifier) => classifier.id === type.id
            );

            return {
                value: String(type.id),
                label: typeClassifier?.description[i18n.language] ?? "",
            };
        });

        const selectedTypeConfig = props.species.types.find((type) => String(type.id) === limitedPrey.type);
        if (selectedTypeConfig?.genders) {
            genders = selectedTypeConfig.genders.map((gender) => {
                const genderClassifier = classifiersContext.gender.options.find(
                    (classifier) => classifier.id === gender.id
                );
                return {
                    value: String(gender.id),
                    label: genderClassifier?.description[i18n.language] ?? "",
                };
            });

            const selectedGenderConfig = selectedTypeConfig.genders.find(
                (gender) => String(gender.id) === limitedPrey.gender
            );
            if (selectedGenderConfig?.ages) {
                ages = selectedGenderConfig.ages.map((age) => {
                    const ageClassifier = classifiersContext.age.options.find((classifier) => classifier.id === age.id);
                    return {
                        value: String(age.id),
                        label: ageClassifier?.description[i18n.language] ?? "",
                    };
                });
            }
        }
    }

    const submitDisabled = !isLimitedPreyValid(limitedPrey);

    return (
        <>
            <Page className="limited-prey-form">
                <PageHeader title={props.title} showBackButton onBackButtonClick={history.goBack} />
                <PageContent>
                    <CurrentPosition positionResult={positionResult} showFetchPositionButtonOnMap />
                    {permit?.isStrapNumberAssigned && (
                        <ReadOnlyInput
                            id="strapNumber"
                            label={t("hunt.strapNumber")}
                            value={permit?.strapNumber ?? ""}
                        />
                    )}
                    <ReadOnlyInput
                        id="huntingLicenseNumber"
                        label={t("hunt.huntingLicenseNumber")}
                        value={limitedPrey.huntingLicenseNumber}
                    />

                    {isMemberTrusteeForDistrict(
                        membershipContext,
                        profileContext.validHuntersCardNumber,
                        hunterContext.hunterConfig.selectedDistrict
                    ) && (
                        <>
                            <div className="limited-prey-form__hunter-card-number">
                                <Label htmlFor="hunterCardNumber">{t("hunt.changeHunterCardNumber")}</Label>
                                <Select
                                    disabled={limitedPrey.isHunterForeigner}
                                    id="hunterCardNumber"
                                    value={limitedPrey.hunterCardNumber}
                                    onChange={onHunterCardNumberChange}
                                    defaultOptionEnabled
                                >
                                    {membershipContext
                                        .find(
                                            (membership) =>
                                                membership.id === hunterContext.hunterConfig.selectedDistrict
                                        )
                                        ?.members.filter(
                                            (member) => member.cardNumber !== profileContext.validHuntersCardNumber
                                        )
                                        .map((member) => (
                                            <SelectOption
                                                key={`hunterCardNumber-${member.id}`}
                                                value={member.cardNumber}
                                            >
                                                {member.cardNumber}
                                            </SelectOption>
                                        ))}
                                </Select>
                            </div>
                            <div className="limited-prey-form__foreigner">
                                <Switch
                                    id="isHunterForeigner"
                                    label={t("hunt.hunterForeigner")}
                                    checked={limitedPrey.isHunterForeigner}
                                    onChange={onisHunterForeignerChange}
                                />

                                {limitedPrey.isHunterForeigner && (
                                    <TextInput
                                        id="foreignerPermitNumber"
                                        placeholder={t("hunt.enterHunterCardNumber")}
                                        value={limitedPrey.foreignerPermitNumber}
                                        onChange={onForeignerPermitNumberChange}
                                    />
                                )}
                            </div>
                        </>
                    )}

                    <ReadOnlyInput id="locationData" label={t("hunt.locationData")} value={locationData} />
                    <NewOptionGroup
                        name="type"
                        label={t("hunt.type.label")}
                        options={types}
                        value={limitedPrey.type}
                        onChange={onTypeChange}
                    />
                    {limitedPrey.type && (
                        <NewOptionGroup
                            name="gender"
                            label={t("hunt.gender.label")}
                            options={genders}
                            value={limitedPrey.gender}
                            onChange={onGenderChange}
                        />
                    )}
                    {limitedPrey.gender && (
                        <NewOptionGroup
                            name="age"
                            label={t("hunt.age.label")}
                            options={ages}
                            onChange={onAgeChange}
                            value={limitedPrey.age}
                        />
                    )}
                    <TextInput id="notes" label={t("hunt.notes")} value={limitedPrey.notes} onChange={onNotesChange} />
                    <Label>{t("hunt.photo")}</Label>
                    <Photo photo={limitedPrey.photo} onPhotoChange={onPhotoChange} mode="camera" />
                    <Checkbox
                        id="observedSignsOfDisease"
                        label={t("hunt.observedSignsOfDisease")}
                        checked={limitedPrey.observedSignsOfDisease}
                        onChange={onObservedSignsOfDiseaseChange}
                    />
                    <Button onClick={onSubmit} disabled={submitDisabled}>
                        {t("hunt.submit")}
                    </Button>
                </PageContent>
            </Page>

            {editQueueContext.state.addToQueueStatus === "loading" && <LoadingActive />}

            {editQueueContext.state.addToQueueStatus === "success" && (
                <LoadingSuccess title={t("editQueue.add.success")} />
            )}
        </>
    );
}
