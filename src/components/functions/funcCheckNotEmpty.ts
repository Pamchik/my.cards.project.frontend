import { IFieldData } from "../../store/componentsData/componentsDataSlice"

export function funcCheckNotEmpty(data: IFieldData | undefined, fieldName: string): boolean {
    if (fieldName) {
        if (
            data?.[fieldName] !== undefined &&
            data?.[fieldName] !== '' && 
            (data?.[fieldName] !== null || data?.[fieldName] === 0)
        ) {
            return true
        }
    }

    return false
}