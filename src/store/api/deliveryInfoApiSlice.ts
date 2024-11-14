import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IDeliveryInfoData {
    id: number,
    line_number: number,
    company_type: string,
    quantity: number | null,
    date: string,
    other: string,
    deleted: boolean | string
}

export interface IDeliveryInfoTableData {
    id: number,
    line_number: number,
    company_type: string,
    quantity: string,
    date: string,
    other: string,
    deleted: boolean| string
}

export const deliveryInfoApi = createApi({
    reducerPath: 'deliveryInfoApi',
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
    tagTypes: ['DeliveryInfo'],
    endpoints: (build) => ({
        getDeliveriesInfo: build.query<IDeliveryInfoData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/deliveries-info/',
                params: params
            }),
            providesTags: ['DeliveryInfo']
        }),
        getDeliveryInfo: build.query<IDeliveryInfoData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/deliveries-info/',
                params: params
            }),
            providesTags: ['DeliveryInfo']
        }),   
        getDeliveryTableInfo: build.query<IDeliveryInfoTableData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/deliveries-info-table/',
                params: params
            }),
            providesTags: ['DeliveryInfo']
        }),      
        addDeliveryInfo: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/deliveries-info/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['DeliveryInfo'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateDeliveryInfo: build.mutation<void, Partial<IDeliveryInfoData> & Pick<IDeliveryInfoData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/deliveries-info/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['DeliveryInfo'],
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
    useGetDeliveryInfoQuery,
    useGetDeliveriesInfoQuery,
    useGetDeliveryTableInfoQuery,
    useAddDeliveryInfoMutation,
    useUpdateDeliveryInfoMutation,
} = deliveryInfoApi;
