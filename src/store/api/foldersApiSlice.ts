import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import Cookies from 'js-cookie';

export interface IFoldersData {
    id: number,
    filePath: string[],
    size: number | null,
    dateModified: string | null,
    type: string,
    name: string
}

export const foldersApi = createApi({
    reducerPath: 'foldersApi',
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
    tagTypes: ['Folders'],
    endpoints: (build) => ({
        getFoldersPath: build.query<IFoldersData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/folders/',
                params: params,
            }),
            providesTags: ['Folders']
        })
    })
})

export const {
    useGetFoldersPathQuery
} = foldersApi;
