import { IFieldData } from "../../store/componentsData/componentsDataSlice"
import { IFieldParams } from "../../store/componentsData/fieldsParamsSlice"
import { funcCheckFieldNotEmpty } from "./funcCheckFieldNotEmpty"
import { funcCheckTypeForField } from "./funcCheckTypeForField"



export interface IGeneralValidResult {
    isAllFieldsValid: boolean
    data: IFieldValidResult
}

interface IFieldValidResult {
    [name: string]: {
        status: boolean
        message: string        
    }
}

export function funcValidateFields(requirements: IFieldParams | undefined, objInputAndChangedData: IFieldData | undefined, objChangedData: IFieldData | undefined): IGeneralValidResult {
    const validationResult: IGeneralValidResult = {
        isAllFieldsValid: true,
        data: {},
    };

    const fieldsInvalidationResult: IFieldValidResult = {}

    function funcChangeInvalidationResult () {
        if (Object.keys(fieldsInvalidationResult).length !== 0) {
            validationResult.isAllFieldsValid = false
            validationResult.data = fieldsInvalidationResult
        }
    }

    //Проверка на пустые поля
        if (requirements) {
            Object.keys(requirements).forEach((item) => {
                if (requirements[item].isRequired) {
                    if (objInputAndChangedData) {
                        const fieldValue = objInputAndChangedData[item]
                        const isFieldNotEmpty = (fieldValue !== undefined && fieldValue !== null) ? funcCheckFieldNotEmpty(fieldValue) : false
                        if (!isFieldNotEmpty) {
                            fieldsInvalidationResult[item] = {status: true, message: 'Поле не заполнено'}
                        } 
                    } else {
                        fieldsInvalidationResult[item] = {status: true, message: 'Поле не заполнено'}
                    }
                }
            })
        } 

        funcChangeInvalidationResult();

        if (!validationResult.isAllFieldsValid) {
            return validationResult
        }

    // Проверка на соответствие типов
        if (requirements) {
            Object.keys(requirements).forEach((item) => {
                const type = requirements[item].type || 'text'
                const valueMinMax = requirements[item].valueMinMax
                const field = objChangedData?.[item]
                if (field) {
                    const isTypeValid = funcCheckTypeForField(type, valueMinMax, field)
                    if (!isTypeValid.status) {
                        fieldsInvalidationResult[item] = {status: true, message: isTypeValid.message}
                    }                    
                }
            })
        }

        funcChangeInvalidationResult();

        if (!validationResult.isAllFieldsValid) {
            return validationResult
        }


    return validationResult;
}