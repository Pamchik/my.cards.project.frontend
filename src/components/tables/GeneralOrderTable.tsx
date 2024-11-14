import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ColGroupDef, GridState, RowClassParams, RowStyle } from 'ag-grid-community';
import { ReactComponent as ImportantIcon } from '../../static/icons/Important_red.svg';
import moment from "moment";
import { useEffectStoreData } from "../hooks/useEffectStoreData";
import { useDispatch } from "react-redux";
import { setLocalStorageData } from "../../store/tableData/tablesDataSlice";
import { deleteResetTableParams } from "../../store/tableData/tablesResetParamsSlice";
import SceletonLoadingTableView from "../loading/SceletonLoadingTableView";
import { setModalProps } from "../../store/modalData/modalsPropsDataSlice";
import { setModalOpen } from "../../store/modalData/modalsSlice";
import { funcConvertToFieldDataType } from "../functions/funcConvertToFieldDataType";
import { IProjectTableApiData } from "../../store/api/projectsApiSlice";
import { funcSortedDateOrDateTimeByValue, funcSortedStringDateByValue } from "../functions/funcSortedDateByValue";

interface IGeneralOrderTable {
    arrData: IProjectTableApiData[]
    isLoading: {status: boolean, isSuccessful?: boolean}
    savedTableParamsTime: string
    funcGetLineID: (id: number | undefined | null) => void
}

const DetailedEffectsRenderer: React.FC<{ data: IProjectTableApiData }> = ({ data }) => {
    if (data && data.product_effects.length > 0) {
        return (
            <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {data.product_effects.map((effect, index) => (
                    <React.Fragment key={index}>
                        <span>{effect}</span>
                        <br />
                    </React.Fragment>
                ))}
            </span>
        );
    } else {
        return null;
    }
};

const DetailedEffectsCommonRenderer: React.FC<{ data: IProjectTableApiData }> = ({ data }) => {
    if (data && data.product_effects_common.length > 0) {
        return (
            <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {data.product_effects_common.map((effect, index) => (
                    <React.Fragment key={index}>
                        <span>{effect}</span>
                        <br />
                    </React.Fragment>
                ))}
            </span>
        );
    } else {
        return null;
    }
};

function getColorStyle (value : string | null | undefined) {
    if (value === "В процессе") {
        return { color: 'orange' }
    } else if (value === "Завершено") {
        return { color: 'green' }
    } else {
        return null
    }
}



