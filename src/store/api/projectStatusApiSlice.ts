import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import Cookies from 'js-cookie';

export interface IProjectStatus {
    id: number,
    name: string,
    active : boolean,
}

export const projectStatusApi = createApi({
    reducerPath: 'projectStatusApi',
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
        getProjectStatuses: build.query<IProjectStatus[], void>({
            query: () => ({
                url: '/api/general-project-statuses/',
            }),
        }) 
    })
})

export const {
    useGetProjectStatusesQuery,
} = projectStatusApi;
