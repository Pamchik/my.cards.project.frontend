import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import Cookies from 'js-cookie';

export interface IUserCheck {
    sessionid: string
}

export interface ILoginData {
    email: string, 
    password: string
}

export interface IChangePassword {
    sessionid: string,
    password: string,
    new_password: string,
    repeat_password: string
}

export const userApi = createApi({
    reducerPath: 'userApi',
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
        userCheck: build.query({
            query: (params: IUserCheck) => ({
                url: '/api/auth/user-check',
                params,
            })
        }),
        login: build.mutation({
            query: (body: ILoginData) => ({
                url: '/api/auth/login',
                method: 'POST',
                body,
            })
        }),
        changePassword: build.mutation({
            query: (body: IChangePassword) => ({
                url: '/api/auth/user-change-password',
                method: 'POST',
                body,
            })
        }),
    })
})

export const {
    useLazyUserCheckQuery, 
    useLoginMutation, 
    useChangePasswordMutation
} = userApi;