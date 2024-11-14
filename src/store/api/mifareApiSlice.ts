import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IMifaresData {
    id: number,
    name: string,
    active: boolean,
    other: string | null, 
}

export const mifareApi = createApi({
    reducerPath: 'mifareApi',
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
    tagTypes: ['Mifare'],
    endpoints: (build) => ({
        getMifares: build.query<IMifaresData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/mifare-types/',
                params: params
            }),
            providesTags: ['Mifare']
        }),
        getMifare: build.query<IMifaresData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/mifare-types/',
                params: params
            }),
            providesTags: ['Mifare']
        }),        
        addMifare: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/mifare-types/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['Mifare'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateMifare: build.mutation<void, Partial<IMifaresData> & Pick<IMifaresData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/mifare-types/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['Mifare'],
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
    useGetMifareQuery,
    useGetMifaresQuery,
    useAddMifareMutation,
    useUpdateMifareMutation,
} = mifareApi;
