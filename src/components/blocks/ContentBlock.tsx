import React from 'react';

interface IContentBlock {
    title?: string 
    children?: React.ReactNode 
    myStyleMain?: Record<string, string>
    myStyleTitle?: Record<string, string>
    myStyleContent?: Record<string, string>
    line?: boolean
}


const ContentBlock = ({
    title,
    children,
    myStyleMain,
    myStyleTitle,
    myStyleContent,
    line
}: IContentBlock) => {

    let isLine: Record<string, string>;
    if (line) {
        isLine = { '--before-content': `''` }
    } else {
        isLine = { '--before-content': 'none' }
    }

    const newStyle: Record<string, string> = {...isLine, ...myStyleMain}

    return (
        <div className='content-block' style={newStyle}>
            {title && <p className='content-block__title' style={myStyleTitle}>{title}</p>}
            <div className='content-block__content' style={myStyleContent}>
                {children}
            </div>
        </div>
    );
};

export default ContentBlock;