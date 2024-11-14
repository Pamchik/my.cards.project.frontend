import { useDispatch } from "react-redux";
import { IInputValue, ITotalValue, changeInputAndChangedData } from "../../store/componentsData/componentsDataSlice";

export function useFieldValueChange(componentName: string) {

    const dispatch = useDispatch()

    const updateFieldValue = (obj: {name: string, value: ITotalValue}) => {
        dispatch(changeInputAndChangedData({componentName, data: 
            {[obj.name]: 
                (obj.value !== undefined && obj.value !== null && obj.value !== '') 
                ? obj.value 
                : null
                }
        }))
    };

    return updateFieldValue;
}