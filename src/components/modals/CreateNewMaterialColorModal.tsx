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
import BlockTextarea from "../UI/fields/BlockTextarea";
import { IFieldParams, IInputTypes, ITextareaTypes } from "../../store/componentsData/fieldsParamsSlice";
import { IInputValue, ISelectValue, ITextareaValue, deleteAllComponentData, setChangedData, setInputData } from "../../store/componentsData/componentsDataSlice";
import { setLoadingStatus } from "../../store/componentsData/loadingProcessSlice";
import { deleteModalProps, setModalProps } from "../../store/modalData/modalsPropsDataSlice";
import { setSavingStatus } from "../../store/componentsData/savingProcessSlice";
import { funcValidateFields } from "../functions/funcValidateFields";
import { deleteFieldInvalid, setFieldInvalid } from "../../store/componentsData/fieldsInvalidSlice";
import { functionErrorMessage } from "../functions/functionErrorMessage";
import LoadingView from "../loading/LoadingView";
import BlockSelect from "../UI/fields/BlockSelect";
import { useGetVendorsQuery } from "../../store/api/vendorApiSlice";
import { funcConvertToFieldDataType } from "../functions/funcConvertToFieldDataType";
import { useGetProductTypesQuery } from "../../store/api/productTypeApiSlice";
import { useAddMaterialColorMutation, useUpdateMaterialColorMutation } from "../../store/api/materialColorApiSlice";
import { useGetMaterialsQuery } from "../../store/api/materialApiSlice";
import { useAllComponentParamsReset } from "../hooks/useComponentDataReset";
import useTimeoutManager from "../hooks/useTimeoutManager";


