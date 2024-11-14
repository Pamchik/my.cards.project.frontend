import React from 'react';
import { useState, useEffect } from 'react';


interface IMoveRightIconButton {
    isListEmpty: {fieldName: string, data: number[]}[]
    direction: 'right' | 'left'
    fieldName: string
    onClick?: () => void
}

const MoveIconButton = ({
    isListEmpty,
    direction,
    fieldName,
    onClick
}: IMoveRightIconButton) => {

    const [classButton, setClassButton] = useState('')

    const [isActive, setIsActive] = useState<boolean>(false)
    useEffect(() => {
        const currentFieldObj = isListEmpty.filter(item => item.fieldName === fieldName)
        if (currentFieldObj[0]) {
            const currentFieldData = currentFieldObj[0].data
            if (currentFieldData.length > 0) {
                setIsActive(true)
            } else {
                setIsActive(false)
            }
        } else {
            setIsActive(false)
        }
         
    },[isListEmpty])

    useEffect(() => {
        if (isActive) {
            if (direction === 'right') {
                setClassButton('btn btn_move_right-icon active')
            } else {
                setClassButton('btn btn_move_left-icon active')
            }
        } else {
            if (direction === 'right') {
                setClassButton('btn btn_move_right-icon disabled')
            } else {
                setClassButton('btn btn_move_left-icon disabled')
            }
        }
    }, [isActive])

    return (
        <button onClick={onClick} className={classButton}></button>
    );
};

export default MoveIconButton;