import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IBanksData {
    id: number,
    name_eng: string,
    full_name_eng: string | null,
    full_name_rus: string | null,
    address_eng: string | null,
    address_rus: string | null,
    processing: number | null,
    pesro_script_vendor: number | null,
    tolerance: number | null,
    active: boolean,
    country: number | null,   
    other: string | null, 
}

export const bankApi = createApi({
    reducerPath: 'bankApi',
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
    tagTypes: ['Bank'],
    endpoints: (build) => ({
        getBanks: build.query<IBanksData[], void>({
            query: () => ({
                url: '/api/banks/',
            }),
            providesTags: ['Bank']
        }),
        getBank: build.query<IBanksData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/banks/',
                params: params
            }),
            providesTags: ['Bank']
        }),        
        addBank: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/banks/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['Bank'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateBank: build.mutation<void, Partial<IBanksData> & Pick<IBanksData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/banks/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['Bank'],
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
    useGetBankQuery,
    useGetBanksQuery,
    useAddBankMutation,
    useUpdateBankMutation,
} = bankApi;
