import { IConfigStructure } from "./funcCreateConfigData";

export function funcGetConfigDataFromLocalStorage (): IConfigStructure  {
    const configDataString = localStorage.getItem('configData');
    if (configDataString) {
        return JSON.parse(configDataString);
    }
    return {
        WEB_Url: '', 
        API_Url: '', 
        emailDomain: '',
        Media_ROOT: ''
    };
};