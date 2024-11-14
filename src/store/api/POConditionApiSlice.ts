import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IPOConditionData {
    id: number,
    deviation_min: number | null,
    deviation_max: number | null,
    lead_time: number | null,
    line_number: number, 
    name: string | null
}

export const POConditionApi = createApi({
    reducerPath: 'POConditionApi',
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
    tagTypes: ['POCondition'],
    endpoints: (build) => ({
        getPOCondition: build.query<IPOConditionData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/PO-additional-conditions/',
                params: params
            }),
            providesTags: ['POCondition']
        }),        
        addPOCondition: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/PO-additional-conditions/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['POCondition'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updatePOCondition: build.mutation<void, Partial<IPOConditionData> & Pick<IPOConditionData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/PO-additional-conditions/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['POCondition'],
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
    useGetPOConditionQuery,
    useAddPOConditionMutation,
    useUpdatePOConditionMutation,
} = POConditionApi;
