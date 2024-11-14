import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import Cookies from 'js-cookie';

export interface ICardTestType {
    id: number,
    name: string,
    active : boolean,
}

export const cardTestTypeApi = createApi({
    reducerPath: 'cardTestTypeApi',
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
        getCardTestType: build.query<ICardTestType[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/test-card-types/',
                params: params,
            }),
        }),
        getCardTestTypes: build.query<ICardTestType[], void>({
            query: () => ({
                url: '/api/test-card-types/',
            }),
        }) 
    })
})

export const {
    useGetCardTestTypeQuery,
    useGetCardTestTypesQuery,
} = cardTestTypeApi;