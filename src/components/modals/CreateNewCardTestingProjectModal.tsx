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
import { IFieldParams, IInputTypes, ITextareaTypes } from "../../store/componentsData/fieldsParamsSlice";
import { IInputValue, ISelectValue, ITextareaValue, deleteAllComponentData, setChangedData, setInputData } from "../../store/componentsData/componentsDataSlice";
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
import { useGetChipsQuery } from "../../store/api/chipApiSlice";
import { useAddCardTestingMutation } from "../../store/api/cardTestingApiSlice";
import BlockCheckBox from "../UI/fields/BlockCheckBox";
import BlockTextarea from "../UI/fields/BlockTextarea";
import { useGetCardTestTypesQuery } from "../../store/api/cardTestTypeApiSlice";
import { useGetKeyExchangesQuery } from "../../store/api/keyExchangeApiSlice";
import useTimeoutManager from "../hooks/useTimeoutManager";
import { useGetAppletsQuery } from "../../store/api/appletApiSlice";
import { useNavigate } from "react-router-dom";


const CreateNewCardTestingProjectModal = () => {

    const componentName = 'CreateNewCardTestingProjectModal'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {modalsPropsData, loadingProcess, fieldParams, componentData, componentInvalidFields, savingProcess, componentsAPIUpdate} = useEffectStoreData(componentName)
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
    const {data: chipsData, isFetching: isFetchingChipsData, error: errorChipsData, refetch: refetchChipsData} = useGetChipsQuery(
        { vendor: componentData?.objInputAndChangedData['vendor'] as number},
        { 
            skip: !componentData?.objInputAndChangedData['vendor'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['vendor'] ? data : [],
                ...other
            })        
        }
    );
    const {data: appletsData, isFetching: isFetchingAppletsData, error: errorAppletsData, refetch: refetchAppletsData} = useGetAppletsQuery(
        { chip: componentData?.objInputAndChangedData['chip'] as number},
        { 
            skip: !componentData?.objInputAndChangedData['chip'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['chip'] ? data : [],
                ...other
            })        
        }
    )
    const {data: cardTestTypesData, isFetching: isFetchingCardTestTypesData, error: errorCardTestTypesData, refetch: refetchCardTestTypesData} = useGetCardTestTypesQuery(undefined)
    const {data: keyExchangesData, isFetching: isFetchingKeyExchangesData, error: errorKeyExchangesData, refetch: refetchKeyExchangesData} = useGetKeyExchangesQuery(
        { bank: componentData?.objInputAndChangedData['bank'] as number},
        { 
            skip: !componentData?.objInputAndChangedData['bank'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['bank'] ? data : [],
                ...other
            })            
        }
    )
    const {data: allKeyExchangesData, isFetching: isFetchingAllKeyExchangesData, error: errorAllKeyExchangesData, refetch: refetchAllKeyExchangesData} = useGetKeyExchangesQuery(undefined)

    const [addCardTesting, {}] = useAddCardTestingMutation()

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    const initFieldParams: IFieldParams = {
        'vendor': {isRequired: true, type: 'number'},
        'product_type': {isRequired: true, type: 'number'},
        'chip': {isRequired: false, type: 'number'},
        'applet': {isRequired: false, type: 'number'},
        'requested_quantity': {isRequired: false, type: 'number'},
        'is_for_bank': {isRequired: false, type: 'boolean'},
        'bank': {isRequired: false, type: 'number'},
        'type_card': {isRequired: false, type: 'number'},
        'KCV': {isRequired: false, type: 'number'},
        'other': {isRequired: false, type: 'text'}
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
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['applet']}}))
        if (isComponentPrepared && !isFetchingAppletsData) {
            if (!errorAppletsData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['applet']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['applet']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingAppletsData, componentData?.objInputAndChangedData['chip']]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['type_card']}}))
        if (isComponentPrepared && !isFetchingCardTestTypesData) {
            if (!errorCardTestTypesData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['type_card']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['type_card']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingCardTestTypesData]);

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
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['chip']}}))
        if (isComponentPrepared && !isFetchingChipsData) {
            if (!errorChipsData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['chip']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['chip']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingChipsData, componentData?.objInputAndChangedData['vendor']]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['KCV']}}))
        if (isComponentPrepared && !isFetchingKeyExchangesData && !isFetchingAllKeyExchangesData) {
            if (!errorKeyExchangesData && !errorAllKeyExchangesData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['KCV']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['KCV']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingKeyExchangesData, isFetchingAllKeyExchangesData, componentData?.objInputAndChangedData['bank']]);

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
        if (componentData?.objInputAndChangedData['chip']) {
            setValues({name: 'chip', value: null})
        }
    }, [componentData?.objInputAndChangedData['vendor']]);

    useEffect(() => {
        if (componentData?.objInputAndChangedData['applet']) {
            setValues({name: 'applet', value: null})
        }
    }, [componentData?.objInputAndChangedData['chip']]);

    useEffect(() => {
        if (!componentData?.objInputAndChangedData['bank'] && componentData?.objInputAndChangedData['type_card']) {
            setValues({name: 'type_card', value: null})
        }
        if (componentData?.objInputAndChangedData['bank'] && componentData?.objInputAndChangedData['type_card'] === 2) {
            setValues({name: 'KCV', value: null})
        }
    }, [componentData?.objInputAndChangedData['bank']]);

    async function funcSaveFields () {
        dispatch(setSavingStatus({componentName, data: {status: true}}))
        let updatedFieldParams = {...fieldParams}
        if (componentData?.objInputAndChangedData?.['is_for_bank']) {
            if (isKCVFieldShow) {
                updatedFieldParams = {
                    ...fieldParams, 
                    'bank': {isRequired: true, type: 'number'},
                    'type_card': {isRequired: true, type: 'number'},
                    'KCV': {isRequired: true, type: 'number'},
                }
            } else {
                updatedFieldParams = {
                    ...fieldParams, 
                    'bank': {isRequired: true, type: 'number'},
                    'type_card': {isRequired: true, type: 'number'},
                }
            }
        }
        if (componentData?.objInputAndChangedData?.['chip']) {
            updatedFieldParams = {
                ...updatedFieldParams, 
                'chip': {isRequired: true, type: 'number'},
                'applet': {isRequired: true, type: 'number'}
            }
        }
        const isValid = funcValidateFields(updatedFieldParams, componentData?.objInputAndChangedData, componentData?.objChangedData)
        if (isValid.isAllFieldsValid) {
            dispatch(deleteFieldInvalid({componentName}))
            const myData = componentData.objChangedData
            const typeCardID: Record<string, number> = myData['type_card'] ? {} : { type_card: 1 }
            await addCardTesting({ ...myData, ...typeCardID }).unwrap()    
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

    function handleChecked (fieldName: string, e: React.ChangeEvent<HTMLInputElement>) {
        const isChecked = e.target.checked
        setValues({name: fieldName, value: isChecked})
        if (!isChecked) {
            setValues({name: 'bank', value: null})
            setValues({name: 'type_card', value: null})
            setValues({name: 'KCV', value: null})
        }
    }

    const [isKCVFieldShow, setIsKCVFieldShow] = useState<boolean>(false)
    const [isRelevantKCVShow, setIsRelevantKCVShow] = useState<boolean>(true)
    useEffect(() => {
        if (componentData?.objInputAndChangedData['type_card']) {
            const typeCardName = cardTestTypesData?.find(item => item.id === componentData?.objInputAndChangedData['type_card'])?.name
            if (typeCardName === 'Live') {
                setIsRelevantKCVShow(true)
                setValues({name: 'KCV', value: null})
                setIsKCVFieldShow(true)
            } else {
                setValues({name: 'KCV', value: null})
                setIsKCVFieldShow(false)
            }
        } else {
            if (componentData?.objInputAndChangedData['KCV']) {
                setValues({name: 'KCV', value: null})                
            }
            setIsKCVFieldShow(false)
        }
    }, [componentData?.objInputAndChangedData['type_card']]);


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
                    <div style={{width: '140px'}}></div>
                    <MainModalText modalTitle={'Создание нового проекта по тестированию карт'}/>
                    <MainModalBtnBlock myStyleBtnBlock={{width: '140px'}}>
                        {
                            componentData?.objChangedData && Object.keys(componentData.objChangedData).length > (modalsPropsData?.qtyFieldsForSavingBtn || 0) && 
                            (<>
                                <ButtonMain
                                    onClick={funcSaveFields} 
                                    type={'submit'} 
                                    title={'Сохранить'}
                                />                                                    
                            </>)
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
                            fieldName={'chip'}
                            showName={"short_name"}
                            title={'Чип'}
                            value={componentData?.objInputAndChangedData['chip'] as ISelectValue}
                            options={chipsData || []}
                            isEmptyOption={true}
                            onChange={(obj) => setValues(obj)}   
                            skeletonLoading={loadingProcess?.['chip']}
                            isRequired={fieldParams?.['chip']?.isRequired}  
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('chip')}
                            isInvalidStatus={componentInvalidFields?.['chip']}   
                            isChanged={!!componentData?.objChangedData?.['chip']}  
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
                                            dispatch(setModalProps({componentName: 'CreateNewChipModal', data: {
                                                objChangedData: {
                                                    active: true, 
                                                    vendor: componentData?.objInputAndChangedData['vendor'] as ISelectValue
                                                },
                                                objReadOnlyFields: ['active', 'vendor'],
                                                qtyFieldsForSavingBtn: 2
                                            }}))
                                            dispatch(setModalOpen('CreateNewChipModal'))
                                        },
                                        disabled: !!!componentData?.objInputAndChangedData['vendor']
                                    }, 
                                    {
                                        name: "Изменить", 
                                        onClick: () => {
                                            const data = chipsData?.find(item => item.id === componentData?.objInputAndChangedData['chip'])
                                            if (data) {
                                                dispatch(setModalProps({componentName: 'CreateNewChipModal', data: {
                                                    objInputData: funcConvertToFieldDataType(data),
                                                    objReadOnlyFields: ['active', 'vendor', 'payment_system']
                                                }}))
                                                dispatch(setModalOpen('CreateNewChipModal'))
                                            } else {
                                                return {}
                                            }                                        
                                        }, 
                                        disabled: !!!componentData?.objInputAndChangedData['chip']
                                    }
                                ]}
                                myStyle={{width: '20px', height: '20px', margin: '2.5px 4px'}}
                            />
                        </BlockSelect>
                        <BlockSelect
                            fieldName={'applet'}
                            showName={"name"}
                            title={'Applet'}
                            value={componentData?.objInputAndChangedData['applet'] as ISelectValue}
                            options={appletsData || []}
                            isEmptyOption={true}
                            onChange={(obj) => setValues(obj)}   
                            skeletonLoading={loadingProcess?.['applet']}
                            isRequired={fieldParams?.['applet']?.isRequired}  
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('applet')}
                            isInvalidStatus={componentInvalidFields?.['applet']}   
                            isChanged={!!componentData?.objChangedData?.['applet']}  
                        >
                            <ButtonMain
                                onClick={() => {}}
                                type={'other'}
                                color="transparent"
                                drop={true}
                                actions={[
                                    {
                                        name: "Изменить", 
                                        onClick: () => {
                                            const data = appletsData?.find(item => item.id === componentData?.objInputAndChangedData['applet'])
                                            if (data) {
                                                dispatch(setModalProps({componentName: 'CreateNewAppletModal', data: {
                                                    objInputData: funcConvertToFieldDataType(data),
                                                    objReadOnlyFields: ['active', 'payment_system']
                                                }}))
                                                dispatch(setModalOpen('CreateNewAppletModal'))
                                            } else {
                                                return {}
                                            }                                        
                                        }, 
                                        disabled: !!!componentData?.objInputAndChangedData['applet']
                                    }
                                ]}
                                myStyle={{width: '20px', height: '20px', margin: '2.5px 4px'}}
                            />
                        </BlockSelect>
                        <BlockInput
                            onChange={(obj) => setValues(obj)}
                            fieldName={'requested_quantity'}
                            title={'Количество карт для запроса'}
                            type={fieldParams?.['requested_quantity']?.type as IInputTypes}
                            value={componentData?.objInputAndChangedData['requested_quantity'] as IInputValue}
                            placeholder={'Введите количество'}
                            skeletonLoading={loadingProcess?.['requested_quantity']}
                            isRequired={fieldParams?.['requested_quantity']?.isRequired}
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('requested_quantity')}
                            isInvalidStatus={componentInvalidFields?.['requested_quantity']}
                            isChanged={!!componentData?.objChangedData?.['requested_quantity']}
                            minValue={0}
                        />
                        <BlockCheckBox
                            id={1}
                            title={'Запрос для банка'}
                            fieldName={'is_for_bank'}
                            myStyleMain={{marginLeft: '10px', marginBottom: '15px'}}
                            myStyleTitle={{fontSize: '12px'}}
                            onChange={(fieldName, e) => handleChecked(fieldName, e)}
                            checked={componentData?.objInputAndChangedData?.['is_for_bank'] as boolean || false}
                            skeletonLoading={loadingProcess?.['is_for_bank']}
                        />
                        {componentData?.objInputAndChangedData?.['is_for_bank'] && (<>
                            <BlockSelect
                                fieldName={'bank'}
                                showName={"name_eng"}
                                title={'Название Банка'}
                                value={componentData?.objInputAndChangedData['bank'] as ISelectValue}
                                options={banksData || []}
                                isEmptyOption={true}
                                onChange={(obj) => setValues(obj)}   
                                skeletonLoading={loadingProcess?.['bank']}
                                isRequired={true}  
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
                                fieldName={'type_card'}
                                showName={"name"}
                                title={'Тип карт'}
                                value={componentData?.objInputAndChangedData['type_card'] as ISelectValue}
                                options={cardTestTypesData || []}
                                isEmptyOption={true}
                                onChange={(obj) => setValues(obj)}   
                                skeletonLoading={loadingProcess?.['type_card']}
                                isRequired={true}  
                                isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('type_card')}
                                isInvalidStatus={componentInvalidFields?.['type_card']}   
                                isChanged={!!componentData?.objChangedData?.['type_card']}  
                            />    
                            {isKCVFieldShow && (<>
                                <BlockSelect
                                    fieldName={'KCV'}
                                    showName={"number"}
                                    title={'K-код ключа'}
                                    value={componentData?.objInputAndChangedData['KCV'] as ISelectValue}
                                    options={(isRelevantKCVShow ? keyExchangesData : allKeyExchangesData) || []}
                                    isEmptyOption={true}
                                    onChange={(obj) => setValues(obj)}   
                                    skeletonLoading={loadingProcess?.['KCV']}
                                    isRequired={true}  
                                    isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('KCV')}
                                    isInvalidStatus={componentInvalidFields?.['KCV']}   
                                    isChanged={!!componentData?.objChangedData?.['KCV']}  
                                >
                                    <ButtonMain
                                        onClick={() => {}}
                                        type={'other'}
                                        color="transparent"
                                        drop={true}
                                        actions={[
                                            {
                                                name: isRelevantKCVShow ? 'Все ключи' : 'Для текущего банка', 
                                                onClick: () => {
                                                    setIsRelevantKCVShow((prev) => {return !prev})
                                                }
                                            }
                                        ]}
                                        myStyle={{width: '20px', height: '20px', margin: '2.5px 4px'}}
                                    />
                                </BlockSelect>   
                            </>)}
                            <BlockTextarea
                                onChange={(obj) => setValues(obj)}
                                fieldName={'other'}
                                title={'Другое'}
                                type={fieldParams?.['other']?.type as ITextareaTypes}
                                value={componentData?.objInputAndChangedData['other'] as ITextareaValue}
                                placeholder={'Введите комментарий'}
                                skeletonLoading={loadingProcess?.['other']}
                                isRequired={fieldParams?.['other']?.isRequired}
                                isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('other')}
                                isInvalidStatus={componentInvalidFields?.['other']}
                                isChanged={!!componentData?.objChangedData?.['other']}
                                rows={2}
                            />
                        </>)}
                    </ContentBlock>
                </MainModalMainBlock>
            </ModalViewBase>
        </>)}
    </>)
}

export default CreateNewCardTestingProjectModal