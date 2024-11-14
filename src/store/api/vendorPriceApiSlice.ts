import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IVendorPriceData {
    id: number,
    line_number: number,
    unit_price: number | null,
    main_currency: number | null,  
    additional_currency: number | null,    
    exchange_rates: number | null,
    exchange_rates_by_bank: number | null,    
    exchange_rates_by_date: string | null,
    payment_сurrency: number | null,  
    prepaid_percent: number | null,    
    epson_proof_cost: number | null,
    payment_system_approval_cost: number | null,
    certificate_of_origin_cost: number | null,
}


export const vendorPriceApi = createApi({
    reducerPath: 'vendorPriceApi',
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
    tagTypes: ['VendorPrice'],
    endpoints: (build) => ({
        getVendorPrices: build.query<IVendorPriceData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/vendor-prices/',
                params: params
            }),
            providesTags: ['VendorPrice']
        }),
        getVendorPrice: build.query<IVendorPriceData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/vendor-prices/',
                params: params
            }),
            providesTags: ['VendorPrice']
        }),        
        addVendorPrice: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/vendor-prices/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['VendorPrice'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateVendorPrice: build.mutation<void, Partial<IVendorPriceData> & Pick<IVendorPriceData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/vendor-prices/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['VendorPrice'],
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
    useGetVendorPriceQuery,
    useGetVendorPricesQuery,
    useAddVendorPriceMutation,
    useUpdateVendorPriceMutation,
} = vendorPriceApi;
