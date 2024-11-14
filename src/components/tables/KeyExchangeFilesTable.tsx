import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, RowClassParams, RowStyle } from 'ag-grid-community';
import moment from "moment";
import { IFiles } from "../../store/api/fileApiSlice";
import SceletonLoadingTableView from "../loading/SceletonLoadingTableView";
import { funcDownloadFile } from "../functions/funcDownloadFile";
import { useGetFileStatusesQuery } from "../../store/api/fileStatusApiSlice";
import { funcSortedDateOrDateTimeByValue } from "../functions/funcSortedDateByValue";

interface IKeyExchangeFilesTable {
    arrFiles: IFiles[],
    isLoading: {status: boolean, isSuccessful?: boolean},
    onItemsSelected?: (id: number | null) => void
}

const KeyExchangeFilesTable = ({
    arrFiles,
    isLoading,
    onItemsSelected,
}: IKeyExchangeFilesTable) => {

    const {data: fileStatusesData, isFetching: isFetchingFileStatusesData, error: errorFileStatusesData, refetch: refetchFileStatusesData} = useGetFileStatusesQuery(undefined)

    // Настройка таблицы
        const gridRef = useRef<AgGridReact<IFiles>>(null);
        const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
        const gridStyle = useMemo(() => ({ height: '100%', width: '100%', fontSize: '9pt' }), []);
        const [rowData, setRowData] = useState<IFiles[]>([]);

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

        const [columnDefs, setColumnDefs] = useState<ColDef<IFiles, any>[]>([]);

        useEffect(() => {
            setColumnDefs([
                { 
                    field: 'received_from', 
                    width: 140, 
                    headerName: 'От кого' 
                },
                { 
                    flex: 1,
                    field: 'name',
                    headerName: 'Название' 
                },
                { 
                    field: 'file_extension',
                    headerName: 'Формат',
                    width: 120, 
                },
                {
                    field: 'created_date', 
                    headerName: 'Добавлено',
                    sort: 'desc',
                    width: 160,
                    valueGetter: (params) => {
                        const date = moment(params?.data?.created_date, true);
                        return date.isValid() ? date.format('DD.MM.YYYY HH:mm') : '';
                    },
                    valueFormatter: (params) => params.value,
                    comparator: (valueA, valueB) => funcSortedDateOrDateTimeByValue(valueA, valueB)
                },
                { 
                    field: 'status',
                    headerName: 'Статус',
                    width: 150,
                    tooltipField: 'status',
                    valueGetter: (params) => {
                        const myId: number | undefined = params.data?.['status'];
                        if (myId) {
                            const currentValue = fileStatusesData?.find(item => item.id === myId);
                            return currentValue ? currentValue.name : null;
                        }
                        return null;
                    }
                },
                { 
                    field: 'other',
                    headerName: 'Комментарий',
                    width: 250, 
                }
            ])
        }, [fileStatusesData]);

        useEffect(() => {
            setRowData(arrFiles)
        }, [arrFiles]);

    // Скачивание файла по двойному клику
        const onRowDoubleClicked = useCallback(() => {
            const selectedRows = gridRef.current?.api.getSelectedRows();
            if (selectedRows && selectedRows.length > 0) {
                const fileUrl = selectedRows[0].file;
                const fileName = selectedRows[0].name
                const fileExtension = selectedRows[0].file_extension
                
                if (fileUrl && fileName) {
                    funcDownloadFile(fileUrl, fileName + '.' + fileExtension)    
                }
            }
        }, []);

    // Добавление выбранных строк в список 
        const onSelectionChanged = () => {
            const selectedNodes = gridRef.current?.api?.getSelectedNodes();
            
            if (selectedNodes) {
                const selectedId = selectedNodes[0]?.data?.id
                if (selectedId) {
                    onItemsSelected && onItemsSelected(selectedId)
                } else {
                    onItemsSelected && onItemsSelected(null)
                }
            } else {
                onItemsSelected && onItemsSelected(null)
            }
        };

        const getRowStyle = (params: RowClassParams<IFiles, any>): RowStyle | undefined => {
            if (params.data && params.data.status === 9) {
                return { backgroundColor: '#c4c4c469' }
            }
            return undefined;
        };

    if (isLoading?.status) 
        return <SceletonLoadingTableView/>
    else
        return (
            <div style={containerStyle}>
                
                <div style={gridStyle} className="ag-theme-quartz">  
                
                    <AgGridReact
                        ref={gridRef}
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        rowSelection={'single'}
                        getRowStyle={getRowStyle}
                        onRowDoubleClicked={onRowDoubleClicked}
                        onSelectionChanged={onSelectionChanged}
                        enableCellTextSelection={true}
                        getRowHeight={getRowHeight}
                        headerHeight={40}
                    />  
                </div>
            </div>
        );
};


export default KeyExchangeFilesTable;