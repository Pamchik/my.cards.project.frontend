import React, { useEffect, useState } from 'react';
import MainInfoBlock from '../blocks/MainInfoBlock';
import LoadingView from '../loading/LoadingView';
import BtnBlock from '../blocks/BtnBlock';
import ButtonMain from '../UI/buttons/ButtonMain';
import ContentBlock from '../blocks/ContentBlock';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { IFieldParams, IInputTypes, setFieldParams } from '../../store/componentsData/fieldsParamsSlice';
import { useFieldValueChange } from '../hooks/useFieldValueChange';
import BlockInput from '../UI/fields/BlockInput';
import { setLoadingStatus } from '../../store/componentsData/loadingProcessSlice';
import { changeComponentReadOnly, setComponentReadOnly } from '../../store/componentsData/componentsReadOnlySlice';
import { IInputValue, deleteAllComponentData } from '../../store/componentsData/componentsDataSlice';
import { deleteFieldInvalid, setFieldInvalid } from '../../store/componentsData/fieldsInvalidSlice';
import { setSavingStatus } from '../../store/componentsData/savingProcessSlice';
import { funcValidateFields } from '../functions/funcValidateFields';
import { useChangePasswordMutation } from '../../store/api/userApiSlice';
import { useEffectStoreData } from '../hooks/useEffectStoreData';

