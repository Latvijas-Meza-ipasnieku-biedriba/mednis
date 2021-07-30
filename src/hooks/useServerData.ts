import * as React from "react";
import { Classifiers } from "../types/classifiers";
import { District } from "../types/districts";
import { Features } from "../types/features";
import { Membership } from "../types/mtl";
import { Permit } from "../types/permits";
import { Profile } from "../types/profile";
import { useClassifiersQuery, useStoredClassifiersQueryData } from "./useClassifiersQuery";
import { useDistrictsQuery, useStoredDistrictsQueryData } from "./useDistrictsQuery";
import { useFeaturesQuery, useStoredFeaturesQueryData } from "./useFeaturesQuery";
import { useMembershipQuery, useStoredMembershipQueryData } from "./useMembershipQuery";
import { usePermitsQuery, useStoredPermitsQueryData } from "./usePermitsQuery";
import { useProfileQuery, useStoredProfileQueryData } from "./userProfileQuery";

type ServerDataResult =
    | { status: "loading" }
    | {
          status: "success";
          classifiers: Classifiers;
          profile: Profile;
          features: Features;
          permits: Permit[];
          memberships: Membership[];
          districts: District[];
      }
    | { status: "failure"; refetch: () => void };

export function useServerData(): ServerDataResult {
    // Pre-fill queryClient with stored data for offline scenarios
    useStoredClassifiersQueryData();
    useStoredProfileQueryData();
    useStoredPermitsQueryData();
    useStoredMembershipQueryData();
    useStoredDistrictsQueryData();
    useStoredFeaturesQueryData();

    const classifiersQuery = useClassifiersQuery();
    const profileQuery = useProfileQuery();
    const featuresQuery = useFeaturesQuery();

    const isVmdAccountConnected = profileQuery.data?.vmdId ? true : false;
    const permitsQuery = usePermitsQuery(isVmdAccountConnected);
    const membershipQuery = useMembershipQuery(isVmdAccountConnected);
    const districtsQuery = useDistrictsQuery(isVmdAccountConnected);

    const refetch = React.useCallback(() => {
        if (classifiersQuery.status === "error") {
            classifiersQuery.refetch();
        }
        if (profileQuery.status === "error") {
            profileQuery.refetch();
        }
        if (featuresQuery.status === "error") {
            featuresQuery.refetch();
        }
        if (permitsQuery.status === "error") {
            permitsQuery.refetch();
        }
        if (membershipQuery.status === "error") {
            membershipQuery.refetch();
        }
        if (districtsQuery.status === "error") {
            districtsQuery.refetch();
        }
    }, [classifiersQuery, profileQuery, featuresQuery, permitsQuery, membershipQuery, districtsQuery]);

    if (
        classifiersQuery.isLoading ||
        profileQuery.isLoading ||
        featuresQuery.isLoading ||
        permitsQuery.isLoading ||
        membershipQuery.isLoading ||
        districtsQuery.isLoading
    ) {
        return { status: "loading" };
    }

    if (
        classifiersQuery.isLoadingError ||
        !classifiersQuery.data ||
        profileQuery.isLoadingError ||
        !profileQuery.data ||
        featuresQuery.isLoadingError ||
        !featuresQuery.data ||
        (isVmdAccountConnected
            ? permitsQuery.isLoadingError ||
              !permitsQuery.data ||
              membershipQuery.isLoadingError ||
              !membershipQuery.data ||
              districtsQuery.isLoadingError ||
              !districtsQuery.data
            : false)
    ) {
        return {
            status: "failure",
            refetch,
        };
    }

    return {
        status: "success",
        classifiers: classifiersQuery.data,
        profile: profileQuery.data,
        features: featuresQuery.data,
        permits: permitsQuery.data ?? [],
        memberships: membershipQuery.data ?? [],
        districts: districtsQuery.data ?? [],
    };
}
