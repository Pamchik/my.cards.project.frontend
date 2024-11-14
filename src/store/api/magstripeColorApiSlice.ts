import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IMagstripeColorsData {
    id: number,
    name_eng: string,
    name_rus: string,
    vendor: number,
    magstripe_tracks: number,
    active: boolean,
    other: string | null, 
}

export const magstripeColorApi = createApi({
    reducerPath: 'magstripeColorApi',
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
    tagTypes: ['MagstripeColor'],
    endpoints: (build) => ({
        getMagstripeColors: build.query<IMagstripeColorsData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/magstripe-colors/',
                params: params
            }),
            providesTags: ['MagstripeColor']
        }),
        getMagstripeColor: build.query<IMagstripeColorsData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/magstripe-colors/',
                params: params
            }),
            providesTags: ['MagstripeColor']
        }),        
        addMagstripeColor: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/magstripe-colors/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['MagstripeColor'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateMagstripeColor: build.mutation<void, Partial<IMagstripeColorsData> & Pick<IMagstripeColorsData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/magstripe-colors/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['MagstripeColor'],
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
    useGetMagstripeColorQuery,
    useGetMagstripeColorsQuery,
    useAddMagstripeColorMutation,
    useUpdateMagstripeColorMutation,
} = magstripeColorApi;
