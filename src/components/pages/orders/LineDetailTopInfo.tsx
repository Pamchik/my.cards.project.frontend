import { useEffect, useState } from "react";
import { useEffectStoreData } from "../../hooks/useEffectStoreData";
import { useComponentPreparation } from "../../hooks/useComponentPreparation";
import { useFieldValueChange } from "../../hooks/useFieldValueChange";
import { useDispatch } from "react-redux";
import { deleteComponentsAPIUpdate, setComponentsAPIUpdate } from "../../../store/componentsData/componentsAPIUpdateSlice";
import { IFieldParams, IInputTypes } from "../../../store/componentsData/fieldsParamsSlice";
import { setLoadingStatus } from "../../../store/componentsData/loadingProcessSlice";
import { funcConvertToFieldDataType } from "../../functions/funcConvertToFieldDataType";
import { IInputValue, ISelectValue, deleteAllComponentData, deleteChangedComponentData, setInputData } from "../../../store/componentsData/componentsDataSlice";
import { setSavingStatus } from "../../../store/componentsData/savingProcessSlice";
import { funcValidateFields } from "../../functions/funcValidateFields";
import { deleteFieldInvalid, setFieldInvalid } from "../../../store/componentsData/fieldsInvalidSlice";
import { functionErrorMessage } from "../../functions/functionErrorMessage";
import { changeComponentReadOnly } from "../../../store/componentsData/componentsReadOnlySlice";
import { useGetBankQuery } from "../../../store/api/bankApiSlice";
import UrgentIconButton from "../../UI/buttons/UrgentIconButton";
import BlockSelect from "../../UI/fields/BlockSelect";
import ButtonMain from "../../UI/buttons/ButtonMain";
import BlockInput from "../../UI/fields/BlockInput";
import { useAllComponentParamsReset } from "../../hooks/useComponentDataReset";
import useTimeoutManager from "../../hooks/useTimeoutManager";
import { useGetProjectQuery, useUpdateProjectMutation, useUpdateProjectWithoutReloadingMutation } from "../../../store/api/projectsApiSlice";
import { useGetProjectStatusesQuery } from "../../../store/api/projectStatusApiSlice";
import { useGetPaymentSystemsQuery } from "../../../store/api/paymentSystemApiSlice";
import { useGetProductCategoriesQuery } from "../../../store/api/productCategoryApiSlice";
import { useGetProcessNamesQuery } from "../../../store/api/processNamesApiSlice";

interface ILineDetailTopInfo {
    selectedID: number
    selectedTab: number
}

