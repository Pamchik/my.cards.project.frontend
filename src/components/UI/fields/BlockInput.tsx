import React, { useState, useEffect, useRef } from 'react';
import { IInputValue } from '../../../store/componentsData/componentsDataSlice';
import { IInputTypes } from '../../../store/componentsData/fieldsParamsSlice';
import { funcCheckEnteredValue } from '../../functions/funcCheckEnteredValue';
import { funcNumberWithThousandSeparator } from '../../functions/funcNumberWithThousandSeparator';

interface IBlockInput {
    fieldName: string,
    title?: string,
    type?: IInputTypes,
    myStyle?: Record<string, string>,
    isReadOnly?: boolean,
    isRequired?: boolean,
    value?: IInputValue,
    isInvalidStatus?: {status: boolean, message: string | undefined},
    isChanged?: boolean,
    skeletonLoading?: {status: boolean, isSuccessful?: boolean},
    placeholder?: string,
    myStyleInput?: Record<string, string>,
    minValue?: number,
    maxValue?: number,
    children?: React.ReactNode    
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void,
    onChange: (obj: {name: string, value: IInputValue}) => void,
    isBlockChangeFormat?:boolean
}


const BlockInput = (props: IBlockInput) => {

    // Input значение
        const [inputValue, setInputValue] = useState<string | number>('');
        const [isEditing, setIsEditing] = useState(false);
        useEffect(() => {
            if (typeof props.value === 'string' || typeof props.value === 'number') {
                setInputValue(props.value);
            } else {
                setInputValue('');
            }
        }, [props.value]);

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const preparedValue = funcCheckEnteredValue(inputValue, e.target.value, props.type);
            if (preparedValue !== false) {
                setInputValue(preparedValue);
                props.onChange({ name: props.fieldName, value: preparedValue });
            }
        };

        const formatNumber = (value: string | number) => {
            return funcNumberWithThousandSeparator(Number(value));
        };
    
        const formatFloat = (value: string | number) => {
            return new Intl.NumberFormat('ru-RU', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 10,
            }).format(Number(value)).replace(',', '.');
        };
    
        const handleFocus = () => {
            if (!props.isReadOnly) {
                setIsEditing(true);    
            }
        };
    
        const handleBlur = () => {
            setIsEditing(false);
        };

        const getDisplayValue = () => {
            if (isEditing || props.isBlockChangeFormat) {
                return inputValue;
            }
            if (props.type === 'number' && (!isEditing || props.isReadOnly) && inputValue) {
                return formatNumber(inputValue);
            }
            if (props.type === 'float' && (!isEditing || props.isReadOnly) && inputValue) {
                return formatFloat(inputValue);
            }
            return inputValue;
        };

    // Список соответствий Placeholder
        const placeholderMap: Record<string, string> = {
            text: 'Введите текст',
            number: 'Введите целое число',
            float: 'Введите число в формате: 0.0',
            date: 'Введите дату',
            email: 'Введите почту в формате: sample@test.com',
            phone: 'Введите телефон в формате: +7(123)456-78-90',
            password: 'Введите пароль',
        };


    // Тип поля
        const [inputType, setInputType] = useState((props.type === 'password' || props.type === 'date') ? props.type : 'text');
        function handleTogglePasswordVisibility () {
            setInputType(inputType === 'password' ? 'text' : 'password');
        };
        
        const inputRef = useRef<HTMLInputElement>(null);

        const handleClickOutside = (event: MouseEvent) => {
            if (    
                props.type === 'password' &&
                inputRef.current &&
                inputRef.current instanceof Node &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setInputType('password');
            }
        };
    
        useEffect(() => {
            if (props.type === 'password') {
                setInputType('password');
                document.addEventListener('click', handleClickOutside);
                return () => {
                    document.removeEventListener('click', handleClickOutside);
                };
            }
        }, [props.type]);

        let titleView;
        if (props.title) {
            if (props.skeletonLoading?.status) {
                titleView = (<>
                    <div
                        style={{backgroundColor:'rgba(151, 36, 36, 0)', height: '12px', width: '50%'}}
                        className={`text-field__label skeleton-loading`}
                    ></div>
                </>)
            } else {
                titleView = (<>
                    <label className="text-field__label">
                        {props.title || ''} 
                        {(props.isRequired || false) && <span style={{color: 'red'}}>*</span>}
                    </label>
                </>)
            }
        } else {
            titleView = (<></>)
        }

        let inputView;
        if (props.skeletonLoading?.status) {
            inputView = (<>
                <div
                    style={{...(props.myStyleInput), backgroundColor:'rgba(151, 36, 36, 0)'}}
                    className={`text-field__input skeleton-loading`} 
                ></div>
            </>)
        } else {
            if (props.skeletonLoading && !props.skeletonLoading.status && !props.skeletonLoading.isSuccessful) {
                inputView = (<>
                    <div
                        style={{...(props.myStyleInput), backgroundColor:'rgba(151, 36, 36, 0)'}}
                        className={`text-field__input`} 
                    >
                        <div className='text-field__input_error-block'>
                            <div 
                                className={`text-field__input_error`} 
                            >
                                <svg />
                            </div>
                        </div>
                    </div>                    
                </>)
            } else {
                inputView = (<>
                    <input
                        style={props.myStyleInput}
                        type={inputType}
                        className={`text-field__input ${(props.isChanged && !props.isReadOnly) || false ? 'text-field__input_updated': ''}`} 
                        readOnly={props.isReadOnly || false} 
                        placeholder={props.placeholder !== undefined ? props.placeholder : undefined || (props.type ? placeholderMap[props.type] : undefined) || ''}
                        onChange={handleInputChange}
                        value={getDisplayValue()}  
                        onKeyDown={props.onKeyDown}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                    {props.type === 'password' &&
                        <div className='text-field__input_password-block'>
                            <button 
                                className={`text-field__input_password ${inputType === 'password' ? 'text-field__input_password_show' : 'text-field__input_password_hide'}`} 
                                onClick={handleTogglePasswordVisibility}
                            >
                                <svg />
                            </button>
                        </div>
                    }
                    {props.children}                        
                </>)
            }
        }



    return (
        <div className={`text-field`} style={props.myStyle}>
            {titleView}
            <div className={'text-field__block'} ref={inputRef}>
                <div style={{display: 'flex'}}>
                    {inputView}
                </div>
            </div>
            {(!props.skeletonLoading || (props.skeletonLoading && !props.skeletonLoading.status)) && props.isInvalidStatus?.status && <span style={{color: 'red', fontSize: '9pt'}}>{props.isInvalidStatus?.message || ''}</span>}
        </div>
    );
};
  
  
export default BlockInput;