const UserPassword = () => {

    const componentName = "UserPassword"
    const sessionId = useSelector((state: RootState) => state.sessionId.id)
    const user = useSelector((state: RootState) => state.user)
    const {loadingProcess, fieldParams, savingProcess, componentData, componentInvalidFields, componentReadOnly} = useEffectStoreData(componentName);
    const dispatch = useDispatch()
    const setValues = useFieldValueChange(componentName)
    const [changePasswordAPI, {}] = useChangePasswordMutation();

    const initFieldParams: IFieldParams = {
        'password': { isRequired: true, type: 'password' },
        'new_password': { isRequired: true, type: 'password' },
        'repeat_password': { isRequired: true, type: 'password' }
    }

    useEffect(() => {
        dispatch(deleteAllComponentData({componentName}))
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['password', 'new_password', 'repeat_password']}}))
        dispatch(setComponentReadOnly({componentName}))
        dispatch(setFieldParams({componentName, data: initFieldParams}))
        setTimeout(() => {
            if (user.username) {
                dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['password', 'new_password', 'repeat_password']}}))
            } else {
                dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['password', 'new_password', 'repeat_password']}}))
            }
        }, 1000)
    }, []);   

    const [successValidation, setSuccessValidation] = useState<boolean | null>(null)

    async function submitBtn() {
        dispatch(setSavingStatus({componentName, data: {status: true}}))
        const isValid = funcValidateFields(fieldParams, componentData?.objInputAndChangedData, componentData?.objChangedData)
        if (sessionId) {
            if (isValid.isAllFieldsValid) {
                dispatch(deleteFieldInvalid({componentName}))
                const password = componentData?.objInputAndChangedData['password'] as string
                const new_password = componentData?.objInputAndChangedData['new_password'] as string 
                const repeat_password = componentData?.objInputAndChangedData['repeat_password'] as string 
                await changePasswordAPI({password, new_password, repeat_password, sessionid: sessionId}).unwrap()
                .then((res) => {
                    dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: true}}))
                    dispatch(changeComponentReadOnly({componentName, newStatus: true}))
                    dispatch(deleteAllComponentData({componentName}))
                    dispatch(deleteFieldInvalid({componentName}))
                    setSuccessValidation(true)
                    setTimeout(() => { 
                        dispatch(setSavingStatus({ componentName, data: { status: false } }))
                    }, 1000)  
                }).catch((error) => {
                    let errorMessage;
                    if (error.data && typeof error.data.message === 'string') {
                        errorMessage = error.data.message
                    } else {
                        errorMessage = 'Неизвестная ошибка, обратитесь к Администратору'
                    }
                    dispatch(setSavingStatus({ componentName, data: { status: true, isSuccessful: false, message: errorMessage} }))
                })
            } else {
                dispatch(setFieldInvalid({componentName, data: isValid.data}))
                dispatch(setSavingStatus({componentName, data: {status: false}}))
            }
        } else {
            dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: false, message: "Ошибка сессии. Обновите страницу."}}))
        }
    }

    
    return (
        <MainInfoBlock myStyleMain={{border: '1px solid #bebebe', borderRadius: '10px', width: '50%', marginLeft: 'auto', marginRight: 'auto', height: '350px', flex: 'none'}}>
            {savingProcess?.status && 
                <LoadingView 
                    isSuccessful={savingProcess.isSuccessful} 
                    errorMessage={savingProcess.message} 
                    componentName={componentName} 
                />
            } 
            <BtnBlock>
                {
                    (
                        componentData?.objInputAndChangedData['password'] && 
                        componentData?.objInputAndChangedData['new_password'] && 
                        componentData?.objInputAndChangedData['repeat_password'])
                    && 
                    <ButtonMain
                        onClick={() => submitBtn()}
                        type={'submit'} 
                        title={'Сохранить'}
                    />
                }
                <ButtonMain 
                    onClick={() => {
                        dispatch(changeComponentReadOnly({ componentName, newStatus: componentReadOnly?.status ? false : true}))
                        dispatch(deleteAllComponentData({componentName}))
                        dispatch(deleteFieldInvalid({componentName}))
                        setSuccessValidation(null)
                    }} 
                    type={'other'} 
                    color={'gray'}
                    myStyle={{width: '120px'}} 
                    title={!componentReadOnly?.status ? 'Отмена' : 'Редактировать'}
                />
            </BtnBlock>

            <ContentBlock title='Смена пароля'>
                <BlockInput
                    onChange={(obj) => setValues(obj)}
                    fieldName={'password'}
                    title={'Текущий пароль'}
                    type={fieldParams?.['password']?.type as IInputTypes}
                    value={componentData?.objInputAndChangedData['password'] as IInputValue}
                    placeholder={'Введите пароль'}
                    myStyleInput={{ height: '30px' }}
                    skeletonLoading={loadingProcess?.['password']}
                    isRequired={fieldParams?.['password']?.isRequired}
                    isInvalidStatus={componentInvalidFields?.['password']}
                    isReadOnly={componentReadOnly?.status}
                    isChanged={!!componentData?.objChangedData?.['password']}
                />
                <BlockInput
                    onChange={(obj) => setValues(obj)}
                    fieldName={'new_password'}
                    title={'Новый пароль'}
                    type={fieldParams?.['new_password']?.type as IInputTypes}
                    value={componentData?.objInputAndChangedData['new_password'] as IInputValue}
                    placeholder={'Введите пароль'}
                    myStyleInput={{ height: '30px' }}
                    skeletonLoading={loadingProcess?.['new_password']}
                    isRequired={fieldParams?.['new_password']?.isRequired}
                    isInvalidStatus={componentInvalidFields?.['new_password']}
                    isReadOnly={componentReadOnly?.status}
                    isChanged={!!componentData?.objChangedData?.['new_password']}
                />
                <BlockInput
                    onChange={(obj) => setValues(obj)}
                    fieldName={'repeat_password'}
                    title={'Подтвердите пароль'}
                    type={fieldParams?.['repeat_password']?.type as IInputTypes}
                    value={componentData?.objInputAndChangedData['repeat_password'] as IInputValue}
                    placeholder={'Введите пароль'}
                    myStyleInput={{ height: '30px' }}
                    skeletonLoading={loadingProcess?.['repeat_password']}
                    isRequired={fieldParams?.['repeat_password']?.isRequired}
                    isInvalidStatus={componentInvalidFields?.['repeat_password']}
                    isReadOnly={componentReadOnly?.status}
                    isChanged={!!componentData?.objChangedData?.['repeat_password']}
                />
                {successValidation && (
                    <div style={{marginTop: '30px', marginLeft: '10px', color: 'green', fontSize: '10pt'}}>
                        <p>Пароль был успешно изменен</p>
                    </div>
                )}
                {successValidation === null &&
                    <div style={{marginTop: '30px', marginLeft: '10px', color: '#eb8736', fontSize: '10pt'}}>
                        <p><b>Требования к паролю:</b></p><br/>
                        <p>- должен быть на латинице</p>
                        <p>- должен содержать от 8 до 24 символов</p>
                        <p>- должен содержать хотя бы одну заглавную букву и строчную букву</p>
                        <p>- должен содержать хотя бы одну цифру</p>
                        <p>- может содержать специальные символы: ~ ! ? @ # $ % ^ & * _ - </p>
                    </div>                    
                }  
            </ContentBlock>
        </MainInfoBlock>
    );
};

export default UserPassword;