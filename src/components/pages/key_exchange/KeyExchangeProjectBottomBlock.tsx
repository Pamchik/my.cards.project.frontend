import { useDispatch } from "react-redux";
import { useUpdateKeyExchangeMutation } from "../../../store/api/keyExchangeApiSlice";
import ButtonMain from "../../UI/buttons/ButtonMain";
import ElementSpoiler from "../../UI/spoilers/ElementSpoiler";
import BtnBlock from "../../blocks/BtnBlock";
import MainInfoBlock from "../../blocks/MainInfoBlock";
import { funcValidateFields, IGeneralValidResult } from "../../functions/funcValidateFields";
import KeyExchangeProjectMainData from "./KeyExchangeProjectMainData";
import KeyExchangeProjectParams from "./KeyExchangeProjectParams";
import KeyExchangeTableBlock from "./KeyExchangeTableBlock";
import { setSavingStatus } from "../../../store/componentsData/savingProcessSlice";
import { deleteFieldInvalid, setFieldInvalid } from "../../../store/componentsData/fieldsInvalidSlice";
import { deleteAllComponentData, deleteChangedComponentData } from "../../../store/componentsData/componentsDataSlice";
import useTimeoutManager from "../../hooks/useTimeoutManager";
import { functionErrorMessage } from "../../functions/functionErrorMessage";
import { changeComponentReadOnly } from "../../../store/componentsData/componentsReadOnlySlice";
import { useEffectStoreData } from "../../hooks/useEffectStoreData";

interface IKeyExchangeProjectBottomBlock {
    selectedID: number
}

const KeyExchangeProjectBottomBlock = ({
    selectedID,
}: IKeyExchangeProjectBottomBlock) => {

    const componentsViewed = ['KeyExchangeProjectMainData', 'KeyExchangeProjectParams']
    const { componentReadOnly: KeyExchangeProjectMainData_componentReadOnly, fieldParams: KeyExchangeProjectMainData_fieldParams, componentData: KeyExchangeProjectMainData_componentData } = useEffectStoreData('KeyExchangeProjectMainData')
    const { fieldParams: KeyExchangeProjectParams_fieldParams, componentData: KeyExchangeProjectParams_componentData } = useEffectStoreData('KeyExchangeProjectParams')
    const dispatch = useDispatch()
    const setKeyExchangeProjectMainDataManagedTimeout = useTimeoutManager('KeyExchangeProjectMainData')
    const setKeyExchangeProjectParamsManagedTimeout = useTimeoutManager('KeyExchangeProjectParams')

    const [updateKeyExchange, {}] = useUpdateKeyExchangeMutation()

    function validateComponents(): IGeneralValidResult {
        const isComponentsValid: IGeneralValidResult = {
            isAllFieldsValid: true,
            data: {},
        };    

        const isKeyExchangeProjectMainDataValid = funcValidateFields(
            KeyExchangeProjectMainData_fieldParams, 
            KeyExchangeProjectMainData_componentData?.objInputAndChangedData, 
            KeyExchangeProjectMainData_componentData?.objChangedData
        )
        const isKeyExchangeProjectParamsValid = funcValidateFields(
            KeyExchangeProjectParams_fieldParams, 
            KeyExchangeProjectParams_componentData?.objInputAndChangedData, 
            KeyExchangeProjectParams_componentData?.objChangedData
        )

        isComponentsValid.isAllFieldsValid = 
            (
                isKeyExchangeProjectMainDataValid.isAllFieldsValid && 
                isKeyExchangeProjectParamsValid.isAllFieldsValid
            ) ? true : false
        isComponentsValid.data = {
            ...isKeyExchangeProjectMainDataValid.data,
            ...isKeyExchangeProjectParamsValid.data
        }
        return isComponentsValid;
    }

    async function funcSaveFields () {
        componentsViewed.forEach((componentName: string) => {
            dispatch(setSavingStatus({componentName, data: {status: true}}))
        })
        const currentId: number = KeyExchangeProjectMainData_componentData?.objInputAndChangedData['id'] as number
        if (currentId) {
            const isComponentsValid = validateComponents()
            if (isComponentsValid.isAllFieldsValid) {
                componentsViewed.forEach((componentName: string) => {
                    dispatch(deleteFieldInvalid({componentName}))
                })
                const myData = {
                    ...KeyExchangeProjectMainData_componentData?.objChangedData, 
                    ...KeyExchangeProjectParams_componentData?.objChangedData
                }
                await updateKeyExchange({...myData, id: currentId}).unwrap()    
                .then((res) => {
                    componentsViewed.forEach((componentName: string) => {
                        dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: true}}))
                        dispatch(deleteAllComponentData({componentName}))                        
                    })
                    funcChangeCancelSet(true)
                    setKeyExchangeProjectMainDataManagedTimeout(() => { 
                        dispatch(setSavingStatus({ componentName: 'KeyExchangeProjectMainData', data: { status: false } }))                        
                    }, 1000) 
                    setKeyExchangeProjectParamsManagedTimeout(() => { 
                        dispatch(setSavingStatus({ componentName: 'KeyExchangeProjectParams', data: { status: false } }))                        
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
                            ...KeyExchangeProjectMainData_componentData?.objChangedData, 
                            ...KeyExchangeProjectParams_componentData?.objChangedData
                        } && Object.keys({
                            ...KeyExchangeProjectMainData_componentData?.objChangedData, 
                            ...KeyExchangeProjectParams_componentData?.objChangedData
                        }).length > 0) &&
                        <ButtonMain
                            onClick={funcSaveFields} 
                            type={'submit'} 
                            title={'Сохранить'}
                        />
                    }
                    <ButtonMain 
                        onClick={() => funcChangeCancelSet(KeyExchangeProjectMainData_componentReadOnly?.status ? false : true)} 
                        type={'other'} 
                        color={'gray'}
                        myStyle={{width: '120px'}} 
                        title={!KeyExchangeProjectMainData_componentReadOnly?.status ? 'Отмена' : 'Редактировать'}
                    />                 
                </BtnBlock>     
                <MainInfoBlock myStyleContext={{overflowY: 'auto'}}>
                    <MainInfoBlock myStyleMain={{height: '220px', flex: '0 0 auto', borderBottom: '1px solid #bebebe', borderRadius: '0', marginBottom: '10px'}}>
                        <KeyExchangeProjectMainData
                            selectedID={selectedID}
                        />
                    </MainInfoBlock>
                    <ElementSpoiler spoilerTitle={'Основные характеристики'} isDefaultActive={true}>  
                        <KeyExchangeProjectParams
                            selectedID={selectedID}
                        />
                    </ElementSpoiler>
                    <ElementSpoiler spoilerTitle={'Документы'} isDefaultActive={true}> 
                        <KeyExchangeTableBlock
                            selectedID={selectedID}
                        />
                    </ElementSpoiler>                          
                </MainInfoBlock>                    
            </MainInfoBlock>                
        </div>
    );
};

export default KeyExchangeProjectBottomBlock;