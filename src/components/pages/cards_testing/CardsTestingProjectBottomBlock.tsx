import { useDispatch } from "react-redux";
import ElementSpoiler from "../../UI/spoilers/ElementSpoiler";
import MainInfoBlock from "../../blocks/MainInfoBlock";
import CardsTestingProjectGeneralInfo from "./CardsTestingProjectGeneralInfo";
import CardsTestingProjectMainData from "./CardsTestingProjectMainData";
import CardsTestingProjectParams from "./CardsTestingProjectParams";
import CardsTestingTableBlock from "./CardsTestingTableBlock";
import CardsTransferTableBlock from "./CardsTransferTableBlock";
import { useEffectStoreData } from "../../hooks/useEffectStoreData";
import useTimeoutManager from "../../hooks/useTimeoutManager";
import { useUpdateCardTestingMutation } from "../../../store/api/cardTestingApiSlice";
import { funcValidateFields, IGeneralValidResult } from "../../functions/funcValidateFields";
import { setSavingStatus } from "../../../store/componentsData/savingProcessSlice";
import { deleteFieldInvalid, setFieldInvalid } from "../../../store/componentsData/fieldsInvalidSlice";
import { deleteAllComponentData, deleteChangedComponentData } from "../../../store/componentsData/componentsDataSlice";
import { functionErrorMessage } from "../../functions/functionErrorMessage";
import { changeComponentReadOnly } from "../../../store/componentsData/componentsReadOnlySlice";
import BtnBlock from "../../blocks/BtnBlock";
import ButtonMain from "../../UI/buttons/ButtonMain";



interface ICardsTestingProjectBottomBlock {
    selectedID: number
}

