import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IPaymentInfoData {
    id: number,
    line_number: number,
    company_type: string,
    currency: number,
    payment_type: number,
    payment_value: number,
    payment_date: string,
    other: string,
    deleted: boolean | string
}

export interface IPaymentInfoTableData {
    id: number,
    line_number: number,
    company_type: string,
    currency: string,
    payment_type: string,
    payment_value: string,
    payment_date: string,
    other: string,
    deleted: boolean | string
}

export const paymentInfoApi = createApi({
    reducerPath: 'paymentInfoApi',
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
    tagTypes: ['PaymentInfo'],
    endpoints: (build) => ({
        getPaymentsInfo: build.query<IPaymentInfoData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/payments-info/',
                params: params
            }),
            providesTags: ['PaymentInfo']
        }),
        getPaymentInfo: build.query<IPaymentInfoData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/payments-info/',
                params: params
            }),
            providesTags: ['PaymentInfo']
        }), 
        getPaymentsInfoTable: build.query<IPaymentInfoTableData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/payments-info-table/',
                params: params
            }),
            providesTags: ['PaymentInfo']
        }),       
        addPaymentInfo: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/payments-info/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['PaymentInfo'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updatePaymentInfo: build.mutation<void, Partial<IPaymentInfoData> & Pick<IPaymentInfoData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/payments-info/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['PaymentInfo'],
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
    useGetPaymentInfoQuery,
    useGetPaymentsInfoQuery,
    useGetPaymentsInfoTableQuery,
    useAddPaymentInfoMutation,
    useUpdatePaymentInfoMutation,
} = paymentInfoApi;
