export interface IConfigStructure {
    WEB_Url: string,
    API_Url: string,
    emailDomain: string,
    Media_ROOT: string,
}

export async function funcCreateConfigData () {
    const configStructureModel: IConfigStructure = {
        WEB_Url: '', 
        API_Url: '', 
        emailDomain: '',
        Media_ROOT: '',
    }

    async function fetchConfig() {
        try {
            const response = await fetch('/config.json');
            if (!response.ok) {
                localStorage.setItem('configData', JSON.stringify(configStructureModel));  
                throw new Error('Failed to load config.json');
            }
            const configData = await response.json();
            localStorage.setItem('configData', JSON.stringify(configData));            
        } catch (error) {
            console.error('Error fetching config.json:', error);
        }
    }

    await fetchConfig()

}