import { useEffect, useState } from "react";
import { ITextareaTypes } from "../../../store/componentsData/fieldsParamsSlice";
import { ITextareaValue } from "../../../store/componentsData/componentsDataSlice";
import { funcCheckEnteredValue } from "../../functions/funcCheckEnteredValue";

interface IBlockTextarea {
    fieldName: string,
    title?: string,
    type?: ITextareaTypes,
    myStyle?: Record<string, string>,
    isReadOnly?: boolean,
    isRequired?: boolean,
    value?: ITextareaValue,
    isInvalidStatus?: {status: boolean, message: string | undefined},
    isChanged?: boolean,
    skeletonLoading?: {status: boolean, isSuccessful?: boolean},
    placeholder?: string,
    myStyleTextarea?: Record<string, string>,
    rows?: number,
    children?: React.ReactNode    
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void,
    onChange: (obj: {name: string, value: ITextareaValue}) => void,
}

const BlockTextarea = ( props: IBlockTextarea ) => {   

    // Input значение
        const [textareaValue, setTextareaValue] = useState<string | number>('');
        useEffect(() => {
            if (typeof props.value === 'string' || typeof props.value === 'number') {
                setTextareaValue(props.value);
            } else {
                setTextareaValue('');
            }
        }, [props.value]);

        const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const preparedValue = funcCheckEnteredValue(textareaValue, e.target.value, props.type);
            if (preparedValue !== false) {
                setTextareaValue(preparedValue);
              props.onChange({ name: props.fieldName, value: preparedValue.toString() });
            }
          };
    
    // Список соответствий Placeholder
        const placeholderMap: Record<string, string> = {
            text: 'Введите текст',
            number: 'Введите целое число',
            float: 'Введите число в формате: 0.0',
            date: 'Введите дату в формате дд.мм.гггг',
            email: 'Введите почту в формате: sample@test.com',
            phone: 'Введите телефон в формате: +7(123)456-78-90',
        };

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

    let textareaView;
    if (props.skeletonLoading?.status) {
        textareaView = (<>
            <div
                style={{...(props.myStyleTextarea || {resize: 'none', height: '100%', width: '100%'}), backgroundColor:'rgba(151, 36, 36, 0)', height: `calc(${props.rows || 4} * 21px)`}}
                className={`text-field__textarea skeleton-loading`} 
            ></div>
        </>)
    } else {
        if (props.skeletonLoading && !props.skeletonLoading.status && !props.skeletonLoading.isSuccessful) {
            textareaView = (<>
                <div
                    style={{...(props.myStyleTextarea || {resize: 'none', height: '100%', width: '100%'}), backgroundColor:'rgba(151, 36, 36, 0)', height: '100px'}}
                    className={`text-field__textarea`} 
                >
                    <div className='text-field__textarea_error-block'>
                        <div 
                            className={`text-field__textarea_error`} 
                        >
                            <svg />
                        </div>
                    </div>
                </div>                    
            </>)
        } else {
            textareaView = (<>
                <textarea 
                    className={`text-field__textarea ${(props.isChanged && !props.isReadOnly) || false  ? 'text-field__textarea_updated': ''}`} 
                    style={props.myStyleTextarea || {resize: 'vertical', height: `calc(${props.rows || 4} * 21px)`, width: '100%', overflowY: 'auto'}} 
                    readOnly={props.isReadOnly || false}
                    // rows={props.rows || 4}
                    placeholder={props.placeholder !== undefined ? props.placeholder : undefined || (props.type ? placeholderMap[props.type] : undefined) || ''}
                    onChange={handleTextareaChange}
                    value={textareaValue}          
                />
                {props.children}                        
            </>)
        }
    }
        
    return (
        <div className='text-field' style={props.myStyle}> 
            {titleView}
            {textareaView}
            {(props.skeletonLoading && !props.skeletonLoading.status) && props.isInvalidStatus?.status && <span style={{color: 'red', fontSize: '9pt'}}>{props.isInvalidStatus?.message || ''}</span>}
        </div>
    );
};
  
  
export default BlockTextarea;

