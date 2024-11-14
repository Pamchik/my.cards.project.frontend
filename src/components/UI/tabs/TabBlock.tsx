import React, { useState, useEffect, useRef } from 'react';
import MoveIconButtonSimple from '../buttons/MoveIconButtonSimple';
import ButtonMain from '../buttons/ButtonMain';

interface ITabBlock {
    items: string[]
    selectedItem: number
    onIndexChange: (index: number) => void
    btnDisabled?: boolean
}

const TabBlock = ({
    items,
    selectedItem,
    onIndexChange,
    btnDisabled
}: ITabBlock) => {

    const [startIndex, setStartIndex] = useState<number>(0);
    const [showLeftButton, setShowLeftButton] = useState<boolean>(false);
    const [showRightButton, setShowRightButton] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        updateButtonVisibility();
        window.addEventListener('resize', updateButtonVisibility);
        return () => window.removeEventListener('resize', updateButtonVisibility);
    }, [startIndex, items]);

    const updateButtonVisibility = () => {
        const containerWidth: number | undefined = containerRef.current?.offsetWidth || 0;
        const itemsWidth = items.reduce((acc, item) => {
            const itemElement = document.createElement('div');
            itemElement.textContent = item;
            itemElement.style.width = '120px';
            itemElement.style.marginLeft = '2px';
            document.body.appendChild(itemElement);
            const itemWidth = itemElement.offsetWidth;
            document.body.removeChild(itemElement);
            return acc + itemWidth;
        }, 0);
        const showLeft: boolean = containerRef.current?.scrollLeft! > 0 || false;
        const showRight: boolean = (containerRef.current?.scrollLeft || 0) + containerWidth - 20 < itemsWidth;
        setShowLeftButton(showLeft);
        setShowRightButton(showRight);
    };

    const scrollLeft = () => {
        if (containerRef.current) {
        const newScrollLeft = Math.max(0, containerRef.current.scrollLeft - 122);
        containerRef.current.scrollLeft = newScrollLeft;
        setStartIndex(prevIndex => {
            const newIndex = Math.max(0, prevIndex - 1);
            // onIndexChange(newIndex);
            return newIndex;
        });
        }
    };

    const scrollRight = () => {
        if (containerRef.current) {
        const newScrollLeft = Math.min(
            containerRef.current.scrollWidth - containerRef.current.offsetWidth,
            containerRef.current.scrollLeft + 122
        );
        containerRef.current.scrollLeft = newScrollLeft;
        setStartIndex(prevIndex => {
            const newIndex = Math.min(items.length - 1, prevIndex + 1);
            // onIndexChange(newIndex);
            return newIndex;
        });
        }
  };

    return (
        <div className="flex-container" style={{ width: '100%', display: 'flex' }}>
            {!btnDisabled && <MoveIconButtonSimple
                isActive={showLeftButton}
                onClick={() => scrollLeft()}
                direction={'left'}
                myStyle={{ width: '24px' }}
            />}
            <div
                className='navigation-tabs-container'
                ref={containerRef}
                style={{ width: 'calc(100% - 54px)', overflow: 'hidden', display: 'flex', margin: '0 3px 0 3px' }}
            >
                {items.map((item, index) => (
                    <div key={index} style={{ minWidth: '120px', marginLeft: '2px', display: 'block', paddingTop: '9px' }}>
                        <ButtonMain
                            onClick={() => onIndexChange(index)}
                            type={'other'}
                            title={item}
                            color={'gray'}
                            myStyle={{
                                width: '110px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', height: '20px', backgroundColor: `${selectedItem === index ? '#25d36576' : '#c4c4c43a'}`}}
                        />
                    </div>
                  ))}
            </div>

            {!btnDisabled && <MoveIconButtonSimple
                isActive={showRightButton}
                onClick={() => scrollRight()}
                direction={'right'}
                myStyle={{ width: '24px' }}
            />}
        </div>
    );
};

export default TabBlock;