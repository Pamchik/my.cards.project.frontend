import React, { createContext, useState } from 'react';

interface IConfigStructure {
    WEB_Url: string;
    API_Url: string;
    emailDomain: string;
}

interface IConfigData {
    configData: IConfigStructure,
    getConfigData: () => Promise<IConfigStructure>;
}

const ConfigStructureModel: IConfigStructure = {
    WEB_Url: '', 
    API_Url: '', 
    emailDomain: ''
}

export const ConfigDataContext = createContext<IConfigData>({
    configData: ConfigStructureModel,
    getConfigData: async () => (ConfigStructureModel),
})

const ConfigData = ({ children }: {children: React.ReactNode}) => {

    const [configData, setConfigData] = useState<IConfigStructure>(ConfigStructureModel)

    async function fetchConfig() {
        try {
          const response = await fetch('/config.json');
          if (!response.ok) {
            throw new Error('Failed to load config.json');
          }
          const configData = await response.json();
          return configData;
        } catch (error) {
          console.error('Error fetching config.json:', error);
          return null;
        }
    }

    async function getConfigData() {
        const configDataCache = await fetchConfig();
        const WEB_Url = configDataCache.WEB_Url || ''
        const API_Url = configDataCache.API_Url || ''
        const emailDomain = configDataCache.emailDomain || ''
        setConfigData({WEB_Url: WEB_Url, API_Url: API_Url, emailDomain: emailDomain})
        return {WEB_Url: WEB_Url, API_Url: API_Url, emailDomain: emailDomain}
    }

    return (
        <ConfigDataContext.Provider 
            value={{ 
                configData,
                getConfigData,
            }}
        >
            { children }
        </ConfigDataContext.Provider>
    );
};

export default ConfigData;