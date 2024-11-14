import moment from "moment";
import { ITotalValue } from "../../store/componentsData/componentsDataSlice";
import { ITotalTypes } from "../../store/componentsData/fieldsParamsSlice";


export function funcCheckTypeForField(type: ITotalTypes | undefined, valueMinMax: {min?: number | undefined, max?: number | undefined} | undefined, field: ITotalValue | undefined): {status: boolean, message: string} {
    let isValid = {
        status: true, 
        message: ''
    }
    if (type === 'text' || type === 'password') {
        if (typeof field !== 'string' && field !== null) {
            return {
                status: false,
                message: 'Неверный формат (строка)'
            }
        }
    } else if (type === 'number') {
        if ((typeof field === 'number' && !isNaN(field)) || field === null) {
            if (field) {
                if (valueMinMax?.min !== undefined) {
                    if (valueMinMax.min > field) {
                        return {
                            status: false,
                            message:  `Минимальное значение ${valueMinMax.min}`
                        }
                    }
                }
                if (valueMinMax?.max !== undefined) {
                    if (valueMinMax.max < field) {
                        return {
                            status: false,
                            message:  `Максимальное значение ${valueMinMax.max}`
                        }
                    }
                }                
            }
        } else {
            return {
                status: false,
                message: 'Неверный формат (число)'
            }          
        }
    } else if (type === 'float') {
        if ((typeof field === 'number' && !isNaN(field)) || field === null) {
            if (field) {
                if (valueMinMax?.min !== undefined) {
                    if (valueMinMax.min > field) {
                        return {
                            status: false,
                            message:  `Минимальное значение ${valueMinMax.min}`
                        }
                    }
                }
                if (valueMinMax?.max !== undefined) {
                    if (valueMinMax.max < field) {
                        return {
                            status: false,
                            message:  `Максимальное значение ${valueMinMax.max}`
                        }
                    }
                }                
            }
        } else if ((typeof field === 'string' && !isNaN(parseFloat(field))) || field === null) {
            if (field) {
                if (valueMinMax?.min !== undefined) {
                    if (valueMinMax.min > parseFloat(field)) {
                        return {
                            status: false,
                            message:  `Минимальное значение ${valueMinMax.min}`
                        }
                    }
                }
                if (valueMinMax?.max !== undefined) {
                    if (valueMinMax.max < parseFloat(field)) {
                        return {
                            status: false,
                            message:  `Максимальное значение ${valueMinMax.max}`
                        }
                    }
                }                
            }
        } else {
            return {
                status: false,
                message: 'Неверный формат (число)'
            }          
        }
    } else if (type === 'date') {
        if (typeof field === 'string' || field === null) { 
            if ((field && !moment(field, "YYYY-MM-DD").isValid()) || (field && field.length !== 10)) {
                return {
                    status: false,
                    message: 'Недействительная дата'
                }
            }
        } else {
            return {
                status: false,
                message: 'Неверный формат (дата)' 
            }
        }
    } else if (type === 'email') {
        if (typeof field === 'string' || field === null) { 
            if (field) {
                const emailValidResult = field.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        
                if (!emailValidResult) {
                    return {
                        status: false,
                        message: 'Неверная почта'
                    }
                }
            } 
        } else {
            return {
                status: false,
                message: 'Неверный формат (почта)' 
            }
        }
    } else if (type === 'phone') {
        if (typeof field === 'string' || field === null) { 
            if (field) {
                const phoneValidResult = field.match(/[0-9()+\s-]/)
            
                if (!phoneValidResult) {
                    return {
                        status: false,
                        message: 'Неверный номер телефона' 
                    }
                }

                const phoneLengthResult =  field.length > 10

                if (!phoneLengthResult) {
                    return {
                        status: false,
                        message: 'Введите не менее 10 символов' 
                    }
                }        
            }
        } else {
            return {
                status: false,
                message: 'Неверный формат (телефон)' 
            }
        }
    } else if (type === 'boolean') {
        if (typeof field !== 'boolean' && field !== null) {
            return {
                status: false,
                message: 'Неверный формат (логическое значение)' 
            } 
        }
    } else if (type === 'array') {
        if (typeof field !== 'object' && field !== null && Array.isArray(field)) {
            return {
                status: false,
                message: 'Неверный формат (массив)' 
            }
        }
    }

    return isValid
}
