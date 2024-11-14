import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridState } from 'ag-grid-community';
import moment from "moment";
import { useEffectStoreData } from "../hooks/useEffectStoreData";
import { useDispatch } from "react-redux";
import { deleteResetTableParams } from "../../store/tableData/tablesResetParamsSlice";
import { getLocalStorageData, setLocalStorageData } from "../../store/tableData/tablesDataSlice";
import SceletonLoadingTableView from "../loading/SceletonLoadingTableView";
import { setModalOpen } from "../../store/modalData/modalsSlice";
import { IReportName } from "../../store/api/reportApiSlice";

interface IGeneralReportsTable {
    arrData: IReportName[]
    isLoading: {status: boolean, isSuccessful?: boolean}
    savedTableParamsTime: string
    funcGetLineComponentName: (componentName: string | undefined | null) => void
}


const GeneralReportsTable = ({
    arrData,
    isLoading,
    savedTableParamsTime,
    funcGetLineComponentName,
}: IGeneralReportsTable) => {

    const tableStateLocalStorageName = 'GeneralReportsTableStateLocalStorage'
    const {tableData, tableResetParams} = useEffectStoreData(tableStateLocalStorageName);
    const dispatch = useDispatch();
    
    // Настройка таблицы
        const [initialState, setInitialState] = useState<GridState>();

    // Проверяем и загружаем сохраненное состояние из localStorage при первой загрузке
        useEffect(() => {
            const savedState = localStorage.getItem('GeneralReportsTableStateLocalStorage');
            if (savedState) {
                setInitialState(JSON.parse(savedState));
            } else {
                setInitialState({});
            }
        }, []);

        const gridRef = useRef<AgGridReact<IReportName>>(null);
        const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
        const gridStyle = useMemo(() => ({ height: '100%', width: '100%', fontSize: '9pt' }), []);
        const [rowData, setRowData] = useState<IReportName[]>([]);

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

        const [columnDefs, setColumnDefs] = useState<ColDef<IReportName, any>[]>([
            { 
                field: 'name', 
                width: 300, 
                headerName: 'Название', 
                sort: 'desc'
            },
            { 
                field: 'description',
                flex: 1,
                headerName: 'Описание'
            },
            {
                headerName: 'Последняя выгрузка', 
                field: 'last_upload', 
                width: 200,
                valueFormatter: (params) => {             
                    if (moment.utc(params.value).isValid()) {
                        return moment.utc(params.value).format('DD.MM.YYYY HH:mm');
                    } else {
                        return '';
                    }                
                },
            },
        ]);

        useEffect(() => {
            setRowData(arrData)
        }, [arrData]);


    // Функция получения данных по двойному нажатию на строку в таблице
        const onRowDoubleClicked = useCallback(() => {
            const selectedRows = gridRef.current?.api.getSelectedRows();
            if (selectedRows && selectedRows.length > 0) {
                const selectedComponentName = selectedRows[0].component_name;
                dispatch(setModalOpen(selectedComponentName))
            }
        }, []);

    // Функция получения ID по одному нажатию на строку в таблице
        const onRowClicked = useCallback(() => {
            const selectedRows = gridRef.current?.api.getSelectedRows();
            const selectedComponentName = selectedRows && selectedRows.length > 0 ? selectedRows[0].component_name : null
            funcGetLineComponentName(selectedComponentName)
        }, [])

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



    if (isLoading.status || isSaveTime) 
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
                        onRowClicked={onRowClicked}
                        enableCellTextSelection={true}
                        getRowHeight={getRowHeight}
                        headerHeight={40}
                        initialState={initialState}
                    />  
                </div>
            </div>
        );
};


export default GeneralReportsTable;