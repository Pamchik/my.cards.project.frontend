import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IProductTypesData {
    id: number,
    name_eng: string,
    name_rus: string,
    vendor: number,
    active: boolean,
    other: string | null, 
}

export const productTypeApi = createApi({
    reducerPath: 'productTypeApi',
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
    tagTypes: ['ProductType'],
    endpoints: (build) => ({
        getProductTypes: build.query<IProductTypesData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/product-types/',
                params: params
            }),
            providesTags: ['ProductType']
        }),
        getProductType: build.query<IProductTypesData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/product-types/',
                params: params
            }),
            providesTags: ['ProductType']
        }),        
        addProductType: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/product-types/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['ProductType'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateProductType: build.mutation<void, Partial<IProductTypesData> & Pick<IProductTypesData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/product-types/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['ProductType'],
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
    useGetProductTypeQuery,
    useGetProductTypesQuery,
    useAddProductTypeMutation,
    useUpdateProductTypeMutation,
} = productTypeApi;
