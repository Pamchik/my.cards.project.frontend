import { useEffect, useState } from "react";
import { useEffectStoreData } from "../../hooks/useEffectStoreData";
import { useComponentPreparation } from "../../hooks/useComponentPreparation";
import { useFieldValueChange } from "../../hooks/useFieldValueChange";
import { useDispatch } from "react-redux";
import { useGetCardTestingQuery } from "../../../store/api/cardTestingApiSlice";
import { deleteComponentsAPIUpdate } from "../../../store/componentsData/componentsAPIUpdateSlice";
import { IFieldParams, IInputTypes } from "../../../store/componentsData/fieldsParamsSlice";
import { funcConvertToFieldDataType } from "../../functions/funcConvertToFieldDataType";
import { deleteChangedComponentData, IInputValue, ISelectValue, setInputData } from "../../../store/componentsData/componentsDataSlice";
import { setLoadingStatus } from "../../../store/componentsData/loadingProcessSlice";
import { useGetChipQuery } from "../../../store/api/chipApiSlice";
import { useGetMifaresQuery } from "../../../store/api/mifareApiSlice";
import { useGetProductTypesQuery } from "../../../store/api/productTypeApiSlice";
import { useGetMaterialsQuery } from "../../../store/api/materialApiSlice";
import { useGetMaterialColorsQuery } from "../../../store/api/materialColorApiSlice";
import { useGetLaminationsQuery } from "../../../store/api/laminationApiSlice";
import { useGetMagstripeTracksQuery } from "../../../store/api/magstripeTrackApiSlice";
import { useGetMagstripeColorsQuery } from "../../../store/api/magstripeColorApiSlice";
import { useGetAntennasQuery } from "../../../store/api/antennaApiSlice";
import BtnBlock from "../../blocks/BtnBlock";
import ButtonMain from "../../UI/buttons/ButtonMain";
import LoadingView from "../../loading/LoadingView";
import ContentBlock from "../../blocks/ContentBlock";
import BlockSelect from "../../UI/fields/BlockSelect";
import BlockInput from "../../UI/fields/BlockInput";
import { setModalProps } from "../../../store/modalData/modalsPropsDataSlice";
import { setModalOpen } from "../../../store/modalData/modalsSlice";
import { useAllComponentParamsReset } from "../../hooks/useComponentDataReset";
import useTimeoutManager from "../../hooks/useTimeoutManager";
import { useGetAppletsQuery } from "../../../store/api/appletApiSlice";
import { changeComponentReadOnly } from "../../../store/componentsData/componentsReadOnlySlice";
import { deleteFieldInvalid } from "../../../store/componentsData/fieldsInvalidSlice";


interface ICardsTestingProjectParams {
    selectedID: number
}

