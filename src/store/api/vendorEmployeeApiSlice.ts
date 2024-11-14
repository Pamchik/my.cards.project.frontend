import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IVendorEmployeesData {
    id: number,
    name: string,
    email: string | null,
    phone: string | null,
    vendor: number,
    other: string | null,
    active: boolean,
}

export const vendorEmployeeApi = createApi({
    reducerPath: 'vendorEmployeeApi',
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
    tagTypes: ['VendorEmployee'],
    endpoints: (build) => ({
        getVendorEmployees: build.query<IVendorEmployeesData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/vendor-employees/',
                params: params,
            }),
            providesTags: ['VendorEmployee']
        }),
        getVendorEmployee: build.query<IVendorEmployeesData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/vendor-employees/',
                params: params
            }),
            providesTags: ['VendorEmployee']
        }),        
        addVendorEmployee: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/vendor-employees/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['VendorEmployee'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateVendorEmployee: build.mutation<void, Partial<IVendorEmployeesData> & Pick<IVendorEmployeesData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/vendor-employees/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['VendorEmployee'],
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
    useGetVendorEmployeesQuery,
    useGetVendorEmployeeQuery,
    useAddVendorEmployeeMutation,
    useUpdateVendorEmployeeMutation
} = vendorEmployeeApi;