const LineDetailTopInfo = ({
    selectedID,
    selectedTab
}: ILineDetailTopInfo) => {

    const componentName = 'LineDetailTopInfo'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const { loadingProcess, fieldParams, componentData, componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: projectData, isFetching: isFetchingProjectData, error: errorProjectData, refetch: refetchProjectData} = useGetProjectQuery({id: selectedID});
    const {data: bankData, isFetching: isFetchingBankData, error: errorBankData, refetch: refetchBankData} = useGetBankQuery(
        {id: projectData?.[0].bank},
        { 
            skip: !componentData?.objInputAndChangedData['bank'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['bank'] ? data : [],
                ...other
            })  
        }
    )
    const {data: paymentSystemsData, isFetching: isFetchingPaymentSystemsData, error: errorPaymentSystemsData, refetch: refetchPaymentSystemsData} = useGetPaymentSystemsQuery(undefined);
    const {data: productCategoriesData, isFetching: isFetchingProductCategoriesData, error: errorProductCategoriesData, refetch: refetchProductCategoriesData} = useGetProductCategoriesQuery(undefined);
    const {data: projectStatuses, isFetching: isFetchingProjectStatuses, error: errorProjectStatuses, refetch: refetchProjectStatuses} = useGetProjectStatusesQuery(undefined)
    const {data: processNamesData, isFetching: isFetchingProcessNamesData, error: errorProcessNamesData, refetch: refetchProcessNamesData} = useGetProcessNamesQuery(undefined)

    const [updateProject, {}] = useUpdateProjectWithoutReloadingMutation()

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    function funcUpdateData() {
        if (selectedTab === 0) {
            dispatch(setComponentsAPIUpdate([
                'projectData',
                'bankData',
                'projectStatuses',
                'paymentSystemsData',
                'productCategoriesData',
                'materialsData',
                'materialColorsData',
                'laminationsData',
                'chipsData',
                'appletsData',
                'chipColorsData',
                'mifaresData',
                'magstripeTracksData',
                'magstripeColorsData',
                'antennasData',
                'effectsData',
                'bankEmployeesData',
                'countriesData',
                'vendorData',
                'vendorEmployeesData',
                'vendorManufacturiesData',
                'changelogData'
            ]))            
        } else if (selectedTab === 1) {
            dispatch(setComponentsAPIUpdate([
                'processNamesData',
                'processStatusesData',
                'processData',
                'annexesConditionData',
                ...(processNamesData?.map(item => `processData_${item.id}`) || []),
                ...(processNamesData?.map(item => `filesData_${item.id}`) || []),
                'deliveriesVendorInfoData',
                'deliveriesBankInfoData',
                'deliveriesInfoData_vendor',
                'deliveriesInfoData_bank',
                'deliveriesTableInfoData_vendorTable',
                'deliveriesTableInfoData_bankTable',
                'projectData',
                'currenciesData',
                'paymentsVendorInfoData',
                'paymentsBankInfoData',
                'vendorPriceData',
                'bankPriceData',
                'banksData',
                'paymentsInfoTableData_vendorTable',
                'paymentsInfoData_bank',
                'paymentsInfoData_vendor',
                'paymentsInfoTableData_bankTable',
                'bankBIDsData',
                'paymentSystemApprovalData',
                'POConditionData',
                'productionData',
                'changelogData'
            ]))
        } else if (selectedTab === 2) {
            dispatch(setComponentsAPIUpdate([
                'galleriesData',
            ]))
        }
    }

    useEffect(() => {
        if (componentsAPIUpdate.includes('projectData')) {
            updateAPIData('projectData', refetchProjectData)
        } else if (componentsAPIUpdate.includes('projectStatuses')) {
            updateAPIData('projectStatuses', refetchProjectStatuses)
        } else if (componentsAPIUpdate.includes('paymentSystemsData')) {
            updateAPIData('paymentSystemsData', refetchPaymentSystemsData)
        } else if (componentsAPIUpdate.includes('productCategoriesData')) {
            updateAPIData('productCategoriesData', refetchProductCategoriesData)
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
        'title': {isRequired: false, type: 'text'},
        'general_line_status': {isRequired: true, type: 'number'}
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

   useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['title']}}))
        if (isComponentPrepared) {
            if (!isFetchingProjectData && !isFetchingBankData) {
                if (!errorProjectData && projectData && !errorBankData && !errorPaymentSystemsData && !errorProductCategoriesData) {
                    const myData = funcConvertToFieldDataType(projectData[0])
                    dispatch(setInputData({componentName, data: myData}))
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: [
                            'title'
                        ]}}))
                    }, 1000)  
                } else {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['title']}}))
                    }, 1000)
                }
            }
        }
    }, [selectedID, isComponentPrepared, projectData, isFetchingProjectData, bankData, isFetchingBankData, paymentSystemsData, isFetchingPaymentSystemsData, productCategoriesData, isFetchingProductCategoriesData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['general_line_status']}}))
        if (isComponentPrepared && !isFetchingProjectStatuses && !isFetchingProjectData && !errorProjectData ) {
            if (!errorProjectStatuses) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['general_line_status']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['general_line_status']}}))
                }, 1000)
            }
        }
    }, [selectedID, isComponentPrepared, isFetchingProjectData, isFetchingProjectStatuses]);

    useEffect(() => {
        funcChangeCancelSet(true)
    }, [selectedID]);

    useEffect(() => {
        if (isFetchingProjectData) {
            funcChangeCancelSet(true)
        }
    }, [isFetchingProjectData]);

    async function funcSaveFields () {
        dispatch(setSavingStatus({componentName, data: {status: true}}))
        const currentId: number = componentData?.objInputAndChangedData['id'] as number
        if (currentId) {
            const isValid = funcValidateFields(fieldParams, componentData?.objInputAndChangedData, componentData?.objChangedData)
            if (isValid.isAllFieldsValid) {
                dispatch(deleteFieldInvalid({componentName}))
                const myData = componentData.objChangedData
                await updateProject({...myData, id: currentId}).unwrap()    
                .then((res) => {
                    dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: true}}))
                    // dispatch(deleteAllComponentData({componentName}))
                    setValues({name: 'general_line_status', value: componentData.objChangedData['general_line_status']})
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
    
    async function funcSaveFieldUrgent () {
        dispatch(setSavingStatus({componentName, data: {status: true}}))
        const currentId: number = componentData?.objInputAndChangedData['id'] as number
        if (currentId) {
                const urgentStatus = componentData?.objInputAndChangedData['isUrgent']
                await updateProject({...{isUrgent: !urgentStatus}, id: currentId}).unwrap()    
                .then((res) => {
                    dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: true}}))
                    // dispatch(deleteAllComponentData({componentName}))
                    setValues({name: 'isUrgent', value: !urgentStatus})
                    funcChangeCancelSet(true)
                    setManagedTimeout(() => { 
                        dispatch(setSavingStatus({ componentName, data: { status: false } }))
                    }, 1000)  
                }).catch((error) => {
                    const message = functionErrorMessage(error)
                    dispatch(setSavingStatus({ componentName, data: { status: true, isSuccessful: false, message: message} }))
                })
        } else {
            dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: false, message: "Ошибка! Обновите страницу и попробуйте заново."}}))
        }
    } 

    function funcChangeCancelSet(newStatus: boolean) {
        // dispatch(deleteChangedComponentData({componentName}))
        dispatch(changeComponentReadOnly({componentName, newStatus}))
        dispatch(deleteFieldInvalid({componentName}))            
    }

    const [number, setNumber] = useState<string | undefined>(undefined)
    useEffect(() => {
        setNumber(componentData?.objInputAndChangedData?.['number'] as string | undefined)
    }, [componentData?.objInputAndChangedData?.['number']]);

    const [bankName, setBankName] = useState<string | undefined>(undefined)
    useEffect(() => {
        setBankName(bankData?.find(item => item.id === componentData?.objInputAndChangedData?.['bank'])?.name_eng as string | undefined)
    }, [bankData, componentData?.objInputAndChangedData?.['bank']]);

    const [paymentSystemName, setPaymentSystemName] = useState<string | undefined>(undefined)
    useEffect(() => {
        setPaymentSystemName(paymentSystemsData?.find(item => item.id === componentData?.objInputAndChangedData?.['payment_system'])?.name as string | undefined)
    }, [paymentSystemsData, componentData?.objInputAndChangedData?.['payment_system']]);

    const [cardCategoryName, setCardCategoryName] = useState<string | undefined>(undefined)
    useEffect(() => {
        setCardCategoryName(productCategoriesData?.find(item => item.id === componentData?.objInputAndChangedData?.['product_category'])?.name as string | undefined)
    }, [productCategoriesData, componentData?.objInputAndChangedData?.['product_category']]);

    const [productName, setProductName] = useState<string | undefined>(undefined)
    useEffect(() => {
        setProductName(componentData?.objInputAndChangedData?.['product_name'] as string | undefined)
    }, [componentData?.objInputAndChangedData?.['product_name']]);

    const [title, setTitle] = useState<string>('')
    useEffect(() => {
        setTitle(
            `${number ? `${number} : ` : ''}${bankName ? `${bankName}` : ''} ${paymentSystemName ? `${paymentSystemName}${cardCategoryName ? ` ${cardCategoryName}` : ''}` : ''} ${productName ? `${productName}` : ''}`.trim()
        )
    }, [number, bankName, paymentSystemName, cardCategoryName, productName]);

    return (<>
        <div className="top-info-block">
            <div className="top-info-block__info">
                <BlockInput
                    onChange={(obj) => setValues(obj)}
                    fieldName={'title'}
                    type={fieldParams?.['title']?.type as IInputTypes}
                    value={title as IInputValue}
                    skeletonLoading={loadingProcess?.['title']}
                    isReadOnly={true}
                    myStyle={{marginTop: '0', marginBottom: '0', marginLeft: '0', marginRight: '0', width: '100%' }}
                    myStyleInput={{fontWeight: '600',  background: 'transparent'}}
                />
            </div>

            <div className="top-info-block__status">
                <UrgentIconButton
                    value={componentData?.objInputAndChangedData['isUrgent'] as boolean | undefined}
                    onClick={() => funcSaveFieldUrgent()}
                />
                <p>Статус</p>
                <BlockSelect
                    fieldName={'general_line_status'}
                    showName={"name"}
                    value={componentData?.objInputAndChangedData['general_line_status'] as ISelectValue}
                    options={projectStatuses || []}
                    isEmptyOption={true}
                    onChange={(obj) => setValues(obj)}   
                    skeletonLoading={loadingProcess?.['general_line_status']}
                    isRequired={fieldParams?.['general_line_status']?.isRequired}  
                    isReadOnly={componentReadOnly?.status} 
                    isInvalidStatus={componentInvalidFields?.['general_line_status']}   
                    isChanged={!!componentData?.objChangedData?.['general_line_status']}  
                    myStyle={{ width: '200px', textAlignLast: 'center', marginTop: 'auto', marginBottom: 'auto', marginLeft: '10px' }}
                    isSortDisabled={true}
                />
            </div>
            <div className="top-info-block__btn-block">
                { componentReadOnly?.status
                ? 
                    <ButtonMain
                        type={'changeIcon'}
                        onClick={() => funcChangeCancelSet(false)}
                    /> 
                :
                    <>
                        <ButtonMain
                            type={'submitIcon'}
                            onClick={funcSaveFields}
                        />                    
                        <ButtonMain
                            type={'resetIcon'}
                            onClick={() => funcChangeCancelSet(true)}
                        />  
                    </>  
                }    

                <ButtonMain
                    onClick={funcUpdateData}
                    type={'repeatIcon'}
                />
            </div>            
        </div>
    </>)
}

export default LineDetailTopInfo