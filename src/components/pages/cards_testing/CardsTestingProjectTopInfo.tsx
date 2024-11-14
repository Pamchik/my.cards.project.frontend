import { useEffect, useState } from "react";
import { useEffectStoreData } from "../../hooks/useEffectStoreData";
import { useComponentPreparation } from "../../hooks/useComponentPreparation";
import { useFieldValueChange } from "../../hooks/useFieldValueChange";
import { useDispatch } from "react-redux";
import { useGetCardTestingQuery, useUpdateCardTestingMutation, useUpdateCardTestingWithoutReloadingMutation } from "../../../store/api/cardTestingApiSlice";
import { useGetBankQuery } from "../../../store/api/bankApiSlice";
import { useGetCardTestTypeQuery } from "../../../store/api/cardTestTypeApiSlice";
import { useGetChipQuery } from "../../../store/api/chipApiSlice";
import { deleteComponentsAPIUpdate, setComponentsAPIUpdate } from "../../../store/componentsData/componentsAPIUpdateSlice";
import { useGetCardTestingStatusesQuery } from "../../../store/api/cardTestingStatusApiSlice";
import { IFieldParams, IInputTypes } from "../../../store/componentsData/fieldsParamsSlice";
import { setLoadingStatus } from "../../../store/componentsData/loadingProcessSlice";
import { funcConvertToFieldDataType } from "../../functions/funcConvertToFieldDataType";
import { IInputValue, ISelectValue, deleteAllComponentData, deleteChangedComponentData, setInputData } from "../../../store/componentsData/componentsDataSlice";
import { setSavingStatus } from "../../../store/componentsData/savingProcessSlice";
import { funcValidateFields } from "../../functions/funcValidateFields";
import { deleteFieldInvalid, setFieldInvalid } from "../../../store/componentsData/fieldsInvalidSlice";
import { functionErrorMessage } from "../../functions/functionErrorMessage";
import { changeComponentReadOnly } from "../../../store/componentsData/componentsReadOnlySlice";
import BlockInput from "../../UI/fields/BlockInput";
import UrgentIconButton from "../../UI/buttons/UrgentIconButton";
import BlockSelect from "../../UI/fields/BlockSelect";
import ButtonMain from "../../UI/buttons/ButtonMain";
import { useAllComponentParamsReset } from "../../hooks/useComponentDataReset";
import useTimeoutManager from "../../hooks/useTimeoutManager";


interface ICardsTestingProjectTopInfo {
    selectedID: number
}

