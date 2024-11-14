import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IEffectsData {
    id: number,
    name_eng: string,
    name_rus: string,
    common_name_eng: string,
    common_name_rus: string,
    product_type: number,
    active: boolean,
    other: string | null, 
}

export interface ILineEffectsCommonData {
    rus: string,
    eng: string
}

export const effectApi = createApi({
    reducerPath: 'effectApi',
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
    tagTypes: ['Effect'],
    endpoints: (build) => ({
        getEffects: build.query<IEffectsData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/effects/',
                params: params,
            }),
            providesTags: ['Effect']
        }),
        getEffect: build.query<IEffectsData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/effects/',
                params: params
            }),
            providesTags: ['Effect']
        }),    
        getLineEffectsCommon: build.query<ILineEffectsCommonData, Record<string, number>>({
            query: (params: Record<string, number>) => ({
                url: '/api/line-effects-common/',
                params: params,
            }),
        }),  
        addEffect: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/effects/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['Effect'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateEffect: build.mutation<void, Partial<IEffectsData> & Pick<IEffectsData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/effects/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['Effect'],
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
    useGetEffectQuery,
    useGetEffectsQuery,
    useAddEffectMutation,
    useUpdateEffectMutation,
    useLazyGetLineEffectsCommonQuery
} = effectApi;
