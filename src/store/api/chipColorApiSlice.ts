import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import Cookies from 'js-cookie';

export interface IChipColorData {
    id: number,
    name_eng: string,
    name_rus: string,
    active : boolean,
}

export const chipColorApi = createApi({
    reducerPath: 'chipColorApi',
    baseQuery: async (args, api, extraOptions) => {
        const configData = funcGetConfigDataFromLocalStorage();
        const baseUrl = configData.API_Url || '';
        const baseQueryFn = fetchBaseQuery({
            baseUrl,
            prepareHeaders: (headers) => {
                const sessionid = Cookies.get('sessionid');
                if (sessionid) {
                headers.set('Authorization', `sessionid=${sessionid}`);
                }
                return headers;
            },
        });
        return baseQueryFn(args, api, extraOptions);
    },
    endpoints: (build) => ({
        getChipColors: build.query<IChipColorData[], void>({
            query: () => ({
                url: '/api/chip-colors/',
            }),
        }) 
    })
})

export const {
    useGetChipColorsQuery,
} = chipColorApi;
