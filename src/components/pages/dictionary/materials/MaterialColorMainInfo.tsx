import BtnBlock from "../../../blocks/BtnBlock";
import ButtonMain from "../../../UI/buttons/ButtonMain";
import ContentBlock from "../../../blocks/ContentBlock";
import { useEffect, useState } from "react";
import { useEffectStoreData } from "../../../hooks/useEffectStoreData";
import { useComponentPreparation } from "../../../hooks/useComponentPreparation";
import { useFieldValueChange } from "../../../hooks/useFieldValueChange";
import { useDispatch } from "react-redux";
import { IFieldParams, IInputTypes, ITextareaTypes } from "../../../../store/componentsData/fieldsParamsSlice";
import { setLoadingStatus } from "../../../../store/componentsData/loadingProcessSlice";
import { funcConvertToFieldDataType } from "../../../functions/funcConvertToFieldDataType";
import { IInputValue, ISelectValue, ITextareaValue, deleteAllComponentData, deleteChangedComponentData, setInputData } from "../../../../store/componentsData/componentsDataSlice";
import { setSavingStatus } from "../../../../store/componentsData/savingProcessSlice";
import { funcValidateFields } from "../../../functions/funcValidateFields";
import { deleteFieldInvalid, setFieldInvalid } from "../../../../store/componentsData/fieldsInvalidSlice";
import { functionErrorMessage } from "../../../functions/functionErrorMessage";
import { changeComponentReadOnly } from "../../../../store/componentsData/componentsReadOnlySlice";
import LoadingView from "../../../loading/LoadingView";
import BlockInput from "../../../UI/fields/BlockInput";
import BlockTextarea from "../../../UI/fields/BlockTextarea";
import { deleteComponentsAPIUpdate } from "../../../../store/componentsData/componentsAPIUpdateSlice";
import BlockSelect from "../../../UI/fields/BlockSelect";
import { useGetMaterialColorQuery, useUpdateMaterialColorMutation } from "../../../../store/api/materialColorApiSlice";
import { useAllComponentParamsReset } from "../../../hooks/useComponentDataReset";
import useTimeoutManager from "../../../hooks/useTimeoutManager";


interface IMaterialColorMainInfo {
    selectedID: number,
}

const MaterialColorMainInfo = ({
    selectedID,
}: IMaterialColorMainInfo) => {

    const componentName = 'MaterialColorMainInfo'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {loadingProcess, fieldParams, componentData, componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate} = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: materialColorData, isFetching: isFetchingMaterialColorData, error: errorMaterialColorData, refetch: refetchMaterialColorData} = useGetMaterialColorQuery({id: selectedID})
    const [updateMaterialColor, {}] = useUpdateMaterialColorMutation()

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    useEffect(() => {
        if (componentsAPIUpdate.includes('materialColorData')) {
            refetchMaterialColorData()
            funcChangeCancelSet(true)
            dispatch(deleteComponentsAPIUpdate(['materialColorData']))
        }
    }, [componentsAPIUpdate]);

    const initFieldParams: IFieldParams = {
        'name_eng': {isRequired: true, type: 'text'},
        'name_rus': {isRequired: true, type: 'text'},
        'other': {isRequired: false, type: 'text'},
        'active': {isRequired: true, type: 'boolean'},
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
        if (isComponentPrepared) {
            if (!isFetchingMaterialColorData) {
                if (!errorMaterialColorData && materialColorData) {
                    const myData = funcConvertToFieldDataType(materialColorData[0])
                    dispatch(setInputData({componentName, data: myData}))
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: [
                            'name_eng', 
                            'name_rus',
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
    }, [selectedID, isComponentPrepared, materialColorData, isFetchingMaterialColorData]);

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
                await updateMaterialColor({...myData, id: currentId}).unwrap()    
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

    function funcChangeCancelSet (newStatus: boolean) {
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

export default MaterialColorMainInfo