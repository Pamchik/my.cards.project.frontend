import React, { useState, useEffect } from 'react';
import ButtonMain from '../UI/buttons/ButtonMain';
import { useDispatch } from 'react-redux';
import { setSavingStatus } from '../../store/componentsData/savingProcessSlice';


interface ILoadingViewProps {
    isSuccessful?: boolean | undefined
    myStyleContainer?: Record<string, string>,
    errorMessage?: string | Record<string, any>,
    componentName?: string
}

const LoadingView = ({ 
    isSuccessful,
    myStyleContainer,
    errorMessage,
    componentName,
}: ILoadingViewProps) => {

    const dispatch = useDispatch()
    const [iconResult, setIconResult] = useState<boolean | undefined>()
    const [isShowMessage, setIsShowMessage] = useState<boolean>(false)
    const [message, setMessage] = useState<string | Record<string, string>>('')

    function messagePreparation () {
        if (typeof errorMessage === 'string' || typeof errorMessage === 'object') {
            setMessage(errorMessage)
        }
    }

    useEffect(() => {
        if (isSuccessful === true) {
            setIconResult(true);
            if (errorMessage) {
                messagePreparation()
                setTimeout(() => {
                    setIsShowMessage(true)
                }, 1000)
            }
        } else if (isSuccessful === false) {
            setIconResult(false)
            messagePreparation()
            setTimeout(() => {
                setIsShowMessage(true)
            }, 1000)
        }
    }, [isSuccessful]);

    return (
        <div className={`loader-container ${iconResult !== undefined ? 'show-checkmark' : ''}`} style={myStyleContainer}>
            <div className={`spinner ${iconResult !== undefined ? 'hide' : ''}`} id="spinner"></div>

            {isShowMessage 
            ? (<>
                <div style={{display: 'flex', width: '70%', height: '50%', backgroundColor: 'white', borderRadius: '5px', flexDirection: 'column', border: '1px solid grey'}}>
                    <div style={{display: 'block', height: 'calc(100% - 40px)', padding: '5px', overflowY: 'auto'}}>
                        {typeof message === 'string'
                        ? (
                            <div>
                                <p>{message}</p> 
                            </div>
                        )
                        : (
                            <div>
                                {Object.entries(message).map(([field, message]) => (
                                <><p key={field}>{`${field}: ${message}`}</p><br/></>
                                ))}
                            </div>
                        )}
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40px', borderTop: '1px solid grey' }}>
                        <ButtonMain
                            type={'other'}
                            title='OK'
                            onClick={() => {componentName && dispatch(setSavingStatus({ componentName, data: { status: false }}))}}
                        />
                    </div>
                </div>
            </>)
            : (<>
                <div className={`true-result ${iconResult === true ? 'show' : ''}`}>
                    {iconResult === true && (<> 
                        <div className="true-result__line1"></div>
                        <div className="true-result__line2"></div>
                    </>)}
                </div>            

                <div className={`wrong-result ${iconResult === false ? 'show' : ''}`}>
                    {iconResult === false && (<> 
                        <div className="wrong-result__line1"></div>
                        <div className="wrong-result__line2"></div>
                    </>)}
                </div>              
            </>)}
          
        </div>
    );
};

export default LoadingView;