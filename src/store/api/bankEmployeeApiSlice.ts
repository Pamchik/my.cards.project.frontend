import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IBankEmployeesData {
    id: number,
    name: string,
    email: string | null,
    phone: string | null,
    bank: number,
    other: string | null,
    active: boolean,
}

export const bankEmployeeApi = createApi({
    reducerPath: 'bankEmployeeApi',
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
    tagTypes: ['BankEmployee'],
    endpoints: (build) => ({
        getBankEmployees: build.query<IBankEmployeesData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/bank-employees/',
                params: params,
            }),
            providesTags: ['BankEmployee']
        }),
        getBankEmployee: build.query<IBankEmployeesData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/bank-employees/',
                params: params
            }),
            providesTags: ['BankEmployee']
        }),        
        addBankEmployee: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/bank-employees/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['BankEmployee'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateBankEmployee: build.mutation<void, Partial<IBankEmployeesData> & Pick<IBankEmployeesData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/bank-employees/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['BankEmployee'],
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
    useGetBankEmployeesQuery,
    useGetBankEmployeeQuery,
    useAddBankEmployeeMutation,
    useUpdateBankEmployeeMutation
} = bankEmployeeApi;
