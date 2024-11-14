import React, { useState, useEffect, useRef } from 'react';
import BlockInput from '../UI/fields/BlockInput';

interface ISceletonLoadingTableView {
    width?: number,
    height?: number
}

const SceletonLoadingTableView = ({ 
    width, 
    height 
}: ISceletonLoadingTableView) => {
    
    const myWidth: number = width || 300
    const myHeight: number  = height || 20

    const containerRef = useRef<HTMLDivElement | null>(null);
    const [columns, setColumns] = useState<number>(0);
    const [rows, setRows] = useState<number>(0);

    useEffect(() => {
        const updateGrid = () => {
        if (containerRef.current) {
            const containerWidth = containerRef.current?.offsetWidth || 0;
            const containerHeight = containerRef.current?.offsetHeight || 0;
            const padding = 10 * 2;
            const margin = 10 * 2;

            const availableWidth = containerWidth - padding;
            const availableHeight = containerHeight - padding;

            const cols = Math.floor(availableWidth / (myWidth + margin));
            const rows = Math.floor(availableHeight / (myHeight + margin));

            setColumns(cols);
            setRows(rows);
        }
        };

        updateGrid();
        window.addEventListener('resize', updateGrid);
        return () => window.removeEventListener('resize', updateGrid);
    }, [myWidth, myHeight]);

    const renderSkeletonFields = () => {
        const fields = [];
        for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            fields.push(
                <BlockInput
                    onChange={() => {}}
                    fieldName={`${r}-${c}`}
                    skeletonLoading={{status: true}}
                    myStyle={{marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto'}}
                    myStyleInput={{width: `${myWidth}px`, height: `${myHeight}px`, marginLeft: '10px', marginRight: '10px'}}
                />
            );
        }
        }
        return fields;
    };

    return (
        <div className="skeleton-table-container" ref={containerRef}>
        {renderSkeletonFields()}
        </div>
    );
};

export default SceletonLoadingTableView;