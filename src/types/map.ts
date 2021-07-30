export enum MapPane {
    Basemap = "basemapPane",
    Layer = "layerPane",
}

interface MapServiceBase {
    id: string;
    title: string;
    thumbnail: string;
    minZoom?: number;
    maxZoom?: number;
}

export interface MapServiceWmsTiled extends MapServiceBase {
    type: "WmsTiled";
    url: string;
    layers: string[];
    imageFormat?: string;
    transparent?: boolean;
    maxNativeZoom?: number;
}

export interface MapServiceAgsTiled extends MapServiceBase {
    type: "AgsTiled";
    url: string;
    maxNativeZoom?: number;
}

export interface MapServiceAgsDynamic extends MapServiceBase {
    type: "AgsDynamic";
    url: string;
}

export interface MapServiceCustom extends MapServiceBase {
    type: "Custom";
}

export type MapService = MapServiceWmsTiled | MapServiceAgsTiled | MapServiceAgsDynamic | MapServiceCustom;

interface MapServiceGroupBase {
    id: string;
    title: string;
    services: string[];
    isBasemapServiceGroup?: boolean;
}

export interface MapServiceGroupSingle extends MapServiceGroupBase {
    /**
     * One service at a time can be checked, but cannot be unchecked
     */
    selectionMode: "single";
    defaultService: string;
}

export interface MapServiceGroupSingleCheckable extends MapServiceGroupBase {
    /**
     * One service at a time can be checked, can be unchecked
     */
    selectionMode: "single-checkable";
    defaultService?: string;
}

export interface MapServiceGroupMultiple extends MapServiceGroupBase {
    /**
     * One or more services can be checked at the same time, can be unchecked
     */
    selectionMode: "multiple";
    defaultServices?: string[];
}

export type MapServiceGroup = MapServiceGroupSingle | MapServiceGroupSingleCheckable | MapServiceGroupMultiple;
