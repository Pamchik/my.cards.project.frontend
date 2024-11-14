import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IPaymentSystemApprovalData {
    id: number,
    number: number | null,
    line_number: number,
    bid: number | null,
    bin: string | null,
    range_low: string | null,
    range_high: string | null,
    program_name: string | null,
    full_name_in_ps: string | null,
    other: string | null,
    is_requested: string | null,
    approval_date: string | null,
    posted_date: string | null,
    requested_date: string | null,
    received_date: string | null,
}

export const paymentSystemApprovalApi = createApi({
    reducerPath: 'paymentSystemApprovalApi',
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
    tagTypes: ['PaymentSystemApproval'],
    endpoints: (build) => ({
        getPaymentSystemApproval: build.query<IPaymentSystemApprovalData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/payment-system-approvals/',
                params: params
            }),
            providesTags: ['PaymentSystemApproval']
        }),        
        addPaymentSystemApproval: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/payment-system-approvals/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['PaymentSystemApproval'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updatePaymentSystemApproval: build.mutation<void, Partial<IPaymentSystemApprovalData> & Pick<IPaymentSystemApprovalData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/payment-system-approvals/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['PaymentSystemApproval'],
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
    useGetPaymentSystemApprovalQuery,
    useAddPaymentSystemApprovalMutation,
    useUpdatePaymentSystemApprovalMutation,
} = paymentSystemApprovalApi;
