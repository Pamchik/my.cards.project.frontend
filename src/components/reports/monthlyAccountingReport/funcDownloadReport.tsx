// import React from 'react';
// import * as XLSX from 'xlsx';

// export const funcDownloadReport = (data: any) => {
//     // Создаем новую книгу Excel
//     const workbook = XLSX.utils.book_new();

//     // Создаем листы из данных
//     const reportDataSheet = XLSX.utils.json_to_sheet(data);

//     // Добавляем листы в книгу с нужными именами
//     XLSX.utils.book_append_sheet(workbook, reportDataSheet, 'data');

//     // Генерируем Excel файл и загружаем его
//     XLSX.writeFile(workbook, 'report.xlsx');
// }




import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ICurrency } from '../../../store/api/currencyApiSlice';
import { IVendorsData } from '../../../store/api/vendorApiSlice';

interface FormatOptions {
    fontName?: string,
    fontSize?: number,
    isBold?: boolean,
    bgColor?: string,
    borderColor?: string,
    isNum?: boolean,
    wrapText?: boolean,
}

const formatHeaderCell = (cell: ExcelJS.Cell, options: FormatOptions = {}) => {
    const {
        fontName = 'Calibri',
        fontSize = 10,
        isBold = true,
        bgColor ='C0E6F5',
        borderColor = 'FF808080',
        wrapText = true
    } = options;

    // Устанавливаем шрифт
    cell.font = {
        name: fontName,
        size: fontSize,
        bold: isBold
    };

    // Центрируем текст
    cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: wrapText
    };

    // Устанавливаем заливку ячейки
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: bgColor }
    };

    // Устанавливаем границы ячейки
    cell.border = {
        top: { style: 'thin', color: { argb: borderColor } },
        bottom: { style: 'thin', color: { argb: borderColor } },
        left: { style: 'thin', color: { argb: borderColor } },
        right: { style: 'thin', color: { argb: borderColor } }
    };
};

const formatRowCell = (cell: ExcelJS.Cell, options: FormatOptions = {}) => {
    const {
        fontName = 'Calibri',
        fontSize = 10,
        isBold = false,
        borderColor = 'FF808080',
        isNum = false,
        bgColor = false
    } = options;

    // Устанавливаем шрифт
    cell.font = {
        name: fontName,
        size: fontSize,
        bold: isBold
    };

    // Центрируем текст
    if (!isNum) {
        cell.alignment = {
            horizontal: 'left',
            vertical: 'middle'
        }
    } else {
        cell.alignment = {
            horizontal: 'right',
            vertical: 'middle'
        }
    }  

    // Устанавливаем заливку ячейки
    if (bgColor) {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: bgColor }
        };
    }   

    // Устанавливаем границы ячейки
    cell.border = {
        top: { style: 'thin', color: { argb: borderColor } },
        bottom: { style: 'thin', color: { argb: borderColor } },
        left: { style: 'thin', color: { argb: borderColor } },
        right: { style: 'thin', color: { argb: borderColor } }
    };
};

const formatTotalCell = (cell: ExcelJS.Cell, options: FormatOptions = {}) => {
    const {
        fontName = 'Calibri',
        fontSize = 10,
        isBold = true,
        bgColor ='C0E6F5',
        borderColor = 'FF808080',
        wrapText = true
    } = options;

    // Устанавливаем шрифт
    cell.font = {
        name: fontName,
        size: fontSize,
        bold: isBold
    };

    // Центрируем текст
    cell.alignment = {
        horizontal: 'right',
        vertical: 'middle',
        wrapText: wrapText
    };

    // Устанавливаем заливку ячейки
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: bgColor }
    };

    // Устанавливаем границы ячейки
    cell.border = {
        top: { style: 'thin', color: { argb: borderColor } },
        bottom: { style: 'thin', color: { argb: borderColor } },
        left: { style: 'thin', color: { argb: borderColor } },
        right: { style: 'thin', color: { argb: borderColor } }
    };
};

