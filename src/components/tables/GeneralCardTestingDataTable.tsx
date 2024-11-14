import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridState } from 'ag-grid-community';
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { ReactComponent as ImportantIcon } from '../../static/icons/Important_red.svg';
import { ICardTestingTable } from "../../store/api/cardTestingApiSlice";
import { useEffectStoreData } from "../hooks/useEffectStoreData";
import { useDispatch } from "react-redux";
import { getLocalStorageData, setLocalStorageData } from "../../store/tableData/tablesDataSlice";
import { deleteResetTableParams } from "../../store/tableData/tablesResetParamsSlice";
import SceletonLoadingTableView from "../loading/SceletonLoadingTableView";
import { RowClassParams } from "ag-grid-community";
import { RowStyle } from "ag-grid-community";
import { funcSortedDateOrDateTimeByValue } from "../functions/funcSortedDateByValue";


interface IGeneralCardTestingDataTable {
    arrData: ICardTestingTable[]
    isLoading: {status: boolean, isSuccessful?: boolean}
    savedTableParamsTime: string
    funcGetLineID: (id: number | undefined | null) => void
}


const GeneralCardTestingDataTable = ({
    arrData,
    isLoading,
    savedTableParamsTime,
    funcGetLineID,
}: IGeneralCardTestingDataTable) => {

    const tableStateLocalStorageName = 'GeneralCardTestingDataTableStateLocalStorage'
    const {tableData, tableResetParams} = useEffectStoreData(tableStateLocalStorageName);
    const dispatch = useDispatch();

    // Настройка таблицы
        const [initialState, setInitialState] = useState<GridState>();

    // Проверяем и загружаем сохраненное состояние из localStorage при первой загрузке
        useEffect(() => {
            const savedState = localStorage.getItem('GeneralCardTestingDataTableStateLocalStorage');
            if (savedState) {
                setInitialState(JSON.parse(savedState));
            } else {
                setInitialState({});
            }
        }, []);

        const gridRef = useRef<AgGridReact<ICardTestingTable>>(null);
        const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
        const gridStyle = useMemo(() => ({ height: '100%', width: '100%', fontSize: '9pt' }), []);
        const [rowData, setRowData] = useState<ICardTestingTable[]>([]);

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

        const [columnDefs, setColumnDefs] = useState<ColDef<ICardTestingTable, any>[]>([
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
                headerName: 'Номер' 
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
                field: 'product_type',
                width: 140, 
                headerName: 'Тип продукта'
            },
            { 
                field: 'chip',
                width: 200, 
                minWidth: 60, 
                headerName: 'Чип'
            },
            { 
                field: 'applet',
                width: 200, 
                minWidth: 60, 
                headerName: 'Applet'
            },
            { 
                field: 'mifare',
                width: 200, 
                minWidth: 60, 
                headerName: 'Mifare'
            },
            { 
                field: 'requested_quantity',
                width: 200, 
                minWidth: 60, 
                headerName: 'Запрошено'
            },
            { 
                field: 'received',
                width: 100, 
                minWidth: 60, 
                headerName: 'Получено',
                valueFormatter: (params) => {             
                    if (params?.data?.received) {
                        return params.data.received.toString()
                    } else {
                        return ''   
                    }                
                },
            },
            { 
                field: 'sent',
                width: 100, 
                minWidth: 60, 
                headerName: 'Отправлено',
                valueFormatter: (params) => {             
                    if (params?.data?.sent) {
                        return params.data.sent.toString()
                    } else {
                        return ''   
                    }                
                },
            },
            { 
                field: 'on_stock',
                width: 100, 
                minWidth: 60, 
                headerName: 'На стоке',
                valueFormatter: (params) => {             
                    if (params?.data?.on_stock) {
                        return params.data.on_stock.toString()
                    } else {
                        if (params?.data?.received) {
                            return '0'
                        } else {
                            return ''   
                        }
                    }                
                },
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
                navigate(`/cards-testing/${selectedId}/`);
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

        const getRowStyle = (params: RowClassParams<ICardTestingTable, any>): RowStyle | undefined => {
            if (params.data && params.data.status === 'Завершено (успешно)') {
                return { backgroundColor: '#c4c4c469' }
            } else if (params.data && params.data.status === 'Завершено (ошибка)') {
                return { backgroundColor: '#ffe4e4' };
            } else if (params.data && params.data.status === 'Тестирование в Банке') {
                return { backgroundColor: '#fff70090' }
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


export default GeneralCardTestingDataTable;