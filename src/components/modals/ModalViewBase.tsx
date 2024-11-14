import React, { useEffect, useRef } from 'react';
import Draggable from 'react-draggable';


interface IModalViewBaseProps {
    myStyleMain?: Record<string, string>
    myStyleOverlay?: Record<string, string>
    myStyleContext?: Record<string, string>
    children?: React.ReactNode
    onClick?: () => void
    onOverlayClick?: boolean
}

interface IMainModalTopBlockProps {
    myStyleBlock?: Record<string, string>
    children?: React.ReactNode
}

interface IMainModalTextProps {
    myStyleText?: Record<string, string>
    modalTitle?: string
}

interface IMainModalBtnBlockProps {
    myStyleBtnBlock?: Record<string, string>
    children?: React.ReactNode
}

interface IMainModalMainBlockProps {
    myStyleMainBlock?: Record<string, string>
    children?: React.ReactNode
}


const ModalViewBase = ({
    children,
    onClick,
    myStyleMain,
    myStyleOverlay,
    myStyleContext,
    onOverlayClick
}: IModalViewBaseProps) => {
    
    const draggableRef = useRef<HTMLDivElement>(null);

    const getTranslateY = (element: HTMLDivElement) => {
        const transformValue = element.style.transform;
        const match = /translate\((?:-?\d+px,\s*)?(-?\d+px)\)/.exec(transformValue);
        return match ? parseInt(match[1].replace('px', '')) : 0;
    };

    const getTranslateX = (element: HTMLDivElement) => {
        const transformValue = element.style.transform;
        const match = /translate\((-?\d+px)/.exec(transformValue);
        return match ? parseInt(match[1].replace('px', '')) : 0;
    };
    
    const adjustPosition = () => {
        const modal = draggableRef.current;
    
        if (modal) {
            const rect = modal.getBoundingClientRect();
            const currentTranslateY = getTranslateY(modal);
            const currentTranslateX = getTranslateX(modal);
            if (rect.top < 0) {
                const newTranslateY = currentTranslateY - rect.top;
                modal.style.transform = `translate(${currentTranslateX}px, ${newTranslateY}px)`;
            }
        }
    };

    useEffect(() => {
        const modal = draggableRef.current;

        if (modal) {
            const resizeObserver = new ResizeObserver(() => {
                adjustPosition();
            });

            resizeObserver.observe(modal);

            return () => {
                resizeObserver.disconnect();
            };
        }
    }, []);

    

    return (
        <div className="modal-window" style={myStyleMain}>
            <div className="modal-window__overlay" onClick={onOverlayClick ? onClick : ()=>{}} style={myStyleOverlay}></div>
            <Draggable handle=".modal-window__top-block" nodeRef={draggableRef} bounds="body">
                <div className="modal-window__content" style={myStyleContext} ref={draggableRef}>
                    <div className="modal-window__content-block">
                        {children}
                    </div>
                </div>
            </Draggable>
        </div>
    );
};

const MainModalTopBlock = ({
    children, myStyleBlock
}: IMainModalTopBlockProps) => {

    return (
        <div className="modal-window__top-block" style={myStyleBlock}>
            {children}
        </div>      
    );
};

const MainModalText = ({
    modalTitle,
    myStyleText
}: IMainModalTextProps) => {

    return (
        <div className="modal-window__modal-name-text" style={myStyleText}>
            {modalTitle}
        </div>            
    );
};

const MainModalBtnBlock = ({
    children,
    myStyleBtnBlock
}: IMainModalBtnBlockProps) => {

    return (          
        <div className="modal-window__btn-block" style={myStyleBtnBlock}>
            {children}
        </div>
    );
};

const MainModalMainBlock = ({
    children,
    myStyleMainBlock
}: IMainModalMainBlockProps) => {
    
    return (   
        <div className="modal-window__main-block" style={myStyleMainBlock}>
            {children}
        </div>     
    );
};


export { ModalViewBase, MainModalTopBlock, MainModalText, MainModalBtnBlock, MainModalMainBlock };