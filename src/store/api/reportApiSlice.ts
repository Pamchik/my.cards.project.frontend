import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import Cookies from 'js-cookie';

export interface IReportName {
    id: number,
    name: string,
    description: string | null,
    last_upload: string | null,
    component_name: string,
    active : boolean,
}

export const reportApi = createApi({
    reducerPath: 'reportApi',
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
    tagTypes: ['Report'],
    endpoints: (build) => ({
        getReportsName: build.query<IReportName[], void>({
            query: () => ({
                url: '/api/reports-name/',
            }),
            providesTags: ['Report']
        }),
        getReport: build.query<unknown, Record<string, string | number | boolean | null> | undefined>({
            query: (params: Record<string, string | number | boolean | null> | undefined) => ({
                url: '/api/report/',
                params: params
            }),
        }),
    })
})

export const {
    useGetReportsNameQuery,
    useLazyGetReportQuery
} = reportApi;
