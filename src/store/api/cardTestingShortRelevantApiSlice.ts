import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import Cookies from 'js-cookie';

export interface ICardTestingShortRelevantData {
    id: number,
    number: string,
}

export const cardTestingShortRelevantApi = createApi({
    reducerPath: 'cardTestingShortRelevantApi',
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
    tagTypes: ['CardTestingShortRelevant'],
    endpoints: (build) => ({
        getCardsTestingShortRelevant: build.query<ICardTestingShortRelevantData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/card-testing-short-relevant-data/',
                params: params,
            }),
            providesTags: ['CardTestingShortRelevant']
        })
    })
})

export const {
    useGetCardsTestingShortRelevantQuery
} = cardTestingShortRelevantApi;
