
interface BlockRadioBoxType {
    id: number
    name: string
    defaultChecked?: boolean
    fieldName?: string
    isReadOnly?: boolean
    onChange?: (fieldName: string, e: React.ChangeEvent<HTMLInputElement>) => void

}


const BlockRadioBox = ({
    id,
    name,
    defaultChecked,
    fieldName,
    isReadOnly,
    onChange,
}: BlockRadioBoxType) => {

    return (
        <div className='radio' style={{}} key={id}>

            {isReadOnly 
            ?
            name
            :
            <label className="radio__label">
                {name}
                <input
                    className={`radio__input`}
                    name={fieldName}
                    type="radio"
                    value={id}
                    onChange={(e) => onChange && fieldName ? onChange(fieldName, e) : {}}
                    // defaultChecked={defaultChecked}
                    checked={defaultChecked}
                >
                </input>
                <span className="radio__element"></span> 
            </label>
            }


        </div>
    );
};


export default BlockRadioBox;
