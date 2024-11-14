import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';

export function funcDownloadFile(fileUrl: string, fileName: string) {
    if (fileUrl && fileName) {
        
        const baseUrl = funcGetConfigDataFromLocalStorage()?.API_Url
        const baseMediaUrl = funcGetConfigDataFromLocalStorage()?.Media_ROOT

        if (baseUrl && baseMediaUrl) {
            if (fileUrl && fileName) {
                fileUrl = encodeURIComponent(fileUrl)
                const fullBaseUrl = baseUrl + "/" + baseMediaUrl;
                const fullUrl = new URL(fileUrl, fullBaseUrl).href;

                fetch(fullUrl)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`Ошибка HTTP: ${response.status}`);
                        }
                        return response.blob();
                    })
                    .then((blob) => {
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = fileName;
                        a.click();
                        URL.revokeObjectURL(url);
                    })
                    .catch((error) => {
                        console.error('Ошибка при скачивании файла:', error);
                    });  
               

            }
        }


    }
}