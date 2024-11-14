import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import Cookies from 'js-cookie';

export interface IProcessStatus {
    id: number,
    name_eng: string,
    name_rus: string,
    active : boolean,
}

export const processStatusApi = createApi({
    reducerPath: 'processStatusApi',
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
        getProcessStatuses: build.query<IProcessStatus[], void>({
            query: () => ({
                url: '/api/process-statuses/',
            }),
        }) 
    })
})

export const {
    useGetProcessStatusesQuery,
} = processStatusApi;
