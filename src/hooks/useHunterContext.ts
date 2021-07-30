import * as React from "react";
import { Plugins } from "@capacitor/core";
import { Profile } from "../types/profile";
import { StorageKey } from "../types/storage";

export interface HunterConfig {
    selectedDistrict?: number;
}

export interface HunterConfigContext {
    hunterConfig: HunterConfig;
    onSelectedDistrictChange: (districtId: number) => void;
}

export function useHunterConfig(profile?: Profile): HunterConfigContext {
    const [hunterConfig, setHunterConfig] = React.useState<HunterConfig>({});

    const onSelectedDistrictChange = React.useCallback((districtId: number) => {
        setHunterConfig((hunterConfig) => {
            const newHunterConfig = { ...hunterConfig, selectedDistrict: districtId };
            saveHunterConfigToStorage(newHunterConfig);
            return newHunterConfig;
        });
    }, []);

    React.useEffect(() => {
        if (!profile) {
            return;
        }

        getHunterConfig().then((config) => {
            if (config?.selectedDistrict) {
                onSelectedDistrictChange(config.selectedDistrict);
                return;
            }

            if (profile.memberships.length > 0) {
                onSelectedDistrictChange(profile.memberships[0].huntingDistrictId);
            }
        });
    }, [profile, onSelectedDistrictChange]);

    return {
        hunterConfig,
        onSelectedDistrictChange,
    };
}

export const HunterContext = React.createContext<HunterConfigContext | null>(null);

export function useHunterContext() {
    const context = React.useContext(HunterContext);

    if (context === null) {
        throw new Error("HunterContext not initialized");
    }

    return context;
}

function saveHunterConfigToStorage(hunterConfig: HunterConfig): Promise<void> {
    return Plugins.Storage.set({ key: StorageKey.HunterConfig, value: JSON.stringify(hunterConfig) });
}

function getHunterConfig(): Promise<HunterConfig | undefined> {
    return Plugins.Storage.get({ key: StorageKey.HunterConfig }).then((result) => {
        if (result.value) {
            return JSON.parse(result.value);
        }
    });
}
