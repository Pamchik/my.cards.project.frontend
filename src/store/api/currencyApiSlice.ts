import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import Cookies from 'js-cookie';

export interface ICurrency {
    id: number,
    name: string,
    abbreviation: string,
    active : boolean,
}

export const currencyApi = createApi({
    reducerPath: 'currencyApi',
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
        getCurrencies: build.query<ICurrency[], void>({
            query: () => ({
                url: '/api/currencies/',
            }),
        }) 
    })
})

export const {
    useGetCurrenciesQuery,
} = currencyApi;
