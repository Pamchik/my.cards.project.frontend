import { ITotalValue } from "../../store/componentsData/componentsDataSlice";


export function funcCheckFieldNotEmpty(fieldValue: ITotalValue): boolean {
    if (typeof fieldValue === 'string') {
        return fieldValue.trim().length > 0;
    } else if (typeof fieldValue === 'number' || typeof fieldValue === 'boolean') {
        return true;
    } else if (Array.isArray(fieldValue)) {
        return fieldValue.length > 0;
    } else {
        return fieldValue !== undefined && fieldValue !== null;
    }
}