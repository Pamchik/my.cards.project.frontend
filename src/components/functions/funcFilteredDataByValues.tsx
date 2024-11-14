import { ITotalValue } from "../../store/componentsData/componentsDataSlice"

export function funcFilteredDataByValues (prevArray: any[], arrayValueObjects: {fieldName: string, value: ITotalValue | undefined, required: boolean}[]) {
    let newArray = prevArray  

    for (let i = 0; i < arrayValueObjects.length; i++) {

        const currentValue = arrayValueObjects[i].value

        if ((currentValue === undefined || currentValue === null) && arrayValueObjects[i].required) {
            newArray = []
        } else if ((currentValue === undefined || currentValue === null) && !arrayValueObjects[i].required) {
            newArray = [...newArray]
        } else if (typeof currentValue === 'number') {
            if (currentValue) {
                newArray = [...newArray.filter(item => 
                    item[arrayValueObjects[i].fieldName] && 
                    item[arrayValueObjects[i].fieldName].toString().includes(currentValue?.toString())
                )]    
            }
        } else if (typeof currentValue === 'string') {
            if (currentValue) {
                newArray = [...newArray.filter(item => 
                    item[arrayValueObjects[i].fieldName] && 
                    item[arrayValueObjects[i].fieldName].toLowerCase().includes(currentValue?.toString().toLowerCase())
                )]                
            }
        } else if (typeof currentValue === 'boolean') {
            if (currentValue) {
                newArray = [...newArray.filter(item => item[arrayValueObjects[i].fieldName] === true)]
            } else {
                newArray = [...newArray.filter(item => item[arrayValueObjects[i].fieldName] === false)] 
            }
        } else {
            newArray = [...newArray]
        }
    }
    return newArray
}

