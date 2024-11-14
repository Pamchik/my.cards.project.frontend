import React, { useEffect, useState } from 'react';
import ButtonMain from '../UI/buttons/ButtonMain';
import Cookies from 'js-cookie';
import LoadingView from '../loading/LoadingView';
import { useDispatch, useSelector } from 'react-redux'
import { removeSessionId, setSessionId } from '../../store/user/sessionIdSlice'
import { RootState } from '../../store/store';
import { setLoadingStatus } from '../../store/componentsData/loadingProcessSlice';
import { IFieldParams, IInputTypes, setFieldParams } from '../../store/componentsData/fieldsParamsSlice';
import { setSavingStatus } from '../../store/componentsData/savingProcessSlice';
import BlockInput from '../UI/fields/BlockInput';
import { useFieldValueChange } from '../hooks/useFieldValueChange';
import { deleteFieldInvalid, setFieldInvalid } from '../../store/componentsData/fieldsInvalidSlice';
import { funcValidateFields } from '../functions/funcValidateFields';
import { useLoginMutation } from '../../store/api/userApiSlice';
import { funcGetConfigDataFromLocalStorage } from '../functions/funcGetConfigDataFromLocalStorage';
import { IInputValue, deleteAllComponentData } from '../../store/componentsData/componentsDataSlice';
import { useEffectStoreData } from '../hooks/useEffectStoreData';


const Login = () => {

    const componentName = "Login"
    const {loadingProcess, fieldParams, savingProcess, componentData, componentInvalidFields} = useEffectStoreData(componentName);
    const dispatch = useDispatch()
    const setValues = useFieldValueChange(componentName)
    const [loginAPI, {}] = useLoginMutation();
    
    const initFieldParams: IFieldParams = {
        'login': { isRequired: true, type: 'text' },
        'password': { isRequired: true, type: 'password' }
    }

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['login', 'password']}}))
        dispatch(setFieldParams({componentName, data: initFieldParams}))
        setTimeout(() => {
            dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['login', 'password']}}))
        }, 1000)
    }, []);   
    
    async function submitBtn() {
        dispatch(setSavingStatus({componentName, data: {status: true}}))
        const isValid = funcValidateFields(fieldParams, componentData?.objInputAndChangedData, componentData?.objChangedData)

        if (isValid.isAllFieldsValid) {
            dispatch(deleteFieldInvalid({componentName}))
            const email = (componentData?.objInputAndChangedData['login'] as string || '').toLocaleLowerCase() + (funcGetConfigDataFromLocalStorage()?.emailDomain || '')
            const password = componentData?.objInputAndChangedData['password'] as string || '' 
            
            await loginAPI({email: email, password: password}).unwrap()
            .then((res) => {
                const sessionid = res.sessionid
                const expireDate = new Date(res.expire_date);

                Cookies.set('sessionid', sessionid, { path: '/', expires: expireDate, sameSite: 'Lax' });
                dispatch(setSessionId({id: sessionid}))

                dispatch(setSavingStatus({ componentName, data: { status: true, isSuccessful: true } }))
                dispatch(deleteAllComponentData({componentName}))
                setTimeout(() => { 
                    dispatch(setSavingStatus({ componentName, data: { status: false } }))
                }, 1000)            
            }).catch((error) => {
                dispatch(removeSessionId({}))
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
            dispatch(setSavingStatus({ componentName, data: { status: false } }))
        }
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            submitBtn();
        }
    };


    return (
        <div className='login'>
            <div className='login__block'>
                {savingProcess?.status && 
                    <LoadingView 
                        myStyleContainer={{ borderRadius: '20px' }} 
                        isSuccessful={savingProcess.isSuccessful} 
                        errorMessage={savingProcess.message} 
                        componentName={componentName} 
                    />
                }

                <div className='login__block-content'>
                    <div className='login__title-block'>
                        <p>Авторизация</p>
                    </div>
                    <BlockInput
                        onKeyDown={handleKeyPress}
                        onChange={(obj) => setValues(obj)}
                        fieldName={'login'}
                        title={'Логин'}
                        type={fieldParams?.['login']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['login'] as IInputValue}
                        placeholder={'Введите логин'}
                        myStyleInput={{ height: '30px' }}
                        skeletonLoading={loadingProcess?.['login']}
                        isRequired={fieldParams?.['login']?.isRequired}
                        isInvalidStatus={componentInvalidFields?.['login']}
                    />
                    <BlockInput
                        onKeyDown={handleKeyPress}
                        onChange={(obj) => setValues(obj)}
                        fieldName={'password'}
                        title={'Пароль'}
                        type={fieldParams?.['password']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['password'] as IInputValue}
                        placeholder={'Введите пароль'}
                        myStyleInput={{height: '30px'}}
                        skeletonLoading={loadingProcess?.['password']}
                        isRequired={fieldParams?.['password']?.isRequired}
                        isInvalidStatus={componentInvalidFields?.['password']}
                    />
                    <div className="login__button-block">
                        <ButtonMain
                            onClick={() => submitBtn()}
                            type={'enter'}
                            title={'Войти'}
                        />
                    </div>
                </div>                    
            </div>
        </div>
    );
};

export default Login;