import { useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from 'ag-grid-community';
import moment from "moment";
import SceletonLoadingTableView from "../loading/SceletonLoadingTableView";
import { IFoldersData } from "../../store/api/foldersApiSlice";
import { ICellRendererParams } from "ag-grid-community";
import BlockInput from "../UI/fields/BlockInput";
import MoveIconButtonSimple from "../UI/buttons/MoveIconButtonSimple";
import ButtonMain from "../UI/buttons/ButtonMain";
import { useFieldValueChange } from "../hooks/useFieldValueChange";
import { useEffectStoreData } from "../hooks/useEffectStoreData";
import { useDispatch } from "react-redux";
import { deleteFieldInvalid, setFieldInvalid } from "../../store/componentsData/fieldsInvalidSlice";
import { useAllComponentParamsReset } from "../hooks/useComponentDataReset";
import { ReactComponent as FolderClosedIcon } from '../../static/icons/files/Folder-closed.svg';
import { ReactComponent as UNKNOWNFileIcon } from '../../static/icons/files/UNKNOWN-file-icon.svg';
import { funcSortedDateOrDateTimeByValue } from "../functions/funcSortedDateByValue";


interface IFoldersTable {
    arrFolders: IFoldersData[]
    isLoading: {status: boolean, isSuccessful?: boolean}
    onItemSelected?: () => void
    action: string | undefined
    folder_name?: string
}

const FoldersTable = ({
    arrFolders,
    isLoading,
    onItemSelected,
    action,
    folder_name
}: IFoldersTable) => {

    const componentName = 'FoldersTable'
    const {componentInvalidFields} = useEffectStoreData(componentName);
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const dispatch = useDispatch()

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    // Настройка таблицы
    const gridRef = useRef<AgGridReact<IFoldersData>>(null);
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%', fontSize: '9pt' }), []);
    const [rowData, setRowData] = useState<IFoldersData[]>([]);
    const [currentPath, setCurrentPath] = useState<string[]>(folder_name?.split('/') || []);
    const [newFolder, setNewFolder] = useState<string>('')
    const [selectedFile, setSelectedFile] = useState<IFoldersData | null>(null)
    const setValuesAddNewFile = useFieldValueChange('AddNewFileModal') 
    const setValuesAddExistFile = useFieldValueChange('AddExistFileModal') 
    const setValuesChangeFolder = useFieldValueChange('ChangeFileDataModal') 

    const [columnDefs, setColumnDefs] = useState<ColDef<IFoldersData, any>[]>([]);

    useEffect(() => {
        setColumnDefs([
            {
                width: 40, 
                minWidth: 40, 
                maxWidth: 40, 
                headerName: '',
                cellClass: 'center-cell',
                cellRenderer: function(params: any) {
                    return getFileIconRenderer(params)
                }

            },
            {
                flex: 1,
                field: "name",
                headerName: 'Название',
                minWidth: 250,

            },
            {
                field: "dateModified",
                headerName: 'Дата изменения',
                minWidth: 250,
                valueFormatter: (params) => {
                    const date = moment(params.value, "MMM DD YYYY hh:mm:ss A", true);
                    
                    if (date.isValid()) {
                        return date.format('DD.MM.YYYY HH:mm');
                    } else {
                        return '';
                    }
                },
                comparator: (valueA, valueB) => funcSortedDateOrDateTimeByValue(valueA, valueB)
            },
            {
                field: "size",
                aggFunc: "sum",
                headerName: 'Размер',
                valueFormatter: (params) => {
                    return params.value
                    ? Math.round(params.value / 1024) < 1001 
                        ? Math.round(params.value / 1024) + " КБ" 
                        : Math.round(params.value / 1048576) + " МБ"
                    : "";
                },
            }
        ])
    }, []);

    useEffect(() => {
      if (arrFolders?.length > 0) {
        const filteredData = arrFolders.filter(item => {
          if (currentPath.length === 0) {
            return item.filePath.length === 1;
          } else {
            if (item.filePath.length === currentPath.length + 1) {
                for (let i = 0; i < currentPath.length; i++) {
                    if (item.filePath[i] !== currentPath[i]) return false;
                }
                return true;
            } else {
              return false;  
            }
            
          }
        });
        setRowData(filteredData);
      }
    }, [arrFolders, currentPath]);
  
    const navigateToFolder = (folderName: string) => {
        setCurrentPath(prev => [...prev, folderName]);
    };
  
    const navigateUp = () => {
        setCurrentPath(prev => prev.slice(0, -1));
    };

    const addNewFolder = () => {
        dispatch(deleteFieldInvalid({componentName})) 
        if (newFolder) {
            setCurrentPath(prev => [...prev, newFolder]);
            setNewFolder('')        
        } else {
            dispatch(setFieldInvalid({componentName, data: {'new_folder': {status: true, message: 'Не введено название'}}}))
        }
    }; 

    const selectFile = () => {
        dispatch(deleteFieldInvalid({componentName}))  
        if (selectedFile?.name) {
            setValuesAddExistFile({name: 'file', value: (currentPath.join('/') + '/' + selectedFile?.name) || null})
            setValuesAddExistFile({name: 'folder_name', value: currentPath.join('/') || ''})     
        } else {
            dispatch(setFieldInvalid({componentName, data: {'selected_file': {status: true, message: 'Не выбрано название'}}}))
        }
    }

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

    function getFileIconRenderer(params: ICellRendererParams) {
        const icon = getFileIcon(params.data)
        if (icon) {
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {icon}
                </div>            
            )
        } 
        return <></>
    }
    
    function getFileIcon(data: IFoldersData) {
        if (data.type === 'folder') {
            return <FolderClosedIcon width="17px" height="17px" />;
        } else if (data.type === 'file') {
            return <UNKNOWNFileIcon width="17px" height="17px" />;
        }
        return null;
    }

    if (isLoading?.status) 
        return <SceletonLoadingTableView/>
    else
        return (
            <div style={containerStyle}>
                {action === 'AddNewFile' && <>
                    <div style={{display: 'flex', width: '100%'}}>
                        <MoveIconButtonSimple
                            isActive={currentPath.length > 0}
                            onClick={() => navigateUp()}
                            direction={'left'}
                            myStyle={{ width: '24px', marginTop: '25px' }}
                        />
                        <BlockInput
                            onChange={() => {}}
                            fieldName={'folder_path'}
                            title={'Выбранный путь'}
                            type={'text'}
                            value={currentPath.join('/')}
                            placeholder={''}
                            isReadOnly={true}
                            myStyle={{width: '100%'}}
                        />
                        <ButtonMain
                            onClick={() => {
                                setValuesAddNewFile({name: 'folder_name', value: currentPath.join('/')})
                                onItemSelected && onItemSelected()
                            }}
                            type="other" 
                            title="Выбрать" 
                            myStyle={{height: '25px', width: '100px', marginTop: '25px'}}
                        />
                    </div>
                
                    <div style={{display: 'flex', width: '100%'}}>
                        <BlockInput
                            onChange={(obj) => {setNewFolder(obj.value?.toString().trim() as string || '')}}
                            fieldName={'new_folder'}
                            title={'Добавить новую папку'}
                            type={'folder'}
                            value={newFolder}
                            placeholder={'Введите название для новой папки'}
                            isReadOnly={false}
                            isInvalidStatus={componentInvalidFields?.['new_folder']}
                            myStyle={{width: '100%'}}
                        />
                        <ButtonMain
                            onClick={() => addNewFolder()}
                            type="other" 
                            title="Добавить" 
                            myStyle={{height: '25px', width: '100px', marginTop: '25px'}}
                        />
                    </div>
                </>}
                {action === 'AddExistFile' && <>
                    <div style={{display: 'flex', width: '100%'}}>
                        <MoveIconButtonSimple
                            isActive={currentPath.length > 0}
                            onClick={() => navigateUp()}
                            direction={'left'}
                            myStyle={{ width: '24px', marginTop: '25px' }}
                        />
                        <BlockInput
                            onChange={() => {}}
                            fieldName={'folder_path'}
                            title={'Путь'}
                            type={'text'}
                            value={currentPath.join('/')}
                            placeholder={''}
                            isReadOnly={true}
                            myStyle={{width: '100%'}}
                        />
                    </div>
                    <div style={{display: 'flex', width: '100%'}}>
                        <BlockInput
                            onChange={() => {}}
                            fieldName={'selected_file'}
                            title={'Выбранный файл'}
                            type={'text'}
                            value={selectedFile?.name || ''}
                            placeholder={''}
                            isReadOnly={true}
                            isInvalidStatus={componentInvalidFields?.['selected_file']}
                            myStyle={{width: '100%'}}
                        />
                        <ButtonMain
                            onClick={() => selectFile()}
                            type="other" 
                            title="Выбрать" 
                            myStyle={{height: '25px', width: '100px', marginTop: '25px'}}
                        />
                    </div>
                </>}
                {action === 'ChangeFolder' && <>
                    <div style={{display: 'flex', width: '100%'}}>
                        <MoveIconButtonSimple
                            isActive={currentPath.length > 0}
                            onClick={() => navigateUp()}
                            direction={'left'}
                            myStyle={{ width: '24px', marginTop: '25px' }}
                        />
                        <BlockInput
                            onChange={() => {}}
                            fieldName={'folder_path'}
                            title={'Выбранный путь'}
                            type={'text'}
                            value={currentPath.join('/')}
                            placeholder={''}
                            isReadOnly={true}
                            myStyle={{width: '100%'}}
                        />
                        <ButtonMain
                            onClick={() => {
                                setValuesChangeFolder({name: 'folder_name', value: currentPath.join('/')})
                                onItemSelected && onItemSelected()
                            }}
                            type="other" 
                            title="Выбрать" 
                            myStyle={{height: '25px', width: '100px', marginTop: '25px'}}
                        />
                    </div>
                
                    <div style={{display: 'flex', width: '100%'}}>
                        <BlockInput
                            onChange={(obj) => {setNewFolder(obj.value?.toString().trim() as string || '')}}
                            fieldName={'new_folder'}
                            title={'Добавить новую папку'}
                            type={'folder'}
                            value={newFolder}
                            placeholder={'Введите название для новой папки'}
                            isReadOnly={false}
                            isInvalidStatus={componentInvalidFields?.['new_folder']}
                            myStyle={{width: '100%'}}
                        />
                        <ButtonMain
                            onClick={() => addNewFolder()}
                            type="other" 
                            title="Добавить" 
                            myStyle={{height: '25px', width: '100px', marginTop: '25px'}}
                        />
                    </div>
                </>}
                <div style={gridStyle} className="ag-theme-quartz">  
                    <AgGridReact
                        ref={gridRef}
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        getRowHeight={getRowHeight}
                        headerHeight={40}
                        onRowDoubleClicked={(event) => {
                            if (event?.data?.type === 'folder') {
                                navigateToFolder(event?.data?.name);
                            } else {
                                if (action === 'AddExistFile') {
                                    setSelectedFile(event?.data || null)
                                }
                            }
                        }}
                    />
                </div>
            </div>
        );
};


export default FoldersTable;