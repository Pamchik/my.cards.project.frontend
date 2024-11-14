import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IMaterialsData {
    id: number,
    name_eng: string,
    name_rus: string,
    product_type: number,
    active: boolean,
    other: string | null, 
}

export const materialApi = createApi({
    reducerPath: 'materialApi',
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
    tagTypes: ['Material'],
    endpoints: (build) => ({
        getMaterials: build.query<IMaterialsData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/material-types/',
                params: params
            }),
            providesTags: ['Material']
        }),
        getMaterial: build.query<IMaterialsData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/material-types/',
                params: params
            }),
            providesTags: ['Material']
        }),        
        addMaterial: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/material-types/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['Material'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateMaterial: build.mutation<void, Partial<IMaterialsData> & Pick<IMaterialsData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/material-types/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['Material'],
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
    useGetMaterialQuery,
    useGetMaterialsQuery,
    useAddMaterialMutation,
    useUpdateMaterialMutation,
} = materialApi;
