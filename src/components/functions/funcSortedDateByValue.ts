import moment from "moment";


export function funcSortedDateOrDateTimeByValue(
    valueA: string, 
    valueB: string, 
    isReverse: boolean = false
): number {
    const dateA = moment(valueA, ['DD.MM.YYYY', 'DD.MM.YYYY HH:mm', 'MMM DD YYYY hh:mm:ss A', moment.ISO_8601], true)
    const dateB = moment(valueB, ['DD.MM.YYYY', 'DD.MM.YYYY HH:mm', 'MMM DD YYYY hh:mm:ss A', moment.ISO_8601], true)
    
    if (!dateA.isValid() && !dateB.isValid()) return 0
    if (!dateA.isValid()) return 1
    if (!dateB.isValid()) return -1

    let comparison = dateA.diff(dateB)

    return isReverse ? comparison : -comparison
}

function extractDate(value: string): moment.Moment {
    const parts = value ? value.split(' - ') : ''
    if (parts.length < 2) return moment.invalid()

    const dateStr = parts[1].trim()
    return moment(dateStr, ['DD.MM.YYYY', moment.ISO_8601], true)
}

export function funcSortedStringDateByValue(
    valueA: string, 
    valueB: string, 
    isReverse: boolean = false
): number {
    const dateA = extractDate(valueA)
    const dateB = extractDate(valueB)

    if (!dateA.isValid() && !dateB.isValid()) return 0
    if (!dateA.isValid()) return 1
    if (!dateB.isValid()) return -1

    let comparison = dateA.diff(dateB)

    return isReverse ? comparison : -comparison
}