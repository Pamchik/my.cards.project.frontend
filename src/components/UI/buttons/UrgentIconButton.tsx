import React from 'react';
import { useState, useEffect } from 'react';


interface IUrgentIconButton {
    value?: true | false,
    onClick?: () => void
}

const UrgentIconButton = ({
    value,
    onClick
}: IUrgentIconButton) => {

    const [classButton, setClassButton] = useState('')


    useEffect(() => {
        if (value) {
            setClassButton('btn btn_urgent-icon active')
        } else {
            setClassButton('btn btn_urgent-icon no-active')
        }
    }, [value])

    return (
        <button onClick={onClick} className={classButton}></button>
    );
};

export default UrgentIconButton;