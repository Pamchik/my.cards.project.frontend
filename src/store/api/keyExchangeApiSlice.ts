import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IKeyExchangeData {
    id: number,
    number: string,
    status: number,
    request_date: string,
    bank: number,
    bank_KMC_name: number | null,
    vendor: number,
    vendor_origin: number | null,
    vendor_KMC_name: number | null,
    vendor_consultant: number | null,
    KCV: string | null,
    key_label: string | null,
    other: string | null,
    active: boolean,
    isUrgent: boolean,
}

export interface IKeyExchangeTableData {
    id: number,
    number: string,
    status: string | null,
    request_date: string,
    bank: string | null,
    bank_KMC_name: string | null,
    vendor: string | null,
    vendor_origin: string | null,
    vendor_KMC_name: string | null,
    vendor_consultant: string | null,
    KCV: string | null,
    key_label: string | null,
    other: string | null,
    active: boolean,
    isUrgent: boolean,
}

export const keyExchangeApi = createApi({
    reducerPath: 'keyExchangeApi',
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
    tagTypes: ['KeyExchange'],
    endpoints: (build) => ({
        getKeyExchanges: build.query<IKeyExchangeData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/key-exchange/',
                params: params,
            }),
            providesTags: ['KeyExchange']
        }),
        getKeyExchange: build.query<IKeyExchangeData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/key-exchange/',
                params: params
            }),
            providesTags: ['KeyExchange']
        }),  
        getKeyExchangesTable: build.query<IKeyExchangeTableData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/key-exchange-table/',
                params: params,
            }),
            providesTags: ['KeyExchange']
        }),
        addKeyExchange: build.mutation<IKeyExchangeData, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/key-exchange/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['KeyExchange'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateKeyExchange: build.mutation<IKeyExchangeData, Partial<IKeyExchangeData> & Pick<IKeyExchangeData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/key-exchange/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['KeyExchange'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateKeyExchangeWithoutReloading: build.mutation<IKeyExchangeData, Partial<IKeyExchangeData> & Pick<IKeyExchangeData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/key-exchange/${id}/`,
              method: 'PATCH',
              body: data
            }),
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
    useGetKeyExchangesQuery,
    useGetKeyExchangeQuery,
    useGetKeyExchangesTableQuery,
    useAddKeyExchangeMutation,
    useUpdateKeyExchangeMutation,
    useUpdateKeyExchangeWithoutReloadingMutation
} = keyExchangeApi;
