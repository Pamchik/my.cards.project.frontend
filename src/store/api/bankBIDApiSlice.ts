import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IBankBIDsData {
    id: number,
    number: number,
    bank: number,
    other: string | null,
    active: boolean,
}

export const bankBIDApi = createApi({
    reducerPath: 'bankBIDApi',
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
    tagTypes: ['BankBID'],
    endpoints: (build) => ({
        getBankBIDs: build.query<IBankBIDsData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/banks-bids/',
                params: params,
            }),
            providesTags: ['BankBID']
        }),
        getBankBID: build.query<IBankBIDsData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/banks-bids/',
                params: params
            }),
            providesTags: ['BankBID']
        }),        
        addBankBID: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/banks-bids/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['BankBID'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateBankBID: build.mutation<void, Partial<IBankBIDsData> & Pick<IBankBIDsData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/banks-bids/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['BankBID'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        })   
    })
})

export const {
    useGetBankBIDsQuery,
    useGetBankBIDQuery,
    useAddBankBIDMutation,
    useUpdateBankBIDMutation
} = bankBIDApi;