export const funcDownloadReport = async (data: any, formatDict: Record<string, string>, currenciesData: ICurrency[], vendorsData: IVendorsData[]) => {
    // Создаем новую книгу Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('data');

    worksheet.addRow([]);
    // Добавляем текст "Данные по банкам" в первую строку, начиная с колонки 5
    const banksStartColumn = 5;
    const banksEndColumn = banksStartColumn + 2 + currenciesData.length - 1; // Количество валют + 2
    worksheet.mergeCells(1, banksStartColumn, 1, banksEndColumn); // Объединяем ячейки
    worksheet.getCell(1, banksStartColumn).value = "Данные по банкам"; // Устанавливаем значение
    formatHeaderCell(worksheet.getCell(1, banksStartColumn));

    // Добавляем текст "Данные по вендорам" в первую строку, начиная с колонки после "Данные по банкам"
    const vendorsStartColumn = banksEndColumn + 1;
    const vendorsEndColumn = vendorsStartColumn + 2 + (vendorsData.length * currenciesData.length) - 1; // Количество вендоров * количество валют + 2
    worksheet.mergeCells(1, vendorsStartColumn, 1, vendorsEndColumn); // Объединяем ячейки
    worksheet.getCell(1, vendorsStartColumn).value = "Данные по вендорам"; // Устанавливаем значение
    formatHeaderCell(worksheet.getCell(1, vendorsStartColumn));

    // Добавляем заголовки на вторую строку
    if (data.length > 0) {
        // Задаем значения заголовков (добавляем в строку 2)
        const headerRow = worksheet.getRow(2);
        headerRow.values = Object.keys(data[0]); // Заголовки

        // Объединяем ячейки для первых 11 заголовков (строка 1 и 2)
        for (let colIndex = 1; colIndex <= 11; colIndex++) {
            worksheet.mergeCells(2, colIndex, 3, colIndex); // Объединяем строки 2-3 для каждого столбца
            formatHeaderCell(worksheet.getCell(2, colIndex));
        }

        // Объединяем ячейки на основе vendorsData и currenciesData
        let currentColumn = 12; // Начинаем с колонки, следующей за "Данные по вендорам"
        vendorsData.forEach((vendor) => {
            const columnSpan = currenciesData.length; // Количество объединяемых ячеек
            worksheet.mergeCells(2, currentColumn, 2, currentColumn + columnSpan - 1); // Объединяем ячейки
            worksheet.getCell(2, currentColumn).value = vendor.name; // Устанавливаем значение
            formatHeaderCell(worksheet.getCell(2, currentColumn + columnSpan - 1));

            // Выводим валюты под объединённой ячейкой
            currenciesData.forEach((currency, index) => {
                worksheet.getCell(3, currentColumn + index).value = currency.name; // Устанавливаем значение валюты
                formatHeaderCell(worksheet.getCell(3, currentColumn + index));
            });

            currentColumn += columnSpan; // Увеличиваем текущую колонку
        });

        // Добавляем строки данных, начиная с четвёртой строки (так как первая - пустая, вторая - заголовки, третья - валюты)
        const dataRowStartIndex = 4; // Данные начинаются с четвёртой строки
        data.forEach((item: Record<string, string>, rowIndex: number) => {
            const excelRow = worksheet.getRow(dataRowStartIndex + rowIndex); // Определяем строку для добавления данных
            Object.entries(item).forEach(([key, value], colIndex) => {

                // Проверка, является ли значение числом с запятой
                let newValue: string | number = value;
                if (value.includes(',')) {
                    const convertedValue = parseFloat(value.replace(',', '.'));
                    newValue = isNaN(convertedValue) ? value : convertedValue;
                }
                excelRow.getCell(colIndex + 1).value = newValue; // Заполняем ячейки значениями из объекта
                const cell = excelRow.getCell(colIndex + 1); // Получаем ячейку
                cell.value = newValue; // Заполняем ячейку значением
                if (key === 'Месяц') {
                    formatRowCell(cell, {bgColor: 'FBE2D5'});
                } else if (key === 'Название карт') {
                    formatRowCell(cell, {isBold: true});
                } else {
                    formatRowCell(cell);
                }
            });
            excelRow.commit(); // Сохраняем изменения в строке
            
        });
    }

    // Функция для подсчета количества заполненных строк, начиная с 4-й
    const countFilledRows = (worksheet: ExcelJS.Worksheet): number => {
        let filledRowCount = 0;
    
        // Получаем номер последней строки
        const lastRowNumber = worksheet.lastRow ? worksheet.lastRow.number : 0;
    
        // Проходим по всем строкам, начиная с 4-й
        for (let rowIndex = 4; rowIndex <= lastRowNumber; rowIndex++) {
            const row = worksheet.getRow(rowIndex);
            const cellValue3 = row.getCell(3).value; // Значение в 3-й колонке
            const cellValue4 = row.getCell(4).value; // Значение в 4-й колонке
    
            // Проверяем, если хотя бы одна из ячеек не пустая
            if ((cellValue3 !== null && cellValue3 !== '') || (cellValue4 !== null && cellValue4 !== '')) {
                filledRowCount++;
            }
        }
    
        return filledRowCount;
    };


    // Изменение ширины столбцов
    let columnNum = 1
    worksheet.getColumn(columnNum).width = 12;
    worksheet.getColumn(columnNum + 1).width = 9;
    worksheet.getColumn(columnNum + 2).width = 13;
    worksheet.getColumn(columnNum + 3).width = 40;
    worksheet.getColumn(columnNum + 4).width = 60;
    worksheet.getColumn(columnNum + 5).width = 15;
    columnNum = columnNum + 6
    const currenciesDataLen = currenciesData.length
    for (let i = 1; i < currenciesDataLen + 1; i++ ) {
        worksheet.getColumn(columnNum).width = 15;
        columnNum += 1        
    }
    worksheet.getColumn(10).width = 60;
    worksheet.getColumn(11).width = 15;
    columnNum = columnNum + 2
    const vendorsDataLen = vendorsData.length
    for (let i = 1; i < currenciesDataLen * vendorsDataLen + 1; i++ ) {
        worksheet.getColumn(columnNum).width = 15;
        columnNum += 1        
    } 

    // Общий итог
    const filledRows = countFilledRows(worksheet);
    const totalRowIndex = filledRows + 3 + 1;
    worksheet.mergeCells(totalRowIndex, 1, totalRowIndex, 5); // Объединяем ячейки
    worksheet.getCell(totalRowIndex, 1).value = "Общий итог:"; // Устанавливаем значение
    formatTotalCell(worksheet.getCell(totalRowIndex, 1), {})
    
    // Формулы
    const totalColumns = currenciesDataLen * vendorsDataLen + currenciesDataLen + 3
    for (let colIndex = 6; colIndex < 6 + totalColumns; colIndex++) {
        if (colIndex !== (6 + currenciesDataLen + 1)) {
            const sumFormula = `SUM(${worksheet.getColumn(colIndex).letter}${4}:${worksheet.getColumn(colIndex).letter}${totalRowIndex-1})`;
            worksheet.getRow(totalRowIndex).getCell(colIndex).value = { formula: sumFormula }; // Устанавливаем формулу для подсчета суммы            
        }
        formatTotalCell(worksheet.getRow(totalRowIndex).getCell(colIndex))
    }

    // Проверяем, существует ли строка заголовков и содержит ли она значения
    const headerRow = worksheet.getRow(3); // Третья строка с заголовками
    if (headerRow && headerRow.values && Array.isArray(headerRow.values) && headerRow.values.length > 0) {
        headerRow.values.forEach((header: any, columnIndex: number) => {
            // Проверяем, есть ли заголовок в formatDict
            if (formatDict.hasOwnProperty(header)) {
                const format = formatDict[header]; // Получаем формат для данного заголовка

                // Применяем формат для всех строк, начиная с 4-й
                for (let rowIndex = 4; rowIndex <= filledRows + 3; rowIndex++) { // +3, так как индексация строк начинается с 1
                    const cell = worksheet.getRow(rowIndex).getCell(columnIndex); // +1, так как индексация ячеек начинается с 1
                    const value = cell.value; // Получаем текущее значение ячейки

                    // Проверяем и устанавливаем значение как число
                    if (value !== undefined && value !== null && value !== '') {
                        cell.value = parseFloat(value.toString()); // Преобразуем в число
                        cell.numFmt = format; // Применяем формат после изменения значения
                        formatRowCell(cell, {isNum: true});
                    } else {
                        cell.value = null; // Оставляем ячейку пустой
                    }
                }

                // Меняем формат для Итога
                const cell = worksheet.getRow(filledRows + 3 + 1).getCell(columnIndex);
                cell.numFmt = format; 
            }
        });
    }

    // Добавление фильтров
    const lastColumnIndex = worksheet.columns.length; // Последний индекс столбца с данными
    worksheet.autoFilter = {
        from: { row: 3, column: 1 }, // Начало фильтра: A3
        to: { row: 3, column: lastColumnIndex }, // Фильтры на всех столбцах с данными
    };

    // Генерируем Excel файл
    const buffer = await workbook.xlsx.writeBuffer();

    // Загружаем файл
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'report.xlsx');
};