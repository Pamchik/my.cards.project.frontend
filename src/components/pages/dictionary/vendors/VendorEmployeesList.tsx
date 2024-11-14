import { useEffect, useState } from "react";
import ListBlock from "../../../UI/list/ListBlock";
import { useEffectStoreData } from "../../../hooks/useEffectStoreData";
import { useComponentPreparation } from "../../../hooks/useComponentPreparation";
import { useFieldValueChange } from "../../../hooks/useFieldValueChange";
import { useDispatch } from "react-redux";
import { IFieldParams, IInputTypes } from "../../../../store/componentsData/fieldsParamsSlice";
import { setLoadingStatus } from "../../../../store/componentsData/loadingProcessSlice";
import { funcSortedDataByValue } from "../../../functions/funcSortedDataByValue";
import { funcFilteredDataByValues } from "../../../functions/funcFilteredDataByValues";
import LoadingView from "../../../loading/LoadingView";
import MainInfoBlock from "../../../blocks/MainInfoBlock";
import BtnBlock from "../../../blocks/BtnBlock";
import ButtonMain from "../../../UI/buttons/ButtonMain";
import ContentBlock from "../../../blocks/ContentBlock";
import BlockInput from "../../../UI/fields/BlockInput";
import { IInputValue, ISelectValue } from "../../../../store/componentsData/componentsDataSlice";
import BlockSelect from "../../../UI/fields/BlockSelect";
import { deleteComponentsAPIUpdate } from "../../../../store/componentsData/componentsAPIUpdateSlice";
import { IVendorEmployeesData, useGetVendorEmployeesQuery } from "../../../../store/api/vendorEmployeeApiSlice";
import { setModalProps } from "../../../../store/modalData/modalsPropsDataSlice";
import { setModalOpen } from "../../../../store/modalData/modalsSlice";
import { useAllComponentParamsReset } from "../../../hooks/useComponentDataReset";
import useTimeoutManager from "../../../hooks/useTimeoutManager";


interface IVendorEmployeesList {
    setSelectedID: (id: number | null) => void,
    selectedID: number | null
    globalElementID: number
}

const VendorEmployeesList = ({
    setSelectedID,
    selectedID,
    globalElementID
}: IVendorEmployeesList) => {

    const componentName = "VendorEmployeesList"
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {loadingProcess, fieldParams, componentData, componentsAPIUpdate} = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: vendorEmployeesData, isFetching: isFetchingVendorEmployeesData, error: errorVendorEmployeesData, refetch: refetchVendorEmployeesData} = useGetVendorEmployeesQuery({vendor: globalElementID})

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    useEffect(() => {
        if (componentsAPIUpdate.includes('vendorEmployeesData')) {
            refetchVendorEmployeesData()
            dispatch(deleteComponentsAPIUpdate(['vendorEmployeesData']))
        }
    }, [componentsAPIUpdate]);

    const initFieldParams: IFieldParams = {
        'name': { isRequired: false, type: 'text' },
        'status': { isRequired: true, type: 'number' }
    }

    useEffect(() => {
        if (!isComponentPrepared) {
            componentPreparing({ loadingFieldsData: ['name', 'status', 'arrVendorEmployees'], fieldsParamsData: initFieldParams });
            setValues({ name: 'status', value: 1 })
            setIsComponentPrepared(true);
        }
    }, [globalElementID]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
        if (isComponentPrepared) {
            setManagedTimeout(() => {
                dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['name', 'status']}}))
            }, 1000)
        }
    }, [isComponentPrepared, globalElementID]);

    useEffect(() => {
        dispatch(setLoadingStatus({ componentName, data: { status: true, fields: ['arrVendorEmployees'] } }))
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
        if (isComponentPrepared) {
            setManagedTimeout(() => {
                dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['name', 'status']}}))
            }, 1000)
            if (!isFetchingVendorEmployeesData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['arrVendorEmployees']}}))
                }, 1000)
            } else {
                dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['arrVendorEmployees']}}))
            }
        }

    }, [isFetchingVendorEmployeesData, isComponentPrepared, globalElementID]);

    const [sortedVendorEmployeesData, setSortedVendorEmployeesData] = useState<IVendorEmployeesData[]>([])

    useEffect(() => {
        if (vendorEmployeesData && isComponentPrepared) {
            const fieldsCheckValues = [
                {fieldName: 'name', value: componentData?.objInputAndChangedData['name'], required: false},
                {fieldName: 'active', value: componentData?.objInputAndChangedData['status'] === 1 ? true : false, required: false},
            ]
            const newData = funcSortedDataByValue(funcFilteredDataByValues(vendorEmployeesData, fieldsCheckValues), 'name')
            setSortedVendorEmployeesData(newData)
            if (!newData.find(item => item.id === selectedID)) {
                setSelectedID(null)
            }
        } else {
            setSortedVendorEmployeesData([])
            setSelectedID(null)
        }
    },[componentData?.objInputAndChangedData, vendorEmployeesData, isComponentPrepared])

    let itemsList;
    if (loadingProcess?.['arrVendorEmployees'].status) {
        itemsList = (
            <div style={{position: 'relative', height: '100px'}}>
                <LoadingView myStyleContainer={{backgroundColor: 'rgba(255, 255, 255, 0)'}}/>                            
            </div>            
        )
    } else {
        if (errorVendorEmployeesData) {
            itemsList = (
                <div style={{marginTop: '20px', marginLeft: '10px', marginBottom: '10px'}}>
                    Ошибка загрузки данных...
                </div>
            )
        } else {
            itemsList = (
                <>{sortedVendorEmployeesData.map((item) => (
                    <ListBlock
                        key={item.id}
                        title={item.name}
                        onClick={() => {
                            setSelectedID(item.id)
                        }}
                        isActive={item.id === selectedID}
                    />                        
                ))}</>
            )
        }
    } 

    return (<>
        {isComponentPrepared && (
            <MainInfoBlock myStyleMain={{maxWidth: '300px', borderRight: '1px solid #bebebe'}}>
                <BtnBlock>
                    <ButtonMain
                        onClick={() => {
                            dispatch(setModalProps({componentName: 'CreateNewVendorEmployeeModal', data: {
                                objChangedData: {active: true, vendor: globalElementID},
                                objReadOnlyFields: ['active', 'vendor'],
                                qtyFieldsForSavingBtn: 2
                            }}))
                            dispatch(setModalOpen('CreateNewVendorEmployeeModal'))
                        }}
                        type={'other'}
                        title={'Добавить'}  
                        color={'gray'}
                    />
                </BtnBlock>
                <ContentBlock>
                    <BlockInput
                        onChange={(obj) => setValues(obj)}
                        fieldName={'name'}
                        title={'Имя сотрудника'}
                        type={fieldParams?.['name']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['name'] as IInputValue}
                        placeholder={'Начните вводить имя ...'}
                        skeletonLoading={loadingProcess?.['name']}
                        isRequired={fieldParams?.['name']?.isRequired}
                    />
                    <BlockSelect
                        fieldName={'status'}
                        showName={"name"}
                        title={'Статус'}
                        value={componentData?.objInputAndChangedData['status'] as ISelectValue}
                        options={[{ id: 1, name: 'Активные' }, { id: 2, name: 'Архив' }]}
                        isEmptyOption={false}
                        onChange={(obj) => setValues(obj)}
                        skeletonLoading={loadingProcess?.['status']}
                        isRequired={fieldParams?.['status']?.isRequired}
                    />
                    {itemsList}           
                </ContentBlock>
            </MainInfoBlock>
        )}        
    </>)
}

export default VendorEmployeesList