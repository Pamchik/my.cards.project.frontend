import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IProductionData {
    id: number,
    line_number: number,
    date_plan: string | null,
    date_client: string | null,
    date_fact: string | null,
    other: string | null,
}

export const productionDataApi = createApi({
    reducerPath: 'productionDataApi',
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
    tagTypes: ['ProductionData'],
    endpoints: (build) => ({
        getProductionData: build.query<IProductionData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/production-data/',
                params: params
            }),
            providesTags: ['ProductionData']
        }),        
        addProductionData: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/production-data/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['ProductionData'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateProductionData: build.mutation<void, Partial<IProductionData> & Pick<IProductionData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/production-data/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['ProductionData'],
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
    useGetProductionDataQuery,
    useAddProductionDataMutation,
    useUpdateProductionDataMutation,
} = productionDataApi;
