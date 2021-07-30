import { configuration } from "../configuration";
import { Species } from "../types/classifiers";

export function isSpeciesValidForInjured(speciesId: Species) {
    return configuration.hunt.notValidForInjuredSpecies.filter((species) => species === speciesId).length === 0;
}
