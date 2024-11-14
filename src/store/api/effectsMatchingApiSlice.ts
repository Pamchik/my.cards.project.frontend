import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IEffectsMatchingData {
    id: number,
    effect: number,
    matches: number[],
    mismatches: number[],
}

export const effectMatchingApi = createApi({
    reducerPath: 'effectMatchingApi',
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
    tagTypes: ['EffectMatching'],
    endpoints: (build) => ({
        getEffectsMatching: build.query<IEffectsMatchingData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/effects-matching/',
                params: params,
            }),
            providesTags: ['EffectMatching']
        }),
        getEffectMatching: build.query<IEffectsMatchingData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/effects-matching/',
                params: params
            }),
            providesTags: ['EffectMatching']
        }),        
        addEffectMatching: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/effects-matching/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['EffectMatching'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateEffectMatching: build.mutation<void, Partial<IEffectsMatchingData> & Pick<IEffectsMatchingData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/effects-matching/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['EffectMatching'],
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
    useGetEffectMatchingQuery,
    useGetEffectsMatchingQuery,
    useAddEffectMatchingMutation,
    useUpdateEffectMatchingMutation,
} = effectMatchingApi;