const CreateNewMaterialColorModal = () => {

    const componentName = 'CreateNewMaterialColorModal'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {modalsPropsData, loadingProcess, fieldParams, componentData, componentInvalidFields, savingProcess, componentsAPIUpdate} = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: vendorsData, isFetching: isFetchingVendorsData, error: errorVendorsData, refetch: refetchVendorsData} = useGetVendorsQuery(undefined)
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
    const {data: materialsData, isFetching: isFetchingMaterialsData, error: errorMaterialsData, refetch: refetchMaterialsData} = useGetMaterialsQuery(
        { product_type: componentData?.objInputAndChangedData['product_type'] as number},
        { 
            skip: !componentData?.objInputAndChangedData['product_type'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['product_type'] ? data : [],
                ...other
            })  
        }
    );    
    const [updateMaterialColor, {}] = useUpdateMaterialColorMutation()
    const [addMaterialColor, {}] = useAddMaterialColorMutation()

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    const initFieldParams: IFieldParams = {
        'name_eng': {isRequired: true, type: 'text'},
        'name_rus': {isRequired: true, type: 'text'},
        'vendor': { isRequired: false, type: 'number' },
        'product_type': {isRequired: false, type: 'number'},
        'material_type': {isRequired: true, type: 'number'},
        'other': {isRequired: false, type: 'text'},
        'active': {isRequired: true, type: 'boolean'},  
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
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['material_type']}}))
        if (isComponentPrepared && !isFetchingMaterialsData) {
            if (!errorMaterialsData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['material_type']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['material_type']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingMaterialsData, componentData?.objInputAndChangedData['product_type']]);

    useEffect(() => {
        if (componentData?.objInputAndChangedData['product_type'] && !componentData?.objInputAndChangedData['vendor']) {
            setValues({name: 'product_type', value: null})
        }
    }, [componentData?.objInputAndChangedData['vendor']]); 

    useEffect(() => {
        if (componentData?.objInputAndChangedData['material_type'] && !componentData?.objInputAndChangedData['product_type']) {
            setValues({name: 'material_type', value: null})
        }
    }, [componentData?.objInputAndChangedData['product_type']]); 

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
    
    async function funcSaveFields () {
        dispatch(setSavingStatus({componentName, data: {status: true}}))
        const currentId: number = componentData?.objInputAndChangedData['id'] as number
        const isValid = funcValidateFields(fieldParams, componentData?.objInputAndChangedData, componentData?.objChangedData)
        if (currentId) {
            if (isValid.isAllFieldsValid) {
                dispatch(deleteFieldInvalid({componentName}))
                const myData = componentData.objChangedData
                await updateMaterialColor({...myData, id: currentId}).unwrap()    
                .then((res) => {
                    dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: true}}))
                    dispatch(deleteAllComponentData({componentName}))
                    setManagedTimeout(() => { 
                        dispatch(setSavingStatus({ componentName, data: { status: false } }))
                        dispatch(setModalClose(componentName))
                        dispatch(deleteModalProps({componentName}))
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
                await addMaterialColor({...myData}).unwrap()    
                .then((res) => {
                    dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: true}}))
                    dispatch(deleteAllComponentData({componentName}))
                    setManagedTimeout(() => { 
                        dispatch(setSavingStatus({ componentName, data: { status: false } }))
                        dispatch(setModalClose(componentName))
                        dispatch(deleteModalProps({componentName}))
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
                    <MainModalText modalTitle={`${componentData?.objInputData?.['id'] ? 'Изменение цвета Материала' : 'Создание нового цвета Материала'}`}/>
                    <MainModalBtnBlock myStyleBtnBlock={{width: '120px'}}>
                        {
                            componentData?.objChangedData && Object.keys(componentData.objChangedData).length > (modalsPropsData?.qtyFieldsForSavingBtn || 0) && 
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

                <MainModalMainBlock myStyleMainBlock={{ display: 'flex', minHeight: '250px'}}>
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
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('name_rus')}
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
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('name_eng')}
                            isInvalidStatus={componentInvalidFields?.['name_eng']}
                            isChanged={!!componentData?.objChangedData?.['name_eng']}
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
                            fieldName={'material_type'}
                            showName={"name_rus"}
                            title={'Материал'}
                            value={componentData?.objInputAndChangedData['material_type'] as ISelectValue}
                            options={materialsData || []}
                            isEmptyOption={true}
                            onChange={(obj) => setValues(obj)}   
                            skeletonLoading={loadingProcess?.['material_type']}
                            isRequired={fieldParams?.['material_type']?.isRequired}  
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('material_type')}
                            isInvalidStatus={componentInvalidFields?.['material_type']}   
                            isChanged={!!componentData?.objChangedData?.['material_type']}  
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
                                            dispatch(setModalProps({componentName: 'CreateNewMaterialModal', data: {
                                                objChangedData: {
                                                    active: true,
                                                    vendor: componentData?.objInputAndChangedData['vendor'] as ISelectValue,
                                                    product_type: componentData?.objInputAndChangedData['product_type'] as ISelectValue
                                                },
                                                objReadOnlyFields: ['active', 'product_type', 'vendor'],
                                                qtyFieldsForSavingBtn: 3
                                            }}))
                                            dispatch(setModalOpen('CreateNewMaterialModal'))
                                        },
                                        disabled: !!!componentData?.objInputAndChangedData['product_type']
                                    }, 
                                    {
                                        name: "Изменить", 
                                        onClick: () => {
                                            const data = materialsData?.find(item => item.id === componentData?.objInputAndChangedData['material_type'])
                                            if (data) {
                                                dispatch(setModalProps({componentName: 'CreateNewMaterialModal', data: {
                                                    objInputData: {
                                                        ...funcConvertToFieldDataType(data), 
                                                        vendor: componentData?.objInputAndChangedData['vendor'] as ISelectValue
                                                    },
                                                    objReadOnlyFields: ['active', 'product_type', 'vendor']
                                                }}))
                                                dispatch(setModalOpen('CreateNewMaterialModal'))
                                            } else {
                                                return {}
                                            }                                        
                                        }, 
                                        disabled: !!!componentData?.objInputAndChangedData['material_type']
                                    }
                                ]}
                                myStyle={{width: '20px', height: '20px', margin: '2.5px 4px'}}
                            />
                        </BlockSelect>
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
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('active')} 
                            isInvalidStatus={componentInvalidFields?.['active']}   
                            isChanged={!!componentData?.objChangedData?.['active']}  
                        />
                    </ContentBlock>
                </MainModalMainBlock>
            </ModalViewBase>
        </>)}
    </>)
}

export default CreateNewMaterialColorModal