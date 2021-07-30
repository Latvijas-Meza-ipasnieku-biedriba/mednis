import { hasValidSeasonCard, isValidHunter } from "../utils/profile";
import { useProfileContext } from "./useProfileContext";

interface AvailablePages {
    isHuntPageVisible: boolean;
    isMtlPageVisible: boolean;
}

export function useAvailablePages(): AvailablePages {
    const profileContext = useProfileContext();

    return {
        isHuntPageVisible: isValidHunter(profileContext) && hasValidSeasonCard(profileContext),
        isMtlPageVisible: isValidHunter(profileContext) && profileContext.memberships.length > 0,
    };
}
