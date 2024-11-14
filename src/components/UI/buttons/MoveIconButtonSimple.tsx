import React from 'react'; 
import { useState, useEffect } from 'react';


interface IMoveIconButtonSimple {
    isActive: boolean
    direction: 'right' | 'left'
    onClick?: () => void
    myStyle?: Record<string, any>
}

const MoveIconButtonSimple = ({
    isActive,
    direction,
    onClick,
    myStyle
}: IMoveIconButtonSimple) => {

    const [classButton, setClassButton] = useState('')

    useEffect(() => {
        if (isActive) {
            if (direction === 'right') {
                setClassButton('btn btn_move_right-simple-icon active')
            } else {
                setClassButton('btn btn_move_left-simple-icon active')
            }
        } else {
            if (direction === 'right') {
                setClassButton('btn btn_move_right-simple-icon disabled')
            } else {
                setClassButton('btn btn_move_left-simple-icon disabled')
            }
        }
    }, [isActive])

    return (
        <button onClick={onClick} className={classButton} style={myStyle}>
            <svg/>
        </button>
    );
};

export default MoveIconButtonSimple;