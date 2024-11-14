import { useEffect, useState } from "react";
import { MainModalBtnBlock, MainModalMainBlock, MainModalText, MainModalTopBlock, ModalViewBase } from "../../modals/ModalViewBase"
import { useEffectStoreData } from "../../hooks/useEffectStoreData";
import { useComponentPreparation } from "../../hooks/useComponentPreparation";
import { useFieldValueChange } from "../../hooks/useFieldValueChange";
import { useDispatch } from "react-redux";
import { setModalClose, setModalOpen } from "../../../store/modalData/modalsSlice";
import ButtonMain from "../../UI/buttons/ButtonMain";
import ContentBlock from "../../blocks/ContentBlock";
import BlockInput from "../../UI/fields/BlockInput";
import { IFieldParams, IInputTypes } from "../../../store/componentsData/fieldsParamsSlice";
import { IInputValue, setChangedData, setInputData } from "../../../store/componentsData/componentsDataSlice";
import { setLoadingStatus } from "../../../store/componentsData/loadingProcessSlice";
import { deleteModalProps, setModalProps } from "../../../store/modalData/modalsPropsDataSlice";
import { setSavingStatus } from "../../../store/componentsData/savingProcessSlice";
import { funcValidateFields } from "../../functions/funcValidateFields";
import { deleteFieldInvalid, setFieldInvalid } from "../../../store/componentsData/fieldsInvalidSlice";
import { functionErrorMessage } from "../../functions/functionErrorMessage";
import LoadingView from "../../loading/LoadingView";
import { useAllComponentParamsReset } from "../../hooks/useComponentDataReset";
import useTimeoutManager from "../../hooks/useTimeoutManager";
import TotalListBlock, { IListBlock } from "../../UI/fields/TotalListBlock";
import BlockCheckBox from "../../UI/fields/BlockCheckBox";
import { useGetProjectStatusesQuery } from "../../../store/api/projectStatusApiSlice";
import { useGetBanksQuery } from "../../../store/api/bankApiSlice";
import { IVendorsData, useGetVendorsQuery } from "../../../store/api/vendorApiSlice";
import { funcSortedDataByValue } from "../../functions/funcSortedDataByValue";
import MonthlyAccountingReportTable, { IMonthlyAccountingReport } from "./MonthlyAccountingReportTable";
import { useLazyGetReportQuery } from "../../../store/api/reportApiSlice";
import { ICurrency, useGetCurrenciesQuery } from "../../../store/api/currencyApiSlice";
import { funcDownloadReport } from "./funcDownloadReport";

