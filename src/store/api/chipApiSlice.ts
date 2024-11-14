import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IChipsData {
    id: number,
    short_name: string,
    full_name: string,
    kmc_test: string | null,
    kcv_test: string | null,
    vendor: number,
    mifare_available: number[],
    applet_available: number[],
    active: boolean,
    other: string | null, 
}

export const chipApi = createApi({
    reducerPath: 'chipApi',
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
    tagTypes: ['Chip'],
    endpoints: (build) => ({
        getChips: build.query<IChipsData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/chips/',
                params: params
            }),
            providesTags: ['Chip']
        }),
        getChip: build.query<IChipsData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/chips/',
                params: params
            }),
            providesTags: ['Chip']
        }),        
        addChip: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/chips/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['Chip'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateChip: build.mutation<void, Partial<IChipsData> & Pick<IChipsData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/chips/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['Chip'],
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
    useGetChipQuery,
    useGetChipsQuery,
    useAddChipMutation,
    useUpdateChipMutation,
} = chipApi;
