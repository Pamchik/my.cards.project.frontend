import BtnBlock from "../../../blocks/BtnBlock";
import ButtonMain from "../../../UI/buttons/ButtonMain";
import ContentBlock from "../../../blocks/ContentBlock";
import { useEffect, useState } from "react";
import { useEffectStoreData } from "../../../hooks/useEffectStoreData";
import { IFieldParams, IInputTypes, ITextareaTypes } from "../../../../store/componentsData/fieldsParamsSlice";
import { useDispatch } from "react-redux";
import { useFieldValueChange } from "../../../hooks/useFieldValueChange";
import { changeComponentReadOnly } from "../../../../store/componentsData/componentsReadOnlySlice";
import { IInputValue, ISelectValue, ITextareaValue, deleteAllComponentData, deleteChangedComponentData, setInputData } from "../../../../store/componentsData/componentsDataSlice";
import { deleteFieldInvalid, setFieldInvalid } from "../../../../store/componentsData/fieldsInvalidSlice";
import { setLoadingStatus } from "../../../../store/componentsData/loadingProcessSlice";
import BlockInput from "../../../UI/fields/BlockInput";
import BlockTextarea from "../../../UI/fields/BlockTextarea";
import { useComponentPreparation } from "../../../hooks/useComponentPreparation";
import BlockSelect from "../../../UI/fields/BlockSelect";
import { funcConvertToFieldDataType } from "../../../functions/funcConvertToFieldDataType";
import LoadingView from "../../../loading/LoadingView";
import { setSavingStatus } from "../../../../store/componentsData/savingProcessSlice";
import { functionErrorMessage } from "../../../functions/functionErrorMessage";
import { funcValidateFields } from "../../../functions/funcValidateFields";
import { deleteComponentsAPIUpdate } from "../../../../store/componentsData/componentsAPIUpdateSlice";
import { useGetVendorsQuery } from "../../../../store/api/vendorApiSlice";
import { useGetMagstripeColorQuery, useUpdateMagstripeColorMutation } from "../../../../store/api/magstripeColorApiSlice";
import { useGetMagstripeTracksQuery } from "../../../../store/api/magstripeTrackApiSlice";
import { useAllComponentParamsReset } from "../../../hooks/useComponentDataReset";
import useTimeoutManager from "../../../hooks/useTimeoutManager";

interface IMagstripeColorMainInfo {
    selectedID: number
}