const MonthlyAccountingReport = () => {

    const componentName = 'MonthlyAccountingReport'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {modalsPropsData, loadingProcess, fieldParams, componentData, componentInvalidFields, savingProcess, componentsAPIUpdate} = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: projectStatuses, isFetching: isFetchingProjectStatuses, error: errorProjectStatuses, refetch: refetchProjectStatuses} = useGetProjectStatusesQuery(undefined)
    const {data: banksData, isFetching: isFetchingBanksData, error: errorBanksData, refetch: refetchBanksData} = useGetBanksQuery(undefined)
    const {data: vendorsData, isFetching: isFetchingVendorsData, error: errorVendorsData, refetch: refetchVendorsData} = useGetVendorsQuery(undefined)
    const {data: currenciesData, isFetching: isFetchingCurrenciesData, error: errorCurrenciesData, refetch: refetchCurrenciesData} = useGetCurrenciesQuery(undefined);

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    const initFieldParams: IFieldParams = {
        'date_from': {isRequired: true, type: 'date'},
        'date_to': {isRequired: false, type: 'date'},
        'statuses': {isRequired: false, type: 'array'},
        'banks': {isRequired: false, type: 'array'},
        'vendors': {isRequired: false, type: 'array'},
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

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
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['date_from', 'date_to']}}))
        if (isComponentPrepared) {
            setManagedTimeout(() => {
                dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['date_from', 'date_to']}}))
            }, 1000) 
        }
    }, [isComponentPrepared]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['statuses']}}))
        if (isComponentPrepared && !isFetchingProjectStatuses) {
            if (!errorProjectStatuses) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['statuses']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['statuses']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingProjectStatuses]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['banks']}}))
        if (isComponentPrepared && !isFetchingBanksData) {
            if (!errorBanksData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['banks']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['banks']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingBanksData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['vendors']}}))
        if (isComponentPrepared && !isFetchingVendorsData) {
            if (!errorVendorsData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['vendors']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['vendors']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingVendorsData]);

    const [arrCurrentStatusesObject, setArrCurrentStatusesObject] = useState<IListBlock[]>([]);
    useEffect(() => {
        if (projectStatuses) {
            if (projectStatuses.length > 0) {
                const convertedArr = projectStatuses.map((item) => ({id: item.id, name: item['name']}))
                const sortedArr = funcSortedDataByValue(convertedArr, 'name')
                setArrCurrentStatusesObject(sortedArr)
            } else {
                setArrCurrentStatusesObject([])
            }
        } else {
            setArrCurrentStatusesObject([])
        }
    },[projectStatuses])

    useEffect(() => {
        const newStatuses = componentData?.objChangedData['new_statuses'] as IListBlock[] | string | undefined
        if (newStatuses) {
            if (typeof newStatuses === 'string' && newStatuses === 'all') {
                setArrCurrentStatusesObject(projectStatuses?.map((item) => ({id: item.id, name: item['name']})) || [])
            } else if (Array.isArray(newStatuses)) {
                setArrCurrentStatusesObject(newStatuses)
            }
        }
    }, [componentData?.objChangedData['new_statuses']])
    
    useEffect(() => {
        const statusesIDs = arrCurrentStatusesObject.map(item => item.id)
        setValues({name: 'statuses', value: statusesIDs})
    }, [arrCurrentStatusesObject]);

    const [arrCurrentBanksObject, setArrCurrentBanksObject] = useState<IListBlock[]>([]);
    useEffect(() => {
        if (banksData) {
            if (banksData.length > 0) {
                const convertedArr = banksData.map((item) => ({id: item.id, name: item['name_eng']}))
                const sortedArr = funcSortedDataByValue(convertedArr, 'name')
                setArrCurrentBanksObject(sortedArr)
            } else {
                setArrCurrentBanksObject([])
            }
        } else {
            setArrCurrentBanksObject([])
        }
    },[banksData])

    useEffect(() => {
        const newBanks = componentData?.objChangedData['new_banks'] as IListBlock[] | string | undefined
        if (newBanks) {
            if (typeof newBanks === 'string' && newBanks === 'all') {
                setArrCurrentBanksObject(banksData?.map((item) => ({id: item.id, name: item['name_eng']})) || [])
            } else if (Array.isArray(newBanks)) {
                setArrCurrentBanksObject(newBanks)
            }
        }
    }, [componentData?.objChangedData['new_banks']])

    useEffect(() => {
        const banksIDs = arrCurrentBanksObject.map(item => item.id)
        setValues({name: 'banks', value: banksIDs})
    }, [arrCurrentBanksObject]);

    const [arrCurrentVendorsObject, setArrCurrentVendorsObject] = useState<IListBlock[]>([]);
    useEffect(() => {
        if (vendorsData) {
            if (vendorsData.length > 0) {
                const convertedArr = vendorsData.map((item) => ({id: item.id, name: item['name']}))
                const sortedArr = funcSortedDataByValue(convertedArr, 'name')
                setArrCurrentVendorsObject(sortedArr)
            } else {
                setArrCurrentVendorsObject([])
            }
        } else {
            setArrCurrentVendorsObject([])
        }
    },[vendorsData])

    useEffect(() => {
        const newVendors = componentData?.objChangedData['new_vendors'] as IListBlock[] | string | undefined
        if (newVendors) {
            if (typeof newVendors === 'string' && newVendors === 'all') {
                setArrCurrentVendorsObject(vendorsData?.map((item) => ({id: item.id, name: item['name']})) || [])
            } else if (Array.isArray(newVendors)) {
                setArrCurrentVendorsObject(newVendors)
            }
        }
    }, [componentData?.objChangedData['new_vendors']])

    useEffect(() => {
        const vendorsIDs = arrCurrentVendorsObject.map(item => item.id)
        setValues({name: 'vendors', value: vendorsIDs})
    }, [arrCurrentVendorsObject]);

    const [getReport, { data: reportData, isFetching: isLoadingReportData, error: errorReportData }] = useLazyGetReportQuery();
    
    const [reportExportedData, setReportExportedData] = useState<any[]>([])
    const [formatDict, setFormatDict] = useState<Record<string, string>>({
        "Количество (банк)": '#,##0',
        "Количество (вендор)": '#,##0'  
    })

    // console.log(formatDict)
    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    async function funcLoadReport () {
        dispatch(setSavingStatus({componentName, data: {status: true}}))
        const isValid = funcValidateFields(fieldParams, componentData?.objInputAndChangedData, componentData?.objChangedData)
        if (isValid.isAllFieldsValid) {
            dispatch(deleteFieldInvalid({componentName}))
            const myData = componentData.objChangedData
            if (myData['date_to'] && myData['date_from']) {
                if (myData['date_to'] < myData['date_from']) {
                    const errorData = {
                        'date_to': {
                            message: 'Значение не должно быть меньше даты начала', 
                            status: true
                        }
                    }
                    dispatch(setFieldInvalid({componentName, data: errorData}))
                    dispatch(setSavingStatus({componentName, data: {status: false}}))
                }
            }
            const formattedData: Record<string, string | number | boolean | null> = Object.fromEntries(
                Object.entries(myData).map(([key, value]) => 
                    Array.isArray(value) ? [key, value.join(',')] : [key, value]
                )
            );
            getReport({...formattedData, report_name: 'MonthlyAccountingReport'})
            .then((res) => {
                const reportData: IMonthlyAccountingReport[] = res.data as IMonthlyAccountingReport[]
                if (Array.isArray(reportData) && reportData.length > 0 && Array.isArray(vendorsData) && Array.isArray(currenciesData)) {
                    transformData({reportData, vendorsData, currenciesData})
                    setIsLoaded(true)
                }
                dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: true}}))
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

    function transformData ({
        reportData, 
        vendorsData, 
        currenciesData
    }: { 
        reportData: IMonthlyAccountingReport[], 
        vendorsData: IVendorsData[], 
        currenciesData: ICurrency[] 
    }) {

        setReportExportedData(
            reportData.map(item => {
                let row: any = {
                    "Месяц": item.month,
                    "Страна": item.country,
                    "Банк": item.bank,
                    "Название карт": item.card_name,
                    "Договор": item.contract,
                    "Количество (банк)": item.bank_qty,
                }
        
                currenciesData.forEach(currency => {
                    const bankPrice = item.bank_currency === currency.name ? item.bank_price?.replace('.', ',') : '';
                    row[`${currency.name}`] = bankPrice;
                });
                row["PO"] = item.PO;
                row["Количество (вендор)"] = item.vendor_qty;
                vendorsData.forEach(vendor => {
                    currenciesData.forEach(currency => {
                        const vendorPrice = (item.vendor === vendor.name && item.vendor_currency === currency.name) 
                        ? item.vendor_price?.replace('.', ',')
                        : '';
                        row[`${vendor.name}_${currency.name}`] = vendorPrice;
                    })
                })
                return row;
            })
        )

        currenciesData.forEach(currency => {
            setFormatDict(prev => ({ 
                ...prev, 
                [`${currency.name}`]: '#,##0.00'
            }))
        });
        // vendorsData.forEach(vendor => {
            // currenciesData.forEach(currency => {
            //     setFormatDict(prev => ({ 
            //         ...prev, 
            //         [`${currency.name}`]: '#,##0.00'
            //     }))
            // });
        // });
    };


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
                    <div style={{width: '260px'}}></div>
                    <MainModalText modalTitle={`Отчет будущих поставок`}/>
                    <MainModalBtnBlock myStyleBtnBlock={{width: '260px'}}>
                        {isLoaded && <>
                            <ButtonMain
                                // onClick={() => funcDownloadReport(reportData as IMonthlyAccountingReport[] | undefined, vendorsData, currenciesData)} 
                                onClick={() => funcDownloadReport(reportExportedData, formatDict, currenciesData || [], vendorsData || [])}
                                type={'other'} 
                                title={'Скачать'}
                                color={'gray'}
                                myStyle={{width: '120px'}}
                            />                        
                        </>}
                        <ButtonMain
                            onClick={funcLoadReport} 
                            type={'other'} 
                            title={'Получить'}
                            color={'gray'}
                            myStyle={{width: '120px'}}
                        />
                        <ButtonMain 
                            onClick={() => {
                                dispatch(setModalClose(componentName))
                                dispatch(deleteModalProps({componentName}))
                            }}
                            type="resetIcon" 
                        />
                    </MainModalBtnBlock>
                </MainModalTopBlock>

                <MainModalMainBlock myStyleMainBlock={{ display: 'flex', minWidth: '1200px' }}>
                    <ContentBlock myStyleContent={{display: 'flex', flexDirection: 'column', height: '790px'}}>
                        <ContentBlock myStyleMain={{maxHeight: '300px'}} myStyleContent={{display: 'flex', flexDirection: 'row'}}>
                            <ContentBlock line={true} title={'Диапазон:'}>
                                <BlockInput
                                    onChange={(obj) => setValues(obj)}
                                    fieldName={'date_from'}
                                    title={'С'}
                                    type={fieldParams?.['date_from']?.type as IInputTypes}
                                    value={componentData?.objInputAndChangedData['date_from'] as IInputValue}
                                    placeholder={''}
                                    skeletonLoading={loadingProcess?.['date_from']}
                                    isRequired={fieldParams?.['date_from']?.isRequired}
                                    isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('')}
                                    isInvalidStatus={componentInvalidFields?.['date_from']}
                                    isChanged={!!componentData?.objChangedData?.['date_from']}
                                ></BlockInput>
                                <BlockInput
                                    onChange={(obj) => setValues(obj)}
                                    fieldName={'date_to'}
                                    title={'По'}
                                    type={fieldParams?.['date_to']?.type as IInputTypes}
                                    value={componentData?.objInputAndChangedData['date_to'] as IInputValue}
                                    placeholder={''}
                                    skeletonLoading={loadingProcess?.['date_to']}
                                    isRequired={fieldParams?.['date_to']?.isRequired}
                                    isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('date_to')}
                                    isInvalidStatus={componentInvalidFields?.['date_to']}
                                    isChanged={!!componentData?.objChangedData?.['date_to']}
                                ></BlockInput>
                            </ContentBlock> 
                            <ContentBlock line={true} title={'Статусы:'} myStyleContent={{display: 'flex', width: '100%', height: '270px'}}>
                                <TotalListBlock
                                    fieldName={'statuses'}
                                    isReadOnly={true}
                                    isChanged={!!componentData?.objChangedData?.['statuses']}
                                    myStyleMain={{ width: '100%' }}
                                    myStyleListBox={{ height: '250px' }}
                                    skeletonLoading={loadingProcess?.['statuses']}
                                >
                                    {arrCurrentStatusesObject.map((item) => (
                                        item.id && (
                                        <BlockCheckBox
                                            key={item.id} 
                                            id={item.id}
                                            title={item.name}
                                            isReadOnly={true}
                                        />   
                                        )                 
                                    ))}
                                </TotalListBlock>
                                <ButtonMain
                                    onClick={() => {
                                        dispatch(setModalProps({componentName: 'ChangeLineItemsModal', data: {
                                            objInputData: {current_items: arrCurrentStatusesObject},
                                            other: {
                                                all_items: projectStatuses?.map((item) => ({id: item.id, name: item['name']})) || [],
                                                componentName: componentName,
                                                field: 'new_statuses',
                                                title: 'Изменение списка по статусам'
                                            }
                                        }}))
                                        dispatch(setModalOpen('ChangeLineItemsModal'))
                                    }} 
                                    type={'plusIcon'} 
                                />
                            </ContentBlock>
                            <ContentBlock line={true} title={'Банки:'} myStyleContent={{display: 'flex', width: '100%'}}>
                                <TotalListBlock
                                    fieldName={'banks'}
                                    isReadOnly={true}
                                    isChanged={!!componentData?.objChangedData?.['banks']}
                                    myStyleMain={{ width: '100%' }}
                                    myStyleListBox={{ height: '250px' }}
                                    skeletonLoading={loadingProcess?.['banks']}
                                >
                                    {arrCurrentBanksObject.map((item) => (
                                        item.id && (
                                        <BlockCheckBox
                                            key={item.id} 
                                            id={item.id}
                                            title={item.name}
                                            isReadOnly={true}
                                        />   
                                        )                 
                                    ))}
                                </TotalListBlock>
                                <ButtonMain
                                    onClick={() => {
                                        dispatch(setModalProps({componentName: 'ChangeLineItemsModal', data: {
                                            objInputData: {current_items: arrCurrentBanksObject},
                                            other: {
                                                all_items: banksData?.map((item) => ({id: item.id, name: item['name_eng']})) || [],
                                                componentName: componentName,
                                                field: 'new_banks',
                                                title: 'Изменение списка по банкам'
                                            }
                                        }}))
                                        dispatch(setModalOpen('ChangeLineItemsModal'))
                                    }} 
                                    type={'plusIcon'} 
                                />
                            </ContentBlock>
                            <ContentBlock title={'Вендоры:'} myStyleContent={{display: 'flex', width: '100%'}}>
                                <TotalListBlock
                                    fieldName={'vendors'}
                                    isReadOnly={true}
                                    isChanged={!!componentData?.objChangedData?.['vendors']}
                                    myStyleMain={{ width: '100%' }}
                                    myStyleListBox={{ height: '250px' }}
                                    skeletonLoading={loadingProcess?.['vendors']}
                                >
                                    {arrCurrentVendorsObject.map((item) => (
                                        item.id && (
                                        <BlockCheckBox
                                            key={item.id} 
                                            id={item.id}
                                            title={item.name}
                                            isReadOnly={true}
                                        />   
                                        )                 
                                    ))}
                                </TotalListBlock>
                                <ButtonMain
                                    onClick={() => {
                                        dispatch(setModalProps({componentName: 'ChangeLineItemsModal', data: {
                                            objInputData: {current_items: arrCurrentVendorsObject},
                                            other: {
                                                all_items: vendorsData?.map((item) => ({id: item.id, name: item['name']})) || [],
                                                componentName: componentName,
                                                field: 'new_vendors',
                                                title: 'Изменение списка по вендорам'
                                            }
                                        }}))
                                        dispatch(setModalOpen('ChangeLineItemsModal'))
                                    }} 
                                    type={'plusIcon'} 
                                />
                            </ContentBlock>
                        </ContentBlock>
                        <ContentBlock myStyleMain={{overflowY: 'auto', borderTop: '1px solid #bebebe', padding: '0', height: '100%'}} myStyleContent={{height: '100%'}}>
                            <MonthlyAccountingReportTable
                                arrData={reportData || null}
                                isLoading={loadingProcess?.['arrData']}
                            />
                        </ContentBlock>
                    </ContentBlock>
                </MainModalMainBlock>
            </ModalViewBase>
        </>)}
    </>)
}

export default MonthlyAccountingReport