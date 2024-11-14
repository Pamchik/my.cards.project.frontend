export function functionErrorMessage (error: any): string | Record<string, any>  {
    let errorMessage;
    if (typeof error.data === 'string') {
        errorMessage = error.data
    } else if (typeof error.data === 'object') {
        errorMessage = error.data
    } else {
        errorMessage = 'Неизвестная ошибка, обратитесь к Администратору'
    }
    return errorMessage
};