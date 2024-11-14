import { useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from 'ag-grid-community';
import SceletonLoadingTableView from "../../loading/SceletonLoadingTableView";

export interface IMonthlyAccountingReport {
    month: string,
    country: string,
    bank: string,
    vendor: string,
    card_name: string,
    contract: string | null,
    PO: string | null,
    bank_qty: string | null,
    vendor_qty: string | null,
    bank_currency: string | null,
    bank_price: string | null,
    vendor_currency: string | null,
    vendor_price: string | null,
}

interface IMonthlyAccountingReportTable {
    arrData: null | unknown,
    isLoading?: {status: boolean, isSuccessful?: boolean},
}

const MonthlyAccountingReportTable = ({
    arrData,
    isLoading,
}: IMonthlyAccountingReportTable) => {

    // Настройка таблицы
        const gridRef = useRef<AgGridReact<IMonthlyAccountingReport>>(null);
        const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
        const gridStyle = useMemo(() => ({ height: '100%', width: '100%', fontSize: '9pt' }), []);
        const [rowData, setRowData] = useState<IMonthlyAccountingReport[]>([]);

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

        const [columnDefs, setColumnDefs] = useState<ColDef<IMonthlyAccountingReport, any>[]>([])

        useEffect(() => {
            setColumnDefs([
                { 
                    field: 'month', 
                    headerName: 'Месяц',
                    width: 100
                },
                { 
                    field: 'country', 
                    headerName: 'Страна',
                    width: 100 
                },
                { 
                    field: 'bank', 
                    headerName: 'Банк',
                    width: 150
                },
                { 
                    field: 'card_name', 
                    headerName: 'Название карт',
                    width: 200 
                },
                { 
                    field: 'contract', 
                    headerName: 'Договор',
                    width: 300 
                },   
                { 
                    field: 'bank_qty', 
                    headerName: 'Кол-во (банк)',
                    width: 150
                },                
                { 
                    field: 'bank_currency', 
                    headerName: 'Валюта (банк)',
                    width: 150 
                },    
                { 
                    field: 'bank_price', 
                    headerName: 'Стоимость (банк)',
                    width: 150
                },
                { 
                    field: 'vendor', 
                    headerName: 'Вендор',
                    width: 150
                },
                { 
                    field: 'PO', 
                    headerName: 'PO',
                    width: 300 
                },
                { 
                    field: 'vendor_qty', 
                    headerName: 'Кол-во (вендор)',
                    width: 150
                },
                { 
                    field: 'vendor_currency', 
                    headerName: 'Валюта (вендор)',
                    width: 150
                },
                { 
                    field: 'vendor_price', 
                    headerName: 'Стоимость (вендор)',
                    width: 150
                }
            ]);
        }, []);

        useEffect(() => {
            if (arrData) {
                const isEqual = JSON.stringify(arrData) === JSON.stringify(rowData);
                if (!isEqual) {
                    setRowData(arrData as IMonthlyAccountingReport[])           
                }
            } else {
                setRowData([]) 
            }
        }, [arrData]);

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
                />
            </div>
        </div>
    );
};


export default MonthlyAccountingReportTable;