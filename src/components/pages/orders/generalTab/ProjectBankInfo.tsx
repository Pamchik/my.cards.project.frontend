import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useGetProjectQuery } from "../../../../store/api/projectsApiSlice";
import { useEffectStoreData } from "../../../hooks/useEffectStoreData";
import { useComponentPreparation } from "../../../hooks/useComponentPreparation";
import { useAllComponentParamsReset } from "../../../hooks/useComponentDataReset";
import useTimeoutManager from "../../../hooks/useTimeoutManager";
import { useFieldValueChange } from "../../../hooks/useFieldValueChange";
import { IFieldParams, IInputTypes, ITextareaTypes } from "../../../../store/componentsData/fieldsParamsSlice";
import BtnBlock from "../../../blocks/BtnBlock";
import ButtonMain from "../../../UI/buttons/ButtonMain";
import LoadingView from "../../../loading/LoadingView";
import ContentBlock from "../../../blocks/ContentBlock";
import BlockSelect from "../../../UI/fields/BlockSelect";
import { deleteChangedComponentData, IInputValue, ISelectValue, ITextareaValue, setInputData } from "../../../../store/componentsData/componentsDataSlice";
import { setModalProps } from "../../../../store/modalData/modalsPropsDataSlice";
import { setModalOpen } from "../../../../store/modalData/modalsSlice";
import { funcConvertToFieldDataType } from "../../../functions/funcConvertToFieldDataType";
import BlockInput from "../../../UI/fields/BlockInput";
import { deleteComponentsAPIUpdate } from "../../../../store/componentsData/componentsAPIUpdateSlice";
import { setLoadingStatus } from "../../../../store/componentsData/loadingProcessSlice";
import BlockTextarea from "../../../UI/fields/BlockTextarea";
import { useGetBankQuery } from "../../../../store/api/bankApiSlice";
import { useGetBankEmployeesQuery } from "../../../../store/api/bankEmployeeApiSlice";
import { useGetCountriesQuery } from "../../../../store/api/countryApiSlice";
import { changeComponentReadOnly } from "../../../../store/componentsData/componentsReadOnlySlice";
import { deleteFieldInvalid } from "../../../../store/componentsData/fieldsInvalidSlice";


interface IProjectBankInfo {
    selectedID: number
}

