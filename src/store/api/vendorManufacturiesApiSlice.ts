import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IVendorManufacturiesData {
    id: number,
    name: string,
    vendor: number,
    other: string | null,
    active: boolean,
}

export const vendorManufactureApi = createApi({
    reducerPath: 'vendorManufactureApi',
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
    tagTypes: ['VendorManufacture'],
    endpoints: (build) => ({
        getVendorManufacturies: build.query<IVendorManufacturiesData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/vendor-manufacture-countries/',
                params: params,
            }),
            providesTags: ['VendorManufacture']
        }),
        getVendorManufacture: build.query<IVendorManufacturiesData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/vendor-manufacture-countries/',
                params: params
            }),
            providesTags: ['VendorManufacture']
        }),        
        addVendorManufacture: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/vendor-manufacture-countries/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['VendorManufacture'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateVendorManufacture: build.mutation<void, Partial<IVendorManufacturiesData> & Pick<IVendorManufacturiesData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/vendor-manufacture-countries/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['VendorManufacture'],
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
    useGetVendorManufacturiesQuery,
    useGetVendorManufactureQuery,
    useAddVendorManufactureMutation,
    useUpdateVendorManufactureMutation
} = vendorManufactureApi;
