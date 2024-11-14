import React from 'react';

interface IBtnBlock {
    myStyleMain?: Record<string, string>
    children?: React.ReactNode
}


const BtnBlock = ({
    myStyleMain,
    children
}: IBtnBlock) => {
    
    return (
        <div className="btn-block" style={myStyleMain}>
            {children}
        </div>
    );
};



export default BtnBlock;