const ProjectBankInfo = ({
    selectedID,
}: IProjectBankInfo) => {

    const componentName = 'ProjectBankInfo'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {loadingProcess, fieldParams, componentData, componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: projectData, isFetching: isFetchingProjectData, error: errorProjectData, refetch: refetchProjectData} = useGetProjectQuery({id: selectedID});
    const { data: bankData, isFetching: isFetchingBankData, error: errorBankData, refetch: refetchBankData } = useGetBankQuery(
        { id: componentData?.objInputAndChangedData['bank'] as number },
        {
            skip: !componentData?.objInputAndChangedData['bank'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['bank'] ? data : [],
                ...other
            })
        }
    )
    const { data: bankEmployeesData, isFetching: isFetchingBankEmployeesData, error: errorBankEmployeesData, refetch: refetchBankEmployeesData } = useGetBankEmployeesQuery(
        { bank: componentData?.objInputAndChangedData['bank'] as number },
        {
            skip: !componentData?.objInputAndChangedData['bank'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['bank'] ? data : [],
                ...other
            })
        }
    )
    const {data: countriesData, isFetching: isFetchingCountriesData, error: errorCountriesData, refetch: refetchCountriesData} = useGetCountriesQuery(undefined)

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    useEffect(() => {
        if (componentsAPIUpdate.includes('projectData')) {
            updateAPIData('projectData', refetchProjectData)
        } else if (componentsAPIUpdate.includes('bankData')) {
            updateAPIData('bankData', refetchBankData)
        } else if (componentsAPIUpdate.includes('bankEmployeesData')) {
            updateAPIData('bankEmployeesData', refetchBankEmployeesData)
        } else if (componentsAPIUpdate.includes('countriesData')) {
            updateAPIData('countriesData', refetchCountriesData)
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
        'bank_employee': {isRequired: false, type: 'number'},
        'bank_communication': {isRequired: false, type: 'text'},
        'bank': {isRequired: false, type: 'text'},
        'country': {isRequired: false, type: 'text'},
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
        if (isComponentPrepared) {
            if (!isFetchingProjectData) {
                if (!errorProjectData && projectData) {
                    const myData = funcConvertToFieldDataType(projectData[0])
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
    }, [selectedID, isComponentPrepared, projectData, isFetchingProjectData]); 

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['bank']}}))
        if (isComponentPrepared && !isFetchingBankData && !isFetchingProjectData && !errorProjectData) {
            if (!errorBankData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['bank']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['bank']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingBankData, isFetchingProjectData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['country']}}))
        if (isComponentPrepared && !isFetchingCountriesData && !isFetchingProjectData && !errorProjectData) {
            if (!errorCountriesData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['country']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['country']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingCountriesData, isFetchingProjectData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['bank_employee']}}))
        if (isComponentPrepared && !isFetchingBankEmployeesData && !isFetchingProjectData && !errorProjectData) {
            if (!errorBankEmployeesData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['bank_employee']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['bank_employee']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingBankEmployeesData, isFetchingProjectData]);

    useEffect(() => {
        funcChangeCancelSet(true)
    }, [selectedID]);

    useEffect(() => {
        if (isFetchingProjectData) {
            funcChangeCancelSet(true)
        }
    }, [isFetchingProjectData]);

    function funcChangeCancelSet(newStatus: boolean) {
        dispatch(deleteChangedComponentData({componentName}))
        dispatch(changeComponentReadOnly({componentName, newStatus}))
        dispatch(deleteFieldInvalid({componentName}))        
    }

    return (<>
        {isComponentPrepared && (<>

            {savingProcess?.status && 
                <LoadingView
                    isSuccessful={savingProcess.isSuccessful} 
                    errorMessage={savingProcess.message} 
                    componentName={componentName} 
                />
            } 

            <ContentBlock myStyleContent={{flexDirection: 'row', display: 'flex', height: '100%'}}>
                <ContentBlock line={true} title={'Реквизиты Банка (rus):'}>
                    <BlockInput
                        onChange={() => {}}
                        fieldName={'full_name_rus'}
                        title={'Полное наименование (рус)'}
                        type={'text'}
                        value={bankData?.find(item => item.id === componentData?.objInputAndChangedData['bank'])?.full_name_rus as IInputValue}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['bank']}
                        isRequired={false}
                        isReadOnly={true}
                    ></BlockInput>
                    <BlockTextarea
                        onChange={() => {}}
                        fieldName={'address_rus'}
                        title={'Адрес (рус)'}
                        type={'text'}
                        value={bankData?.find(item => item.id === componentData?.objInputAndChangedData['bank'])?.address_rus as ITextareaValue}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['bank']}
                        isRequired={false}
                        isReadOnly={true}
                    ></BlockTextarea>
                    <BlockInput
                        onChange={() => {}}
                        fieldName={'country_rus'}
                        title={'Страна (рус)'}
                        type={fieldParams?.['country']?.type as IInputTypes}
                        value={countriesData?.find(item => item.id === bankData?.find(item => item.id === componentData?.objInputAndChangedData['bank'])?.country)?.name_rus as IInputValue}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['country']}
                        isRequired={false}
                        isReadOnly={true}
                    ></BlockInput>
                </ContentBlock>
                <ContentBlock line={true} title={'Реквизиты Банка (eng):'}>
                    <BlockInput
                        onChange={() => {}}
                        fieldName={'full_name_eng'}
                        title={'Полное наименование (eng)'}
                        type={'text'}
                        value={bankData?.find(item => item.id === componentData?.objInputAndChangedData['bank'])?.full_name_eng as IInputValue}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['bank']}
                        isRequired={false}
                        isReadOnly={true}
                    ></BlockInput>
                    <BlockTextarea
                        onChange={() => {}}
                        fieldName={'address_eng'}
                        title={'Адрес (eng)'}
                        type={'text'}
                        value={bankData?.find(item => item.id === componentData?.objInputAndChangedData['bank'])?.address_eng as ITextareaValue}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['bank']}
                        isRequired={false}
                        isReadOnly={true}
                    ></BlockTextarea>
                    <BlockInput
                        onChange={() => {}}
                        fieldName={'country_eng'}
                        title={'Страна (eng)'}
                        type={fieldParams?.['country']?.type as IInputTypes}
                        value={countriesData?.find(item => item.id === bankData?.find(item => item.id === componentData?.objInputAndChangedData['bank'])?.country)?.name_eng as IInputValue}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['country']}
                        isRequired={false}
                        isReadOnly={true}
                    ></BlockInput>
                </ContentBlock>
                <ContentBlock line={true} title={'Контакты Банка:'}>
                    <BlockSelect
                        fieldName={'bank_employee'}
                        showName={"name"}
                        title={'Имя сотрудника'}
                        value={componentData?.objInputAndChangedData['bank_employee'] as ISelectValue}
                        options={bankEmployeesData || []}
                        isEmptyOption={true}
                        onChange={(obj) => setValues(obj)}
                        skeletonLoading={loadingProcess?.['bank_employee']}
                        isRequired={fieldParams?.['bank_employee']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['bank_employee']}
                        isChanged={!!componentData?.objChangedData?.['bank_employee']}
                    >
                        <ButtonMain
                            onClick={() => { }}
                            type={'other'}
                            color="transparent"
                            drop={true}
                            actions={[
                                {
                                    name: "Добавить",
                                    onClick: () => {
                                        dispatch(setModalProps({
                                            componentName: 'CreateNewBankEmployeeModal', data: {
                                                objChangedData: {
                                                    active: true,
                                                    bank: componentData?.objInputAndChangedData['bank']
                                                },
                                                objReadOnlyFields: ['active', 'bank'],
                                                qtyFieldsForSavingBtn: 2
                                            }
                                        }))
                                        dispatch(setModalOpen('CreateNewBankEmployeeModal'))
                                    }
                                },
                                {
                                    name: "Изменить",
                                    onClick: () => {
                                        const data = bankEmployeesData?.find(item => item.id === componentData?.objInputAndChangedData['bank_employee'])
                                        if (data) {
                                            dispatch(setModalProps({
                                                componentName: 'CreateNewBankEmployeeModal', data: {
                                                    objInputData: funcConvertToFieldDataType(data),
                                                    objReadOnlyFields: ['active', 'bank'],
                                                    qtyFieldsForSavingBtn: 0
                                                }
                                            }))
                                            dispatch(setModalOpen('CreateNewBankEmployeeModal'))
                                        } else {
                                            return {}
                                        }
                                    },
                                    disabled: !!!componentData?.objInputAndChangedData['bank_employee']
                                }
                            ]}
                            myStyle={{ width: '20px', height: '20px', margin: '2.5px 4px' }}
                        />
                    </BlockSelect>
                    <BlockInput
                        onChange={() => {}}
                        fieldName={'bank_employee_email'}
                        title={'Почта сотрудника'}
                        type={'text'}
                        value={bankEmployeesData?.find(item => item.id === componentData?.objInputAndChangedData['bank_employee'])?.email as IInputValue}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['bank_employee']}
                        isRequired={false}
                        isReadOnly={true}
                    ></BlockInput>
                    <BlockInput
                        onChange={() => {}}
                        fieldName={'bank_employee_phone'}
                        title={'Телефон сотрудника'}
                        type={'text'}
                        value={bankEmployeesData?.find(item => item.id === componentData?.objInputAndChangedData['bank_employee'])?.phone as IInputValue}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['bank_employee']}
                        isRequired={false}
                        isReadOnly={true}
                    ></BlockInput>
                    <BlockTextarea
                        onChange={() => {}}
                        fieldName={'bank_employee_other'}
                        title={'Дополнительная информация'}
                        type={'text'}
                        value={bankEmployeesData?.find(item => item.id === componentData?.objInputAndChangedData['bank_employee'])?.other as ITextareaValue}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['bank_employee']}
                        isRequired={false}
                        isReadOnly={true}
                    ></BlockTextarea>
                </ContentBlock>
                <ContentBlock title={'Общение по заказу:'}>
                    <BlockTextarea
                        onChange={(obj) => setValues(obj)}
                        fieldName={'bank_communication'}
                        title={'Тема письма с Банком'}
                        type={fieldParams?.['bank_communication']?.type as ITextareaTypes}
                        value={componentData?.objInputAndChangedData['bank_communication'] as ITextareaTypes}
                        placeholder={'Введите текст'}
                        skeletonLoading={loadingProcess?.['bank_communication']}
                        isRequired={fieldParams?.['bank_communication']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['bank_communication']}
                        isChanged={!!componentData?.objChangedData?.['bank_communication']}
                        rows={11}
                    ></BlockTextarea>
                </ContentBlock>
            </ContentBlock>
        </>)}
    </>)
}


export default ProjectBankInfo