const CardsTestingProjectBottomBlock = ({
    selectedID,
}: ICardsTestingProjectBottomBlock) => {

    const componentsViewed = ['CardsTestingProjectMainData', 'CardsTestingProjectParams', 'CardsTestingProjectGeneralInfo']
    const { componentReadOnly: CardsTestingProjectMainData_componentReadOnly, fieldParams: CardsTestingProjectMainData_fieldParams, componentData: CardsTestingProjectMainData_componentData } = useEffectStoreData('CardsTestingProjectMainData')
    const { fieldParams: CardsTestingProjectParams_fieldParams, componentData: CardsTestingProjectParams_componentData } = useEffectStoreData('CardsTestingProjectParams')
    const { fieldParams: CardsTestingProjectGeneralInfo_fieldParams, componentData: CardsTestingProjectGeneralInfo_componentData } = useEffectStoreData('CardsTestingProjectGeneralInfo')
    const dispatch = useDispatch()
    const setCardsTestingProjectMainDataManagedTimeout = useTimeoutManager('CardsTestingProjectMainData')
    const setCardsTestingProjectParamsManagedTimeout = useTimeoutManager('CardsTestingProjectParams')
    const setCardsTestingProjectGeneralInfoManagedTimeout = useTimeoutManager('CardsTestingProjectGeneralInfo')

    const [updateCardTesting, { }] = useUpdateCardTestingMutation()

    function validateComponents(): IGeneralValidResult {
        const isComponentsValid: IGeneralValidResult = {
            isAllFieldsValid: true,
            data: {},
        };    

        const isCardsTestingProjectMainDataValid = funcValidateFields(
            CardsTestingProjectMainData_fieldParams, 
            CardsTestingProjectMainData_componentData?.objInputAndChangedData, 
            CardsTestingProjectMainData_componentData?.objChangedData
        )
        const isCardsTestingProjectParamsValid = funcValidateFields(
            CardsTestingProjectParams_fieldParams, 
            CardsTestingProjectParams_componentData?.objInputAndChangedData, 
            CardsTestingProjectParams_componentData?.objChangedData
        )
        const isCardsTestingProjectGeneralInfoValid = funcValidateFields(
            CardsTestingProjectGeneralInfo_fieldParams, 
            CardsTestingProjectGeneralInfo_componentData?.objInputAndChangedData, 
            CardsTestingProjectGeneralInfo_componentData?.objChangedData
        )

        isComponentsValid.isAllFieldsValid = 
            (
                isCardsTestingProjectMainDataValid.isAllFieldsValid && 
                isCardsTestingProjectParamsValid.isAllFieldsValid && 
                isCardsTestingProjectGeneralInfoValid.isAllFieldsValid
            ) ? true : false
        isComponentsValid.data = {
            ...isCardsTestingProjectMainDataValid.data,
            ...isCardsTestingProjectParamsValid.data,
            ...isCardsTestingProjectGeneralInfoValid.data
        }
        return isComponentsValid;
    }

    async function funcSaveFields() {
        componentsViewed.forEach((componentName: string) => {
            dispatch(setSavingStatus({componentName, data: {status: true}}))
        })
        const currentId: number = CardsTestingProjectMainData_componentData?.objInputAndChangedData['id'] as number
        if (currentId) {
            const isComponentsValid = validateComponents()
            if (isComponentsValid.isAllFieldsValid) {
                componentsViewed.forEach((componentName: string) => {
                    dispatch(deleteFieldInvalid({componentName}))
                })
                const myData = {
                    ...CardsTestingProjectMainData_componentData?.objChangedData, 
                    ...CardsTestingProjectParams_componentData?.objChangedData,
                    ...CardsTestingProjectGeneralInfo_componentData?.objChangedData
                }
                await updateCardTesting({ ...myData, id: currentId }).unwrap()
                    .then((res) => {
                        componentsViewed.forEach((componentName: string) => {
                            dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: true}}))
                            dispatch(deleteAllComponentData({componentName}))
                        })
                        funcChangeCancelSet(true)

                        setCardsTestingProjectMainDataManagedTimeout(() => {
                            dispatch(setSavingStatus({ componentName: 'CardsTestingProjectMainData', data: { status: false } }))
                        }, 1000)
                        setCardsTestingProjectParamsManagedTimeout(() => {
                            dispatch(setSavingStatus({ componentName: 'CardsTestingProjectParams', data: { status: false } }))
                        }, 1000)
                        setCardsTestingProjectGeneralInfoManagedTimeout(() => {
                            dispatch(setSavingStatus({ componentName: 'CardsTestingProjectGeneralInfo', data: { status: false } }))
                        }, 1000)
                    }).catch((error) => {
                        const message = functionErrorMessage(error)
                        componentsViewed.forEach((componentName: string) => {
                            dispatch(setSavingStatus({ componentName, data: { status: true, isSuccessful: false, message: message} }))
                        })
                    })
            } else {
                componentsViewed.forEach((componentName: string) => {
                    dispatch(setFieldInvalid({componentName, data: isComponentsValid.data}))
                    dispatch(setSavingStatus({componentName, data: {status: false}}))                
                })
            }
        } else {
            componentsViewed.forEach((componentName: string) => {
                dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: false, message: "Ошибка! Обновите страницу и попробуйте заново."}}))             
            })
        }
    }

    function funcChangeCancelSet(newStatus: boolean) {
        componentsViewed.forEach((componentName: string) => {
            dispatch(deleteChangedComponentData({componentName}))
            dispatch(changeComponentReadOnly({componentName, newStatus}))
            dispatch(deleteFieldInvalid({componentName}))        
        })        
    }

    return (
        <div className="bottom-context-block">
            <MainInfoBlock myStyleMain={{border: '1px solid #bebebe', borderRadius: '10px'}} myStyleContext={{overflowY: 'hidden', paddingBottom: '10px'}}>
                <BtnBlock>
                    {
                        ({
                            ...CardsTestingProjectMainData_componentData?.objChangedData, 
                            ...CardsTestingProjectParams_componentData?.objChangedData,
                            ...CardsTestingProjectGeneralInfo_componentData?.objChangedData
                        } && Object.keys({
                            ...CardsTestingProjectMainData_componentData?.objChangedData, 
                            ...CardsTestingProjectParams_componentData?.objChangedData,
                            ...CardsTestingProjectGeneralInfo_componentData?.objChangedData
                        }).length > 0) &&
                        <ButtonMain
                            onClick={funcSaveFields}
                            type={'submit'}
                            title={'Сохранить'}
                        />
                    }
                    <ButtonMain
                        onClick={() => funcChangeCancelSet(CardsTestingProjectMainData_componentReadOnly?.status ? false : true)}
                        type={'other'}
                        color={'gray'}
                        myStyle={{ width: '120px' }}
                        title={!CardsTestingProjectMainData_componentReadOnly?.status ? 'Отмена' : 'Редактировать'}
                    />
                </BtnBlock>
                <MainInfoBlock myStyleContext={{overflowY: 'auto'}}>
                    <MainInfoBlock myStyleMain={{height: '220px', flex: '0 0 auto', borderBottom: '1px solid #bebebe', borderRadius: '0', marginBottom: '10px'}}>
                        <CardsTestingProjectMainData
                            selectedID={selectedID}
                        />
                    </MainInfoBlock>
                    <ElementSpoiler spoilerTitle={'Основные характеристики'} isDefaultActive={true}>
                        <CardsTestingProjectParams
                            selectedID={selectedID}
                        />
                    </ElementSpoiler>
                    <ElementSpoiler spoilerTitle={'Общая информация'} isDefaultActive={true}>
                        <CardsTestingProjectGeneralInfo
                            selectedID={selectedID}                 
                        />
                    </ElementSpoiler>
                    <ElementSpoiler spoilerTitle={'Документы'} isDefaultActive={true}>    
                        <CardsTestingTableBlock
                            selectedID={selectedID}
                        />
                    </ElementSpoiler>
                    <ElementSpoiler spoilerTitle={'Перемещения'} isDefaultActive={true}>
                        <CardsTransferTableBlock
                            selectedID={selectedID}
                        />
                    </ElementSpoiler>                      
                </MainInfoBlock>
            </MainInfoBlock>
        </div>
    );
};

export default CardsTestingProjectBottomBlock;