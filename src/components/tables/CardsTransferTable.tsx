import { useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from 'ag-grid-community';
import moment from "moment";
import { ITestCardTransferData } from "../../store/api/testCardTransferApiSlice";
import { useGetTransferActionsQuery } from "../../store/api/transferActionApiSlice";
import { useGetBankEmployeesQuery } from "../../store/api/bankEmployeeApiSlice";
import { funcSortedDataByValue } from "../functions/funcSortedDataByValue";
import SceletonLoadingTableView from "../loading/SceletonLoadingTableView";
import { funcSortedDateOrDateTimeByValue } from "../functions/funcSortedDateByValue";

interface ICardsTransferTable {
    arrData: ITestCardTransferData[],
    isLoading: { status: boolean, isSuccessful?: boolean },
    funcGetLineID: (id: number | undefined | null) => void
}

const CardsTransferTable = ({
    arrData,
    isLoading,
    funcGetLineID
}: ICardsTransferTable) => {

    const { data: transferActionsData, isFetching: isFetchingTransferActionsData, error: errorTransferActionsData, refetch: refetchTransferActionsData } = useGetTransferActionsQuery(undefined)
    const { data: bankEmployeesData, isFetching: isFetchingBankEmployeesData, error: errorBankEmployeesData, refetch: refetchBankEmployeesData } = useGetBankEmployeesQuery(undefined)

    // Настройка таблицы
    const gridRef = useRef<AgGridReact<ITestCardTransferData>>(null);
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%', fontSize: '9pt' }), []);
    const [rowData, setRowData] = useState<ITestCardTransferData[]>([]);

    const getRowHeight = () => {
        return 30;
    }

    const defaultColDef = useMemo(() => {
        return {
            resizable: true,
            suppressMovable: true,
            sortable: true,
            cellStyle: { fontSize: '9pt' },
            filter: 'agMultiColumnFilter',
        };
    }, []);

    const [columnDefs, setColumnDefs] = useState<ColDef<ITestCardTransferData, any>[]>([]);

    useEffect(() => {
        setColumnDefs([
            {
                field: 'action',
                headerName: 'Действие',
                width: 150,
                valueGetter: (params) => {
                    const myId: number | undefined = params.data?.['action'];
                    if (myId) {
                        const currentValue = transferActionsData?.find(item => item.id === myId)
                        return currentValue ? currentValue.name : null;
                    }
                    return null;
                }
            },
            {
                field: 'transfer_quantity',
                headerName: 'Количество',
                width: 150,
            },
            {
                field: 'transfer_date',
                headerName: 'Дата',
                sort: 'desc',
                width: 200,
                valueGetter: (params) => {
                    const date = moment(params?.data?.transfer_date, true);
                    return date.isValid() ? date.format('DD.MM.YYYY') : '';
                },
                valueFormatter: (params) => params.value,
                comparator: (valueA, valueB) => funcSortedDateOrDateTimeByValue(valueA, valueB)
            },
            {
                field: 'recipient',
                headerName: 'Получатель',
                width: 300,
                valueGetter: (params) => {
                    const myId: number | undefined | null = params.data?.['recipient'];
                    if (myId) {
                        const currentValue = bankEmployeesData?.find(item => item.id === myId);
                        return currentValue ? currentValue.name : null;
                    }
                    return null;
                }
            },
            {
                field: 'other',
                headerName: 'Причина',
                flex: 1
            },
            {
                field: 'comment',
                headerName: 'Комментарий',
                width: 300,
            },
        ])
    }, [transferActionsData, bankEmployeesData]);

    useEffect(() => {
        setRowData(funcSortedDataByValue(arrData, 'id', false, true))
    }, [arrData])

    // Функция получения ID по одному нажатию на строку в таблице
    const onRowClicked = () => {
        const selectedRows = gridRef.current?.api.getSelectedRows();
        const selectedID = selectedRows && selectedRows.length > 0 ? selectedRows[0].id : null
        funcGetLineID(selectedID)
    }
    
    if (isLoading?.status)
        return <SceletonLoadingTableView />
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
                        enableCellTextSelection={true}
                        getRowHeight={getRowHeight}
                        headerHeight={40}
                        onRowClicked={onRowClicked}
                    />
                </div>
            </div>
        );
    
};


export default CardsTransferTable;