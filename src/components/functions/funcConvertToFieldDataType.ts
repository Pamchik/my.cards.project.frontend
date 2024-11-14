import { IFieldData, ITotalValue } from "../../store/componentsData/componentsDataSlice";

export function funcConvertToFieldDataType<T extends Record<string, any>>(data: T): IFieldData {
    const fieldsData: IFieldData = {};

    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            fieldsData[key] = data[key] as ITotalValue;
        }
    }

    return fieldsData;
}