import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import BtnBlock from "../../../../../blocks/BtnBlock";
import ButtonMain from "../../../../../UI/buttons/ButtonMain";
import LoadingView from "../../../../../loading/LoadingView";
import ContentBlock from "../../../../../blocks/ContentBlock";
import BlockInput from "../../../../../UI/fields/BlockInput";
import { IFieldParams, IInputTypes, ITextareaTypes } from "../../../../../../store/componentsData/fieldsParamsSlice";
import { deleteAllComponentData, deleteChangedComponentData, IInputValue, ISelectValue, ITextareaValue, setInputData } from "../../../../../../store/componentsData/componentsDataSlice";
import { useEffectStoreData } from "../../../../../hooks/useEffectStoreData";
import { useComponentPreparation } from "../../../../../hooks/useComponentPreparation";
import { useAllComponentParamsReset } from "../../../../../hooks/useComponentDataReset";
import useTimeoutManager from "../../../../../hooks/useTimeoutManager";
import { useFieldValueChange } from "../../../../../hooks/useFieldValueChange";
import { deleteComponentsAPIUpdate } from "../../../../../../store/componentsData/componentsAPIUpdateSlice";
import { setLoadingStatus } from "../../../../../../store/componentsData/loadingProcessSlice";
import { funcConvertToFieldDataType } from "../../../../../functions/funcConvertToFieldDataType";
import { setSavingStatus } from "../../../../../../store/componentsData/savingProcessSlice";
import { funcValidateFields } from "../../../../../functions/funcValidateFields";
import { deleteFieldInvalid, setFieldInvalid } from "../../../../../../store/componentsData/fieldsInvalidSlice";
import { functionErrorMessage } from "../../../../../functions/functionErrorMessage";
import { changeComponentReadOnly } from "../../../../../../store/componentsData/componentsReadOnlySlice";
import BlockTextarea from "../../../../../UI/fields/BlockTextarea";
import { useAddProductionDataMutation, useGetProductionDataQuery, useUpdateProductionDataMutation } from "../../../../../../store/api/productionDataApiSlice";
import BlockSelect from "../../../../../UI/fields/BlockSelect";


interface IProductionData {
    selectedID: number
}

