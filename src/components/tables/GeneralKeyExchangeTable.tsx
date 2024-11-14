import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridState } from 'ag-grid-community';
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { ReactComponent as ImportantIcon } from '../../static/icons/Important_red.svg';
import { useEffectStoreData } from "../hooks/useEffectStoreData";
import { useDispatch } from "react-redux";
import { deleteResetTableParams } from "../../store/tableData/tablesResetParamsSlice";
import { getLocalStorageData, setLocalStorageData } from "../../store/tableData/tablesDataSlice";
import SceletonLoadingTableView from "../loading/SceletonLoadingTableView";
import { IKeyExchangeTableData } from "../../store/api/keyExchangeApiSlice";
import { RowClassParams } from "ag-grid-community";
import { RowStyle } from "ag-grid-community";
import { funcSortedDateOrDateTimeByValue } from "../functions/funcSortedDateByValue";

interface IGeneralKeyExchangeTable {
    arrData: IKeyExchangeTableData[],
    isLoading: {status: boolean, isSuccessful?: boolean},
    savedTableParamsTime: string,
    funcGetLineID: (id: number | undefined | null) => void
}


const GeneralKeyExchangeTable = ({
    arrData,
    isLoading,
    savedTableParamsTime,
    funcGetLineID,
}: IGeneralKeyExchangeTable) => {

    const tableStateLocalStorageName = 'GeneralKeyExchangeTableStateLocalStorage'
    const {tableData, tableResetParams} = useEffectStoreData(tableStateLocalStorageName);
    const dispatch = useDispatch();
    
    // Настройка таблицы
        const [initialState, setInitialState] = useState<GridState>();

    // Проверяем и загружаем сохраненное состояние из localStorage при первой загрузке
        useEffect(() => {
            const savedState = localStorage.getItem('GeneralKeyExchangeTableStateLocalStorage');
            if (savedState) {
                setInitialState(JSON.parse(savedState));
            } else {
                setInitialState({});
            }
        }, []);        

        const gridRef = useRef<AgGridReact<IKeyExchangeTableData>>(null);
        const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
        const gridStyle = useMemo(() => ({ height: '100%', width: '100%', fontSize: '9pt' }), []);
        const [rowData, setRowData] = useState<IKeyExchangeTableData[]>([]);

        const getRowHeight = () => {
            return 30;
        }

        const defaultColDef = useMemo(() => {
            return {
                flex: 1,
                resizable: true,
                suppressMovable: true,
                sortable: true, 
                cellStyle: {fontSize: '9pt'},
                filter: 'agMultiColumnFilter',
            };
        }, []);

        const [columnDefs, setColumnDefs] = useState<ColDef<IKeyExchangeTableData, any>[]>([
            { 
                field: 'isUrgent', 
                width: 40, 
                minWidth: 40, 
                maxWidth: 40, 
                headerName: '',
                cellClass: 'center-cell',
                cellRenderer: function(params: any) {
                    const isUrgent = params.data && params.data.isUrgent;
                    return isUrgent ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ImportantIcon width="17px" height="17px" />
                        </div>
                    ) : null
                }
            },
            { 
                field: 'number', 
                width: 100, 
                headerName: 'Номер', 
                sort: 'desc'
            },
            { 
                field: 'status',
                width: 140, 
                headerName: 'Статус'
            },
            {
                headerName: 'Дата запроса', 
                field: 'request_date', 
                width: 140,
                valueFormatter: (params) => {
                    const date = moment(params.value, 'DD.MM.YYYY', true);
                    
                    if (date.isValid()) {
                        return date.format('DD.MM.YYYY');
                    } else {
                        return '';
                    }
                },
                comparator: (valueA, valueB) => funcSortedDateOrDateTimeByValue(valueA, valueB)
            },
            { 
                field: 'bank',
                width: 160, 
                headerName: 'Банк'
            },
            { 
                field: 'vendor',
                width: 140, 
                headerName: 'Вендор'
            },
            { 
                field: 'other',
                width: 300, 
                headerName: 'Комментарии'
            }
        ]);

        useEffect(() => {
            setRowData(arrData)
        }, [arrData]);


    // Функция получения данных по двойному нажатию на строку в таблице
        const navigate = useNavigate();
        const onRowDoubleClicked = useCallback(() => {
            const selectedRows = gridRef.current?.api.getSelectedRows();
            if (selectedRows && selectedRows.length > 0) {
                const selectedId = selectedRows[0].id;
                navigate(`/key-exchange/${selectedId}/`);
            }
        }, []);

    // Функция получения ID по одному нажатию на строку в таблице
        const onRowClicked = useCallback(() => {
            const selectedRows = gridRef.current?.api.getSelectedRows();
            const selectedID = selectedRows && selectedRows.length > 0 ? selectedRows[0].id : null
            funcGetLineID(selectedID)
        }, [])

    // Функция по нажатию на колесико мышки
        const onCellMouseDown = (event: any) => {
            // Проверяем, была ли нажата кнопка колесика мышки
            if (event.event.button === 1) {
                const selectedRow = event.data
                const selectedID = selectedRow && selectedRow.id
                if (selectedID) {
                    const currentUrl = window.location.href
                    window.open(`${currentUrl}${selectedID}/`, '_blank');
                }
            }
        }

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

        const getRowStyle = (params: RowClassParams<IKeyExchangeTableData, any>): RowStyle | undefined => {
            if (params.data && params.data.status === 'Завершено (успешно)') {
                return { backgroundColor: '#c4c4c469' };
            } else if (params.data && params.data.status === 'Завершено (ошибка)') {
                return { backgroundColor: '#ffe4e4' };
            }
            return undefined;
        };


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
                        onCellMouseDown={onCellMouseDown}
                        enableCellTextSelection={true}
                        getRowHeight={getRowHeight}
                        headerHeight={40}
                        initialState={initialState}
                        getRowStyle={getRowStyle}
                    />  
                </div>
            </div>
        );
};


export default GeneralKeyExchangeTable;