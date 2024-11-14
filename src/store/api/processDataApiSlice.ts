import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IProcessData {
    id: number,
    line_number: number,
    process_step: number,
    step_status: number,
    step_comment: string | null
}

export const processDataApi = createApi({
    reducerPath: 'processDataApi',
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
    tagTypes: ['ProcessData'],
    endpoints: (build) => ({
        getProcessesData: build.query<IProcessData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/process-data/',
                params: params,
            }),
            providesTags: ['ProcessData']
        }),
        getProcessData: build.query<IProcessData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/process-data/',
                params: params
            }),
            providesTags: ['ProcessData']
        }),        
        addProcessData: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/process-data/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['ProcessData'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateProcessData: build.mutation<void, Partial<IProcessData> & Pick<IProcessData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/process-data/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['ProcessData'],
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
    useGetProcessesDataQuery,
    useGetProcessDataQuery,
    useAddProcessDataMutation,
    useUpdateProcessDataMutation
} = processDataApi;
