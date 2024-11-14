import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IPaymentSystemsData {
    id: number,
    name: string,
    active: boolean,
    other: string | null, 
}

export const paymentSystemApi = createApi({
    reducerPath: 'paymentSystemApi',
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
    tagTypes: ['PaymentSystem'],
    endpoints: (build) => ({
        getPaymentSystems: build.query<IPaymentSystemsData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/payment-systems/',
                params: params,
            }),
            providesTags: ['PaymentSystem']
        }),
        getPaymentSystem: build.query<IPaymentSystemsData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/payment-systems/',
                params: params
            }),
            providesTags: ['PaymentSystem']
        }),        
        addPaymentSystem: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/payment-systems/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['PaymentSystem'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updatePaymentSystem: build.mutation<void, Partial<IPaymentSystemsData> & Pick<IPaymentSystemsData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/payment-systems/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['PaymentSystem'],
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
    useGetPaymentSystemQuery,
    useGetPaymentSystemsQuery,
    useAddPaymentSystemMutation,
    useUpdatePaymentSystemMutation,
} = paymentSystemApi;
