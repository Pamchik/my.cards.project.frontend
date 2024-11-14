import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridState } from 'ag-grid-community';
import moment from "moment";
import { IFilesTable } from "../../store/api/fileApiSlice";
import { getLocalStorageData, setLocalStorageData } from "../../store/tableData/tablesDataSlice";
import { deleteResetTableParams } from "../../store/tableData/tablesResetParamsSlice";
import { useDispatch } from "react-redux";
import { useEffectStoreData } from "../hooks/useEffectStoreData";
import { funcDownloadFile } from "../functions/funcDownloadFile";
import SceletonLoadingTableView from "../loading/SceletonLoadingTableView";
import { funcSortedDateOrDateTimeByValue } from "../functions/funcSortedDateByValue";

interface IDocTemplateFilesTable {
    arrFiles: IFilesTable[],
    isLoading: {status: boolean, isSuccessful?: boolean},
    savedTableParamsTime: string
    onItemsSelected?: (id: number | null) => void
}

const DocTemplateFilesTable = ({
    arrFiles,
    isLoading,
    savedTableParamsTime,
    onItemsSelected,
}: IDocTemplateFilesTable) => {

    const tableStateLocalStorageName = 'DocTemplateFilesTableStateLocalStorage'
    const {tableData, tableResetParams} = useEffectStoreData(tableStateLocalStorageName);
    const dispatch = useDispatch();

    // Настройка таблицы
        const [initialState, setInitialState] = useState<GridState>();

    // Проверяем и загружаем сохраненное состояние из localStorage при первой загрузке
        useEffect(() => {
            const savedState = localStorage.getItem('DocTemplateFilesTableStateLocalStorage');
            if (savedState) {
                setInitialState(JSON.parse(savedState));
            } else {
                setInitialState({});
            }
        }, []);

        const gridRef = useRef<AgGridReact<IFilesTable>>(null);
        const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
        const gridStyle = useMemo(() => ({ height: '100%', width: '100%', fontSize: '9pt' }), []);
        const [rowData, setRowData] = useState<IFilesTable[]>([]);

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

        const [columnDefs, setColumnDefs] = useState<ColDef<IFilesTable, any>[]>([
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
                width: 150,
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
                width: 200,
            },
            { 
                field: 'other',
                headerName: 'Комментарий',
                width: 500,
            },
        ]);

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

    // Функция сохранения состояния таблицы
        const [lastSavedTime, setLastSavedTime] = useState<string>('')
        const [isSaveTime, setIsSaveTime] = useState<boolean>(false)
        useEffect(() => {
            if (lastSavedTime !== savedTableParamsTime) {
                setLastSavedTime(savedTableParamsTime)
                const state = gridRef.current!.api.getState()
                const colState = JSON.stringify(state);
                dispatch(setLocalStorageData({tableName: tableStateLocalStorageName, params: colState}))
                setIsSaveTime(true)
                setInitialState(state)
                setTimeout(() => {
                    setIsSaveTime(false)
                }, 1500)
            }
        }, [savedTableParamsTime]);

    // Если был нажат сброс параметров
        useEffect(() => {
            if (tableResetParams?.resetTableAllParamsTimeStamp) {
                gridRef.current!.api.resetColumnState();
                gridRef.current!.api.resetQuickFilter()

                const allColumns = gridRef.current!.api.getColumns();
                if (allColumns && allColumns?.length > 0) {
                    allColumns.forEach(column => {
                        gridRef.current!.api.destroyFilter(column);
                    });
                }
                dispatch(deleteResetTableParams({type: 'allParams', tableName: tableStateLocalStorageName}))
            }
            if (tableResetParams?.resetTableFiltersTimeStamp) {
                const allColumns = gridRef.current!.api.getColumns();
                if (allColumns && allColumns?.length > 0) {
                    allColumns.forEach(column => {
                        gridRef.current!.api.destroyFilter(column);
                    });
                }
                dispatch(deleteResetTableParams({type: 'filters', tableName: tableStateLocalStorageName}))
            }
        }, [tableResetParams]);


    if (isLoading?.status || isSaveTime) 
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
                        onRowDoubleClicked={onRowDoubleClicked}
                        onSelectionChanged={onSelectionChanged}
                        enableCellTextSelection={true}
                        getRowHeight={getRowHeight}
                        headerHeight={40}
                        initialState={initialState}
                    />  
                </div>
            </div>
        );
};


export default DocTemplateFilesTable;