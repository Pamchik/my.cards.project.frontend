export function funcSortedDataByValue(data: any[], fieldName: string, isNumbers?: boolean, isReverse?: boolean): any[] {
    const copiedData = [...data];

    let sortedData: any[] = [];

    if (copiedData.length > 0) {
        if (isNumbers) {
            if (isReverse) {
                sortedData = copiedData.sort((a, b) => b[fieldName] - a[fieldName]);
            } else {
                sortedData = copiedData.sort((a, b) => a[fieldName] - b[fieldName]);  
            }
        } else {
            sortedData = copiedData.sort((a, b) => {
                const aValue = String(a[fieldName]).toLowerCase();
                const bValue = String(b[fieldName]).toLowerCase();
                if (isReverse) {
                    return -aValue.localeCompare(bValue);  
                } else {
                    return aValue.localeCompare(bValue);
                }
            });
        }
    }

    return sortedData;
}