const MagstripeColorMainInfo = ({
    selectedID
}: IMagstripeColorMainInfo) => {

    const componentName = 'MagstripeColorMainInfo'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const { loadingProcess, fieldParams, componentData, componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: magstripeColorData, isFetching: isFetchingMagstripeColorData, error: errorMagstripeColorData, refetch: refetchMagstripeColorData} = useGetMagstripeColorQuery({id: selectedID})
    const {data: vendorsData, isFetching: isFetchingVendorsData, error: errorVendorsData, refetch: refetchVendorsData} = useGetVendorsQuery(undefined)
    const {data: magstripeTracksData, isFetching: isFetchingMagstripeTracksData, error: errorMagstripeTracksData, refetch: refetchMagstripeTracksData} = useGetMagstripeTracksQuery(undefined)
    const [updateMagstripeColor, {}] = useUpdateMagstripeColorMutation()

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    useEffect(() => {
        if (componentsAPIUpdate.includes('magstripeColorData')) {
            refetchMagstripeColorData()
            funcChangeCancelSet(true)
            dispatch(deleteComponentsAPIUpdate(['magstripeColorData']))
        } else if (componentsAPIUpdate.includes('vendorsData')) {
            refetchVendorsData()
            dispatch(deleteComponentsAPIUpdate(['vendorsData']))
        } else if (componentsAPIUpdate.includes('magstripeTracksData')) {
            refetchMagstripeTracksData()
            dispatch(deleteComponentsAPIUpdate(['magstripeTracksData']))
        }
    }, [componentsAPIUpdate]);

    const initFieldParams: IFieldParams = {
        'name_eng': {isRequired: true, type: 'text'},
        'name_rus': {isRequired: true, type: 'text'},
        'vendor': {isRequired: true, type: 'number'},
        'magstripe_tracks': {isRequired: true, type: 'number'},
        'other': {isRequired: false, type: 'text'},
        'active': {isRequired: true, type: 'boolean'},
    }

    useEffect(() => {
        if (!isComponentPrepared) {
            componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
            setIsComponentPrepared(true);
        }
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
        if (isComponentPrepared) {
            if (!isFetchingMagstripeColorData) {
                if (!errorMagstripeColorData && magstripeColorData) {
                    const myData = funcConvertToFieldDataType(magstripeColorData[0])
                    dispatch(setInputData({componentName, data: myData}))
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: [
                            'name_eng', 
                            'name_rus',
                            'vendor',
                            'magstripe_tracks',
                            'other',
                            'active'
                        ]}}))
                    }, 1000)  
                } else {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: Object.keys(initFieldParams)}}))
                    }, 1000)
                }
            }
        }
    }, [selectedID, isComponentPrepared, magstripeColorData, isFetchingMagstripeColorData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['vendor']}}))
        if (isComponentPrepared && !isFetchingVendorsData && !isFetchingMagstripeColorData && !errorMagstripeColorData) {
            if (!errorVendorsData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['vendor']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['vendor']}}))
                }, 1000)
            }
        }
    }, [selectedID, isComponentPrepared, isFetchingMagstripeColorData, isFetchingVendorsData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['magstripe_tracks']}}))
        if (isComponentPrepared && !isFetchingMagstripeColorData && !errorMagstripeColorData) {
            if (!errorMagstripeTracksData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['magstripe_tracks']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['magstripe_tracks']}}))
                }, 1000)
            }
        }
    }, [selectedID, isComponentPrepared, isFetchingMagstripeColorData, isFetchingMagstripeTracksData]);

    useEffect(() => {
        funcChangeCancelSet(true)
    }, [selectedID]);

    async function funcSaveFields () {
        dispatch(setSavingStatus({componentName, data: {status: true}}))
        const currentId: number = componentData?.objInputAndChangedData['id'] as number
        if (currentId) {
            const isValid = funcValidateFields(fieldParams, componentData?.objInputAndChangedData, componentData?.objChangedData)
            if (isValid.isAllFieldsValid) {
                dispatch(deleteFieldInvalid({componentName}))
                const myData = componentData.objChangedData
                await updateMagstripeColor({...myData, id: currentId}).unwrap()    
                .then((res) => {
                    dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: true}}))
                    dispatch(deleteAllComponentData({componentName}))
                    funcChangeCancelSet(true)
                    setManagedTimeout(() => { 
                        dispatch(setSavingStatus({ componentName, data: { status: false } }))
                    }, 1000)  
                }).catch((error) => {
                    const message = functionErrorMessage(error)
                    dispatch(setSavingStatus({ componentName, data: { status: true, isSuccessful: false, message: message} }))
                })             
            } else {
                dispatch(setFieldInvalid({componentName, data: isValid.data}))
                dispatch(setSavingStatus({componentName, data: {status: false}}))
            }
        } else {
            dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: false, message: "Ошибка! Обновите страницу и попробуйте заново."}}))
        }
    }    

    function funcChangeCancelSet(newStatus: boolean) {
        dispatch(deleteChangedComponentData({componentName}))
        dispatch(changeComponentReadOnly({componentName, newStatus}))
        dispatch(deleteFieldInvalid({componentName}))            
    }

    return (<>
        {isComponentPrepared && (<>
            <BtnBlock>
                {
                    componentData?.objChangedData && Object.keys(componentData.objChangedData).length > 0 && 
                    <ButtonMain
                        onClick={funcSaveFields} 
                        type={'submit'} 
                        title={'Сохранить'}
                    />
                }
                <ButtonMain 
                    onClick={() => funcChangeCancelSet(componentReadOnly?.status ? false : true)} 
                    type={'other'} 
                    color={'gray'}
                    myStyle={{width: '120px'}} 
                    title={!componentReadOnly?.status ? 'Отмена' : 'Редактировать'}
                />                 
            </BtnBlock>

            {savingProcess?.status && 
                <LoadingView 
                    isSuccessful={savingProcess.isSuccessful} 
                    errorMessage={savingProcess.message} 
                    componentName={componentName} 
                />
            } 
            <ContentBlock>
                <BlockInput
                    onChange={(obj) => setValues(obj)}
                    fieldName={'name_rus'}
                    title={'Название (rus)'}
                    type={fieldParams?.['name_rus']?.type as IInputTypes}
                    value={componentData?.objInputAndChangedData['name_rus'] as IInputValue}
                    placeholder={'Введите название на русском'}
                    skeletonLoading={loadingProcess?.['name_rus']}
                    isRequired={fieldParams?.['name_rus']?.isRequired}
                    isReadOnly={componentReadOnly?.status}
                    isInvalidStatus={componentInvalidFields?.['name_rus']}
                    isChanged={!!componentData?.objChangedData?.['name_rus']}
                />
                <BlockInput
                    onChange={(obj) => setValues(obj)}
                    fieldName={'name_eng'}
                    title={'Название (eng)'}
                    type={fieldParams?.['name_eng']?.type as IInputTypes}
                    value={componentData?.objInputAndChangedData['name_eng'] as IInputValue}
                    placeholder={'Введите название на английском'}
                    skeletonLoading={loadingProcess?.['name_eng']}
                    isRequired={fieldParams?.['name_eng']?.isRequired}
                    isReadOnly={componentReadOnly?.status}
                    isInvalidStatus={componentInvalidFields?.['name_eng']}
                    isChanged={!!componentData?.objChangedData?.['name_eng']}
                />
                <BlockTextarea
                    onChange={(obj) => setValues(obj)}
                    fieldName={'other'}
                    title={'Другое'}
                    type={fieldParams?.['other']?.type as ITextareaTypes}
                    value={componentData?.objInputAndChangedData['other'] as ITextareaValue}
                    placeholder={'Введите комментарий'}
                    skeletonLoading={loadingProcess?.['other']}
                    isRequired={fieldParams?.['other']?.isRequired}
                    isReadOnly={componentReadOnly?.status}
                    isInvalidStatus={componentInvalidFields?.['other']}
                    isChanged={!!componentData?.objChangedData?.['other']}
                    rows={3}
                />
                <BlockSelect
                    fieldName={'magstripe_tracks'}
                    showName={"name_rus"}
                    title={'Количество дорожек'}
                    value={componentData?.objInputAndChangedData['magstripe_tracks'] as ISelectValue}
                    options={magstripeTracksData || []}
                    onChange={(obj) => setValues(obj)}   
                    skeletonLoading={loadingProcess?.['magstripe_tracks']}
                    isRequired={fieldParams?.['magstripe_tracks']?.isRequired}  
                    isReadOnly={true} 
                    isInvalidStatus={componentInvalidFields?.['magstripe_tracks']}   
                    isChanged={!!componentData?.objChangedData?.['magstripe_tracks']}  
                />
                <BlockSelect
                    fieldName={'vendor'}
                    showName={"name"}
                    title={'Вендор'}
                    value={componentData?.objInputAndChangedData['vendor'] as ISelectValue}
                    options={vendorsData || []}
                    isEmptyOption={true}
                    onChange={(obj) => setValues(obj)}   
                    skeletonLoading={loadingProcess?.['vendor']}
                    isRequired={fieldParams?.['vendor']?.isRequired}  
                    isReadOnly={true} 
                    isInvalidStatus={componentInvalidFields?.['vendor']}   
                    isChanged={!!componentData?.objChangedData?.['vendor']}  
                />
                <BlockSelect
                    fieldName={'active'}
                    showName={"name"}
                    title={'Статус'}
                    value={componentData?.objInputAndChangedData['active'] as ISelectValue ? 1 : 2 }
                    options={[{id: 1, name: 'Активный'}, {id: 2, name: 'В архиве'}]}
                    isEmptyOption={false}
                    onChange={(obj) => setValues({name: obj.name, value: obj.value === 1 ? true : false})}   
                    skeletonLoading={loadingProcess?.['active']}
                    isRequired={fieldParams?.['active']?.isRequired}  
                    isReadOnly={componentReadOnly?.status} 
                    isInvalidStatus={componentInvalidFields?.['active']}   
                    isChanged={!!componentData?.objChangedData?.['active']}  
                />
            </ContentBlock>
        </>)}
    </>)
}

export default MagstripeColorMainInfo