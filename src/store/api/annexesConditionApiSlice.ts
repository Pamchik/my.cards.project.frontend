import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IAnnexesConditionData {
    id: number,
    deviation_min: number | null,
    deviation_max: number | null,
    lead_time_min: number | null,
    lead_time_max: number | null,
    line_number: number, 
    name: string | null
}

export const annexesConditionApi = createApi({
    reducerPath: 'annexesConditionApi',
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
    tagTypes: ['AnnexesCondition'],
    endpoints: (build) => ({
        getAnnexesCondition: build.query<IAnnexesConditionData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/annexes-additional-conditions/',
                params: params
            }),
            providesTags: ['AnnexesCondition']
        }),        
        addAnnexesCondition: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/annexes-additional-conditions/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['AnnexesCondition'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateAnnexesCondition: build.mutation<void, Partial<IAnnexesConditionData> & Pick<IAnnexesConditionData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/annexes-additional-conditions/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['AnnexesCondition'],
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
    useGetAnnexesConditionQuery,
    useAddAnnexesConditionMutation,
    useUpdateAnnexesConditionMutation,
} = annexesConditionApi;
