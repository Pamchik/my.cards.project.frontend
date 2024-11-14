import { useDispatch } from "react-redux";
import { resetLoadingComponent } from "../../store/componentsData/loadingProcessSlice";
import { resetFieldParamsComponent } from "../../store/componentsData/fieldsParamsSlice";
import { resetSavingStatusComponent } from "../../store/componentsData/savingProcessSlice";
import { resetFieldInvalidComponent } from "../../store/componentsData/fieldsInvalidSlice";
import { resetReadOnlyComponent } from "../../store/componentsData/componentsReadOnlySlice";
import { resetAllComponentDataComponent } from "../../store/componentsData/componentsDataSlice";

export function useAllComponentParamsReset(componentName: string) {

    const dispatch = useDispatch()

    const allComponentParamsReset = () => {
        
        dispatch(resetLoadingComponent({componentName}))  
        dispatch(resetFieldParamsComponent({componentName}))
        dispatch(resetSavingStatusComponent({componentName}))
        dispatch(resetFieldInvalidComponent({componentName}))
        dispatch(resetReadOnlyComponent({componentName}))
        dispatch(resetAllComponentDataComponent({componentName}))

    };

    return allComponentParamsReset;
}