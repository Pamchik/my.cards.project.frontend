import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IMagstripeTracksData {
    id: number,
    name_eng: string,
    name_rus: string,
    active: boolean,
}

export const magstripeTrackApi = createApi({
    reducerPath: 'magstripeTrackApi',
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
    tagTypes: ['MagstripeTrack'],
    endpoints: (build) => ({
        getMagstripeTracks: build.query<IMagstripeTracksData[], void>({
            query: () => ({
                url: '/api/magstripe-tracks/',
            }),
            providesTags: ['MagstripeTrack']
        }),
        getMagstripeTrack: build.query<IMagstripeTracksData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/magstripe-tracks/',
                params: params
            }),
            providesTags: ['MagstripeTrack']
        }),        
        addMagstripeTrack: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/magstripe-tracks/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['MagstripeTrack'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateMagstripeTrack: build.mutation<void, Partial<IMagstripeTracksData> & Pick<IMagstripeTracksData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/magstripe-tracks/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['MagstripeTrack'],
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
    useGetMagstripeTrackQuery,
    useGetMagstripeTracksQuery,
    useAddMagstripeTrackMutation,
    useUpdateMagstripeTrackMutation,
} = magstripeTrackApi;
