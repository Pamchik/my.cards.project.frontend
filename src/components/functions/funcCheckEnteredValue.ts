import moment from "moment";

export function funcCheckEnteredValue(previousValue: string | number, inputValue: string | number, type?: string) {
    let result: boolean | string | number = false
    const prevValue: string | number = previousValue || ''
    const checkValue = funcUpdateInputFieldOnChange(prevValue, inputValue, type);

    if (checkValue !== prevValue) {
        result = checkValue
    }   

    return result 
}

export function funcUpdateInputFieldOnChange(previousValue: string | number, inputValue: string | number, type?: string): string | number {

    let newInputValue: string | number = ''

    let arrNewSymbols: string[] = []

    if ((inputValue.toString()).length > 0) {
        
        if (type === 'number') {

            for (let i = 0; i < inputValue.toString().length; i++) {
                const char = inputValue.toString()[i];
                const isNumeric = /\d/.test(char);
                const isHyphen = char === '-';
                
                if (isNumeric) {
                    arrNewSymbols.push(char);
                } else if (isHyphen && i === 0) {
                    arrNewSymbols.push(char);
                } else {
                    // return previousValue ? previousValue.toLocaleString() : '';
                }
            }
            if (arrNewSymbols.length === 1 && arrNewSymbols[0] === '-') {
                newInputValue = arrNewSymbols.join('')
            } else {
                newInputValue = parseInt(arrNewSymbols.join(''), 10)    
            }
        } else if (type === 'float') {

            let qtyCharAfterDot = 0
            let dotEncountered = false;

            for (let i = 0; i < inputValue.toString().length; i++) {
                const char = inputValue.toString()[i];
                const isNumeric = /\d/.test(char);
                const isHyphen = char === '-';
                const isDot = char === '.';
                const isComma = char === ',';

                if (isNumeric) {
                    arrNewSymbols.push(char);

                    if (dotEncountered) {
                        qtyCharAfterDot++;
                    }

                } else if (isHyphen && i === 0) {
                    arrNewSymbols.push(char);
                } else if (isDot && !dotEncountered) {
                    if (i === 0) {
                        arrNewSymbols.push('0');
                        arrNewSymbols.push(char);
                    } else {
                        arrNewSymbols.push(char);
                    }
                    dotEncountered = true;
                } else if (isComma && !dotEncountered) {
                    if (i === 0) {
                        arrNewSymbols.push('0');
                        arrNewSymbols.push('.');
                    } else {
                        arrNewSymbols.push('.');
                    }
                    dotEncountered = true;
                } else {
                    // return previousValue ? previousValue : '';
                }
            }

            newInputValue = arrNewSymbols.join('')

        } else if (type === 'phone') {
            let allowedChars = /[0-9()+\s-]/;

            for (let i = 0; i < inputValue.toString().length; i++) {
                const char = inputValue.toString()[i];
                const isValidChar = allowedChars.test(char);

                if (isValidChar) {
                    if (char === '+' && i === 0) {
                        arrNewSymbols.push(char);
                    } else if (/[0-9]/.test(char)) {
                        arrNewSymbols.push(char);
                    } else if (char === '(') {
                        if (
                                i > 0 && 
                                inputValue.toString()[i - 1] !== '+' && 
                                !arrNewSymbols.slice(0, i).includes(')') && 
                                !arrNewSymbols.slice(0, i).includes('(') && 
                                !arrNewSymbols.slice(0, i).includes('-')
                            ) {
                            arrNewSymbols.push(char);
                        } else {
                            return previousValue ? previousValue.toLocaleString() : '';
                        }
                    } else if (char === ')') {
                        if (
                                i > 0 && 
                                arrNewSymbols.slice(0, i).includes('(') && 
                                !arrNewSymbols.slice(0, i).includes(')') &&
                                !(inputValue.toString()[i - 1] === '(')
                            ) {
                            arrNewSymbols.push(char);
                        } else {
                            return previousValue ? previousValue.toLocaleString() : '';
                        }
                    } else if (char === '-') {
                        if (
                                i > 0 && 
                                !(inputValue.toString()[i - 1] === '(') && 
                                !(inputValue.toString()[i - 1] === ')') && 
                                !(inputValue.toString()[i - 1] === '-') && 
                                !(inputValue.toString()[i - 1] === ' ') && 
                                (!arrNewSymbols.slice(0, i).includes(')') || (arrNewSymbols.slice(0, i).includes('(') && arrNewSymbols.slice(0, i).includes(')')))
                            ) {
                            arrNewSymbols.push(char);
                        } else {
                            return previousValue ? previousValue.toLocaleString() : '';
                        }
                    } else if (char === ' ') {
                        if (
                                i > 0 && 
                                !(inputValue.toString()[i - 1] === '+') &&
                                !(inputValue.toString()[i - 1] === '-') &&
                                !(inputValue.toString()[i - 1] === '(') &&
                                !(inputValue.toString()[i - 1] === ' ') &&
                                (!arrNewSymbols.slice(0, i).includes(')') || (arrNewSymbols.slice(0, i).includes('(') && arrNewSymbols.slice(0, i).includes(')')))
                            ) {
                            arrNewSymbols.push(char);
                        } else {
                            return previousValue ? previousValue.toLocaleString() : '';  
                        }
                    }
                } else {
                    return previousValue ? previousValue.toLocaleString() : '';
                }

            }

            newInputValue = arrNewSymbols.join('')
        } else if (type === 'folder') {
            const forbiddenChars = /[\\/:*?"<>|]/;

            for (let i = 0; i < inputValue.toString().length; i++) {
                const char = inputValue.toString()[i];
                if (!forbiddenChars.test(char)) {
                    arrNewSymbols.push(char);
                } else {
                    return previousValue ? previousValue.toLocaleString() : '';
                }
            }

            newInputValue = arrNewSymbols.join('');
        } else {
            newInputValue = inputValue
        }
    }

    return newInputValue
}