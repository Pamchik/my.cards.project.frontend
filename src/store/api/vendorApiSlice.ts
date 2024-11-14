import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IVendorsData {
    id: number,
    name: string,
    active: boolean,
    other: string | null, 
}

export const vendorApi = createApi({
    reducerPath: 'vendorApi',
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
    tagTypes: ['Vendor'],
    endpoints: (build) => ({
        getVendors: build.query<IVendorsData[], void>({
            query: () => ({
                url: '/api/vendors/',
            }),
            providesTags: ['Vendor']
        }),
        getVendor: build.query<IVendorsData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/vendors/',
                params: params
            }),
            providesTags: ['Vendor']
        }),        
        addVendor: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/vendors/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['Vendor'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateVendor: build.mutation<void, Partial<IVendorsData> & Pick<IVendorsData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/vendors/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['Vendor'],
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
    useGetVendorQuery,
    useGetVendorsQuery,
    useAddVendorMutation,
    useUpdateVendorMutation,
} = vendorApi;
