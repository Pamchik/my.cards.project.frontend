import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import Cookies from 'js-cookie';

export interface IPaymentType {
    id: number,
    name: string,
    active : boolean,
}

export const paymentTypeApi = createApi({
    reducerPath: 'paymentTypeApi',
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
    endpoints: (build) => ({
        getPaymentTypes: build.query<IPaymentType[], void>({
            query: () => ({
                url: '/api/payment-types/',
            }),
        }) 
    })
})

export const {
    useGetPaymentTypesQuery,
} = paymentTypeApi;
