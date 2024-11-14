import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from 'ag-grid-community';
import moment from "moment";
import { IPaymentInfoTableData } from "../../store/api/paymentInfoApiSlice";
import SceletonLoadingTableView from "../loading/SceletonLoadingTableView";
import { funcSortedDateOrDateTimeByValue } from "../functions/funcSortedDateByValue";


interface IPaymentsInfoTable {
    arrData: IPaymentInfoTableData[],
    isLoading?: {status: boolean, isSuccessful?: boolean},
    funcGetLineID: (id: number | undefined | null) => void
}

const PaymentsInfoTable = ({
    arrData,
    isLoading,
    funcGetLineID
}: IPaymentsInfoTable) => {

    // Настройка таблицы
        const gridRef = useRef<AgGridReact<IPaymentInfoTableData>>(null);
        const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
        const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
        const [rowData, setRowData] = useState<IPaymentInfoTableData[]>([]);

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

        const [columnDefs, setColumnDefs] = useState<ColDef<IPaymentInfoTableData, any>[]>([
            { 
                field: 'payment_type', 
                width: 150, 
                headerName: 'Тип платежа', 
            },
            { 
                field: 'currency',
                width: 150, 
                headerName: 'Валюта',
            },
            { 
                field: 'payment_value',
                headerName: 'Сумма',
                width: 200, 
            },
            {
                field: 'payment_date', 
                headerName: 'Дата',
                sort: 'desc',
                width: 150,
                valueGetter: (params) => {
                    const date = moment(params?.data?.payment_date, true);
                    return date.isValid() ? date.format('DD.MM.YYYY') : '';
                },
                valueFormatter: (params) => params.value,
                comparator: (valueA, valueB) => funcSortedDateOrDateTimeByValue(valueA, valueB)
            },
            { 
                flex: 1,
                field: 'other',
                headerName: 'Описание',
            }
        ]);

        useEffect(() => {
            setRowData(arrData)
        }, [arrData]);

    // Функция получения ID по одному нажатию на строку в таблице
        const onRowClicked = () => {
            const selectedRows = gridRef.current?.api.getSelectedRows();
            const selectedID = selectedRows && selectedRows.length > 0 ? selectedRows[0].id : null
            funcGetLineID(selectedID)
        }

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
                        rowSelection={'single'}
                        enableCellTextSelection={true}
                        getRowHeight={getRowHeight}
                        headerHeight={40}
                        onRowClicked={onRowClicked}
                    />  
                </div>
            </div>
        );
};


export default PaymentsInfoTable;