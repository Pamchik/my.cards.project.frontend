import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useEffectStoreData } from "../../../hooks/useEffectStoreData";
import { useComponentPreparation } from "../../../hooks/useComponentPreparation";
import { useAllComponentParamsReset } from "../../../hooks/useComponentDataReset";
import useTimeoutManager from "../../../hooks/useTimeoutManager";
import { useFieldValueChange } from "../../../hooks/useFieldValueChange";
import { deleteComponentsAPIUpdate } from "../../../../store/componentsData/componentsAPIUpdateSlice";
import { useGetGalleriesQuery } from "../../../../store/api/galleryApiSlice";
import MainInfoBlock from "../../../blocks/MainInfoBlock";
import GalleryBlock from "../../../blocks/GalleryBlock";
import { IFieldParams } from "../../../../store/componentsData/fieldsParamsSlice";
import { setLoadingStatus } from "../../../../store/componentsData/loadingProcessSlice";


interface IProjectGallery {
    selectedID: number
}

const ProjectGallery = ({
    selectedID,
}: IProjectGallery) => {

    const componentName = 'ProjectGallery'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {loadingProcess, fieldParams, componentData, componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const { data: galleriesData, isFetching: isFetchingGalleriesData, error: errorGalleriesData, refetch: refetchGalleriesData } = useGetGalleriesQuery(
        { model_type: 'ProjectLine', number: selectedID, active: 'True', deleted: 'False' }
    );

    useEffect(() => {
        if (componentsAPIUpdate.includes('galleriesData')) {
            updateAPIData('galleriesData', refetchGalleriesData)
        }
    }, [componentsAPIUpdate]);

    function updateAPIData (name: string, refetchFunc: () => void) {
        try {
            refetchFunc();
        } catch (error) {} finally {
            dispatch(deleteComponentsAPIUpdate([name])) 
        } 
    }

    const initFieldParams: IFieldParams = {
        'arrFiles': {isRequired: false, type: 'array'},
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['arrFiles']}}))
        if (isComponentPrepared) {
            if (!isFetchingGalleriesData) {
                if (!errorGalleriesData && galleriesData) {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['arrFiles']}}))
                    }, 1000)  
                } else {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['arrFiles']}}))
                    }, 1000)
                }
            }
        }
    }, [isComponentPrepared, galleriesData, isFetchingGalleriesData]);


    return (<>
        {isComponentPrepared && (<>
            <MainInfoBlock myStyleMain={{border: '1px solid #bebebe', borderRadius: '10px', overflowY: 'hidden'}} myStyleContext={{overflowY: 'hidden', paddingBottom: '10px'}}>
                <GalleryBlock
                    arrFiles={galleriesData || []}
                    selectedID={selectedID}
                    model_type={'ProjectLine'}
                    isLoading={loadingProcess?.['arrFiles']}
                />
            </MainInfoBlock>
        </>)}
    </>)
}


export default ProjectGallery