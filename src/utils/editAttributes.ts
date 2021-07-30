import { v4 as uuid } from "uuid";
import { AttributeBase } from "../types/edit";

export function getDefaultAttributeBase(): AttributeBase {
    return {
        guid: uuid(),
        reportCreated: new Date().toISOString(),
    };
}
