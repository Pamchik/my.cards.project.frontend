import React from 'react';

export interface IListBlock {
    id: number,
    name: string
}

interface ITotalListBlock {
    fieldName: string    
    title?: string
    arrData?: any[]
    arrCurrentNumberList?: number[]
    isReadOnly?: boolean
    isChanged?: boolean    
    myStyleMain?: Record<string, string> 
    myStyleListBox?: Record<string, string> 
    buttonParams?: React.ReactNode
    children?: React.ReactNode
    skeletonLoading?: {status: boolean, isSuccessful?: boolean},
    isRequired?: boolean
}

const TotalListBlock = (props: ITotalListBlock) => {

    let titleView;
    if (props.title) {
        if (!props.skeletonLoading || props.skeletonLoading.status) {
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

    let listView;
    if (!props.skeletonLoading || props.skeletonLoading.status) {
        listView = (<>
            <div
                style={{...(props.myStyleListBox), backgroundColor:'rgba(151, 36, 36, 0)', overflow: 'hidden'}}
                className={`text-field__block-listbox skeleton-loading`} 
            ></div>
        </>)
    } else {
        if (props.skeletonLoading && !props.skeletonLoading.status && !props.skeletonLoading.isSuccessful) {
            listView = (<>
                <div 
                    className={`text-field__block-listbox`} 
                    style={{...props.myStyleListBox, backgroundColor: 'rgba(151, 36, 36, 0)'}}
                > 
                    <div className='text-field__block-listbox_error-block'>
                        <div className={`text-field__block-listbox_error`}>
                            <svg />
                        </div>
                    </div>
                </div>
            </>)
        } else {
            listView = (<>
                <div 
                    className={`text-field__block-listbox 
                        ${props.isReadOnly ? 'readonly' : ''}
                        ${(props.isChanged && !props.isReadOnly) ? 'text-field__block-listbox_updated': ''}
                    `} 
                    style={props.myStyleListBox}
                > 
                    {props.children}
                </div>
                {props.isReadOnly ? '' : props.buttonParams }
            </>)
        }
    }


    return (
        <div className="text-field" style={props.myStyleMain}>
            {titleView}
            <div style={{display: 'flex'}}>
                {listView}
            </div>

        </div>
    );
};

export default TotalListBlock;