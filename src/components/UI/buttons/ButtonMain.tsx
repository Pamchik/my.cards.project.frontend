import { useEffect, useRef, useState } from "react";

 
interface IButtonProps {
    onClick: () => void,
    type: string
    myStyle?: Record<string, string>
    title?: string
    class?: string
    svg?: boolean
    color?: string
    drop?: boolean
    drop_image?: 'dropdown' | 'ellipsis'
    actions?: {name: string, onClick: () => void, myStyle?: Record<string, string>, disabled?: boolean}[]
}

const buttonDefaultParams: IButtonProps = {
    onClick: () => {},
    type: 'otherButton',
    myStyle: {},
    title: '',
    class: '',
    svg: false,
    color: 'light-gray',
    drop: false,
    drop_image: 'dropdown',
    actions: []
}

const ButtonMain = (props: IButtonProps) => {

    const buttonClassByTypes: Record<string, any> = {
        addNewLine: {style: 'btn btn_add', svg: true},
        resetIcon: {style: 'btn btn_reset-icon', svg: true},
        repeatIcon: {style: 'btn btn_repeat-icon', svg: true},
        submit: {style: 'btn btn_submit', svg: false},
        submitIcon: {style: 'btn btn_submit-icon', svg: true},
        plusIcon: {style: 'btn btn_add_to_list-icon', svg: true},
        changeIcon: {style: 'btn btn_change-icon', svg: true},
        enter: {style: 'btn btn_enter', svg: false},
        other: {style: `btn btn_other ${props.color || buttonDefaultParams.color}`, svg: false},
        empty: {style: 'btn btn_empty', svg: false},
    }

    const [buttonParams, setButtonParams] = useState<IButtonProps>(buttonDefaultParams)
    
    useEffect(() => {
        if (props) {
            setButtonParams((prevParams) => ({...prevParams, ...props}))
        }
        if (props.type) {
            setButtonParams((prevParams) => ({
                ...prevParams, 
                class: buttonClassByTypes[props.type].style,
                myStyle: {...props.myStyle},
                svg: buttonClassByTypes[props.type].svg
            }))
        }

    },[props])

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleActionClick = (action: {name: string, onClick: () => void}) => {
        action.onClick();
        setIsOpen(false);
    };

    const renderDropdownContent = () => {
        if (!props.actions || props.actions.length === 0) {
            return null;
        }

        const fullButtonClass = buttonParams.class
        const buttonClass = fullButtonClass ? fullButtonClass.split(' ')[0] : null
        const parentElement = document.querySelector('.dropdown');
        const buttonElement = buttonClass && parentElement ? parentElement.querySelector(`.${buttonClass}`) : null;

        // const buttonElement = buttonClass ? document.querySelector(`.${buttonClass}`) : null;
        const buttonWidth = buttonElement ? buttonElement.getBoundingClientRect().width + 5 : 'auto';

        return (
            <div className="dropdown__content" style={{width: buttonWidth }}>
            {/* <div className="dropdown__content" style={{width: props?.myStyle?.width ? props.myStyle.width : 'auto' }}> */}
                {props.actions.map((action, index) => (
                    <button key={index} disabled={action.disabled || false} onClick={() => handleActionClick(action)} style={{...action.myStyle}}>
                        {action.name}
                    </button>
                ))}
            </div>
        );
    };    

    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleClickOutside = (event: MouseEvent) => {

        if (
            buttonRef.current &&
            buttonRef.current instanceof Node &&
            !buttonRef.current.contains(event.target as Node)
        ) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    if (props.drop) {
        return (
            <div className={`dropdown`}>
                <button ref={buttonRef} className={buttonParams.class} style={buttonParams.myStyle} onClick={toggleDropdown}>
                    {buttonParams.title 
                    ?
                        <div style={{display: 'flex', justifyContent: 'space-between', gap: '10px'}}>
                            <p>{buttonParams.title}</p>
                            <svg className={`svg_${buttonParams.drop_image}`}/>
                        </div>
                    :
                        <svg className={`svg_${buttonParams.drop_image}`}/>
                    }

                </button>
                {isOpen && renderDropdownContent()}
            </div>
        );
    }
    return (
        <button className={buttonParams.class} style={buttonParams.myStyle} onClick={buttonParams.onClick}>
            <p>{buttonParams.title}</p>
            {buttonParams.svg ? <svg /> : ''} 
        </button>
    );
};


export default ButtonMain;