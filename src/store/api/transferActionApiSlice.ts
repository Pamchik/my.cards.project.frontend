import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import Cookies from 'js-cookie';

export interface ITransferAction {
    id: number,
    name: string,
    active : boolean,
}

export const transferActionApi = createApi({
    reducerPath: 'transferActionApi',
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
        getTransferActions: build.query<ITransferAction[], void>({
            query: () => ({
                url: '/api/transfer-actions/',
            }),
        }) 
    })
})

export const {
    useGetTransferActionsQuery,
} = transferActionApi;
