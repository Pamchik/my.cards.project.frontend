import React from 'react';


interface IListBlock {
    title: string | number
    onClick: () => void
    isActive: boolean
    myStyle?: Record<string, string>
    children?: React.ReactNode
}

const ListBlock = ({
    title,
    myStyle,
    onClick,
    isActive
}: IListBlock) => {

    return (
        <div 
            className={`list-block ${isActive ? 'active' : ''}`} 
            style={myStyle} 
            onClick={onClick}
        >
            <div className='list-block__title'>{title}</div>
        </div>
    );
};

export default ListBlock;