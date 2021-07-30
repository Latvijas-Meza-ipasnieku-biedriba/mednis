export interface Feature {
    geometry: { type: "Point"; coordinates: [number, number] };
}

export interface Features {
    observations: Feature[];
    damages: Feature[];
}
