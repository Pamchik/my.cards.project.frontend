import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IAppletsData {
    id: number,
    name: string,
    active: boolean,
    other: string | null, 
}

export const appletApi = createApi({
    reducerPath: 'appletApi',
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
    tagTypes: ['Applet'],
    endpoints: (build) => ({
        getApplets: build.query<IAppletsData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/applet-types/',
                params: params
            }),
            providesTags: ['Applet']
        }),
        getApplet: build.query<IAppletsData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/applet-types/',
                params: params
            }),
            providesTags: ['Applet']
        }),        
        addApplet: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/applet-types/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['Applet'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateApplet: build.mutation<void, Partial<IAppletsData> & Pick<IAppletsData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/applet-types/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['Applet'],
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
    useGetAppletQuery,
    useGetAppletsQuery,
    useAddAppletMutation,
    useUpdateAppletMutation,
} = appletApi;
