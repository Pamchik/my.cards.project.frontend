import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IMaterialColorsData {
    id: number,
    name_eng: string,
    name_rus: string,
    material_type: number,
    active: boolean,
    other: string | null, 
}

export const materialColorApi = createApi({
    reducerPath: 'materialColorApi',
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
    tagTypes: ['MaterialColor'],
    endpoints: (build) => ({
        getMaterialColors: build.query<IMaterialColorsData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/material-colors/',
                params: params
            }),
            providesTags: ['MaterialColor']
        }),
        getMaterialColor: build.query<IMaterialColorsData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/material-colors/',
                params: params
            }),
            providesTags: ['MaterialColor']
        }),        
        addMaterialColor: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/material-colors/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['MaterialColor'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateMaterialColor: build.mutation<void, Partial<IMaterialColorsData> & Pick<IMaterialColorsData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/material-colors/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['MaterialColor'],
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
    useGetMaterialColorQuery,
    useGetMaterialColorsQuery,
    useAddMaterialColorMutation,
    useUpdateMaterialColorMutation,
} = materialColorApi;
