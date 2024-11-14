import moment from "moment"

export function funcConvertToDateFormat (value: string | undefined | null, format: string, fromFormat?: string) {
    if (value) {
        if (fromFormat) {

            // Парсим значение с учетом предыдущего формата
            const parsedValue = moment.utc(value, fromFormat);

            // Форматируем значение в новый формат
            const convertedValue = parsedValue.format(format);
            
            // const convertedValue = moment.utc(value).format(format)
            return convertedValue             
        } else {
            const convertedValue = moment.utc(value).format(format)
            return convertedValue              
        }
      
    } else {
        return undefined
    }
}