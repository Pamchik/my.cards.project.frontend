import { useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from 'ag-grid-community';
import SceletonLoadingTableView from "../loading/SceletonLoadingTableView";
import { IShortProjectTableApiData } from "../../store/api/projectsApiSlice";


interface IProcessFilesMatchingToLinesTable {
    arrOrders: IShortProjectTableApiData[],
    isLoading: {status: boolean, isSuccessful?: boolean},
    onItemsSelected: (arr: number[]) => void,
    additionalNumbers: number[]
}

const ProcessFilesMatchingToLinesTable = ({
    arrOrders,
    isLoading,
    onItemsSelected,
    additionalNumbers,
}: IProcessFilesMatchingToLinesTable) => {

    // Настройка таблицы
        const gridRef = useRef<AgGridReact<IShortProjectTableApiData>>(null);
        const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
        const gridStyle = useMemo(() => ({ height: '100%', width: '100%', fontSize: '9pt' }), []);
        const [rowData, setRowData] = useState<IShortProjectTableApiData[]>([]);

        const getRowHeight = () => {
            return 30;
        }

        const defaultColDef = useMemo(() => {
            return {
                resizable: true,
                suppressMovable: true,
                sortable: true, 
                cellStyle: {fontSize: '9pt'},
                filter: 'agMultiColumnFilter',
                
            };
        }, []);

        const [columnDefs, setColumnDefs] = useState<ColDef<IShortProjectTableApiData, any>[]>([])

        useEffect(() => {
            setColumnDefs([
                {
                    suppressSizeToFit : true,
                    checkboxSelection: true,
                    headerCheckboxSelection: true,
                    width: 50,
                    cellClass: 'custom-checkbox',
                },
                { 
                    field: 'display_year',
                    width: 70, 
                    headerName: 'Год' 
                },
                { 
                    field: 'number', 
                    width: 90, 
                    headerName: 'Номер' 
                },
                { 
                    field: 'bank',
                    width: 100, 
                    headerName: 'Банк', 
                },
                { 
                    field: 'vendor',
                    width: 100, 
                    headerName: 'Вендор', 
                },
                { 
                    field: 'product_type',
                    width: 120, 
                    headerName: 'Тип продукта', 
                },
                { 
                    field: 'product_full_name',
                    width: 120, 
                    headerName: 'Название', 
                    flex: 1,
                },
                { 
                    field: 'chip_full_name',
                    width: 120, 
                    headerName: 'Чип', 
                },
            ]);
        }, []);

        useEffect(() => {
            const isEqual = JSON.stringify(arrOrders) === JSON.stringify(rowData);
            if (!isEqual) {
                setRowData(arrOrders);           
            }
        }, [arrOrders]);

    // Выбор строк при первом рендеринге или изменении additionalNumbers
        // useEffect(() => {
        //     if (additionalNumbers.length > 0 && gridRef.current) {
        //         gridRef.current.api.forEachNode((node) => {
        //             const nodeId = node.data?.id;
        //             if (nodeId !== undefined && additionalNumbers.includes(nodeId)) {
        //                 node.setSelected(true);
        //             }
        //         });
        //     }
        // }, [additionalNumbers]);
        
        const onGridReady = () => {
            if (additionalNumbers.length > 0 && gridRef.current) {
                gridRef.current.api.forEachNode((node) => {
                    const nodeId = node.data?.id;
                    if (nodeId !== undefined && additionalNumbers.includes(nodeId)) {
                        node.setSelected(true);
                    }
                });
            }
        };

    // Добавление выбранных строк в список 
        const onSelectionChanged = () => {
            const selectedNodes = gridRef.current?.api?.getSelectedNodes();
            
            if (selectedNodes && selectedNodes.length > 0) {
                
                const newArray = selectedNodes
                        .map(item => item.data?.id)
                        .filter((id): id is number => id !== undefined && id !== null)
                
                onItemsSelected && onItemsSelected(newArray)
                
            } else {
                onItemsSelected && onItemsSelected([])
            }
        };


    if (isLoading?.status) 
        return <SceletonLoadingTableView/>
    return (
        <div style={containerStyle}>
            <div style={gridStyle} className="ag-theme-quartz">  
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    rowSelection={'multiple'}
                    onSelectionChanged={onSelectionChanged}
                    enableCellTextSelection={true}        
                    getRowHeight={getRowHeight}
                    headerHeight={40}   
                    rowMultiSelectWithClick={true}
                    onGridReady={onGridReady}
                />
            </div>
        </div>
    );
};


export default ProcessFilesMatchingToLinesTable;