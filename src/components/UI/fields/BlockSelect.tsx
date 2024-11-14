import React, { useState, useEffect } from 'react';
import { ISelectTypes } from '../../../store/componentsData/fieldsParamsSlice';
import { ISelectValue } from '../../../store/componentsData/componentsDataSlice';
import { funcSortedDataByValue } from '../../functions/funcSortedDataByValue';

interface IBlockSelect {
    fieldName: string,
    showName: string,
    title?: string,
    type?: ISelectTypes,
    myStyle?: Record<string, string>,
    myStyleSelect?: Record<string, string>,
    isReadOnly?: boolean,
    isRequired?: boolean,
    value?: ISelectValue,
    options?: any[],
    isEmptyOption?: boolean,
    isArchiveOptions?: boolean,
    isInvalidStatus?: {status: boolean, message: string | undefined},
    isChanged?: boolean,
    skeletonLoading?: {status: boolean, isSuccessful?: boolean},
    myStyleInput?: Record<string, string>,
    minValue?: number,
    maxValue?: number,
    children?: React.ReactNode,
    isSortDisabled?: boolean,    
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void,
    onChange: (obj: {name: string, value: ISelectValue}) => void,
}

const BlockSelect = (props: IBlockSelect) => {


    // Текущее значение value
        const [currentValue, setCurrentValue] = useState<number | null>(null)
        useEffect(() => {
            if (typeof props.value === 'number') {
                setCurrentValue(props.value)
            }  else {
                setCurrentValue(null)
            }
        },[props.value])

    // Настройка списка
        const [currentOptions, setCurrentOptions] = useState<any[]>([])
        useEffect(() => {
            if (props.options && props.options.length > 0) {
                if (!props.isArchiveOptions || props.isArchiveOptions === undefined) {
                    const arrFilteredDataByActive = props.options.filter(item =>  !('active' in item) || item.active === true);

                    if (currentValue && (typeof currentValue === 'number')) {
                        const localValue: number = currentValue

                        const inputReseivedElement = props.options.find(item => item.id === +localValue);
                            if (inputReseivedElement) {
                                if (inputReseivedElement.active === false) {
                                    arrFilteredDataByActive.push(inputReseivedElement);
                                }
                            }
                    }
                    if (props.isSortDisabled) {
                        setCurrentOptions(arrFilteredDataByActive)
                    } else {
                        setCurrentOptions(funcSortedDataByValue(arrFilteredDataByActive, props.showName))    
                    }
                } else {
                    if (props.isSortDisabled) {
                        setCurrentOptions(props.options)
                    } else {
                        setCurrentOptions(funcSortedDataByValue(props.options, props.showName))  
                    }
                }          
            } else {
                setCurrentOptions([])
            }
        },[props.options, currentValue])


    // Настройка поля, если нужно стандартное значение при readOnly
        const [visibleName, setVisibleName] = useState<string>('')
        useEffect(() => {
            if (props.options && props.options.length > 0 ) {
                if (props.showName in props.options[0]) {
                    if (currentValue) {
                        const numericValue = +currentValue;
                        const currentObj = props.options.filter(item => item.id === numericValue)[0]
                        if (currentObj) {
                            setVisibleName(currentObj[props.showName])
                        }   
                    } else {
                        setVisibleName('')
                    }
                } else {
                    setVisibleName('')
                }
            } else {
                setVisibleName('')
            }
        },[props.isReadOnly, props.options, currentValue])

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

        let selectView;
        if (props.skeletonLoading?.status) {
            selectView = (<>
                <div
                    style={{...(props.myStyleSelect), backgroundColor:'rgba(151, 36, 36, 0)'}}
                    className={`text-field__select skeleton-loading`} 
                ></div>
            </>)
        } else {
            if (props.skeletonLoading && !props.skeletonLoading.status && !props.skeletonLoading.isSuccessful) {
                selectView = (<>
                    <div
                        style={{...(props.myStyleSelect), backgroundColor:'rgba(151, 36, 36, 0)'}}
                        className={`text-field__select`} 
                    >
                        <div className='text-field__select_error-block'>
                            <div 
                                className={`text-field__select_error`} 
                            >
                                <svg />
                            </div>
                        </div>
                    </div>                    
                </>)
            } else {
                if (props.isReadOnly) {
                    selectView = (<>
                        <input 
                            className="text-field__input" 
                            value={visibleName} 
                            style={props.myStyleSelect} 
                            readOnly
                        />
                    </>)
                } else {
                    selectView = (<>
                        <select 
                            className={`text-field__select ${(props.isChanged && !props.isReadOnly) || false ? 'text-field__select_updated': ''}`} 
                            style={props.myStyleSelect} 

                            onChange={(e) => {
                                if (+e.target.value !== 0) {
                                    props.onChange({ name: props.fieldName, value: +e.target.value })
                                } else {
                                    props.onChange({ name: props.fieldName, value: null })
                                }
                            }}
                            value={currentValue ? currentValue : ''} 
                        >
                            {props.isEmptyOption ? <option value=""></option> : ''}

                            {currentOptions && currentOptions.map(option => 
                                <option key={option.id} value={option.id}>
                                    {/* {option[props.fieldName] ? option[props.fieldName] : option.value} */}
                                    {option[props.showName]}
                                </option>
                            )}        
                        </select>    
                        {props.children} 
                    </>)
                }
               
            }
        }

    return (
        <div className='text-field' style={props.myStyle}>
            {titleView}
            <div style={{display: 'flex'}}>
                {selectView}
            </div>
            {(props.skeletonLoading && !props.skeletonLoading.status) && props.isInvalidStatus?.status && <span style={{color: 'red', fontSize: '9pt'}}>{props.isInvalidStatus?.message || ''}</span>}
        </div>
    );
};
  
  export default BlockSelect;