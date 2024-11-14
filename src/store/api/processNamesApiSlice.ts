import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import Cookies from 'js-cookie';

export interface IProcessNamesData {
    id: number
    url_name: string
    component_name: string
    position_number: number
}

export const processNamesApi = createApi({
    reducerPath: 'processNamesApi',
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
        getProcessNames: build.query<IProcessNamesData[], void>({
            query: () => ({
                url: '/api/process-list/',
            }),
        })   
    })
})

export const {
    useGetProcessNamesQuery
} = processNamesApi;
