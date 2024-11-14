import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useGetProjectQuery } from "../../../../store/api/projectsApiSlice";
import { useEffectStoreData } from "../../../hooks/useEffectStoreData";
import { useComponentPreparation } from "../../../hooks/useComponentPreparation";
import { useAllComponentParamsReset } from "../../../hooks/useComponentDataReset";
import useTimeoutManager from "../../../hooks/useTimeoutManager";
import { useFieldValueChange } from "../../../hooks/useFieldValueChange";
import { IFieldParams, IInputTypes } from "../../../../store/componentsData/fieldsParamsSlice";
import BtnBlock from "../../../blocks/BtnBlock";
import ButtonMain from "../../../UI/buttons/ButtonMain";
import LoadingView from "../../../loading/LoadingView";
import ContentBlock from "../../../blocks/ContentBlock";
import BlockSelect from "../../../UI/fields/BlockSelect";
import { deleteChangedComponentData, IInputValue, ISelectValue, setInputData } from "../../../../store/componentsData/componentsDataSlice";
import { setModalProps } from "../../../../store/modalData/modalsPropsDataSlice";
import { setModalOpen } from "../../../../store/modalData/modalsSlice";
import { funcConvertToFieldDataType } from "../../../functions/funcConvertToFieldDataType";
import BlockInput from "../../../UI/fields/BlockInput";
import { setLoadingStatus } from "../../../../store/componentsData/loadingProcessSlice";
import { setSavingStatus } from "../../../../store/componentsData/savingProcessSlice";
import { functionErrorMessage } from "../../../functions/functionErrorMessage";
import { useGetMaterialsQuery } from "../../../../store/api/materialApiSlice";
import { useGetMaterialColorsQuery } from "../../../../store/api/materialColorApiSlice";
import { useGetLaminationsQuery } from "../../../../store/api/laminationApiSlice";
import { useGetChipsQuery } from "../../../../store/api/chipApiSlice";
import { useGetAppletsQuery } from "../../../../store/api/appletApiSlice";
import { useGetChipColorsQuery } from "../../../../store/api/chipColorApiSlice";
import { useGetMifaresQuery } from "../../../../store/api/mifareApiSlice";
import { useGetMagstripeTracksQuery } from "../../../../store/api/magstripeTrackApiSlice";
import { useGetMagstripeColorsQuery } from "../../../../store/api/magstripeColorApiSlice";
import { useGetAntennasQuery } from "../../../../store/api/antennaApiSlice";
import TotalListBlock from "../../../UI/fields/TotalListBlock";
import { IEffectsData, useGetEffectsQuery, useLazyGetLineEffectsCommonQuery } from "../../../../store/api/effectApiSlice";
import BlockCheckBox from "../../../UI/fields/BlockCheckBox";
import { funcSortedDataByValue } from "../../../functions/funcSortedDataByValue";
import { deleteComponentsAPIUpdate } from "../../../../store/componentsData/componentsAPIUpdateSlice";
import { changeComponentReadOnly } from "../../../../store/componentsData/componentsReadOnlySlice";
import { deleteFieldInvalid } from "../../../../store/componentsData/fieldsInvalidSlice";


interface IMaterialLineInfo {
    selectedID: number
}