const ProductionData = ({
    selectedID,
}: IProductionData) => {

    const componentName = 'ProductionData'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const { loadingProcess, fieldParams, componentData, componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: productionData, isFetching: isFetchingProductionData, error: errorProductionData, refetch: refetchProductionData} = useGetProductionDataQuery({line_number: selectedID});
    const [updateProductionData, {}] = useUpdateProductionDataMutation()
    const [addProductionData, {}] = useAddProductionDataMutation()

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);
    
    useEffect(() => {
        if (componentsAPIUpdate.includes('productionData')) {
            updateAPIData('productionData', refetchProductionData)
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
        'month_plan': {isRequired: false, type: 'text'},
        'date_plan': {isRequired: false, type: 'date'},
        'date_client': {isRequired: false, type: 'date'},
        'date_fact': {isRequired: false, type: 'date'},
        'other': {isRequired: false, type: 'text'}
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
        if (isComponentPrepared) {
            if (!isFetchingProductionData) {
                if (!errorProductionData && productionData) {
                    const myData = funcConvertToFieldDataType(productionData[0])
                    dispatch(setInputData({componentName, data: myData}))
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: Object.keys(initFieldParams)}}))
                    }, 1000)  
                } else {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: Object.keys(initFieldParams)}}))
                    }, 1000)
                }
            }
        }
    }, [selectedID, isComponentPrepared, productionData, isFetchingProductionData]); 

    useEffect(() => {
        funcChangeCancelSet(true)
    }, [selectedID]);

    useEffect(() => {
        if (isFetchingProductionData) {
            funcChangeCancelSet(true)
        }
    }, [isFetchingProductionData]);

    async function funcSaveFields () {
        dispatch(setSavingStatus({componentName, data: {status: true}}))
        const currentId: number = componentData?.objInputAndChangedData['id'] as number
        const isValid = funcValidateFields(fieldParams, componentData?.objInputAndChangedData, componentData?.objChangedData)
        if (currentId) {
            if (isValid.isAllFieldsValid) {
                dispatch(deleteFieldInvalid({componentName}))
                const myData = componentData.objChangedData
                await updateProductionData({...myData, id: currentId}).unwrap()    
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
            if (isValid.isAllFieldsValid) {
                dispatch(deleteFieldInvalid({componentName}))
                const myData = componentData.objChangedData
                await addProductionData({...myData, line_number: selectedID}).unwrap()    
                .then((res) => {
                    dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: true}}))
                    dispatch(deleteAllComponentData({componentName}))
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
        }
    }     

    function funcChangeCancelSet(newStatus: boolean) {
        dispatch(deleteChangedComponentData({componentName}))
        dispatch(changeComponentReadOnly({componentName, newStatus}))
        dispatch(deleteFieldInvalid({componentName}))            
    }

    const [monthYear, setMonthYear] = useState<{ id: number, name: string, fullDate: string }[]>([]);
    useEffect(() => {
        const generateMonthYearList = () => {
            const months = [
              'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
              'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
            ];
            
            const currentDate = new Date();
            const result = [];
      
            for (let i = 0; i < 12; i++) {
              const monthIndex = (currentDate.getMonth() + i) % 12;
              const year = currentDate.getFullYear() + Math.floor((currentDate.getMonth() + i) / 12);
      
              const fullDate = `${year}-${String(monthIndex + 1).padStart(2, '0')}-01`;
      
              result.push({
                id: i + 1,
                name: `${months[monthIndex]} ${year}`,
                fullDate: fullDate
              });
            }
            setMonthYear(result);
        };
          generateMonthYearList();
    }, []);

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
            <ContentBlock myStyleMain={{flex: '0 0 auto'}} myStyleContent={{display: 'flex', flexDirection: 'row'}}>
                <ContentBlock  myStyleMain={{}} line={true}>
                    <BlockSelect
                        fieldName={'month_plan'}
                        showName={"name"}
                        title={'Ориентировочный месяц и год получение заказа'}
                        value={monthYear.find(item => item.fullDate === componentData?.objInputAndChangedData['month_plan'])?.id as ISelectValue}
                        options={monthYear}
                        onChange={(obj) => setValues({name: 'month_plan', value: monthYear.find(item => item.id === obj.value)?.fullDate as string || ''})}   
                        skeletonLoading={loadingProcess?.['month_plan']}
                        isRequired={fieldParams?.['month_plan']?.isRequired}  
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['month_plan']}
                        isChanged={!!componentData?.objChangedData?.['month_plan']}
                        isSortDisabled={true}
                        isEmptyOption={true}
                    ></BlockSelect>                 
                    <BlockInput
                        onChange={(obj) => setValues(obj)}
                        fieldName={'date_plan'}
                        title={'Ориентировочная дата окончания производства'}
                        type={fieldParams?.['date_plan']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['date_plan'] as IInputValue}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['date_plan']}
                        isRequired={fieldParams?.['date_plan']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['date_plan']}
                        isChanged={!!componentData?.objChangedData?.['date_plan']}
                    ></BlockInput>
                    <BlockInput
                        onChange={(obj) => setValues(obj)}
                        fieldName={'date_client'}
                        title={'Дата для клиента'}
                        type={fieldParams?.['date_client']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['date_client'] as IInputValue}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['date_client']}
                        isRequired={fieldParams?.['date_client']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['date_client']}
                        isChanged={!!componentData?.objChangedData?.['date_client']}
                    ></BlockInput>
                    <BlockInput
                        onChange={(obj) => setValues(obj)}
                        fieldName={'date_fact'}
                        title={'Фактическая дата'}
                        type={fieldParams?.['date_fact']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['date_fact'] as IInputValue}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['date_fact']}
                        isRequired={fieldParams?.['date_fact']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['date_fact']}
                        isChanged={!!componentData?.objChangedData?.['date_fact']}
                    ></BlockInput>
                </ContentBlock>
                <ContentBlock  myStyleMain={{}}>
                    <BlockTextarea
                        onChange={(obj) => setValues(obj)}
                        fieldName={'other'}
                        title={'Комментарий'}
                        type={fieldParams?.['other']?.type as ITextareaTypes}
                        value={componentData?.objInputAndChangedData['other'] as ITextareaValue}
                        placeholder={'Введите комментарий'}
                        skeletonLoading={loadingProcess?.['other']}
                        isRequired={fieldParams?.['other']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['other']}
                        isChanged={!!componentData?.objChangedData?.['other']}
                        rows={8}
                    ></BlockTextarea>
                </ContentBlock>
            </ContentBlock>
        </>)}
    </>)
}


export default ProductionData