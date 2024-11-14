import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IPersoVendorsData {
    id: number,
    name: string,
    other: string | null,
    active: boolean,
}

export const persoVendorApi = createApi({
    reducerPath: 'persoVendorApi',
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
    tagTypes: ['PersoVendor'],
    endpoints: (build) => ({
        getPersoVendors: build.query<IPersoVendorsData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/perso-script-vendors/',
                params: params,
            }),
            providesTags: ['PersoVendor']
        }),
        getPersoVendor: build.query<IPersoVendorsData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/perso-script-vendors/',
                params: params
            }),
            providesTags: ['PersoVendor']
        }),        
        addPersoVendor: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/perso-script-vendors/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['PersoVendor'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updatePersoVendor: build.mutation<void, Partial<IPersoVendorsData> & Pick<IPersoVendorsData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/perso-script-vendors/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['PersoVendor'],
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
    useGetPersoVendorsQuery,
    useGetPersoVendorQuery,
    useAddPersoVendorMutation,
    useUpdatePersoVendorMutation
} = persoVendorApi;
