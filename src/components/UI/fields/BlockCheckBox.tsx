
interface IBlockCheckBox {
    id: number
    title?: string
    checked?: undefined | number[] | boolean
    // defaultChecked?: undefined | number[] | boolean
    fieldName?: string
    isReadOnly?: boolean
    isDisabled?: boolean
    onChange?: (fieldName: string, e: React.ChangeEvent<HTMLInputElement>) => void
    myStyleMain?: Record<string, string>
    myStyleInput?: Record<string, string>
    myStyleLabel?: Record<string, string>
    myStyleTitle?: Record<string, string>
    myStyleCheckElement?: Record<string, string>
    skeletonLoading?: {status: boolean, isSuccessful?: boolean},
}


const BlockCheckBox = (props: IBlockCheckBox) => {

    let checkBoxView;
    if (props?.skeletonLoading?.status) {
        checkBoxView = (<>
                <div className={`text-field`}>
                    <div className={'text-field__block'}>
                        <div style={{display: 'flex'}}>
                            <div
                                style={{...(props.myStyleInput), backgroundColor:'rgba(151, 36, 36, 0)'}}
                                className={`text-field__input skeleton-loading`} 
                            ></div>
                        </div>
                    </div>
                </div>
        </>)
    } else {
        if (props.skeletonLoading && !props.skeletonLoading.status && !props.skeletonLoading.isSuccessful) {
            checkBoxView = (<>
                <div className={`text-field`}>
                    <div className={'text-field__block'}>
                        <div style={{display: 'flex'}}>
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
                        </div> 
                    </div> 
                </div>                 
            </>)
        } else {
            if (props.isReadOnly) {
                checkBoxView = (<>
                    <div className='checkbox' style={props.myStyleMain} key={props.id}>
                        {props.title}
                    </div>
                </>)
            } else {
                checkBoxView = (<>
                    <div className='checkbox' style={props.myStyleMain} key={props.id}>
                        <label className="checkbox__label" style={props.myStyleLabel}>
                            <div style={props.myStyleTitle}>{props.title}</div>
                            <input
                                style={props.myStyleInput}
                                className={`checkbox__input`}
                                type="checkbox"
                                value={props.id}
                                onChange={(e) => props.onChange && props.fieldName ? props.onChange(props.fieldName, e) : {}}
                                checked={
                                    props.checked ? 
                                        typeof props.checked === 'boolean' ? 
                                        props.checked :
                                        props.checked.includes(+props.id) : 
                                    false}
                                disabled={props.isDisabled}
                                // checked={checked}
                            >
                            </input>
                            <span className="checkbox__element" style={props.myStyleCheckElement}></span> 
                        </label>
                    </div>
                </>)
            }  
        }
    }

    return (<>
        {checkBoxView}
    </>);
};


export default BlockCheckBox;
