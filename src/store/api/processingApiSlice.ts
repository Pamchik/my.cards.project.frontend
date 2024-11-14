import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IProcessingsData {
    id: number,
    name: string,
    other: string | null,
    active: boolean,
}

export const processingApi = createApi({
    reducerPath: 'processingApi',
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
    tagTypes: ['Processing'],
    endpoints: (build) => ({
        getProcessings: build.query<IProcessingsData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/processing-centers/',
                params: params,
            }),
            providesTags: ['Processing']
        }),
        getProcessing: build.query<IProcessingsData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/processing-centers/',
                params: params
            }),
            providesTags: ['Processing']
        }),        
        addProcessing: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/processing-centers/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['Processing'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateProcessing: build.mutation<void, Partial<IProcessingsData> & Pick<IProcessingsData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/processing-centers/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['Processing'],
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
    useGetProcessingsQuery,
    useGetProcessingQuery,
    useAddProcessingMutation,
    useUpdateProcessingMutation
} = processingApi;
