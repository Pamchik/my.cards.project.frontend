import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface ICardTestingData {
    id: number,
    number: string,
    status: number,
    type_card: number,
    KCV: number | null,
    request_date: string,
    is_for_bank: boolean,
    bank: number | null,
    vendor: number,
    vendor_origin: number | null,    
    chip: number | null, 
    applet: number | null, 
    mifare: number | null, 
    mifare_access_key: string | null,
    antenna_size: number | null,
    product_type: number | null,
    material_type: number | null,
    material_color: number | null,
    magstripe_color: number | null,
    magstripe_tracks: number | null,
    lamination_face: number | null,
    lamination_back: number | null,
    requested_quantity: number | null,
    input_code: string | null,
    signed_form_date: string,
    signed_by: number | null,
    other: string | null,
    active: boolean,
    isUrgent: boolean,
}

export interface ICardTestingTable {
    id: number,
    number: string,
    status: string,
    type_card: string,
    KCV: string | null,
    request_date: string,
    is_for_bank: boolean,
    bank: string | null,
    vendor: string,
    vendor_origin: string | null,    
    chip: string | null, 
    applet: string | null, 
    mifare: string | null, 
    mifare_access_key: string | null,
    antenna_size: string | null,
    product_type: string | null,
    material_type: string | null,
    material_color: string | null,
    magstripe_color: string | null,
    magstripe_tracks: string | null,
    lamination_face: string | null,
    lamination_back: string | null,
    requested_quantity: string | null,
    input_code: string | null,
    signed_form_date: string,
    signed_by: string | null,
    other: string | null,
    active: boolean,
    isUrgent: boolean,
    received: number | null,
    sent: number | null,
    on_stock: number | null,
}

export const cardTestingApi = createApi({
    reducerPath: 'cardTestingApi',
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
    tagTypes: ['CardTesting'],
    endpoints: (build) => ({
        getCardsTesting: build.query<ICardTestingData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/card-testing-data/',
                params: params,
            }),
            providesTags: ['CardTesting']
        }),
        getCardTesting: build.query<ICardTestingData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/card-testing-data/',
                params: params
            }),
            providesTags: ['CardTesting']
        }),        
        addCardTesting: build.mutation<ICardTestingData, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/card-testing-data/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['CardTesting'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateCardTesting: build.mutation<ICardTestingData, Partial<ICardTestingData> & Pick<ICardTestingData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/card-testing-data/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['CardTesting'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateCardTestingWithoutReloading: build.mutation<ICardTestingData, Partial<ICardTestingData> & Pick<ICardTestingData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/card-testing-data/${id}/`,
              method: 'PATCH',
              body: data
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        getCardsTestingTable: build.query<ICardTestingTable[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/card-testing-table/',
                params: params,
            }),
            providesTags: ['CardTesting']
        }), 
    })
})

export const {
    useGetCardsTestingQuery,
    useGetCardsTestingTableQuery,
    useGetCardTestingQuery,
    useAddCardTestingMutation,
    useUpdateCardTestingMutation,
    useUpdateCardTestingWithoutReloadingMutation
} = cardTestingApi;
