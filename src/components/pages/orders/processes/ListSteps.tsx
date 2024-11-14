import React, { useEffect } from 'react';
import MainInfoBlock from '../../../blocks/MainInfoBlock';
import { useEffectStoreData } from '../../../hooks/useEffectStoreData';
import { useDispatch } from 'react-redux';
import { funcSortedDataByValue } from '../../../functions/funcSortedDataByValue';
import ElementSpoilerNum from '../../../UI/spoilers/ElementSpoilerNum';
import { useGetProcessNamesQuery } from '../../../../store/api/processNamesApiSlice';
import { useGetProcessStatusesQuery } from '../../../../store/api/processStatusApiSlice';
import { useGetProcessesDataQuery } from '../../../../store/api/processDataApiSlice';
import { deleteComponentsAPIUpdate } from '../../../../store/componentsData/componentsAPIUpdateSlice';
import Annexes from './steps/Annexes/Annexes';
import Contracts from './steps/Contracts/Contracts';
import InputFiles from './steps/InputFiles/InputFiles';
import Offers from './steps/Offers/Offers';
import PaymentSystem from './steps/PaymentSystem/PaymentSystem';
import PO from './steps/PO/PO';
import Production from './steps/Production/Production';
import Proofs from './steps/Proofs/Proofs';
import Tests from './steps/TestsProcess/Tests';
import DeliveriesVendor from './steps/DeliveriesVendor/DeliveriesVendor';
import DeliveriesBank from './steps/DeliveriesBank/DeliveriesBank';
import PaymentsVendor from './steps/PaymentsVendor/PaymentsVendor';
import PaymentsBank from './steps/PaymentsBank/PaymentsBank';


interface IListSteps {
    selectedID: number
}


const ListSteps = ({
    selectedID
}: IListSteps) => {

    const componentName = 'ListSteps'
    const {componentsAPIUpdate } = useEffectStoreData(componentName);   
    const dispatch = useDispatch()

    const {data: processNamesData, isFetching: isFetchingProcessNamesData, error: errorProcessNamesData, refetch: refetchProcessNamesData} = useGetProcessNamesQuery(undefined)
    const {data: processStatusesData, isFetching: isFetchingProcessStatusesData, error: errorProcessStatusesData, refetch: refetchProcessStatusesData} = useGetProcessStatusesQuery(undefined)
    const { data: processData, isFetching: isFetchingProcessData, error: errorProcessData, refetch: refetchProcessData } = useGetProcessesDataQuery(
        { line_number: selectedID as number },
        {
            skip: !selectedID,
            selectFromResult: ({ data, ...other }) => ({
                data: selectedID ? data : [],
                ...other
            })
        }
    )

    useEffect(() => {
        if (componentsAPIUpdate.includes('processNamesData')) {
            updateAPIData('processNamesData', refetchProcessNamesData)
        } else if (componentsAPIUpdate.includes('processStatusesData')) {
            updateAPIData('processStatusesData', refetchProcessStatusesData)
        } else if (componentsAPIUpdate.includes('processData')) {
            updateAPIData('processData', refetchProcessData)
        }
    }, [componentsAPIUpdate]);

    function updateAPIData (name: string, refetchFunc: () => void) {
        try {
            refetchFunc();
        } catch (error) {} finally {
            dispatch(deleteComponentsAPIUpdate([name])) 
        } 
    }

    const stepBlockMatching: Record<string, React.ComponentType<any>> = {
        'Приложения': Annexes,
        'Договоры': Contracts,
        'Доставки от вендора': DeliveriesVendor,
        'Доставки в банк': DeliveriesBank,
        'Исходники': InputFiles,
        'КП': Offers,
        'Оплаты вендору': PaymentsVendor,
        'Оплаты от банка': PaymentsBank,
        'PO': PO,
        'Производство': Production,
        'Макеты': Proofs,
        'Платежные системы': PaymentSystem,
        'Тестирования': Tests,
    }


    return (
        <MainInfoBlock myStyleMain={{border: '1px solid #bebebe', borderRadius: '10px'}} myStyleContext={{overflowY: 'auto', paddingBottom: '10px'}}>
            {funcSortedDataByValue(processNamesData || [], 'position_number', true).map((step) => {
                const StepComponent = stepBlockMatching[step.component_name];
                    return (
                        <ElementSpoilerNum 
                            key={step.component_name}
                            spoilerNumber={step.position_number} 
                            spoilerTitle={step.component_name} 
                            stepStatus={processStatusesData?.find(item => item.id === processData?.find(process => process.process_step === step.id)?.step_status)?.name_eng}
                            myStyleMain={{margin: '0 0px', borderRadius: '10px', padding: '0 0 15px 0'}}
                        >
                            {StepComponent && 
                            <StepComponent 
                                processStep={step}
                                selectedID={+selectedID}
                            />
                            }
                        </ElementSpoilerNum>                    
                    )
                }
            )}

        </MainInfoBlock>
    );
};

export default ListSteps;