import React, { useState } from 'react';
import MainInfoBlock from '../../../blocks/MainInfoBlock';
import PictureCommentBlock from './PictureCommentBlock';
import ElementSpoiler from '../../../UI/spoilers/ElementSpoiler';
import ProjectMainData from './ProjectMainData';
import MaterialLineInfo from './MaterialLineInfo';
import ProjectBankInfo from './ProjectBankInfo';
import ProjectVendorInfo from './ProjectVendorInfo';
import BtnBlock from '../../../blocks/BtnBlock';
import ButtonMain from '../../../UI/buttons/ButtonMain';
import { useEffectStoreData } from '../../../hooks/useEffectStoreData';
import { useDispatch } from 'react-redux';
import useTimeoutManager from '../../../hooks/useTimeoutManager';
import { useUpdateProjectMutation, useUpdateProjectWithFileMutation } from '../../../../store/api/projectsApiSlice';
import { funcValidateFields, IGeneralValidResult } from '../../../functions/funcValidateFields';
import { setSavingStatus } from '../../../../store/componentsData/savingProcessSlice';
import { deleteFieldInvalid, setFieldInvalid } from '../../../../store/componentsData/fieldsInvalidSlice';
import { deleteAllComponentData, deleteChangedComponentData } from '../../../../store/componentsData/componentsDataSlice';
import { functionErrorMessage } from '../../../functions/functionErrorMessage';
import { changeComponentReadOnly } from '../../../../store/componentsData/componentsReadOnlySlice';

interface IGeneralLineInfo {
    selectedID: number
}

