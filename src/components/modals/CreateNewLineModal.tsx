import { useEffect, useState } from "react";
import { MainModalBtnBlock, MainModalMainBlock, MainModalText, MainModalTopBlock, ModalViewBase } from "./ModalViewBase"
import { useEffectStoreData } from "../hooks/useEffectStoreData";
import { useComponentPreparation } from "../hooks/useComponentPreparation";
import { useFieldValueChange } from "../hooks/useFieldValueChange";
import { useDispatch } from "react-redux";
import { setModalClose, setModalOpen } from "../../store/modalData/modalsSlice";
import ButtonMain from "../UI/buttons/ButtonMain";
import ContentBlock from "../blocks/ContentBlock";
import BlockInput from "../UI/fields/BlockInput";
import { IFieldParams, IInputTypes } from "../../store/componentsData/fieldsParamsSlice";
import { IInputValue, ISelectValue, deleteAllComponentData, setChangedData, setInputData } from "../../store/componentsData/componentsDataSlice";
import { setLoadingStatus } from "../../store/componentsData/loadingProcessSlice";
import { deleteModalProps, setModalProps } from "../../store/modalData/modalsPropsDataSlice";
import { setSavingStatus } from "../../store/componentsData/savingProcessSlice";
import { funcValidateFields } from "../functions/funcValidateFields";
import { deleteFieldInvalid, setFieldInvalid } from "../../store/componentsData/fieldsInvalidSlice";
import { functionErrorMessage } from "../functions/functionErrorMessage";
import LoadingView from "../loading/LoadingView";
import { useGetBanksQuery } from "../../store/api/bankApiSlice";
import BlockSelect from "../UI/fields/BlockSelect";
import { funcConvertToFieldDataType } from "../functions/funcConvertToFieldDataType";
import { useAllComponentParamsReset } from "../hooks/useComponentDataReset";
import { useGetVendorsQuery } from "../../store/api/vendorApiSlice";
import { useGetProductTypesQuery } from "../../store/api/productTypeApiSlice";
import { useGetPaymentSystemsQuery } from "../../store/api/paymentSystemApiSlice";
import { useGetProductCategoriesQuery } from "../../store/api/productCategoryApiSlice";
import { useAddProjectMutation } from "../../store/api/projectsApiSlice";
import useTimeoutManager from "../hooks/useTimeoutManager";


