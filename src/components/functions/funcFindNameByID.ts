export function funcFindNameByID (prevArray: any[], selectedID: number | undefined | null, field: string) {
    if (prevArray.length > 0 && selectedID) {
        const currentLine = prevArray.find(item => item.id === selectedID)
        if (currentLine) {
            return currentLine[field]
        }
        return undefined        
    } else {
        return undefined
    }
}