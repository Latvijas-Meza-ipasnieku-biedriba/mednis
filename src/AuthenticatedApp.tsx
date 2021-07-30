import * as React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Plugins } from "@capacitor/core";
import { Damage } from "./pages/damage/Damage";
import { HuntPage } from "./pages/hunt/HuntPage";
import { InitialLoadingActive, InitialLoadingFailed } from "./components/InitialLoading";
import { MapPage } from "./pages/map/MapPage";
import { Observations } from "./pages/observations/Observations";
import { MtlPage } from "./pages/mtl/MtlPage";
import { TabBar } from "./components/TabBar";
import { ClassifiersContext } from "./hooks/useClassifiersContext";
import { DistrictsContext } from "./hooks/useDistrictsContext";
import { EditQueueProvider } from "./hooks/useEditQueue";
import { FeaturesContext } from "./hooks/useFeaturesContext";
import { HunterContext, useHunterConfig } from "./hooks/useHunterContext";
import { MapSettingsProvider } from "./hooks/useMapSettings";
import { MembershipContext } from "./hooks/useMembershipContext";
import { PermitsContext } from "./hooks/usePermitsContext";
import { ProfileContext } from "./hooks/useProfileContext";
import { SpeciesContext, useSpecies } from "./hooks/useSpecies";
import { UserDataContext, useUserData } from "./hooks/useUserData";
import { useServerData } from "./hooks/useServerData";
import { useTabBarVisible } from "./hooks/useTabBarVisible";
import "./AuthenticatedApp.scss";

export function AuthenticatedApp() {
    const tabBarVisible = useTabBarVisible();
    const serverData = useServerData();
    const species = useSpecies(serverData.status === "success" ? serverData.classifiers : undefined);
    const hunterConfig = useHunterConfig(serverData.status === "success" ? serverData.profile : undefined);
    const userData = useUserData(serverData.status === "success" ? serverData.profile : undefined);

    React.useEffect(() => {
        if (serverData.status !== "loading") {
            Plugins.SplashScreen.hide();
        }
    }, [serverData.status]);

    if (serverData.status === "loading") {
        return <InitialLoadingActive />;
    }

    if (serverData.status === "failure") {
        return <InitialLoadingFailed onRetry={serverData.refetch} />;
    }

    return (
        <ClassifiersContext.Provider value={serverData.classifiers}>
            <PermitsContext.Provider value={serverData.permits}>
                <ProfileContext.Provider value={serverData.profile}>
                    <FeaturesContext.Provider value={serverData.features}>
                        <SpeciesContext.Provider value={species}>
                            <MembershipContext.Provider value={serverData.memberships}>
                                <HunterContext.Provider value={hunterConfig}>
                                    <DistrictsContext.Provider value={serverData.districts}>
                                        <UserDataContext.Provider value={userData}>
                                            <MapSettingsProvider>
                                                <AuthenticatedAppContent
                                                    editQueueEnabled={
                                                        serverData.status === "success" &&
                                                        !!serverData.classifiers &&
                                                        !!serverData.profile &&
                                                        !!userData.userData
                                                    }
                                                >
                                                    <main>
                                                        <Switch>
                                                            <Route path="/map" exact>
                                                                <MapPage />
                                                            </Route>
                                                            <Route path="/observations" exact>
                                                                <Observations />
                                                            </Route>
                                                            <Route path="/damage" exact>
                                                                <Damage />
                                                            </Route>
                                                            <Route path="/hunt">
                                                                <HuntPage />
                                                            </Route>
                                                            <Route path="/mtl">
                                                                <MtlPage />
                                                            </Route>
                                                            <Route path="/">
                                                                <Redirect to="/map" />
                                                            </Route>
                                                        </Switch>
                                                    </main>

                                                    {tabBarVisible && <TabBar />}
                                                </AuthenticatedAppContent>
                                            </MapSettingsProvider>
                                        </UserDataContext.Provider>
                                    </DistrictsContext.Provider>
                                </HunterContext.Provider>
                            </MembershipContext.Provider>
                        </SpeciesContext.Provider>
                    </FeaturesContext.Provider>
                </ProfileContext.Provider>
            </PermitsContext.Provider>
        </ClassifiersContext.Provider>
    );
}

interface AuthenticatedAppContentProps {
    editQueueEnabled: boolean;
    children: React.ReactNode;
}

function AuthenticatedAppContent(props: AuthenticatedAppContentProps) {
    return (
        <div className="authenticated-app">
            {props.editQueueEnabled ? <EditQueueProvider>{props.children}</EditQueueProvider> : props.children}
        </div>
    );
}