const CreateNewLineModal = () => {

    const componentName = 'CreateNewLineModal'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {modalsPropsData, loadingProcess, fieldParams, componentData, componentInvalidFields, savingProcess, componentsAPIUpdate} = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: vendorsData, isFetching: isFetchingVendorsData, error: errorVendorsData, refetch: refetchVendorsData} = useGetVendorsQuery(undefined)
    const {data: banksData, isFetching: isFetchingBanksData, error: errorBanksData, refetch: refetchBanksData} = useGetBanksQuery(undefined)
    const {data: productTypesData, isFetching: isFetchingProductTypesData, error: errorProductTypesData, refetch: refetchProductTypesData} = useGetProductTypesQuery(
        { vendor: componentData?.objInputAndChangedData['vendor'] as number},
        { 
            skip: !componentData?.objInputAndChangedData['vendor'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['vendor'] ? data : [],
                ...other
            })  
        }
    );
    const {data: paymentSystemsData, isFetching: isFetchingPaymentSystemsData, error: errorPaymentSystemsData, refetch: refetchPaymentSystemsData} = useGetPaymentSystemsQuery(undefined)
    const {data: productCategoriesData, isFetching: isFetchingProductCategoriesData, error: errorProductCategoriesData, refetch: refetchProductCategoriesData} = useGetProductCategoriesQuery(
        { payment_system: componentData?.objInputAndChangedData['payment_system'] as number},
        {   
            skip: !componentData?.objInputAndChangedData['payment_system'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['payment_system'] ? data : [],
                ...other
            })  
        }
    );

    const [addProject, {}] = useAddProjectMutation()

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    const initFieldParams: IFieldParams = {
        'vendor': {isRequired: true, type: 'number'},
        'bank': {isRequired: true, type: 'number'},
        'product_type': {isRequired: true, type: 'number'},
        'payment_system': {isRequired: true, type: 'number'},
        'product_category': {isRequired: false, type: 'number'},
        'product_name': {isRequired: false, type: 'text'}
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['vendor']}}))
        if (isComponentPrepared && !isFetchingVendorsData) {
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
    }, [isComponentPrepared, isFetchingVendorsData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['bank']}}))
        if (isComponentPrepared && !isFetchingBanksData) {
            if (!errorBanksData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['bank']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['bank']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingBanksData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['product_type']}}))
        if (isComponentPrepared && !isFetchingProductTypesData) {
            if (!errorProductTypesData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['product_type']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['product_type']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingProductTypesData, componentData?.objInputAndChangedData['vendor']]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['payment_system']}}))
        if (isComponentPrepared && !isFetchingPaymentSystemsData) {
            if (!errorPaymentSystemsData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['payment_system']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['payment_system']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingPaymentSystemsData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['product_category']}}))
        if (isComponentPrepared && !isFetchingProductCategoriesData) {
            if (!errorProductCategoriesData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['product_category']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['product_category']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingProductCategoriesData, componentData?.objInputAndChangedData['payment_system']]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
        if (isComponentPrepared) {
            setManagedTimeout(() => {
                dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: Object.keys(initFieldParams)}}))
            }, 1000) 
        }
    }, [isComponentPrepared]);

    useEffect(() => {
        if (modalsPropsData?.objInputData) {
            dispatch(setInputData({componentName, data: modalsPropsData.objInputData}))
        }
        if (modalsPropsData?.objChangedData) {
            dispatch(setChangedData({componentName, data: modalsPropsData.objChangedData}))
        }
    }, [isComponentPrepared]);
    
    useEffect(() => {
        if (componentData?.objInputAndChangedData['product_type']) {
            setValues({name: 'product_type', value: null})
        }
    }, [componentData?.objInputAndChangedData['vendor']]);

    useEffect(() => {
        if (componentData?.objInputAndChangedData['product_category']) {
            setValues({name: 'product_category', value: ''})
        }
    }, [componentData?.objInputAndChangedData['payment_system']]);

    async function funcSaveFields () {
        dispatch(setSavingStatus({componentName, data: {status: true}}))
        const isValid = funcValidateFields(fieldParams, componentData?.objInputAndChangedData, componentData?.objChangedData)
        if (isValid.isAllFieldsValid) {
            dispatch(deleteFieldInvalid({componentName}))
            const myData = componentData.objChangedData
            await addProject({...myData}).unwrap()    
            .then((res) => {
                dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: true}}))
                dispatch(deleteAllComponentData({componentName}))
                setManagedTimeout(() => { 
                    dispatch(setSavingStatus({ componentName, data: { status: false } }))
                    dispatch(setModalClose(componentName))
                    dispatch(deleteModalProps({componentName}))

                    if (res?.id) {
                        const currentUrl = window.location.href
                        window.open(`${currentUrl}${res.id}/`, '_blank');                    
                    }
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

    return (<>
        {isComponentPrepared && (<>
            <ModalViewBase
                myStyleContext={{ }} 
                onClick={() => {
                    dispatch(setModalClose(componentName))
                    dispatch(deleteModalProps({componentName}))
                }}
                 onOverlayClick={false}
            >
                {savingProcess?.status && 
                    <LoadingView
                        isSuccessful={savingProcess.isSuccessful} 
                        errorMessage={savingProcess.message} 
                        componentName={componentName} 
                    />
                } 
                <MainModalTopBlock>
                    <div style={{width: '120px'}}></div>
                    <MainModalText modalTitle={'Создание нового проекта по картам'}/>
                    <MainModalBtnBlock myStyleBtnBlock={{width: '120px'}}>
                        {
                            componentData?.objChangedData && Object.keys(componentData.objChangedData).length > 0 && 
                            <ButtonMain
                                onClick={funcSaveFields} 
                                type={'submit'} 
                                title={'Сохранить'}
                            />
                        }
                        <ButtonMain 
                            onClick={() => {
                                dispatch(setModalClose(componentName))
                                dispatch(deleteModalProps({componentName}))
                            }}
                            type="resetIcon" 
                        />
                    </MainModalBtnBlock>
                </MainModalTopBlock>

                <MainModalMainBlock myStyleMainBlock={{ display: 'flex', minHeight: '350px', width: '800px'}}>
                    <ContentBlock>
                        <BlockSelect
                            fieldName={'vendor'}
                            showName={"name"}
                            title={'Название Вендора'}
                            value={componentData?.objInputAndChangedData['vendor'] as ISelectValue}
                            options={vendorsData || []}
                            isEmptyOption={true}
                            onChange={(obj) => setValues(obj)}   
                            skeletonLoading={loadingProcess?.['vendor']}
                            isRequired={fieldParams?.['vendor']?.isRequired}  
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('vendor')}
                            isInvalidStatus={componentInvalidFields?.['vendor']}   
                            isChanged={!!componentData?.objChangedData?.['vendor']}  
                        >
                            <ButtonMain
                                onClick={() => {}}
                                type={'other'}
                                color="transparent"
                                drop={true}
                                actions={[
                                    {
                                        name: "Добавить", 
                                        onClick: () => {
                                            dispatch(setModalProps({componentName: 'CreateNewVendorModal', data: {
                                                objChangedData: {active: true},
                                                objReadOnlyFields: ['active'],
                                                qtyFieldsForSavingBtn: 1
                                            }}))
                                            dispatch(setModalOpen('CreateNewVendorModal'))
                                        }
                                    }, 
                                    {
                                        name: "Изменить", 
                                        onClick: () => {
                                            const data = vendorsData?.find(item => item.id === componentData?.objInputAndChangedData['vendor'])
                                            if (data) {
                                                dispatch(setModalProps({componentName: 'CreateNewVendorModal', data: {
                                                    objInputData: funcConvertToFieldDataType(data),
                                                    objReadOnlyFields: ['active']
                                                }}))
                                                dispatch(setModalOpen('CreateNewVendorModal'))
                                            } else {
                                                return {}
                                            }                                        
                                        }, 
                                        disabled: !!!componentData?.objInputAndChangedData['vendor']
                                    }
                                ]}
                                myStyle={{width: '20px', height: '20px', margin: '2.5px 4px'}}
                            />
                        </BlockSelect>
                        <BlockSelect
                            fieldName={'bank'}
                            showName={"name_eng"}
                            title={'Название Банка'}
                            value={componentData?.objInputAndChangedData['bank'] as ISelectValue}
                            options={banksData || []}
                            isEmptyOption={true}
                            onChange={(obj) => setValues(obj)}   
                            skeletonLoading={loadingProcess?.['bank']}
                            isRequired={fieldParams?.['bank']?.isRequired}  
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('bank')}
                            isInvalidStatus={componentInvalidFields?.['bank']}   
                            isChanged={!!componentData?.objChangedData?.['bank']}  
                        >
                            <ButtonMain
                                onClick={() => {}}
                                type={'other'}
                                color="transparent"
                                drop={true}
                                actions={[
                                    {
                                        name: "Добавить", 
                                        onClick: () => {
                                            dispatch(setModalProps({componentName: 'CreateNewBankModal', data: {
                                                objChangedData: {active: true},
                                                objReadOnlyFields: ['active'],
                                                qtyFieldsForSavingBtn: 1
                                            }}))
                                            dispatch(setModalOpen('CreateNewBankModal'))
                                        }
                                    }, 
                                    {
                                        name: "Изменить", 
                                        onClick: () => {
                                            const data = banksData?.find(item => item.id === componentData?.objInputAndChangedData['bank'])
                                            if (data) {
                                                dispatch(setModalProps({componentName: 'CreateNewBankModal', data: {
                                                    objInputData: funcConvertToFieldDataType(data),
                                                    objReadOnlyFields: ['active', 'country']
                                                }}))
                                                dispatch(setModalOpen('CreateNewBankModal'))
                                            } else {
                                                return {}
                                            }                                        
                                        }, 
                                        disabled: !!!componentData?.objInputAndChangedData['bank']
                                    }
                                ]}
                                myStyle={{width: '20px', height: '20px', margin: '2.5px 4px'}}
                            />
                        </BlockSelect>
                        <BlockSelect
                            fieldName={'product_type'}
                            showName={"name_rus"}
                            title={'Тип продукта'}
                            value={componentData?.objInputAndChangedData['product_type'] as ISelectValue}
                            options={productTypesData || []}
                            isEmptyOption={true}
                            onChange={(obj) => setValues(obj)}   
                            skeletonLoading={loadingProcess?.['product_type']}
                            isRequired={fieldParams?.['product_type']?.isRequired}  
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('product_type')}
                            isInvalidStatus={componentInvalidFields?.['product_type']}   
                            isChanged={!!componentData?.objChangedData?.['product_type']}  
                        >
                            <ButtonMain
                                onClick={() => {}}
                                type={'other'}
                                color="transparent"
                                drop={true}
                                actions={[
                                    {
                                        name: "Добавить", 
                                        onClick: () => {
                                            dispatch(setModalProps({componentName: 'CreateNewProductTypeModal', data: {
                                                objChangedData: {
                                                    active: true, 
                                                    vendor: componentData?.objInputAndChangedData['vendor'] as ISelectValue
                                                },
                                                objReadOnlyFields: ['active', 'vendor'],
                                                qtyFieldsForSavingBtn: 2
                                            }}))
                                            dispatch(setModalOpen('CreateNewProductTypeModal'))
                                        },
                                        disabled: !!!componentData?.objInputAndChangedData['vendor']
                                    }, 
                                    {
                                        name: "Изменить", 
                                        onClick: () => {
                                            const data = productTypesData?.find(item => item.id === componentData?.objInputAndChangedData['product_type'])
                                            if (data) {
                                                dispatch(setModalProps({componentName: 'CreateNewProductTypeModal', data: {
                                                    objInputData: funcConvertToFieldDataType(data),
                                                    objReadOnlyFields: ['active', 'vendor']
                                                }}))
                                                dispatch(setModalOpen('CreateNewProductTypeModal'))
                                            } else {
                                                return {}
                                            }                                        
                                        }, 
                                        disabled: !!!componentData?.objInputAndChangedData['product_type']
                                    }
                                ]}
                                myStyle={{width: '20px', height: '20px', margin: '2.5px 4px'}}
                            />
                        </BlockSelect>
                        <BlockSelect
                            fieldName={'payment_system'}
                            showName={"name"}
                            title={'Платежная система'}
                            value={componentData?.objInputAndChangedData['payment_system'] as ISelectValue}
                            options={paymentSystemsData || []}
                            isEmptyOption={true}
                            onChange={(obj) => setValues(obj)}   
                            skeletonLoading={loadingProcess?.['payment_system']}
                            isRequired={fieldParams?.['payment_system']?.isRequired}  
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('payment_system')}
                            isInvalidStatus={componentInvalidFields?.['payment_system']}   
                            isChanged={!!componentData?.objChangedData?.['payment_system']}  
                        >
                            <ButtonMain
                                onClick={() => {}}
                                type={'other'}
                                color="transparent"
                                drop={true}
                                actions={[
                                    {
                                        name: "Добавить", 
                                        onClick: () => {
                                            dispatch(setModalProps({componentName: 'CreateNewPaymentSystemModal', data: {
                                                objChangedData: {active: true},
                                                objReadOnlyFields: ['active'],
                                                qtyFieldsForSavingBtn: 1
                                            }}))
                                            dispatch(setModalOpen('CreateNewPaymentSystemModal'))
                                        }
                                    }, 
                                    {
                                        name: "Изменить", 
                                        onClick: () => {
                                            const data = paymentSystemsData?.find(item => item.id === componentData?.objInputAndChangedData['payment_system'])
                                            if (data) {
                                                dispatch(setModalProps({componentName: 'CreateNewPaymentSystemModal', data: {
                                                    objInputData: funcConvertToFieldDataType(data),
                                                    objReadOnlyFields: ['active']
                                                }}))
                                                dispatch(setModalOpen('CreateNewPaymentSystemModal'))
                                            } else {
                                                return {}
                                            }                                        
                                        }, 
                                        disabled: !!!componentData?.objInputAndChangedData['payment_system']
                                    }
                                ]}
                                myStyle={{width: '20px', height: '20px', margin: '2.5px 4px'}}
                            />
                        </BlockSelect>
                        <BlockSelect
                            fieldName={'product_category'}
                            showName={"name"}
                            title={'Категория продукта'}
                            value={componentData?.objInputAndChangedData['product_category'] as ISelectValue}
                            options={productCategoriesData || []}
                            isEmptyOption={true}
                            onChange={(obj) => setValues(obj)}   
                            skeletonLoading={loadingProcess?.['product_category']}
                            isRequired={fieldParams?.['product_category']?.isRequired}  
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('product_category')}
                            isInvalidStatus={componentInvalidFields?.['product_category']}   
                            isChanged={!!componentData?.objChangedData?.['product_category']}  
                        >
                            <ButtonMain
                                onClick={() => {}}
                                type={'other'}
                                color="transparent"
                                drop={true}
                                actions={[
                                    {
                                        name: "Добавить", 
                                        onClick: () => {
                                            dispatch(setModalProps({componentName: 'CreateNewProductCategoryModal', data: {
                                                objChangedData: {
                                                    active: true, 
                                                    payment_system: componentData?.objInputAndChangedData['payment_system'] as ISelectValue
                                                },
                                                objReadOnlyFields: ['active', 'payment_system'],
                                                qtyFieldsForSavingBtn: 2
                                            }}))
                                            dispatch(setModalOpen('CreateNewProductCategoryModal'))
                                        },
                                        disabled: !!!componentData?.objInputAndChangedData['payment_system']
                                    }, 
                                    {
                                        name: "Изменить", 
                                        onClick: () => {
                                            const data = productCategoriesData?.find(item => item.id === componentData?.objInputAndChangedData['product_category'])
                                            if (data) {
                                                dispatch(setModalProps({componentName: 'CreateNewProductCategoryModal', data: {
                                                    objInputData: funcConvertToFieldDataType(data),
                                                    objReadOnlyFields: ['active', 'payment_system']
                                                }}))
                                                dispatch(setModalOpen('CreateNewProductCategoryModal'))
                                            } else {
                                                return {}
                                            }                                        
                                        }, 
                                        disabled: !!!componentData?.objInputAndChangedData['product_category']
                                    }
                                ]}
                                myStyle={{width: '20px', height: '20px', margin: '2.5px 4px'}}
                            />
                        </BlockSelect>
                        <BlockInput
                            onChange={(obj) => setValues(obj)}
                            fieldName={'product_name'}
                            title={'Название'}
                            type={fieldParams?.['product_name']?.type as IInputTypes}
                            value={componentData?.objInputAndChangedData['product_name'] as IInputValue}
                            placeholder={'Введите название'}
                            skeletonLoading={loadingProcess?.['product_name']}
                            isRequired={fieldParams?.['product_name']?.isRequired}
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('product_name')}
                            isInvalidStatus={componentInvalidFields?.['product_name']}
                            isChanged={!!componentData?.objChangedData?.['product_name']}
                        />
                    </ContentBlock>
                </MainModalMainBlock>
            </ModalViewBase>
        </>)}
    </>)
}

export default CreateNewLineModal