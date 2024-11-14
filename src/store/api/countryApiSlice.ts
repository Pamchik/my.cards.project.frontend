import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface ICountryNames {
    id: number,
    short_name: string,
    name_eng: string,
    name_rus: string,
    active: boolean,
    other: string | null,   
}

export const countryApi = createApi({
    reducerPath: 'countryApi',
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
    tagTypes: ['Country'],
    endpoints: (build) => ({
        getCountries: build.query<ICountryNames[], void>({
            query: () => ({
                url: '/api/countries/',
            }),
            providesTags: ['Country']
        }),
        getCountry: build.query<ICountryNames[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/countries/',
                params: params
            }),
            providesTags: ['Country']
        }),
        addCountry: build.mutation<void, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/countries/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['Country'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateCountry: build.mutation<void, Partial<ICountryNames> & Pick<ICountryNames, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/countries/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['Country'],
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
    useGetCountriesQuery,
    useGetCountryQuery,
    useAddCountryMutation,
    useUpdateCountryMutation,
} = countryApi;
