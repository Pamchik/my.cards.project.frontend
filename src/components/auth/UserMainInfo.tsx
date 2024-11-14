import React, { useEffect } from 'react';
import MainInfoBlock from '../blocks/MainInfoBlock';
import BtnBlock from '../blocks/BtnBlock';
import ContentBlock from '../blocks/ContentBlock';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setLoadingStatus } from '../../store/componentsData/loadingProcessSlice';
import { IInputValue, setInputData } from '../../store/componentsData/componentsDataSlice';
import BlockInput from '../UI/fields/BlockInput';
import { useEffectStoreData } from '../hooks/useEffectStoreData';

const UserMainInfo = () => {

    const componentName = "UserMainInfo"
    const user = useSelector((state: RootState) => state.user)
    const {loadingProcess, componentData} = useEffectStoreData(componentName);
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['username', 'email', 'role']}}))
        if (user) {
            dispatch(setInputData({componentName, data: {...user}}))
        }
        setTimeout(() => {
            if (user.username) {
                dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['username', 'email', 'role']}}))
            } else {
                dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['username', 'email', 'role']}}))
            }
        }, 1000)
    }, [user]);


    return (
        <MainInfoBlock myStyleMain={{border: '1px solid #bebebe', borderRadius: '10px', width: '50%', marginLeft: 'auto', marginRight: 'auto', height: 'auto', flex: 'none'}}>            
            <BtnBlock>
            </BtnBlock>
            <ContentBlock title='Основная информация' myStyleMain={{height: 'auto', flex: 'none'}}>
                <BlockInput
                    onChange={() => {}}
                    fieldName={'username'}
                    title={'Логин'}
                    value={componentData?.objInputAndChangedData['username'] as IInputValue}
                    skeletonLoading={loadingProcess?.['username']}
                    isReadOnly={true}
                />
                <BlockInput
                    onChange={() => {}}
                    fieldName={'email'}
                    title={'Почта'}
                    value={componentData?.objInputAndChangedData['email'] as IInputValue}
                    skeletonLoading={loadingProcess?.['email']}
                    isReadOnly={true}
                />
                <BlockInput
                    onChange={() => {}}
                    fieldName={'role'}
                    title={'Роль'}
                    value={componentData?.objInputAndChangedData['role'] as IInputValue}
                    skeletonLoading={loadingProcess?.['role']}
                    isReadOnly={true}
                />
            </ContentBlock>
        </MainInfoBlock>
    );
};

export default UserMainInfo;