const CardsTestingProjectTopInfo = ({
    selectedID,
}: ICardsTestingProjectTopInfo) => {

    const componentName = 'CardsTestingProjectTopInfo'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const { loadingProcess, fieldParams, componentData, componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)
    const dispatch = useDispatch()
    
    const { data: cardTestingData, isFetching: isFetchingCardTestingData, error: errorCardTestingData, refetch: refetchCardTestingData } = useGetCardTestingQuery({ id: selectedID });
    const { data: bankData, isFetching: isFetchingBankData, error: errorBankData, refetch: refetchBankData } = useGetBankQuery(
        { id: cardTestingData?.[0].bank || undefined },
        {
            skip: !componentData?.objInputAndChangedData['bank'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['bank'] ? data : [],
                ...other
            })
        }
    )
    const { data: cardTestTypeData, isFetching: isFetchingCardTestTypeData, error: errorCardTestTypeData, refetch: refetchCardTestTypeData } = useGetCardTestTypeQuery(
        { id: cardTestingData?.[0].type_card },
        {
            skip: !componentData?.objInputAndChangedData['type_card'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['type_card'] ? data : [],
                ...other
            })
        }
    )
    const { data: chipData, isFetching: isFetchingChipData, error: errorChipData, refetch: refetchChipData } = useGetChipQuery(
        { id: cardTestingData?.[0].chip || undefined },
        {
            skip: !componentData?.objInputAndChangedData['chip'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['chip'] ? data : [],
                ...other
            })
        }
    )
    const { data: cardTestingStatuses, isFetching: isFetchingCardTestingStatuses, error: errorCardTestingStatuses, refetch: refetchCardTestingStatuses } = useGetCardTestingStatusesQuery(undefined)

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    const [updateCardTesting, { }] = useUpdateCardTestingWithoutReloadingMutation()

    function funcUpdateData() {
        dispatch(setComponentsAPIUpdate([
            'cardTestingData',
            'bankData',
            'chipData',
            'cardTestTypeData',
            'cardTestTypesData',
            'cardTestingStatuses',
            'magstripeTracksData',
            'testCardTransfersData',
            'filesData',
            'fileStatusesData',
            'keyExchangesData',
            'bankEmployeesData',
            'vendorData',
            'vendorEmployeesData',
            'vendorManufacturiesData',
            'appletsData',
            'mifaresData',
            'productTypesData',
            'materialsData',
            'materialColorsData',
            'laminationsData',
            'magstripeColorsData',
            'antennasData',
            'changelogData'
        ]))
    }

    useEffect(() => {
        if (componentsAPIUpdate.includes('cardTestingData')) {
            updateAPIData('cardTestingData', refetchCardTestingData)
        } else if (componentsAPIUpdate.includes('cardTestingStatuses')) {
            updateAPIData('cardTestingStatuses', refetchCardTestingStatuses)
        } else if (componentsAPIUpdate.includes('bankData')) {
            updateAPIData('bankData', refetchBankData)
        } else if (componentsAPIUpdate.includes('chipData')) {
            updateAPIData('chipData', refetchChipData)
        } else if (componentsAPIUpdate.includes('cardTestTypeData')) {
            updateAPIData('cardTestTypeData', refetchCardTestTypeData)
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
        'title': { isRequired: false, type: 'text' },
        'status': { isRequired: true, type: 'number' }
    }

    useEffect(() => {
        componentPreparing({ loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams });
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({ componentName, data: { status: true, fields: ['title'] } }))
        if (isComponentPrepared) {
            if (!isFetchingCardTestingData && !isFetchingBankData && !isFetchingCardTestTypeData && !isFetchingChipData) {
                if (!errorCardTestingData && cardTestingData && !errorBankData && !errorCardTestTypeData && !errorChipData) {
                    const myData = funcConvertToFieldDataType(cardTestingData[0])
                    dispatch(setInputData({ componentName, data: myData }))
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({
                            componentName, data: {
                                status: false, isSuccessful: true, fields: [
                                    'title'
                                ]
                            }
                        }))
                    }, 1000)
                } else {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: false, fields: ['title'] } }))
                    }, 1000)
                }
            }
        }
    }, [
        selectedID,
        isComponentPrepared,
        isFetchingCardTestingData,
        cardTestingData,
        isFetchingBankData,
        isFetchingCardTestTypeData,
        isFetchingChipData
    ]);

    useEffect(() => {
        dispatch(setLoadingStatus({ componentName, data: { status: true, fields: ['status'] } }))
        if (isComponentPrepared && !isFetchingCardTestingStatuses && !isFetchingCardTestingData && !errorCardTestingData) {
            if (!errorCardTestingStatuses) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: true, fields: ['status'] } }))
                }, 1000)
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: false, fields: ['status'] } }))
                }, 1000)
            }
        }
    }, [selectedID, isComponentPrepared, isFetchingCardTestingData, isFetchingCardTestingStatuses]);

    useEffect(() => {
        funcChangeCancelSet(true)
    }, [selectedID]);

    useEffect(() => {
        if (isFetchingCardTestingData) {
            funcChangeCancelSet(true)
        }
    }, [isFetchingCardTestingData]);

    async function funcSaveFields() {
        dispatch(setSavingStatus({ componentName, data: { status: true } }))
        const currentId: number = componentData?.objInputAndChangedData['id'] as number
        if (currentId) {
            const isValid = funcValidateFields(fieldParams, componentData?.objInputAndChangedData, componentData?.objChangedData)
            if (isValid.isAllFieldsValid) {
                dispatch(deleteFieldInvalid({ componentName }))
                const myData = componentData.objChangedData
                await updateCardTesting({ ...myData, id: currentId }).unwrap()
                    .then((res) => {
                        dispatch(setSavingStatus({ componentName, data: { status: true, isSuccessful: true } }))
                        // dispatch(deleteAllComponentData({ componentName }))
                        setValues({name: 'status', value: componentData.objChangedData['status']})
                        funcChangeCancelSet(true)
                        setManagedTimeout(() => {
                            dispatch(setSavingStatus({ componentName, data: { status: false } }))
                        }, 1000)
                    }).catch((error) => {
                        const message = functionErrorMessage(error)
                        dispatch(setSavingStatus({ componentName, data: { status: true, isSuccessful: false, message: message } }))
                    })
            } else {
                dispatch(setFieldInvalid({ componentName, data: isValid.data }))
                dispatch(setSavingStatus({ componentName, data: { status: false } }))
            }
        } else {
            dispatch(setSavingStatus({ componentName, data: { status: true, isSuccessful: false, message: "Ошибка! Обновите страницу и попробуйте заново." } }))
        }
    }   

    async function funcSaveFieldUrgent() {
        dispatch(setSavingStatus({ componentName, data: { status: true } }))
        const currentId: number = componentData?.objInputAndChangedData['id'] as number
        if (currentId) {
            const urgentStatus = componentData?.objInputAndChangedData['isUrgent']
            await updateCardTesting({ ...{ isUrgent: !urgentStatus }, id: currentId }).unwrap()
                .then((res) => {
                    dispatch(setSavingStatus({ componentName, data: { status: true, isSuccessful: true } }))
                    // dispatch(deleteAllComponentData({ componentName }))
                    setValues({name: 'isUrgent', value: !urgentStatus})
                    funcChangeCancelSet(true)
                    setManagedTimeout(() => {
                        dispatch(setSavingStatus({ componentName, data: { status: false } }))
                    }, 1000)
                }).catch((error) => {
                    const message = functionErrorMessage(error)
                    dispatch(setSavingStatus({ componentName, data: { status: true, isSuccessful: false, message: message } }))
                })
        } else {
            dispatch(setSavingStatus({ componentName, data: { status: true, isSuccessful: false, message: "Ошибка! Обновите страницу и попробуйте заново." } }))
        }
    } 

    function funcChangeCancelSet(newStatus: boolean) {
        // dispatch(deleteChangedComponentData({ componentName }))
        dispatch(changeComponentReadOnly({ componentName, newStatus }))
        dispatch(deleteFieldInvalid({ componentName }))
    }

    const [number, setNumber] = useState<string | undefined>(undefined)
    useEffect(() => {
        setNumber(componentData?.objInputAndChangedData?.['number'] as string | undefined)
    }, [componentData?.objInputAndChangedData?.['number']]);

    const [bankName, setBankName] = useState<string | undefined>(undefined)
    useEffect(() => {
        if (bankData && bankData.length > 0) {
            setBankName(bankData?.find(item => item.id === componentData?.objInputAndChangedData?.['bank'])?.name_eng as string | undefined)
        }
    }, [bankData, componentData?.objInputAndChangedData?.['bank']]);

    const [typeCard, setTypeCard] = useState<string | undefined>(undefined)
    useEffect(() => {
        if (cardTestTypeData && cardTestTypeData.length > 0) {
            setTypeCard(cardTestTypeData?.find(item => item.id === componentData?.objInputAndChangedData?.['type_card'])?.name as string | undefined)
        }
    }, [cardTestTypeData, componentData?.objInputAndChangedData?.['type_card']]);

    const [chipName, setChipName] = useState<string | undefined>(undefined)
    useEffect(() => {
        if (chipData && chipData.length > 0) {
            setChipName(chipData?.find(item => item.id === componentData?.objInputAndChangedData?.['chip'])?.short_name as string | undefined)
        }
    }, [chipData, componentData?.objInputAndChangedData?.['chip']]);

    const [title, setTitle] = useState<string>('')
    useEffect(() => {
        setTitle(`${number ? `${number} : ` : ''}${bankName ? `${bankName} - ` : ''}${chipName ? `${chipName} ${typeCard ? `(${typeCard})` : ''}` : 'no chip'}`.trim())
    }, [number, bankName, chipName, typeCard]);

    const [finalTitle, setFinalTitle] = useState<string>('')
    useEffect(() => {
        setFinalTitle(title[title.length - 1] === '-' ? title.substring(0, title.length - 1).trim() : title)
    }, [title])


    return (<>
        <div className="top-info-block">
            <div className="top-info-block__info">
                <BlockInput
                    onChange={(obj) => setValues(obj)}
                    fieldName={'title'}
                    type={fieldParams?.['title']?.type as IInputTypes}
                    value={finalTitle as IInputValue}
                    skeletonLoading={loadingProcess?.['title']}
                    isReadOnly={true}
                    myStyle={{ marginTop: '0', marginBottom: '0', marginLeft: '0', marginRight: '0', width: '100%' }}
                    myStyleInput={{ fontWeight: '600', background: 'transparent' }}
                    placeholder=""
                />
            </div>

            <div className="top-info-block__status">
                <UrgentIconButton
                    value={componentData?.objInputAndChangedData['isUrgent'] as boolean | undefined}
                    onClick={() => funcSaveFieldUrgent()}
                />
                <p>Статус</p>
                <BlockSelect
                    fieldName={'status'}
                    showName={"name"}
                    value={componentData?.objInputAndChangedData['status'] as ISelectValue}
                    options={cardTestingStatuses || []}
                    isEmptyOption={true}
                    onChange={(obj) => setValues(obj)}
                    skeletonLoading={loadingProcess?.['status']}
                    isRequired={fieldParams?.['status']?.isRequired}
                    isReadOnly={componentReadOnly?.status}
                    isInvalidStatus={componentInvalidFields?.['status']}
                    isChanged={!!componentData?.objChangedData?.['status']}
                    myStyle={{ width: '200px', textAlignLast: 'center', marginTop: 'auto', marginBottom: 'auto', marginLeft: '10px' }}
                    isSortDisabled={true}
                />
            </div>
            <div className="top-info-block__btn-block">
                {componentReadOnly?.status
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

export default CardsTestingProjectTopInfo