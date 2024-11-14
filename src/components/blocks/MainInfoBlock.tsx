import React from 'react';

interface IMainInfoBlock {
    myStyleMain?: Record<string, string>
    myStyleContext?: Record<string, string>
    children?: React.ReactNode
}

const MainInfoBlock = ({
    myStyleMain,
    myStyleContext,
    children
}: IMainInfoBlock) => {
    
    return (
        <div className="main-info-block" style={myStyleMain}>
            <div className="main-info-block__context" style={myStyleContext}>
                {children}   
            </div>
        </div>
    );
};

export default MainInfoBlock;