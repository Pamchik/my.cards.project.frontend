import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import Cookies from 'js-cookie';

export interface IFiles {
    id: number,
    file: string,
    name: string,
    file_extension: string,
    process_step : number,
    number: string,
    created_date: string,
    status: number,
    file_type: string,
    active: boolean,
    model_type: string,
    created_by: string,
    received_from: string,
    other: string | null
}

export const relevantFileApi = createApi({
    reducerPath: 'relevantFileApi',
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
    tagTypes: ['RelevantFile'],
    endpoints: (build) => ({
        getRelevantFiles: build.query<IFiles[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/relevant-files/',
                params: params
            }),
            providesTags: ['RelevantFile']
        })
    })
})

export const {
    useGetRelevantFilesQuery
} = relevantFileApi;
