import * as React from "react";
import { useTranslation } from "react-i18next";
import { Collapsible, CollapsibleItem } from "../../components/Collapsible";
import { Icon } from "../../components/Icon";
import { MessageModal } from "../../components/modal/MessageModal";
import { ProfilePhoto } from "../../components/photo/ProfilePhoto";
import { ReadOnlyInput } from "../../components/ReadOnlyInput";
import { TextInput } from "../../components/TextInput";
import { useProfileContext } from "../../hooks/useProfileContext";
import { useVmdAccountConnect, VmdAccountConnectStatus } from "../../hooks/useVmdAccountConnect";
import { getProfileBasicInfoFromStorage, hasValidSeasonCard } from "../../utils/profile";
import { useUserDataContext } from "../../hooks/useUserData";
import { PhotoReference } from "../../types/photo";
import { configuration } from "../../configuration";
import "./Profile.scss";

export interface ProfileState {
    firstName: string;
    lastName: string;
    photo: PhotoReference | string | undefined;
}

export function Profile() {
    const profileContext = useProfileContext();
    const userDataContext = useUserDataContext();
    const { t } = useTranslation();

    const [profile, setProfile] = React.useState<ProfileState>({
        firstName: "",
        lastName: "",
        photo: undefined,
    });

    React.useEffect(() => {
        const profileBasicInfo = userDataContext.userData?.profileBasicInfo;
        if (profileBasicInfo) {
            setProfile(profileBasicInfo);
            return;
        }

        // Fallback to getting info straight from storage
        getProfileBasicInfoFromStorage().then((profileBasicInfoFromStorage) => {
            if (profileBasicInfoFromStorage) {
                setProfile(profileBasicInfoFromStorage);
            }
        });
    }, []);

    React.useEffect(() => {
        userDataContext.updateProfileBasicInfo(profile);
    }, [profile]);

    function onFirstNameChange(firstName: string) {
        setProfile((profile) => ({ ...profile, firstName }));
    }

    function onLastNameChange(lastName: string) {
        setProfile((profile) => ({ ...profile, lastName }));
    }

    function onPhotoChange(photo: PhotoReference) {
        setProfile((profile) => ({ ...profile, photo }));
    }

    const huntingDistrictManager = profileContext.memberships
        .filter((membership) => membership.isManager)
        .map((membership) => membership.huntingDistrict.descriptionLv.trim())
        .join(", ");
    const huntingDistrictMember = profileContext.memberships
        .filter((membership) => membership.isMember)
        .map((membership) => membership.huntingDistrict.descriptionLv.trim())
        .join(", ");

    const isSeasonCardValid = hasValidSeasonCard(profileContext);

    return (
        <div className="profile">
            <div className="profile__card">
                <div className="profile__card__photo">
                    <ProfilePhoto photo={profile.photo} onPhotoChange={onPhotoChange} />
                </div>

                <div className="profile__card__info">
                    {/* TODO: Uncomment tag when we have access to roles */}
                    {/* <Tag text="Mednieks" /> */}
                    {profile.firstName && (
                        <span className="profile__card__info__name">{`${profile.firstName} ${profile.lastName}`}</span>
                    )}

                    <ReadOnlyInput id="profileId" label="ID:&nbsp;" value={String(profileContext.id)} />
                </div>
            </div>

            <Collapsible>
                <CollapsibleItem title={t("profile.basicInfo")}>
                    <div className="profile__basic-info">
                        <TextInput
                            id="firstName"
                            label={t("profile.firstName")}
                            value={profile.firstName}
                            onChange={onFirstNameChange}
                        />
                        <TextInput
                            id="lastName"
                            label={t("profile.lastName")}
                            value={profile.lastName}
                            onChange={onLastNameChange}
                        />

                        {profileContext.validHuntersCardNumber && (
                            <ReadOnlyInput
                                id="validHuntersCardNumber"
                                label={t("hunt.huntersLicenseNumber")}
                                value={profileContext.validHuntersCardNumber}
                            />
                        )}
                        {profileContext.validHuntManagerCardNumber && (
                            <ReadOnlyInput
                                id="validHuntManagerCardNumber"
                                label={t("hunt.huntManagersLicenseNumber")}
                                value={profileContext.validHuntManagerCardNumber}
                            />
                        )}
                        {profileContext.isHunter && (
                            <>
                                <ReadOnlyInput
                                    id="huntersSeasonCard"
                                    label={t("hunt.huntersSeasonCard")}
                                    value={isSeasonCardValid ? t("hunt.huntCardValid") : t("hunt.huntCardInvalid")}
                                    iconLeft={
                                        <Icon
                                            name={isSeasonCardValid ? "valid" : "invalid"}
                                            className={isSeasonCardValid ? "valid" : "invalid"}
                                        />
                                    }
                                />
                            </>
                        )}

                        {configuration.features.isVmdAccountConnectFeatureEnabled && <ConnectVmdAccountButton />}
                    </div>
                </CollapsibleItem>
                {profileContext.isHunter && (huntingDistrictManager || huntingDistrictMember) && (
                    <CollapsibleItem title={t("profile.huntingDistricts")}>
                        <div className="profile__hunting-districts">
                            {huntingDistrictManager && (
                                <ReadOnlyInput
                                    id="validHuntersCardNumber"
                                    label={t("hunt.huntingDistrictManager")}
                                    value={huntingDistrictManager}
                                />
                            )}
                            {huntingDistrictMember && (
                                <ReadOnlyInput
                                    id="validHuntManagerCardNumber"
                                    label={t("hunt.huntingDistrictMember")}
                                    value={huntingDistrictMember}
                                />
                            )}
                        </div>
                    </CollapsibleItem>
                )}
            </Collapsible>
        </div>
    );
}

function ConnectVmdAccountButton() {
    const { t } = useTranslation();
    const vmdAccountConnect = useVmdAccountConnect();

    function onConnect() {
        if (vmdAccountConnect.status === VmdAccountConnectStatus.Idle) {
            vmdAccountConnect.connect();
        }
    }

    function onReset() {
        if (vmdAccountConnect.status === VmdAccountConnectStatus.Failure) {
            vmdAccountConnect.reset();
        }
    }

    return (
        <>
            <button
                className="profile__basic-info__connect"
                onClick={onConnect}
                disabled={vmdAccountConnect.status !== VmdAccountConnectStatus.Idle}
            >
                {t("profile.connectVmdAccount")}
            </button>

            {vmdAccountConnect.status === VmdAccountConnectStatus.Failure && (
                <MessageModal variant="failure" title={t("vmdConnect.failure")} showClose onClose={onReset} />
            )}
        </>
    );
}
