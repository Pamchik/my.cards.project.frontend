import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IAntennasData {
    id: number,
    name_eng: string,
    name_rus: string,
    vendor: number | null,
    active: boolean,
    other: string | null, 
}

export const antennaApi = createApi({
    reducerPath: 'antennaApi',
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
    tagTypes: ['Antenna'],
    endpoints: (build) => ({
        getAntennas: build.query<IAntennasData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/antenna-sizes/',
                params: params
            }),
            providesTags: ['Antenna']
        }),
        getAntenna: build.query<IAntennasData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/antenna-sizes/',
                params: params
            }),
            providesTags: ['Antenna']
        }),        
        addAntenna: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/antenna-sizes/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['Antenna'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateAntenna: build.mutation<void, Partial<IAntennasData> & Pick<IAntennasData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/antenna-sizes/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['Antenna'],
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
    useGetAntennaQuery,
    useGetAntennasQuery,
    useAddAntennaMutation,
    useUpdateAntennaMutation,
} = antennaApi;
