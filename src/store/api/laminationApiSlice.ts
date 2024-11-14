import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface ILaminationsData {
    id: number,
    name_eng: string,
    name_rus: string,
    vendor: number,
    active: boolean,
    other: string | null, 
}

export const laminationApi = createApi({
    reducerPath: 'laminationApi',
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
    tagTypes: ['Lamination'],
    endpoints: (build) => ({
        getLaminations: build.query<ILaminationsData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/lamination-types/',
                params: params
            }),
            providesTags: ['Lamination']
        }),
        getLamination: build.query<ILaminationsData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/lamination-types/',
                params: params
            }),
            providesTags: ['Lamination']
        }),        
        addLamination: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/lamination-types/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['Lamination'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateLamination: build.mutation<void, Partial<ILaminationsData> & Pick<ILaminationsData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/lamination-types/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['Lamination'],
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
    useGetLaminationQuery,
    useGetLaminationsQuery,
    useAddLaminationMutation,
    useUpdateLaminationMutation,
} = laminationApi;
