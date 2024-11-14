import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IProductCategoriesData {
    id: number,
    name: string,
    payment_system: number,
    other: string | null,
    active: boolean,
}

export const productCategoryApi = createApi({
    reducerPath: 'productCategoryApi',
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
    tagTypes: ['ProductCategory'],
    endpoints: (build) => ({
        getProductCategories: build.query<IProductCategoriesData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/product-categories/',
                params: params,
            }),
            providesTags: ['ProductCategory']
        }),
        getProductCategory: build.query<IProductCategoriesData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/product-categories/',
                params: params
            }),
            providesTags: ['ProductCategory']
        }),        
        addProductCategory: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/product-categories/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['ProductCategory'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateProductCategory: build.mutation<void, Partial<IProductCategoriesData> & Pick<IProductCategoriesData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/product-categories/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['ProductCategory'],
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
    useGetProductCategoriesQuery,
    useGetProductCategoryQuery,
    useAddProductCategoryMutation,
    useUpdateProductCategoryMutation
} = productCategoryApi;