const GeneralOrderTable = ({
    arrData,
    isLoading,
    savedTableParamsTime,
    funcGetLineID,
}: IGeneralOrderTable) => {

    const tableStateLocalStorageName = 'GeneralOrderTableStateLocalStorage'
    const {tableData, tableResetParams} = useEffectStoreData(tableStateLocalStorageName);
    const dispatch = useDispatch();

    // Настройка таблицы
        const [initialState, setInitialState] = useState<GridState>();

    // Проверяем и загружаем сохраненное состояние из localStorage при первой загрузке
        useEffect(() => {
            const savedState = localStorage.getItem('GeneralOrderTableStateLocalStorage');
            if (savedState) {
                setInitialState(JSON.parse(savedState));
            } else {
                setInitialState({});
            }
        }, []);

        const gridRef = useRef<AgGridReact<IProjectTableApiData>>(null);
        const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
        const gridStyle = useMemo(() => ({ height: '100%', width: '100%', fontSize: '9pt' }), []);
        const [rowData, setRowData] = useState<IProjectTableApiData[]>([]);

        const getRowHeight = () => {
            return 30;
        }

        const defaultColDef = useMemo(() => {
            return {
                cellStyle: {fontSize: '8pt'},
                filter: 'agMultiColumnFilter',
            };
        }, []);

        const [columnDefs, setColumnDefs] = useState<(ColDef<IProjectTableApiData, any> | ColGroupDef)[]>([
            { 
                field: 'isUrgent', 
                width: 40, 
                minWidth: 40, 
                maxWidth: 40, 
                headerName: '',
                cellClass: 'center-cell',
                lockPosition: "left",
                pinned: true,
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
                pinned: true,
                sort: 'asc',
            },
            {
                field: 'created_date', 
                headerName: 'Создано',
                width: 120,
                pinned: true,
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
                field: 'country',
                width: 100, 
                headerName: 'Страна',
                pinned: true,
            },
            {
                headerName: 'Данные по банку',
                children: [
                    { columnGroupShow: 'closed', field: 'bank', headerName: 'Банк', pinned: true, cellStyle: { fontWeight: 'bold' } },
                    { columnGroupShow: 'open', field: 'bank', headerName: 'Банк', pinned: true },
                    { columnGroupShow: 'open', field: 'bank_employee', headerName: 'Сотрудник банка', pinned: true },
                ],
            },
            {
                headerName: 'Данные по карте',
                children: [
                    { columnGroupShow: 'closed', field: 'product_full_name', headerName: 'Название', pinned: true, cellStyle: { fontWeight: 'bold' } },
                    { columnGroupShow: 'open', field: 'payment_system', headerName: 'Платежная система', pinned: true },
                    { columnGroupShow: 'open', field: 'product_category', headerName: 'Категория', pinned: true },
                    { columnGroupShow: 'open', field: 'product_name', headerName: 'Название', pinned: true },
                    { columnGroupShow: 'open', field: 'product_code', headerName: 'Код продукта', pinned: true },
                    { columnGroupShow: 'open', field: 'product_revision', headerName: 'Ревизия', pinned: true },
                ],
            }, 
            { 
                field: 'general_line_status', 
                headerName: 'Общий статус' 
            },  
            { 
                field: 'general_comment', 
                headerName: 'Общий комментарий' 
            },  
            {
                headerName: 'Данные по вендору',
                children: [
                    { columnGroupShow: 'closed', field: 'vendor', headerName: 'Вендор' },
                    { columnGroupShow: 'open', field: 'vendor', headerName: 'Вендор' },
                    { columnGroupShow: 'open', field: 'vendor_employee', headerName: 'Сотрудник вендора' },
                    { columnGroupShow: 'open', field: 'vendor_manufacture_country', headerName: 'Завод' },
                ],
            },    
            { 
                field: 'product_type',
                width: 140, 
                headerName: 'Тип продукта'
            },    
            {
                headerName: 'Данные по чипу',
                children: [
                    { columnGroupShow: 'closed', field: 'chip_full_name', headerName: 'Чип' },
                    { columnGroupShow: 'open', field: 'chip', headerName: 'Чип' },
                    { columnGroupShow: 'open', field: 'applet', headerName: 'Апплет' },
                    { columnGroupShow: 'open', field: 'chip_color', headerName: 'Цвет модуля' },
                    { columnGroupShow: 'open', field: 'mifare', headerName: 'Mifare' },
                ],
            }, 
            {
                headerName: 'Другие элементы',
                children: [
                    { columnGroupShow: 'closed' },
                    { columnGroupShow: 'open', field: 'antenna_size', headerName: 'Размер антенны' },
                    { columnGroupShow: 'open', field: 'magstripe_tracks', headerName: 'Количество дорожек' },
                    { columnGroupShow: 'open', field: 'magstripe_color', headerName: 'Цвет магнитки' },
                    { columnGroupShow: 'open', field: 'material_type', headerName: 'Тип материала' },
                    { columnGroupShow: 'open', field: 'material_color', headerName: 'Цвет материала' },
                    { columnGroupShow: 'open', field: 'lamination_face', headerName: 'Ламинация (лицо)' },
                    { columnGroupShow: 'open', field: 'lamination_back', headerName: 'Ламинация (оборот)' },
                ],
            },
            {
                headerName: 'Эффекты',
                children: [
                    { columnGroupShow: 'closed', field: 'product_effects_qty', headerName: 'Кол-во' },
                    { 
                        columnGroupShow: 'open', 
                        field: 'product_effects', 
                        headerName: 'Подробно', 
                        cellRenderer: DetailedEffectsRenderer,
                        autoHeight: true,
                        filter: 'customProductEffectsFilter',
                    },
                    { 
                        columnGroupShow: 'open', 
                        field: 'product_effects_common', 
                        headerName: 'Подробно (общ.)', 
                        cellRenderer: DetailedEffectsCommonRenderer,
                        autoHeight: true,
                        filter: 'customProductEffectsCommonFilter',
                    }
                ]
            }, 
            { 
                field: 'product_qty_from_bank', 
                headerName: 'Кол-во_план (банк)' 
            },  
            { 
                field: 'fact_qty_bank', 
                headerName: 'Кол-во_факт (банк)' 
            },  
            { 
                field: 'product_qty_to_vendor', 
                headerName: 'Кол-во_план (вендор)' 
            },       
            { 
                field: 'fact_qty_vendor', 
                headerName: 'Кол-во_факт (вендор)' 
            }, 
            {
                headerName: 'Исходник',
                children: [
                    { columnGroupShow: 'closed', field: 'process_step_status_1', headerName: 'Статус', cellStyle: (params) => {return getColorStyle(params.value)} },
                    { columnGroupShow: 'open', field: 'process_step_status_1', headerName: 'Статус', cellStyle: (params) => {return getColorStyle(params.value)} },
                    { columnGroupShow: 'open', field: 'process_step_comment_1', headerName: 'Комментарий' },
                ],
            },   
            
            {
                headerName: 'КП',
                children: [
                    { columnGroupShow: 'closed', field: 'process_step_status_2', headerName: 'Статус', cellStyle: (params) => {return getColorStyle(params.value)} },
                    { columnGroupShow: 'open', field: 'process_step_status_2', headerName: 'Статус', cellStyle: (params) => {return getColorStyle(params.value)} },
                    { columnGroupShow: 'open', field: 'process_step_comment_2', headerName: 'Комментарий' },
                ],
            },   
            {
                headerName: 'Договор',
                children: [
                    { columnGroupShow: 'closed', field: 'process_step_status_3', headerName: 'Статус', cellStyle: (params) => {return getColorStyle(params.value)} },
                    { columnGroupShow: 'open', field: 'process_step_status_3', headerName: 'Статус', cellStyle: (params) => {return getColorStyle(params.value)} },
                    { columnGroupShow: 'open', field: 'process_step_comment_3', headerName: 'Комментарий' },
                ],
            },   
            {
                headerName: 'Приложение',
                children: [
                    { columnGroupShow: 'closed', field: 'process_step_status_4', headerName: 'Статус', cellStyle: (params) => {return getColorStyle(params.value)} },
                    { columnGroupShow: 'open', field: 'lead_time_bank', headerName: 'Срок доставки' },
                    { columnGroupShow: 'open', field: 'deviation_bank', headerName: 'Отклонение' },
                    { columnGroupShow: 'open', field: 'process_step_status_4', headerName: 'Статус', cellStyle: (params) => {return getColorStyle(params.value)} },
                    { columnGroupShow: 'open', field: 'process_step_comment_4', headerName: 'Комментарий' },
                ],
            },  
            {
                headerName: 'Оплата (вендор)',
                children: [
                    { columnGroupShow: 'closed', field: 'process_step_status_5', headerName: 'Статус', cellStyle: (params) => {return getColorStyle(params.value)} },
                    { columnGroupShow: 'open', field: 'unit_price_vendor', headerName: 'Цена за ед.' },
                    { columnGroupShow: 'open', field: 'payment_plan_vendor', headerName: 'Стоимость (план)' },
                    { columnGroupShow: 'open', field: 'unit_price_vendor_additional', headerName: 'Доп. цена за ед.' },
                    { columnGroupShow: 'open', field: 'additional_payment_plan_vendor', headerName: 'Доп. стоимость (план)' },
                    // { columnGroupShow: 'open', field: 'additional_vendor_cost', headerName: 'Доп. затраты' },
                    { columnGroupShow: 'open', field: 'prepaid_percent_vendor', headerName: 'Предоплата %' },
                    { columnGroupShow: 'open', field: 'prepaid_value_vendor', headerName: 'Оплачено (предоплата)' },
                    { columnGroupShow: 'open', field: 'postpaid_percent_vendor', headerName: 'Постоплата %' },
                    { columnGroupShow: 'open', field: 'postpaid_value_vendor', headerName: 'Оплачено (постоплата)' },
                    { columnGroupShow: 'open', field: 'payment_fact_vendor', headerName: 'Оплачено (сумма)' },
                    { columnGroupShow: 'open', field: 'process_step_status_5', headerName: 'Статус', cellStyle: (params) => {return getColorStyle(params.value)} },
                    { columnGroupShow: 'open', field: 'process_step_comment_5', headerName: 'Комментарий' },
                ],
            },              
            {
                headerName: 'Оплата (банк)',
                children: [
                    { columnGroupShow: 'closed', field: 'process_step_status_6', headerName: 'Статус', cellStyle: (params) => {return getColorStyle(params.value)} },
                    { columnGroupShow: 'open', field: 'unit_price_bank', headerName: 'Цена за ед.' },
                    { columnGroupShow: 'open', field: 'payment_plan_bank', headerName: 'Стоимость (план)' },
                    { columnGroupShow: 'open', field: 'unit_price_bank_additional', headerName: 'Доп. цена за ед.' },
                    { columnGroupShow: 'open', field: 'exchange_rates_bank', headerName: 'Курс' },
                    { columnGroupShow: 'open', field: 'additional_payment_plan_bank', headerName: 'Доп. стоимость (план)' },
                    { columnGroupShow: 'open', field: 'prepaid_percent_bank', headerName: 'Предоплата %' },
                    { columnGroupShow: 'open', field: 'prepaid_value_bank', headerName: 'Оплачено (предоплата)' },
                    { columnGroupShow: 'open', field: 'postpaid_percent_bank', headerName: 'Постоплата %' },
                    { columnGroupShow: 'open', field: 'postpaid_value_bank', headerName: 'Оплачено (постоплата)' },
                    { columnGroupShow: 'open', field: 'payment_fact_bank', headerName: 'Оплачено (сумма)' },
                    { columnGroupShow: 'open', field: 'process_step_status_6', headerName: 'Статус', cellStyle: (params) => {return getColorStyle(params.value)} },
                    { columnGroupShow: 'open', field: 'process_step_comment_6', headerName: 'Комментарий' },
                ],
            },   
            {
                headerName: 'PO',
                children: [
                    { columnGroupShow: 'closed', field: 'process_step_status_7', headerName: 'Статус', cellStyle: (params) => {return getColorStyle(params.value)} },
                    { columnGroupShow: 'open', field: 'lead_time_vendor', headerName: 'Срок доставки' },
                    { columnGroupShow: 'open', field: 'deviation_vendor', headerName: 'Отклонение' },
                    { columnGroupShow: 'open', field: 'process_step_status_7', headerName: 'Статус', cellStyle: (params) => {return getColorStyle(params.value)} },
                    { columnGroupShow: 'open', field: 'process_step_comment_7', headerName: 'Комментарий' },
                ],
            },   
            {
                headerName: 'Тестирование',
                children: [
                    { columnGroupShow: 'closed', field: 'process_step_status_8', headerName: 'Статус', cellStyle: (params) => {return getColorStyle(params.value)} },
                    { columnGroupShow: 'open', field: 'process_step_status_8', headerName: 'Статус', cellStyle: (params) => {return getColorStyle(params.value)} },
                    { columnGroupShow: 'open', field: 'process_step_comment_8', headerName: 'Комментарий' },
                ],
            },   
            {
                headerName: 'Платежная система',
                children: [
                    { columnGroupShow: 'closed', field: 'process_step_status_9', headerName: 'Статус', cellStyle: (params) => {return getColorStyle(params.value)} },
                    { columnGroupShow: 'open', field: 'payment_system_data', headerName: 'Данные для ПС', comparator: (valueA, valueB) => funcSortedStringDateByValue(valueA, valueB)},
                    { columnGroupShow: 'open', field: 'approval_date', headerName: 'Дата утверждения', comparator: (valueA, valueB) => funcSortedStringDateByValue(valueA, valueB)},
                    { columnGroupShow: 'open', field: 'process_step_status_9', headerName: 'Статус', cellStyle: (params) => {return getColorStyle(params.value)} },
                    { columnGroupShow: 'open', field: 'process_step_comment_9', headerName: 'Комментарий' },
                ],
            },   
            {
                headerName: 'Макет',
                children: [
                    { columnGroupShow: 'closed', field: 'process_step_status_10', headerName: 'Статус', cellStyle: (params) => {return getColorStyle(params.value)} },
                    { columnGroupShow: 'open', field: 'process_step_status_10', headerName: 'Статус', cellStyle: (params) => {return getColorStyle(params.value)} },
                    { columnGroupShow: 'open', field: 'process_step_comment_10', headerName: 'Комментарий' },
                ],
            },   
            {
                headerName: 'Производство',
                children: [
                    { columnGroupShow: 'closed', field: 'process_step_status_11', headerName: 'Статус', cellStyle: (params) => {return getColorStyle(params.value)} },
                    { columnGroupShow: 'open', field: 'month_plan', headerName: 'Ориентировочный месяц окончания' },
                    { columnGroupShow: 'open', field: 'date_plan', headerName: 'Ориентировочная дата (вендор)', 
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
                    { columnGroupShow: 'open', field: 'date_client', headerName: 'Ориентировочная дата (банк)',
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
                    { columnGroupShow: 'open', field: 'date_fact', headerName: 'Фактическая дата',
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
                    { columnGroupShow: 'open', field: 'process_step_status_11', headerName: 'Статус', cellStyle: (params) => {return getColorStyle(params.value)} },
                    { columnGroupShow: 'open', field: 'process_step_comment_11', headerName: 'Комментарий' },
                ],
            },   
            {
                headerName: 'Доставка от вендора',
                children: [
                    { columnGroupShow: 'closed', field: 'process_step_status_12', headerName: 'Статус', cellStyle: (params) => {return getColorStyle(params.value)} },
                    { columnGroupShow: 'open', field: 'process_step_status_12', headerName: 'Статус', cellStyle: (params) => {return getColorStyle(params.value)} },
                    { columnGroupShow: 'open', field: 'process_step_comment_12', headerName: 'Комментарий' },
                ],
            },  
            {
                headerName: 'Доставка в банк',
                children: [
                    { columnGroupShow: 'closed', field: 'process_step_status_13', headerName: 'Статус', cellStyle: (params) => {return getColorStyle(params.value)} },
                    { columnGroupShow: 'open', field: 'process_step_status_13', headerName: 'Статус', cellStyle: (params) => {return getColorStyle(params.value)} },
                    { columnGroupShow: 'open', field: 'process_step_comment_13', headerName: 'Комментарий' },
                ],
            },  
        ]);

        useEffect(() => {
            setRowData(arrData)
        }, [arrData]);

    // Функция получения данных по двойному нажатию на строку в таблице
        const onRowDoubleClicked = useCallback(() => {
            const selectedRows = gridRef.current?.api.getSelectedRows();
            dispatch(setModalProps({
                componentName: 'LinePreviewModal', data: {
                    objInputData: selectedRows ? funcConvertToFieldDataType(selectedRows[0]) : {}
                }
            }))
            dispatch(setModalOpen('LinePreviewModal'))
        }, []);

    // Функция получения ID по одному нажатию на строку в таблице
        const onRowClicked = useCallback(() => {
            const selectedRows = gridRef.current?.api.getSelectedRows();
            const selectedID = selectedRows && selectedRows.length > 0 ? selectedRows[0].id : null
            funcGetLineID(selectedID)
        }, [])
    
    // Функция по нажатию на колесико мышки
        const onCellMouseDown = (event: any) => {
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

        const getRowStyle = (params: RowClassParams<IProjectTableApiData, any>): RowStyle | undefined => {
            if (params.data && params.data.general_line_status === 'Закрыт') {
                return { backgroundColor: '#c4c4c469' }
            } else if (params.data && params.data.general_line_status === 'Приостановлен') {
                return { backgroundColor: '#ffe4e4' }
            }
            return undefined;
        };




    if (isLoading?.status || isSaveTime) 
        return <SceletonLoadingTableView/>
    else
        return (
            <div style={containerStyle}>
                <div style={gridStyle} className="ag-theme-quartz">  
                    <AgGridReact<IProjectTableApiData>
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


export default GeneralOrderTable;