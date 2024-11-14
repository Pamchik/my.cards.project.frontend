import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface ITestCardTransferData {
    id: number,
    action: number,
    is_for_bank: boolean,
    card_testing_project: number,
    recipient: number | null,
    transfer_date: string,
    transfer_quantity: number | null,
    other: string | null,
    comment: string | null,
    deleted: boolean | string
}

export const testCardTransferApi = createApi({
    reducerPath: 'testCardTransferApi',
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
    tagTypes: ['TestCardTransfer'],
    endpoints: (build) => ({
        getTestCardTransfers: build.query<ITestCardTransferData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/test-card-transfer-data/',
                params: params
            }),
            providesTags: ['TestCardTransfer']
        }),
        getTestCardTransfer: build.query<ITestCardTransferData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/test-card-transfer-data/',
                params: params
            }),
            providesTags: ['TestCardTransfer']
        }),        
        addTestCardTransfer: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
                url: '/api/test-card-transfer-data/',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['TestCardTransfer'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateTestCardTransfer: build.mutation<void, Partial<ITestCardTransferData> & Pick<ITestCardTransferData, 'id'>>({
            query: ({ id, ...data }) => ({
                url: `/api/test-card-transfer-data/${id}/`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['TestCardTransfer'],
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
    useGetTestCardTransferQuery,
    useGetTestCardTransfersQuery,
    useAddTestCardTransferMutation,
    useUpdateTestCardTransferMutation,
} = testCardTransferApi;