const GeneralLineInfo = ({
    selectedID,
}: IGeneralLineInfo) => {

    const componentsViewed = ['PictureCommentBlock', 'ProjectMainData', 'ProjectBankInfo', 'ProjectVendorInfo', 'MaterialLineInfo']
    const { componentReadOnly: PictureCommentBlock_componentReadOnly, fieldParams: PictureCommentBlock_fieldParams, componentData: PictureCommentBlock_componentData } = useEffectStoreData('PictureCommentBlock')
    const { fieldParams: ProjectMainData_fieldParams, componentData: ProjectMainData_componentData } = useEffectStoreData('ProjectMainData')
    const { fieldParams: ProjectBankInfo_fieldParams, componentData: ProjectBankInfo_componentData } = useEffectStoreData('ProjectBankInfo')
    const { fieldParams: ProjectVendorInfo_fieldParams, componentData: ProjectVendorInfo_componentData } = useEffectStoreData('ProjectVendorInfo')
    const { fieldParams: MaterialLineInfo_fieldParams, componentData: MaterialLineInfo_componentData } = useEffectStoreData('MaterialLineInfo')   
    const dispatch = useDispatch()
    const setPictureCommentBlockManagedTimeout = useTimeoutManager('PictureCommentBlock')
    const setProjectMainDataManagedTimeout = useTimeoutManager('ProjectMainData')
    const setProjectBankInfoManagedTimeout = useTimeoutManager('ProjectBankInfo')
    const setProjectVendorInfoManagedTimeout = useTimeoutManager('ProjectVendorInfo')
    const setMaterialLineInfoManagedTimeout = useTimeoutManager('MaterialLineInfo')

    const [updateProjectWithFile, {}] = useUpdateProjectWithFileMutation()
    const [updateProject, {}] = useUpdateProjectMutation()

    function validateComponents(): IGeneralValidResult {
        const isComponentsValid: IGeneralValidResult = {
            isAllFieldsValid: true,
            data: {},
        };    

        const isPictureCommentBlockValid = funcValidateFields(
            PictureCommentBlock_fieldParams, 
            PictureCommentBlock_componentData?.objInputAndChangedData, 
            PictureCommentBlock_componentData?.objChangedData
        )
        const isProjectMainDataValid = funcValidateFields(
            ProjectMainData_fieldParams, 
            ProjectMainData_componentData?.objInputAndChangedData, 
            ProjectMainData_componentData?.objChangedData
        )
        const isProjectBankInfoValid = funcValidateFields(
            ProjectBankInfo_fieldParams, 
            ProjectBankInfo_componentData?.objInputAndChangedData, 
            ProjectBankInfo_componentData?.objChangedData
        )
        const isProjectVendorInfoValid = funcValidateFields(
            ProjectVendorInfo_fieldParams, 
            ProjectVendorInfo_componentData?.objInputAndChangedData, 
            ProjectVendorInfo_componentData?.objChangedData
        )
        const isMaterialLineInfoValid = funcValidateFields(
            MaterialLineInfo_fieldParams, 
            MaterialLineInfo_componentData?.objInputAndChangedData, 
            MaterialLineInfo_componentData?.objChangedData
        )

        isComponentsValid.isAllFieldsValid = 
            (
                isPictureCommentBlockValid.isAllFieldsValid && 
                isProjectMainDataValid.isAllFieldsValid && 
                isProjectBankInfoValid.isAllFieldsValid &&
                isProjectVendorInfoValid.isAllFieldsValid &&
                isMaterialLineInfoValid.isAllFieldsValid
            ) ? true : false
        isComponentsValid.data = {
            ...isPictureCommentBlockValid.data,
            ...isProjectMainDataValid.data,
            ...isProjectBankInfoValid.data,
            ...isProjectVendorInfoValid.data,
            ...isMaterialLineInfoValid.data
        }
        return isComponentsValid;
    }

    async function funcSaveFields () {
        componentsViewed.forEach((componentName: string) => {
            dispatch(setSavingStatus({componentName, data: {status: true}}))
        })
        const currentId: number = PictureCommentBlock_componentData?.objInputAndChangedData['id'] as number
        if (currentId) {
            const isComponentsValid = validateComponents()
            if (isComponentsValid.isAllFieldsValid) {
                componentsViewed.forEach((componentName: string) => {
                    dispatch(deleteFieldInvalid({componentName}))
                })
                const myData = {
                    ...PictureCommentBlock_componentData?.objChangedData, 
                    ...ProjectMainData_componentData?.objChangedData,
                    ...ProjectBankInfo_componentData?.objChangedData,
                    ...ProjectVendorInfo_componentData?.objChangedData,
                    ...MaterialLineInfo_componentData?.objChangedData
                }

                if (newPreview) {
                    await updateProjectWithFile({file: newPreview, data: myData, id: currentId}).unwrap()    
                    .then((res) => {
                        componentsViewed.forEach((componentName: string) => {
                            dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: true}}))
                            dispatch(deleteAllComponentData({componentName}))
                        })
                        funcChangeCancelSet(true)
                        setPictureCommentBlockManagedTimeout(() => { 
                            dispatch(setSavingStatus({ componentName: 'PictureCommentBlock', data: { status: false } }))
                            setNewPreview(null)
                        }, 1000)  
                        setProjectMainDataManagedTimeout(() => { 
                            dispatch(setSavingStatus({ componentName: 'ProjectMainData', data: { status: false } }))
                        }, 1000)  
                        setProjectBankInfoManagedTimeout(() => { 
                            dispatch(setSavingStatus({ componentName: 'ProjectBankInfo', data: { status: false } }))
                        }, 1000)  
                        setProjectVendorInfoManagedTimeout(() => { 
                            dispatch(setSavingStatus({ componentName: 'ProjectVendorInfo', data: { status: false } }))
                        }, 1000)  
                        setMaterialLineInfoManagedTimeout(() => { 
                            dispatch(setSavingStatus({ componentName: 'MaterialLineInfo', data: { status: false } }))
                        }, 1000)  
                    }).catch((error) => {
                        const message = functionErrorMessage(error)
                        componentsViewed.forEach((componentName: string) => {
                            dispatch(setSavingStatus({ componentName, data: { status: true, isSuccessful: false, message: message} }))
                        })
                    }) 
                } else {
                    await updateProject({...myData, id: currentId}).unwrap()    
                    .then((res) => {
                        componentsViewed.forEach((componentName: string) => {
                            dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: true}}))
                            dispatch(deleteAllComponentData({componentName}))                        
                        })
                        funcChangeCancelSet(true)
                        setPictureCommentBlockManagedTimeout(() => { 
                            dispatch(setSavingStatus({ componentName: 'PictureCommentBlock', data: { status: false } }))
                        }, 1000)  
                        setProjectMainDataManagedTimeout(() => { 
                            dispatch(setSavingStatus({ componentName: 'ProjectMainData', data: { status: false } }))
                        }, 1000)  
                        setProjectBankInfoManagedTimeout(() => { 
                            dispatch(setSavingStatus({ componentName: 'ProjectBankInfo', data: { status: false } }))
                        }, 1000)  
                        setProjectVendorInfoManagedTimeout(() => { 
                            dispatch(setSavingStatus({ componentName: 'ProjectVendorInfo', data: { status: false } }))
                        }, 1000)  
                        setMaterialLineInfoManagedTimeout(() => { 
                            dispatch(setSavingStatus({ componentName: 'MaterialLineInfo', data: { status: false } }))
                        }, 1000) 
                    }).catch((error) => {
                        const message = functionErrorMessage(error)
                        componentsViewed.forEach((componentName: string) => {
                            dispatch(setSavingStatus({ componentName, data: { status: true, isSuccessful: false, message: message} }))
                        })
                    })  
                }
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
        setNewPreview(null)
    }

    const [newPreview, setNewPreview] = useState<File | null>(null)
    function funcSetImage (file: File | null) {
        setNewPreview(file)
    }
    
    return (

        <MainInfoBlock myStyleMain={{height: '100%', border: '1px solid #bebebe', borderRadius: '10px'}} myStyleContext={{overflowY: 'hidden', paddingBottom: '10px'}}>
            <BtnBlock>
                {
                    ({
                        ...PictureCommentBlock_componentData?.objChangedData, 
                        ...ProjectMainData_componentData?.objChangedData,
                        ...ProjectBankInfo_componentData?.objChangedData,
                        ...ProjectVendorInfo_componentData?.objChangedData,
                        ...MaterialLineInfo_componentData?.objChangedData
                    } && Object.keys({
                        ...PictureCommentBlock_componentData?.objChangedData, 
                        ...ProjectMainData_componentData?.objChangedData,
                        ...ProjectBankInfo_componentData?.objChangedData,
                        ...ProjectVendorInfo_componentData?.objChangedData,
                        ...MaterialLineInfo_componentData?.objChangedData
                    }).length > 0 || newPreview) && 
                    <ButtonMain
                        onClick={funcSaveFields} 
                        type={'submit'} 
                        title={'Сохранить'}
                    />
                }
                <ButtonMain 
                    onClick={() => funcChangeCancelSet(PictureCommentBlock_componentReadOnly?.status ? false : true)} 
                    type={'other'} 
                    color={'gray'}
                    myStyle={{width: '120px'}} 
                    title={!PictureCommentBlock_componentReadOnly?.status ? 'Отмена' : 'Редактировать'}
                />                 
            </BtnBlock>
            <MainInfoBlock myStyleContext={{overflowY: 'auto'}}>
                {/* -------- Рисунок, комментарий -------- */}
                <MainInfoBlock myStyleMain={{height: '230px', flex: '0 0 auto', borderBottom: '1px solid #bebebe', borderRadius: '0'}}>
                    <PictureCommentBlock
                        selectedID={selectedID}
                        funcSetImage={funcSetImage}
                    />
                </MainInfoBlock>

                {/* -------- Общие данные по заказу -------- */}
                <ElementSpoiler spoilerTitle={'Данные по заказу'} isDefaultActive={true}>
                    <ProjectMainData
                        selectedID={selectedID}
                    />
                </ElementSpoiler>

                {/* -------- Данные по материалам -------- */}
                <ElementSpoiler spoilerTitle={'Данные по материалам'} isDefaultActive={true}>
                    <MaterialLineInfo
                        selectedID={selectedID}
                    />
                </ElementSpoiler>

                {/* -------- Общие данные по Банку -------- */}
                <ElementSpoiler spoilerTitle={'Данные по Банку'} isDefaultActive={true}>
                    <ProjectBankInfo
                        selectedID={selectedID}
                    />
                </ElementSpoiler>

                {/* -------- Общие данные по Вендору -------- */}
                <ElementSpoiler spoilerTitle={'Данные по Вендору'} isDefaultActive={true}>
                    <ProjectVendorInfo
                        selectedID={selectedID}               
                    />
                </ElementSpoiler>
            </MainInfoBlock>
        </MainInfoBlock>
    );
};

export default GeneralLineInfo;