const MaterialLineInfo = ({
    selectedID,
}: IMaterialLineInfo) => {

    const componentName = 'MaterialLineInfo'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {loadingProcess, fieldParams, componentData, componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: projectData, isFetching: isFetchingProjectData, error: errorProjectData, refetch: refetchProjectData} = useGetProjectQuery({id: selectedID});
    const { data: materialsData, isFetching: isFetchingMaterialsData, error: errorMaterialsData, refetch: refetchMaterialsData } = useGetMaterialsQuery(
        { product_type: projectData?.[0].product_type as number },
        {
            skip: !projectData?.[0].product_type,
            selectFromResult: ({ data, ...other }) => ({
                data: projectData?.[0].product_type ? data : [],
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
        { vendor: projectData?.[0].vendor as number },
        {
            skip: !projectData?.[0].vendor,
            selectFromResult: ({ data, ...other }) => ({
                data: projectData?.[0].vendor ? data : [],
                ...other
            })
        }
    );
    const {data: chipsData, isFetching: isFetchingChipsData, error: errorChipsData, refetch: refetchChipsData} = useGetChipsQuery(
        { vendor: projectData?.[0].vendor as number},
        { 
            skip: !projectData?.[0].vendor,
            selectFromResult: ({ data, ...other }) => ({
                data: projectData?.[0].vendor ? data : [],
                ...other
            })        
        }
    );
    const {data: appletsData, isFetching: isFetchingAppletsData, error: errorAppletsData, refetch: refetchAppletsData} = useGetAppletsQuery(
        { 
            chip: componentData?.objInputAndChangedData['chip'] as number,
            payment_system: componentData?.objInputAndChangedData['payment_system'] as number
        },
        { 
            skip: !componentData?.objInputAndChangedData['chip'] || !componentData?.objInputAndChangedData['payment_system'],
            selectFromResult: ({ data, ...other }) => ({
                data: (componentData?.objInputAndChangedData['chip'] && componentData?.objInputAndChangedData['payment_system']) ? data : [],
                ...other
            })        
        }
    )
    const {data: chipColorsData, isFetching: isFetchingChipColorsData, error: errorChipColorsData, refetch: refetchChipColorsData} = useGetChipColorsQuery(undefined);
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
    const { data: magstripeTracksData, isFetching: isFetchingMagstripeTracksData, error: errorMagstripeTracksData, refetch: refetchMagstripeTracksData } = useGetMagstripeTracksQuery(undefined)
    const { data: magstripeColorsData, isFetching: isFetchingMagstripeColorsData, error: errorMagstripeColorsData, refetch: refetchMagstripeColorsData } = useGetMagstripeColorsQuery(
        { 
            vendor: projectData?.[0].vendor, 
            magstripe_tracks: componentData?.objInputAndChangedData['magstripe_tracks'] as number, 
        },
        {
            skip: !projectData?.[0].vendor || !componentData?.objInputAndChangedData['magstripe_tracks'],
            selectFromResult: ({ data, ...other }) => ({
                data: (projectData?.[0].vendor && componentData?.objInputAndChangedData['magstripe_tracks']) ? data : [],
                ...other
            })
        }
    );
    const { data: antennasData, isFetching: isFetchingAntennasData, error: errorAntennasData, refetch: refetchAntennasData } = useGetAntennasQuery(
        { vendor: projectData?.[0].vendor },
        {
            skip: !projectData?.[0].vendor,
            selectFromResult: ({ data, ...other }) => ({
                data: projectData?.[0].vendor ? data : [],
                ...other
            })
        }
    );
    const {data: effectsData, isFetching: isFetchingEffectsData, error: errorEffectsData, refetch: refetchEffectsData} = useGetEffectsQuery(
        { product_type: projectData?.[0].product_type as number },
        {
            skip: !projectData?.[0].product_type,
            selectFromResult: ({ data, ...other }) => ({
                data: projectData?.[0].product_type ? data : [],
                ...other
            })
        }
    )

    const [getLineEffects, { data: lineEffectsCommonData, isFetching: isLoadingLineEffectsCommonData, error: errorLineEffectsCommonData }] = useLazyGetLineEffectsCommonQuery();


    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    useEffect(() => {
        if (componentsAPIUpdate.includes('projectData')) {
            updateAPIData('projectData', refetchProjectData)
        } else if (componentsAPIUpdate.includes('materialsData')) {
            updateAPIData('materialsData', refetchMaterialsData)
        } else if (componentsAPIUpdate.includes('materialColorsData')) {
            updateAPIData('materialColorsData', refetchMaterialColorsData)
        } else if (componentsAPIUpdate.includes('laminationsData')) {
            updateAPIData('laminationsData', refetchLaminationsData)
        } else if (componentsAPIUpdate.includes('chipsData')) {
            updateAPIData('chipsData', refetchChipsData)
        } else if (componentsAPIUpdate.includes('appletsData')) {
            updateAPIData('appletsData', refetchAppletsData)
        } else if (componentsAPIUpdate.includes('chipColorsData')) {
            updateAPIData('chipColorsData', refetchChipColorsData)
        } else if (componentsAPIUpdate.includes('mifaresData')) {
            updateAPIData('mifaresData', refetchMifaresData)
        } else if (componentsAPIUpdate.includes('magstripeTracksData')) {
            updateAPIData('magstripeTracksData', refetchMagstripeTracksData)
        } else if (componentsAPIUpdate.includes('magstripeColorsData')) {
            updateAPIData('magstripeColorsData', refetchMagstripeColorsData)
        } else if (componentsAPIUpdate.includes('antennasData')) {
            updateAPIData('antennasData', refetchAntennasData)
        } else if (componentsAPIUpdate.includes('effectsData')) {
            updateAPIData('effectsData', refetchEffectsData)
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
        'material_type': {isRequired: false, type: 'number'},
        'material_color': {isRequired: false, type: 'number'},
        'lamination_face': {isRequired: false, type: 'number'},
        'lamination_back': {isRequired: false, type: 'number'},
        'chip': {isRequired: false, type: 'number'},
        'product_full_name_chip': {isRequired: false, type: 'text'},
        'applet': {isRequired: false, type: 'number'},
        'chip_color': {isRequired: false, type: 'number'},
        'mifare': {isRequired: false, type: 'number'},
        'mifare_access_key': {isRequired: false, type: 'text'},
        'magstripe_tracks': {isRequired: false, type: 'number'},
        'magstripe_color': {isRequired: false, type: 'number'},
        'antenna_size': {isRequired: false, type: 'number'},
        'product_effects': {isRequired: false, type: 'array'},
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
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['material_type']}}))
        if (isComponentPrepared && !isFetchingMaterialsData && !isFetchingProjectData && !errorProjectData) {
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
    }, [isComponentPrepared, isFetchingMaterialsData, isFetchingProjectData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['material_color']}}))
        if (isComponentPrepared && !isFetchingMaterialColorsData && !isFetchingProjectData && !errorProjectData) {
            if (!errorMaterialColorsData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['material_color']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['material_color']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingMaterialColorsData, isFetchingProjectData, componentData?.objInputAndChangedData['material_type']]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['lamination_face', 'lamination_back']}}))
        if (isComponentPrepared && !isFetchingLaminationsData && !isFetchingProjectData && !errorProjectData) {
            if (!errorLaminationsData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['lamination_face', 'lamination_back']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['lamination_face', 'lamination_back']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingLaminationsData, isFetchingProjectData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['chip', 'product_full_name_chip']}}))
        if (isComponentPrepared && !isFetchingChipsData && !isFetchingProjectData && !errorProjectData) {
            if (!errorChipsData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['chip', 'product_full_name_chip']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['chip', 'product_full_name_chip']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingChipsData, isFetchingProjectData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['applet']}}))
        if (isComponentPrepared && !isFetchingAppletsData && !isFetchingProjectData && !errorProjectData) {
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
    }, [isComponentPrepared, isFetchingAppletsData, isFetchingProjectData, componentData?.objInputAndChangedData['chip']]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['chip_color']}}))
        if (isComponentPrepared && !isFetchingChipColorsData && !isFetchingProjectData && !errorProjectData) {
            if (!errorChipColorsData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['chip_color']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['chip_color']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingChipColorsData, isFetchingProjectData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['mifare', 'mifare_access_key']}}))
        if (isComponentPrepared && !isFetchingMifaresData && !isFetchingProjectData && !errorProjectData) {
            if (!errorMifaresData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['mifare', 'mifare_access_key']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['mifare', 'mifare_access_key']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingMifaresData, isFetchingProjectData, componentData?.objInputAndChangedData['chip']]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['magstripe_tracks']}}))
        if (isComponentPrepared && !isFetchingMagstripeTracksData && !isFetchingProjectData && !errorProjectData) {
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
    }, [isComponentPrepared, isFetchingMagstripeTracksData, isFetchingProjectData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['magstripe_color']}}))
        if (isComponentPrepared && !isFetchingMagstripeColorsData && !isFetchingProjectData && !errorProjectData) {
            if (!errorMagstripeColorsData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['magstripe_color']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['magstripe_color']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingMagstripeColorsData, isFetchingProjectData, componentData?.objInputAndChangedData['magstripe_tracks']]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['antenna_size']}}))
        if (isComponentPrepared && !isFetchingAntennasData && !isFetchingProjectData && !errorProjectData) {
            if (!errorAntennasData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['antenna_size']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['antenna_size']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingAntennasData, isFetchingProjectData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['product_effects']}}))
        if (isComponentPrepared && !isFetchingEffectsData && !isFetchingProjectData && !errorProjectData) {
            if (!errorEffectsData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['product_effects']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['product_effects']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingEffectsData, isFetchingProjectData]);

    useEffect(() => {
        if (componentData?.objChangedData.hasOwnProperty('material_type') && componentData?.objInputAndChangedData['material_color']) {
            setValues({name: 'material_color', value: null})
        }
    }, [componentData?.objInputAndChangedData['material_type']]);

    const [fullChipName, setFullChipName] = useState<string>('')
    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['product_full_name_chip']}}))
        if (componentData?.objInputAndChangedData['chip']) {
            const chipFullName = chipsData?.find(item => item.id === componentData.objInputAndChangedData['chip'])?.full_name || ''
            setFullChipName(chipFullName)
        } else {
            setFullChipName('')
        }
        setManagedTimeout(() => {
            dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['product_full_name_chip']}}))
        }, 1000)
    }, [chipsData, componentData?.objInputAndChangedData['chip']]);

    useEffect(() => {
        if (componentData?.objChangedData.hasOwnProperty('chip') && componentData?.objInputAndChangedData['applet']) {
            setValues({name: 'applet', value: null})
        }
        if (componentData?.objChangedData.hasOwnProperty('chip') && componentData?.objInputAndChangedData['mifare']) {
            setValues({name: 'mifare', value: null})
        }  
    }, [componentData?.objInputAndChangedData['chip']]);

    useEffect(() => {
        if (componentData?.objChangedData.hasOwnProperty('mifare') && componentData?.objInputAndChangedData['mifare_access_key']) {
            setValues({name: 'mifare_access_key', value: null})
        }  
    }, [componentData?.objInputAndChangedData['mifare']]);

    useEffect(() => {
        if (componentData?.objChangedData.hasOwnProperty('magstripe_tracks') && componentData?.objInputAndChangedData['magstripe_color']) {
            setValues({name: 'magstripe_color', value: null})
        }  
    }, [componentData?.objInputAndChangedData['magstripe_tracks']]);

    const [arrCurrentEffectsObject, setArrCurrentEffectsObject] = useState<IEffectsData[]>([]);
    useEffect(() => {
        const data = componentData?.objInputAndChangedData
        if (data && data['product_effects']) {
            if (typeof data['product_effects'] === 'object') {
                const currentList: number[] = data['product_effects'] as number[]
                const convertedArr = currentList.map(id => effectsData?.find(item => item.id === id)).filter(item => item !== undefined) as any[]
                const sortedArr = funcSortedDataByValue(convertedArr, 'name_rus')

                setArrCurrentEffectsObject(sortedArr)
            } else {
                setArrCurrentEffectsObject([])
            }
        } else {
            setArrCurrentEffectsObject([])
        }
    },[effectsData, componentData?.objInputAndChangedData['product_effects']])

    function funcGetLineEffects () {
        const params = {
            id: componentData?.objInputAndChangedData?.['id'] as number
        };
        getLineEffects(params)
        .then((res) => {
            const message = functionErrorMessage(res)
            dispatch(setSavingStatus({ componentName, data: { status: true, isSuccessful: true, message: message} }))
        }).catch((error) => {
            const message = functionErrorMessage(error)
            dispatch(setSavingStatus({ componentName, data: { status: true, isSuccessful: false, message: message} }))
        })
    };

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
            <BtnBlock>
                <ButtonMain 
                    onClick={funcGetLineEffects} 
                    type={'other'} 
                    color={'gray'}
                    myStyle={{width: '150px'}} 
                    title={'Показать эффекты'}
                />                              
            </BtnBlock>

            {savingProcess?.status && 
                <LoadingView
                    isSuccessful={savingProcess.isSuccessful} 
                    errorMessage={savingProcess.message} 
                    componentName={componentName} 
                />
            } 

            <ContentBlock myStyleContent={{flexDirection: 'row', display: 'flex', height: '100%'}}>
                <ContentBlock line={true}>
                    <ContentBlock line={true} title={'Описание материала:'}>
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
                                                        vendor: projectData?.[0].vendor || null,
                                                        product_type: projectData?.[0].product_type || null
                                                    },
                                                    objReadOnlyFields: ['active', 'product_type', 'vendor'],
                                                    qtyFieldsForSavingBtn: 3
                                                }
                                            }))
                                            dispatch(setModalOpen('CreateNewMaterialModal'))
                                        },
                                        disabled: (!!!projectData?.[0].product_type || !!!projectData?.[0].vendor)
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
                                                            vendor: projectData?.[0].vendor || null,
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
                                        disabled: (!!!componentData?.objInputAndChangedData['material_type'] || !!!projectData?.[0].vendor)
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
                                                        vendor: projectData?.[0].vendor || null,
                                                        product_type: projectData?.[0].product_type || null,
                                                        material_type: componentData?.objInputAndChangedData['material_type']
                                                    },
                                                    objReadOnlyFields: ['active', 'vendor', 'product_type', 'material_type'],
                                                    qtyFieldsForSavingBtn: 4
                                                }
                                            }))
                                            dispatch(setModalOpen('CreateNewMaterialColorModal'))
                                        },
                                        disabled: (!!!projectData?.[0].vendor || !!!projectData?.[0].product_type || !!!componentData?.objInputAndChangedData['material_type'])
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
                                                            vendor: projectData?.[0].vendor || null,
                                                            product_type: projectData?.[0].product_type || null,
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
                                        disabled: (!!!componentData?.objInputAndChangedData['material_color'] || !!!projectData?.[0].vendor || !!!projectData?.[0].product_type)
                                    }
                                ]}
                                myStyle={{ width: '20px', height: '20px', margin: '2.5px 4px' }}
                            />
                        </BlockSelect>
                    </ContentBlock>
                    <ContentBlock line={true} title={'Ламинация:'}>
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
                                                        vendor: projectData?.[0].vendor || null
                                                    },
                                                    objReadOnlyFields: ['active', 'vendor'],
                                                    qtyFieldsForSavingBtn: 2
                                                }
                                            }))
                                            dispatch(setModalOpen('CreateNewLaminationModal'))
                                        },
                                        disabled: (!!!projectData?.[0].vendor)
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
                                                        vendor: projectData?.[0].vendor || null
                                                    },
                                                    objReadOnlyFields: ['active', 'vendor'],
                                                    qtyFieldsForSavingBtn: 2
                                                }
                                            }))
                                            dispatch(setModalOpen('CreateNewLaminationModal'))
                                        },
                                        disabled: (!!!projectData?.[0].vendor)
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
                <ContentBlock line={true}>
                    <ContentBlock title={'Описание чипа:'}>
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
                            isReadOnly={componentReadOnly?.status}
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
                                                    vendor: projectData?.[0].vendor || null as ISelectValue
                                                },
                                                objReadOnlyFields: ['active', 'vendor'],
                                                qtyFieldsForSavingBtn: 2
                                            }}))
                                            dispatch(setModalOpen('CreateNewChipModal'))
                                        },
                                        disabled: !!!projectData?.[0].vendor
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
                                        disabled: !!!projectData?.[0].vendor
                                    }
                                ]}
                                myStyle={{width: '20px', height: '20px', margin: '2.5px 4px'}}
                            />
                        </BlockSelect>
                        <BlockInput
                            onChange={() => {}}
                            fieldName={'product_full_name_chip'}
                            title={'Полное название чипа'}
                            type={fieldParams?.['product_full_name_chip']?.type as IInputTypes}
                            value={fullChipName}
                            placeholder={''}
                            skeletonLoading={loadingProcess?.['product_full_name_chip']}
                            isRequired={fieldParams?.['product_full_name_chip']?.isRequired}
                            isReadOnly={true}
                        ></BlockInput>
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
                            isReadOnly={componentReadOnly?.status}
                            isInvalidStatus={componentInvalidFields?.['applet']}   
                            isChanged={!!componentData?.objChangedData?.['applet']}  
                        ></BlockSelect>
                        <BlockSelect
                            fieldName={'chip_color'}
                            showName={"name_rus"}
                            title={'Цвет контактной площадки'}
                            value={componentData?.objInputAndChangedData['chip_color'] as ISelectValue}
                            options={chipColorsData || []}
                            isEmptyOption={true}
                            onChange={(obj) => setValues(obj)}   
                            skeletonLoading={loadingProcess?.['chip_color']}
                            isRequired={fieldParams?.['chip_color']?.isRequired}  
                            isReadOnly={componentReadOnly?.status}
                            isInvalidStatus={componentInvalidFields?.['chip_color']}   
                            isChanged={!!componentData?.objChangedData?.['chip_color']}  
                        ></BlockSelect>
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
                        ></BlockSelect>
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
                        ></BlockInput>      
                    </ContentBlock>
                </ContentBlock>
                <ContentBlock line={true}>
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
                                                        vendor: projectData?.[0].vendor || null,
                                                        magstripe_tracks: componentData?.objInputAndChangedData['magstripe_tracks']
                                                    },
                                                    objReadOnlyFields: ['active', 'vendor', 'magstripe_tracks'],
                                                    qtyFieldsForSavingBtn: 3
                                                }
                                            }))
                                            dispatch(setModalOpen('CreateNewMagstripeColorModal'))
                                        },
                                        disabled: (!!!projectData?.[0].vendor || !!!componentData?.objInputAndChangedData['magstripe_tracks'])
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
                                                        vendor: projectData?.[0].vendor || null
                                                    },
                                                    objReadOnlyFields: ['active', 'vendor'],
                                                    qtyFieldsForSavingBtn: 2
                                                }
                                            }))
                                            dispatch(setModalOpen('CreateNewAntennaModal'))
                                        },
                                        disabled: !!!projectData?.[0].vendor
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
                <ContentBlock title={'Описание эффектов:'} myStyleContent={{display: 'flex', width: '100%'}}>
                    <TotalListBlock
                        fieldName={'product_effects'}
                        isReadOnly={true}
                        isChanged={!!componentData?.objChangedData?.['product_effects']}
                        myStyleMain={{ width: '100%' }}
                        myStyleListBox={{ height: '320px' }}
                        skeletonLoading={loadingProcess?.['product_effects']}
                    >
                        {arrCurrentEffectsObject.map((item) => (
                            item.id && (
                            <BlockCheckBox
                                key={item.id} 
                                id={item.id}
                                title={item.name_rus}
                                isReadOnly={true}
                            />   
                            )                 
                        ))}
                    </TotalListBlock>

                    {!componentReadOnly?.status && <div style={{marginRight: '10px', alignContent: 'center'}}>
                        <ButtonMain
                            onClick={() => {
                                dispatch(setModalProps({componentName: 'ChangeLineEffectsModal', data: {
                                    objInputData: {current_effects: componentData?.objInputAndChangedData?.['product_effects'] || []},
                                    other: {
                                        product_type: projectData?.[0].product_type,
                                        vendor: projectData?.[0].vendor,
                                        componentName: componentName
                                    }
                                }}))
                                dispatch(setModalOpen('ChangeLineEffectsModal'))
                            }} 
                            type={'plusIcon'} 
                        />
                    </div>}
                </ContentBlock>
            </ContentBlock>
        </>)}
    </>)
}

export default MaterialLineInfo