import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import Cookies from 'js-cookie';

export interface IChangelog {
    timestamp: string, 
    username: string, 
}

export interface IChangelogHistoryID {
    update: IChangelog,
    create: IChangelog
}

export const changelogApi = createApi({
    reducerPath: 'changelogApi',
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
    tagTypes: ['Changelog'],
    endpoints: (build) => ({
        getChangelog: build.query<IChangelogHistoryID, Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/changelog/history/',
                params: params,
            }),
            providesTags: ['Changelog'],
        }) 
    })
})

export const {
    useGetChangelogQuery,
} = changelogApi;
