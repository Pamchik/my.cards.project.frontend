import { useDispatch } from "react-redux";
import { deleteAllComponentData } from "../../store/componentsData/componentsDataSlice";
import { setLoadingStatus } from "../../store/componentsData/loadingProcessSlice";
import { setSavingStatus } from "../../store/componentsData/savingProcessSlice";
import { IFieldParams, setFieldParams } from "../../store/componentsData/fieldsParamsSlice";
import { deleteFieldInvalid } from "../../store/componentsData/fieldsInvalidSlice";
import { setComponentReadOnly } from "../../store/componentsData/componentsReadOnlySlice";

export function useComponentPreparation(componentName: string) {

    const dispatch = useDispatch()

    const componentPreparing = (data: {loadingFieldsData: string[], fieldsParamsData: IFieldParams}) => {
        
        dispatch(setLoadingStatus({componentName, data: {status: true, isSuccessful: undefined, fields: data.loadingFieldsData}}))     
        dispatch(setSavingStatus({componentName, data: {status: false, isSuccessful: undefined, message: undefined}}))
        dispatch(setFieldParams({componentName, data: data.fieldsParamsData}))
        dispatch(deleteFieldInvalid({componentName}))
        dispatch(setComponentReadOnly({componentName}))
        dispatch(deleteAllComponentData({componentName}))

    };

    return componentPreparing;
}