import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from 'ag-grid-community';
import moment from "moment";
import { IFilesTable } from "../../store/api/fileApiSlice";
import { funcDownloadFile } from "../functions/funcDownloadFile";
import { funcSortedDateOrDateTimeByValue } from "../functions/funcSortedDateByValue";

interface IPreviewProcessTable {
    arrData: IFilesTable[]
}


const PreviewProcessTable = ({
    arrData,
}: IPreviewProcessTable) => {


    // Настройка таблицы
        const gridRef = useRef<AgGridReact<IFilesTable>>(null);
        const containerStyle = useMemo(() => ({ width: '100%', height: '100%'}), []);
        const gridStyle = useMemo(() => ({ height: '100%', width: '100%', fontSize: '9pt' }), []);
        const [rowData, setRowData] = useState<IFilesTable[]>([]);

        const getRowHeight = () => {
            return 30;
        }

        const defaultColDef = useMemo(() => {
            return {
                suppressMovable: true,
                floatingFilterComponentParams: { suppressFilterButton: true },
                sortable: true, 
                cellStyle: {fontSize: '9pt'},

            };
        }, []);

        const [columnDefs, setColumnDefs] = useState<ColDef<IFilesTable, any>[]>([
            {
                flex: 1,
                headerName: 'Название файла',
                field: 'name', 
                cellStyle: {color: 'blue'},
            },
            {
                headerName: 'Расширение',
                field: 'file_extension', 
                width: 140, 
            },
            {
                headerName: 'Добавлено', 
                field: 'created_date', 
                sort: 'desc',
                width: 160,
                valueFormatter: (params) => {
                    const date = moment(params.value, true);
                    
                    if (date.isValid()) {
                        return date.format('DD.MM.YYYY HH:mm');
                    } else {
                        return '';
                    }
                },
                comparator: (valueA, valueB) => funcSortedDateOrDateTimeByValue(valueA, valueB)
            },
            { 
                headerName: 'Статус',
                field: 'status',
                width: 200,
            },
        ]);

        useEffect(() => {
            setRowData(arrData)
        }, [arrData]);

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



    return (
        <>
            <div style={containerStyle}>
                <div style={gridStyle} className="ag-theme-quartz">  
                    <AgGridReact
                        ref={gridRef}
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        rowSelection={'single'}
                        onRowDoubleClicked={onRowDoubleClicked}
                        suppressRowHoverHighlight={true}
                        enableCellTextSelection={true}
                        getRowHeight={getRowHeight}
                        headerHeight={40}
                    />  
                </div>
            </div>
        </>
    );
};


export default PreviewProcessTable;