const CardsTestingProjectParams = ({
    selectedID,
}: ICardsTestingProjectParams) => {

    const componentName = 'CardsTestingProjectParams'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const { loadingProcess, fieldParams, componentData, componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)
    const dispatch = useDispatch()

    const { data: cardTestingData, isFetching: isFetchingCardTestingData, error: errorCardTestingData, refetch: refetchCardTestingData } = useGetCardTestingQuery({ id: selectedID });
    const { data: appletsData, isFetching: isFetchingAppletsData, error: errorAppletsData, refetch: refetchAppletsData } = useGetAppletsQuery(undefined);
    const { data: chipData, isFetching: isFetchingChipData, error: errorChipData, refetch: refetchChipData } = useGetChipQuery(
        { id: componentData?.objInputAndChangedData['chip'] as number | undefined },
        {
            skip: !componentData?.objInputAndChangedData['chip'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['chip'] ? data : [],
                ...other
            })
        }
    )
    const { data: mifaresData, isFetching: isFetchingMifaresData, error: errorMifaresData, refetch: refetchMifaresData } = useGetMifaresQuery(
        { chip: componentData?.objInputAndChangedData['chip'] as number | undefined },
        {
            skip: !componentData?.objInputAndChangedData['chip'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['chip'] ? data : [],
                ...other
            })
        }
    )  
    const { data: productTypesData, isFetching: isFetchingProductTypesData, error: errorProductTypesData, refetch: refetchProductTypesData } = useGetProductTypesQuery(
        { vendor: componentData?.objInputAndChangedData['vendor'] as number },
        {
            skip: !componentData?.objInputAndChangedData['vendor'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['vendor'] ? data : [],
                ...other
            })
        }
    );
    const { data: materialsData, isFetching: isFetchingMaterialsData, error: errorMaterialsData, refetch: refetchMaterialsData } = useGetMaterialsQuery(
        { product_type: componentData?.objInputAndChangedData['product_type'] as number },
        {
            skip: !componentData?.objInputAndChangedData['product_type'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['product_type'] ? data : [],
                ...other
            })
        }
    ); 
    const { data: materialColorsData, isFetching: isFetchingMaterialColorsData, error: errorMaterialColorsData, refetch: refetchMaterialColorsData } = useGetMaterialColorsQuery(
        { material_type: componentData?.objInputAndChangedData['material_type'] as number },
        {
            skip: !componentData?.objInputAndChangedData['material_type'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['material_type'] ? data : [],
                ...other
            })
        }
    ); 
    const { data: laminationsData, isFetching: isFetchingLaminationsData, error: errorLaminationsData, refetch: refetchLaminationsData } = useGetLaminationsQuery(
        { vendor: componentData?.objInputAndChangedData['vendor'] as number },
        {
            skip: !componentData?.objInputAndChangedData['vendor'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['vendor'] ? data : [],
                ...other
            })
        }
    );
    const { data: magstripeTracksData, isFetching: isFetchingMagstripeTracksData, error: errorMagstripeTracksData, refetch: refetchMagstripeTracksData } = useGetMagstripeTracksQuery(undefined)
    const { data: magstripeColorsData, isFetching: isFetchingMagstripeColorsData, error: errorMagstripeColorsData, refetch: refetchMagstripeColorsData } = useGetMagstripeColorsQuery(
        { 
            vendor: componentData?.objInputAndChangedData['vendor'] as number, 
            magstripe_tracks: componentData?.objInputAndChangedData['magstripe_tracks'] as number, 
        },
        {
            skip: !componentData?.objInputAndChangedData['vendor'] || !componentData?.objInputAndChangedData['magstripe_tracks'],
            selectFromResult: ({ data, ...other }) => ({
                data: (componentData?.objInputAndChangedData['vendor'] && componentData?.objInputAndChangedData['magstripe_tracks']) ? data : [],
                ...other
            })
        }
    );
    const { data: antennasData, isFetching: isFetchingAntennasData, error: errorAntennasData, refetch: refetchAntennasData } = useGetAntennasQuery(
        { vendor: componentData?.objInputAndChangedData['vendor'] as number },
        {
            skip: !componentData?.objInputAndChangedData['vendor'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['vendor'] ? data : [],
                ...other
            })
        }
    );

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    useEffect(() => { 
        if (componentsAPIUpdate.includes('cardTestingData')) {
            updateAPIData('cardTestingData', refetchCardTestingData)
        } else if (componentsAPIUpdate.includes('magstripeTracksData')) {
            updateAPIData('magstripeTracksData', refetchMagstripeTracksData)
        } else if (componentsAPIUpdate.includes('appletsData')) {
            updateAPIData('appletsData', refetchAppletsData)
        } else if (componentsAPIUpdate.includes('chipData')) {
            updateAPIData('chipData', refetchChipData)
        } else if (componentsAPIUpdate.includes('mifaresData')) {
            updateAPIData('mifaresData', refetchMifaresData)
        } else if (componentsAPIUpdate.includes('productTypesData')) {
            updateAPIData('productTypesData', refetchProductTypesData)
            refetchProductTypesData()
        } else if (componentsAPIUpdate.includes('materialsData')) {
            updateAPIData('materialsData', refetchMaterialsData)
        } else if (componentsAPIUpdate.includes('materialColorsData')) {
            updateAPIData('materialColorsData', refetchMaterialColorsData)
        } else if (componentsAPIUpdate.includes('laminationsData')) {
            updateAPIData('laminationsData', refetchLaminationsData)
        } else if (componentsAPIUpdate.includes('magstripeColorsData')) {
            updateAPIData('magstripeColorsData', refetchMagstripeColorsData)          
        } else if (componentsAPIUpdate.includes('antennasData')) {
            updateAPIData('antennasData', refetchAntennasData)
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
        'chip': { isRequired: false, type: 'number' },
        'chip_full': { isRequired: false, type: 'text' },
        'applet': { isRequired: false, type: 'number' },
        'mifare': { isRequired: false, type: 'number' },
        'mifare_access_key': { isRequired: false, type: 'text' },
        'product_type': { isRequired: true, type: 'number' },
        'material_type': { isRequired: false, type: 'number' },
        'material_color': { isRequired: false, type: 'number' },
        'lamination_face': { isRequired: false, type: 'number' },
        'lamination_back': { isRequired: false, type: 'number' },
        'magstripe_tracks': { isRequired: false, type: 'number' },
        'magstripe_color': { isRequired: false, type: 'number' },
        'antenna_size': { isRequired: false, type: 'number' }
    }
    
    useEffect(() => {
        componentPreparing({ loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams });
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({ componentName, data: { status: true, fields: Object.keys(initFieldParams) } }))
        if (isComponentPrepared) {
            if (!isFetchingCardTestingData) {
                if (!errorCardTestingData && cardTestingData) {
                    const myData = funcConvertToFieldDataType(cardTestingData[0])
                    dispatch(setInputData({ componentName, data: myData }))
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: true, fields: Object.keys(initFieldParams) } }))
                    }, 1000)
                } else {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: false, fields: Object.keys(initFieldParams) } }))
                    }, 1000)
                }
            }
        }
    }, [selectedID, isComponentPrepared, cardTestingData, isFetchingCardTestingData]); 

    useEffect(() => {
        dispatch(setLoadingStatus({ componentName, data: { status: true, fields: ['chip', 'chip_full'] } }))
        if (isComponentPrepared && !isFetchingChipData && !isFetchingCardTestingData && !errorCardTestingData) {
            if (!errorChipData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: true, fields: ['chip', 'chip_full'] } }))
                }, 1000)
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: false, fields: ['chip', 'chip_full'] } }))
                }, 1000)
            }
        }
    }, [selectedID, isComponentPrepared, isFetchingChipData, isFetchingCardTestingData]);

    useEffect(() => {
        dispatch(setLoadingStatus({ componentName, data: { status: true, fields: ['product_type'] } }))
        if (isComponentPrepared && !isFetchingProductTypesData && !isFetchingCardTestingData && !errorCardTestingData) {
            if (!errorProductTypesData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: true, fields: ['product_type'] } }))
                }, 1000)
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: false, fields: ['product_type'] } }))
                }, 1000)
            }
        }
    }, [selectedID, isComponentPrepared, isFetchingProductTypesData, isFetchingCardTestingData]);

    useEffect(() => {
        dispatch(setLoadingStatus({ componentName, data: { status: true, fields: ['material_type'] } }))
        if (isComponentPrepared && !isFetchingMaterialsData && !isFetchingCardTestingData && !errorCardTestingData) {
            if (!errorMaterialsData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: true, fields: ['material_type'] } }))
                }, 1000)
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: false, fields: ['material_type'] } }))
                }, 1000)
            }
        }
    }, [selectedID, isComponentPrepared, isFetchingMaterialsData, isFetchingCardTestingData]);

    useEffect(() => {
        dispatch(setLoadingStatus({ componentName, data: { status: true, fields: ['applet'] } }))
        if (isComponentPrepared && !isFetchingAppletsData && !isFetchingCardTestingData && !errorCardTestingData) {
            if (!errorAppletsData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: true, fields: ['applet'] } }))
                }, 1000)
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: false, fields: ['applet'] } }))
                }, 1000)
            }
        }
    }, [selectedID, isComponentPrepared, isFetchingAppletsData, isFetchingCardTestingData]);

    useEffect(() => {
        dispatch(setLoadingStatus({ componentName, data: { status: true, fields: ['material_color'] } }))
        if (isComponentPrepared && !isFetchingMaterialColorsData && !isFetchingCardTestingData && !errorCardTestingData) {
            if (!errorMaterialColorsData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: true, fields: ['material_color'] } }))
                }, 1000)
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: false, fields: ['material_color'] } }))
                }, 1000)
            }
        }
    }, [selectedID, isComponentPrepared, isFetchingMaterialColorsData, isFetchingCardTestingData]);

    useEffect(() => {
        dispatch(setLoadingStatus({ componentName, data: { status: true, fields: ['lamination_face', 'lamination_back'] } }))
        if (isComponentPrepared && !isFetchingLaminationsData && !isFetchingCardTestingData && !errorCardTestingData) {
            if (!errorLaminationsData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: true, fields: ['lamination_face', 'lamination_back'] } }))
                }, 1000)
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: false, fields: ['lamination_face', 'lamination_back'] } }))
                }, 1000)
            }
        }
    }, [selectedID, isComponentPrepared, isFetchingLaminationsData, isFetchingCardTestingData]);

    useEffect(() => {
        dispatch(setLoadingStatus({ componentName, data: { status: true, fields: ['magstripe_tracks'] } }))
        if (isComponentPrepared && !isFetchingMagstripeTracksData && !isFetchingCardTestingData && !errorCardTestingData) {
            if (!errorMagstripeTracksData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: true, fields: ['magstripe_tracks'] } }))
                }, 1000)
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: false, fields: ['magstripe_tracks'] } }))
                }, 1000)
            }
        }
    }, [selectedID, isComponentPrepared, isFetchingMagstripeTracksData, isFetchingCardTestingData]);

    useEffect(() => {
        dispatch(setLoadingStatus({ componentName, data: { status: true, fields: ['magstripe_color'] } }))
        if (isComponentPrepared && !isFetchingMagstripeColorsData && !isFetchingCardTestingData && !errorCardTestingData) {
            if (!errorMagstripeColorsData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: true, fields: ['magstripe_color'] } }))
                }, 1000)
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: false, fields: ['magstripe_color'] } }))
                }, 1000)
            }
        }
    }, [selectedID, isComponentPrepared, isFetchingMagstripeColorsData, isFetchingCardTestingData, componentData?.objInputAndChangedData['magstripe_tracks']]);

    useEffect(() => {
        dispatch(setLoadingStatus({ componentName, data: { status: true, fields: ['antenna_size'] } }))
        if (isComponentPrepared && !isFetchingAntennasData && !isFetchingCardTestingData && !errorCardTestingData) {
            if (!errorAntennasData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: true, fields: ['antenna_size'] } }))
                }, 1000)
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: false, fields: ['antenna_size'] } }))
                }, 1000)
            }
        }
    }, [selectedID, isComponentPrepared, isFetchingAntennasData, isFetchingCardTestingData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['mifare', 'mifare_access_key']}}))
        if (isComponentPrepared && !isFetchingMifaresData && !isFetchingCardTestingData && !errorCardTestingData) {
            if (!errorMifaresData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: true, fields: ['mifare', 'mifare_access_key']} }))
                }, 1000)
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: false, fields: ['mifare', 'mifare_access_key']} }))
                }, 1000)
            }
        }
    }, [selectedID, isComponentPrepared, isFetchingMifaresData, isFetchingCardTestingData]);

    useEffect(() => {
        funcChangeCancelSet(true)
    }, [selectedID]);

    useEffect(() => {
        if (isFetchingCardTestingData) {
            funcChangeCancelSet(true)
        }
    }, [isFetchingCardTestingData]);

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

            <ContentBlock myStyleContent={{flexDirection: 'row', display: 'flex', height: '370px'}}>
                <ContentBlock line={true}>
                    <ContentBlock title={'Описание чипа:'}>
                        <BlockSelect
                            fieldName={'chip'}
                            showName={"short_name"}
                            title={'Чип'}
                            value={componentData?.objInputAndChangedData['chip'] as ISelectValue}
                            options={chipData || []}
                            onChange={() => {}}
                            skeletonLoading={loadingProcess?.['chip']}
                            isRequired={fieldParams?.['chip']?.isRequired}
                            isReadOnly={true}
                        />
                        <BlockInput
                            onChange={() => {}}
                            fieldName={'chip_full'}
                            title={'Полное название чипа'}
                            type={fieldParams?.['chip_full']?.type as IInputTypes}
                            value={chipData?.find(item => item.id === componentData?.objInputAndChangedData['chip'])?.full_name as IInputValue || ''}
                            placeholder={''}
                            skeletonLoading={loadingProcess?.['chip_full']}
                            isRequired={fieldParams?.['chip_full']?.isRequired}
                            isReadOnly={true}
                        />   
                        <BlockSelect
                            fieldName={'applet'}
                            showName={"name"}
                            title={'Applet'}
                            value={componentData?.objInputAndChangedData['applet'] as ISelectValue}
                            options={appletsData || []}
                            onChange={() => {}}
                            skeletonLoading={loadingProcess?.['applet']}
                            isRequired={fieldParams?.['applet']?.isRequired}
                            isReadOnly={true}
                        />           
                    </ContentBlock>
                    <ContentBlock title={'Mifare:'}>
                        <BlockSelect
                            fieldName={'mifare'}
                            showName={"name"}
                            title={'Тип Mifare'}
                            value={componentData?.objInputAndChangedData['mifare'] as ISelectValue}
                            options={mifaresData || []}
                            isEmptyOption={true}
                            onChange={(obj) => setValues(obj)}
                            skeletonLoading={loadingProcess?.['mifare']}
                            isRequired={fieldParams?.['mifare']?.isRequired}
                            isReadOnly={componentReadOnly?.status}
                            isInvalidStatus={componentInvalidFields?.['mifare']}
                            isChanged={!!componentData?.objChangedData?.['mifare']}
                        />
                        <BlockInput
                            onChange={(obj) => setValues(obj)}
                            fieldName={'mifare_access_key'}
                            title={'Ключ доступа Mifare (опционно)'}
                            type={fieldParams?.['mifare_access_key']?.type as IInputTypes}
                            value={componentData?.objInputAndChangedData['mifare_access_key'] as IInputValue}
                            placeholder={'Введите ключ'}
                            skeletonLoading={loadingProcess?.['mifare_access_key']}
                            isRequired={fieldParams?.['mifare_access_key']?.isRequired}
                            isReadOnly={componentReadOnly?.status}
                            isInvalidStatus={componentInvalidFields?.['mifare_access_key']}
                            isChanged={!!componentData?.objChangedData?.['mifare_access_key']}
                        />                 
                    </ContentBlock>                    
                </ContentBlock>
                <ContentBlock line={true}>
                    <ContentBlock title={'Описание материала:'}>
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
                            isReadOnly={true}
                        ></BlockSelect>
                        <BlockSelect
                            fieldName={'material_type'}
                            showName={"name_rus"}
                            title={'Материал (тип)'}
                            value={componentData?.objInputAndChangedData['material_type'] as ISelectValue}
                            options={materialsData || []}
                            isEmptyOption={true}
                            onChange={(obj) => setValues(obj)}
                            skeletonLoading={loadingProcess?.['material_type']}
                            isRequired={fieldParams?.['material_type']?.isRequired}
                            isReadOnly={componentReadOnly?.status}
                            isInvalidStatus={componentInvalidFields?.['material_type']}
                            isChanged={!!componentData?.objChangedData?.['material_type']}
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
                                                componentName: 'CreateNewMaterialModal', data: {
                                                    objChangedData: {
                                                        active: true,
                                                        vendor: componentData?.objInputAndChangedData['vendor'],
                                                        product_type: componentData?.objInputAndChangedData['product_type']
                                                    },
                                                    objReadOnlyFields: ['active', 'product_type', 'vendor'],
                                                    qtyFieldsForSavingBtn: 3
                                                }
                                            }))
                                            dispatch(setModalOpen('CreateNewMaterialModal'))
                                        }
                                    },
                                    {
                                        name: "Изменить",
                                        onClick: () => {
                                            const data = materialsData?.find(item => item.id === componentData?.objInputAndChangedData['material_type'])
                                            if (data) {
                                                dispatch(setModalProps({
                                                    componentName: 'CreateNewMaterialModal', data: {
                                                        objInputData: {
                                                            ...funcConvertToFieldDataType(data),
                                                            vendor: componentData?.objInputAndChangedData['vendor']
                                                        },
                                                        objReadOnlyFields: ['active', 'product_type', 'vendor'],
                                                        qtyFieldsForSavingBtn: 0
                                                    }
                                                }))
                                                dispatch(setModalOpen('CreateNewMaterialModal'))
                                            } else {
                                                return {}
                                            }
                                        },
                                        disabled: !!!componentData?.objInputAndChangedData['material_type']
                                    }
                                ]}
                                myStyle={{ width: '20px', height: '20px', margin: '2.5px 4px' }}
                            />
                        </BlockSelect>
                        <BlockSelect
                            fieldName={'material_color'}
                            showName={"name_rus"}
                            title={'Материал (цвет)'}
                            value={componentData?.objInputAndChangedData['material_color'] as ISelectValue}
                            options={materialColorsData || []}
                            isEmptyOption={true}
                            onChange={(obj) => setValues(obj)}
                            skeletonLoading={loadingProcess?.['material_color']}
                            isRequired={fieldParams?.['material_color']?.isRequired}
                            isReadOnly={componentReadOnly?.status}
                            isInvalidStatus={componentInvalidFields?.['material_color']}
                            isChanged={!!componentData?.objChangedData?.['material_color']}
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
                                                componentName: 'CreateNewMaterialColorModal', data: {
                                                    objChangedData: {
                                                        active: true,
                                                        vendor: componentData?.objInputAndChangedData['vendor'],
                                                        product_type: componentData?.objInputAndChangedData['product_type'],
                                                        material_type: componentData?.objInputAndChangedData['material_type']
                                                    },
                                                    objReadOnlyFields: ['active', 'vendor', 'product_type', 'material_type'],
                                                    qtyFieldsForSavingBtn: 4
                                                }
                                            }))
                                            dispatch(setModalOpen('CreateNewMaterialColorModal'))
                                        }
                                    },
                                    {
                                        name: "Изменить",
                                        onClick: () => {
                                            const data = materialColorsData?.find(item => item.id === componentData?.objInputAndChangedData['material_color'])
                                            if (data) {
                                                dispatch(setModalProps({
                                                    componentName: 'CreateNewMaterialColorModal', data: {
                                                        objInputData: {
                                                            ...funcConvertToFieldDataType(data),
                                                            vendor: componentData?.objInputAndChangedData['vendor'],
                                                            product_type: componentData?.objInputAndChangedData['product_type'],
                                                            material_type: componentData?.objInputAndChangedData['material_type']
                                                        },
                                                        objReadOnlyFields: ['active', 'vendor', 'product_type', 'material_type'],
                                                        qtyFieldsForSavingBtn: 0
                                                    }
                                                }))
                                                dispatch(setModalOpen('CreateNewMaterialColorModal'))
                                            } else {
                                                return {}
                                            }
                                        },
                                        disabled: !!!componentData?.objInputAndChangedData['material_color']
                                    }
                                ]}
                                myStyle={{ width: '20px', height: '20px', margin: '2.5px 4px' }}
                            />
                        </BlockSelect>
                    </ContentBlock>    
                    <ContentBlock title={'Ламинация:'}>
                        <BlockSelect
                            fieldName={'lamination_face'}
                            showName={"name_rus"}
                            title={'Ламинация (лицо)'}
                            value={componentData?.objInputAndChangedData['lamination_face'] as ISelectValue}
                            options={laminationsData || []}
                            isEmptyOption={true}
                            onChange={(obj) => setValues(obj)}
                            skeletonLoading={loadingProcess?.['lamination_face']}
                            isRequired={fieldParams?.['lamination_face']?.isRequired}
                            isReadOnly={componentReadOnly?.status}
                            isInvalidStatus={componentInvalidFields?.['lamination_face']}
                            isChanged={!!componentData?.objChangedData?.['lamination_face']}
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
                                                componentName: 'CreateNewLaminationModal', data: {
                                                    objChangedData: {
                                                        active: true,
                                                        vendor: componentData?.objInputAndChangedData['vendor']
                                                    },
                                                    objReadOnlyFields: ['active', 'vendor'],
                                                    qtyFieldsForSavingBtn: 2
                                                }
                                            }))
                                            dispatch(setModalOpen('CreateNewLaminationModal'))
                                        }
                                    },
                                    {
                                        name: "Изменить",
                                        onClick: () => {
                                            const data = laminationsData?.find(item => item.id === componentData?.objInputAndChangedData['lamination_face'])
                                            if (data) {
                                                dispatch(setModalProps({
                                                    componentName: 'CreateNewLaminationModal', data: {
                                                        objInputData: funcConvertToFieldDataType(data),
                                                        objReadOnlyFields: ['active', 'vendor'],
                                                        qtyFieldsForSavingBtn: 0
                                                    }
                                                }))
                                                dispatch(setModalOpen('CreateNewLaminationModal'))
                                            } else {
                                                return {}
                                            }
                                        },
                                        disabled: !!!componentData?.objInputAndChangedData['lamination_face']
                                    }
                                ]}
                                myStyle={{ width: '20px', height: '20px', margin: '2.5px 4px' }}
                            />
                        </BlockSelect>
                        <BlockSelect
                            fieldName={'lamination_back'}
                            showName={"name_rus"}
                            title={'Ламинация (оборот)'}
                            value={componentData?.objInputAndChangedData['lamination_back'] as ISelectValue}
                            options={laminationsData || []}
                            isEmptyOption={true}
                            onChange={(obj) => setValues(obj)}
                            skeletonLoading={loadingProcess?.['lamination_back']}
                            isRequired={fieldParams?.['lamination_back']?.isRequired}
                            isReadOnly={componentReadOnly?.status}
                            isInvalidStatus={componentInvalidFields?.['lamination_back']}
                            isChanged={!!componentData?.objChangedData?.['lamination_back']}
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
                                                componentName: 'CreateNewLaminationModal', data: {
                                                    objChangedData: {
                                                        active: true,
                                                        vendor: componentData?.objInputAndChangedData['vendor']
                                                    },
                                                    objReadOnlyFields: ['active', 'vendor'],
                                                    qtyFieldsForSavingBtn: 2
                                                }
                                            }))
                                            dispatch(setModalOpen('CreateNewLaminationModal'))
                                        }
                                    },
                                    {
                                        name: "Изменить",
                                        onClick: () => {
                                            const data = laminationsData?.find(item => item.id === componentData?.objInputAndChangedData['lamination_back'])
                                            if (data) {
                                                dispatch(setModalProps({
                                                    componentName: 'CreateNewLaminationModal', data: {
                                                        objInputData: funcConvertToFieldDataType(data),
                                                        objReadOnlyFields: ['active', 'vendor'],
                                                        qtyFieldsForSavingBtn: 0
                                                    }
                                                }))
                                                dispatch(setModalOpen('CreateNewLaminationModal'))
                                            } else {
                                                return {}
                                            }
                                        },
                                        disabled: !!!componentData?.objInputAndChangedData['lamination_back']
                                    }
                                ]}
                                myStyle={{ width: '20px', height: '20px', margin: '2.5px 4px' }}
                            />
                        </BlockSelect>              
                    </ContentBlock>                
                </ContentBlock>
                <ContentBlock>
                    <ContentBlock title={'Описание магнитной полосы:'}>
                        <BlockSelect
                            fieldName={'magstripe_tracks'}
                            showName={"name_rus"}
                            title={'Магнитная полоса (дорожки)'}
                            value={componentData?.objInputAndChangedData['magstripe_tracks'] as ISelectValue}
                            options={magstripeTracksData || []}
                            isEmptyOption={true}
                            onChange={(obj) => setValues(obj)}
                            skeletonLoading={loadingProcess?.['magstripe_tracks']}
                            isRequired={fieldParams?.['magstripe_tracks']?.isRequired}
                            isReadOnly={componentReadOnly?.status}
                            isInvalidStatus={componentInvalidFields?.['magstripe_tracks']}
                            isChanged={!!componentData?.objChangedData?.['magstripe_tracks']}
                        ></BlockSelect>
                        <BlockSelect
                            fieldName={'magstripe_color'}
                            showName={"name_rus"}
                            title={'Магнитная полоса (цвет)'}
                            value={componentData?.objInputAndChangedData['magstripe_color'] as ISelectValue}
                            options={magstripeColorsData || []}
                            isEmptyOption={true}
                            onChange={(obj) => setValues(obj)}
                            skeletonLoading={loadingProcess?.['magstripe_color']}
                            isRequired={fieldParams?.['magstripe_color']?.isRequired}
                            isReadOnly={componentReadOnly?.status}
                            isInvalidStatus={componentInvalidFields?.['magstripe_color']}
                            isChanged={!!componentData?.objChangedData?.['magstripe_color']}
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
                                                componentName: 'CreateNewMagstripeColorModal', data: {
                                                    objChangedData: {
                                                        active: true,
                                                        vendor: componentData?.objInputAndChangedData['vendor'],
                                                        magstripe_tracks: componentData?.objInputAndChangedData['magstripe_tracks']
                                                    },
                                                    objReadOnlyFields: ['active', 'vendor', 'magstripe_tracks'],
                                                    qtyFieldsForSavingBtn: 3
                                                }
                                            }))
                                            dispatch(setModalOpen('CreateNewMagstripeColorModal'))
                                        }
                                    },
                                    {
                                        name: "Изменить",
                                        onClick: () => {
                                            const data = magstripeColorsData?.find(item => item.id === componentData?.objInputAndChangedData['magstripe_color'])
                                            if (data) {
                                                dispatch(setModalProps({
                                                    componentName: 'CreateNewMagstripeColorModal', data: {
                                                        objInputData: funcConvertToFieldDataType(data),
                                                        objReadOnlyFields: ['active', 'vendor', 'magstripe_tracks'],
                                                        qtyFieldsForSavingBtn: 0
                                                    }
                                                }))
                                                dispatch(setModalOpen('CreateNewMagstripeColorModal'))
                                            } else {
                                                return {}
                                            }
                                        },
                                        disabled: !!!componentData?.objInputAndChangedData['magstripe_color']
                                    }
                                ]}
                                myStyle={{ width: '20px', height: '20px', margin: '2.5px 4px' }}
                            />
                        </BlockSelect>                 
                    </ContentBlock>   
                    <ContentBlock title={'Описание антенны:'}>
                        <BlockSelect
                            fieldName={'antenna_size'}
                            showName={"name_rus"}
                            title={'Размер антенны'}
                            value={componentData?.objInputAndChangedData['antenna_size'] as ISelectValue}
                            options={antennasData || []}
                            isEmptyOption={true}
                            onChange={(obj) => setValues(obj)}
                            skeletonLoading={loadingProcess?.['antenna_size']}
                            isRequired={fieldParams?.['antenna_size']?.isRequired}
                            isReadOnly={componentReadOnly?.status}
                            isInvalidStatus={componentInvalidFields?.['antenna_size']}
                            isChanged={!!componentData?.objChangedData?.['antenna_size']}
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
                                                componentName: 'CreateNewAntennaModal', data: {
                                                    objChangedData: {
                                                        active: true,
                                                        vendor: componentData?.objInputAndChangedData['vendor']
                                                    },
                                                    objReadOnlyFields: ['active', 'vendor'],
                                                    qtyFieldsForSavingBtn: 2
                                                }
                                            }))
                                            dispatch(setModalOpen('CreateNewAntennaModal'))
                                        }
                                    },
                                    {
                                        name: "Изменить",
                                        onClick: () => {
                                            const data = antennasData?.find(item => item.id === componentData?.objInputAndChangedData['antenna_size'])
                                            if (data) {
                                                dispatch(setModalProps({
                                                    componentName: 'CreateNewAntennaModal', data: {
                                                        objInputData: funcConvertToFieldDataType(data),
                                                        objReadOnlyFields: ['active', 'vendor'],
                                                        qtyFieldsForSavingBtn: 0
                                                    }
                                                }))
                                                dispatch(setModalOpen('CreateNewAntennaModal'))
                                            } else {
                                                return {}
                                            }
                                        },
                                        disabled: !!!componentData?.objInputAndChangedData['antenna_size']
                                    }
                                ]}
                                myStyle={{ width: '20px', height: '20px', margin: '2.5px 4px' }}
                            />
                        </BlockSelect>
                    </ContentBlock>                     
                </ContentBlock>
            </ContentBlock>
        </>)}
    </>)
}

export default CardsTestingProjectParams