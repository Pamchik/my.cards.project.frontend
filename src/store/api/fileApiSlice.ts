import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IFiles {
    id: number,
    file: string,
    name: string,
    file_extension: string,
    process_step : number | null,
    number: number | null,
    created_date: string,
    status: number,
    file_type: string,
    active: boolean,
    model_type: string,
    created_by: string,
    received_from: string,
    other: string | null,
    folder_name: string,
    deleted: boolean
}

export interface IFilesTable {
    id: number,
    file: string,
    name: string,
    file_extension: string,
    process_step : string | null,
    number: number | null,
    created_date: string,
    status: string,
    file_type: string,
    active: boolean,
    model_type: string,
    created_by: string,
    received_from: string,
    other: string | null,
    folder_name: string,
    deleted: boolean
}


export const fileApi = createApi({
    reducerPath: 'fileApi',
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
    tagTypes: ['File'],
    endpoints: (build) => ({
        getFiles: build.query<IFiles[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/files/',
                params: params,
            }),
            providesTags: ['File']
        }),
        getFile: build.query<IFiles[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/files/',
                params: params
            }),
            providesTags: ['File']
        }),    
        getFilesTable: build.query<IFilesTable[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/files-table/',
                params: params,
            }),
            providesTags: ['File']
        }),    
        addFile: build.mutation<void, { file: File, data: IFieldData }>({
            query: ({file, data}) => {
                const formData = new FormData();
                formData.append('file', file);

                const fieldKeys: string[] = [];
                if (data && Object.keys(data).length > 0) {
                    fieldKeys.push(...Object.keys(data))
                }

                if (fieldKeys.length > 0 && data) {
                    for (let i = 0; i < fieldKeys.length; i++) {
                        const fieldValue: any = data[fieldKeys[i]]

                        if (fieldValue !== null && fieldValue !== undefined) {
                            if (Array.isArray(fieldValue) && fieldValue.length > 0) {
                                fieldValue.forEach((item: any) => {
                                    formData.append(fieldKeys[i], item);
                                });
                            } else {
                                formData.append(fieldKeys[i], fieldValue); 
                            }
                        }
                    }
                }
                
                return {
                    url: '/api/files/',
                    method: 'POST',
                    body: formData,
                  };
            },
            invalidatesTags: ['File'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateFile: build.mutation<void, Partial<IFieldData>>({
            query: ({...data }) => ({
                url: `/api/files/`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['File'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        openFile: build.mutation<void, Partial<IFieldData>>({
            query: ({...data }) => ({
                url: `/api/files/`,
                method: 'POST',
                body: data
            }),
        }),        
        deleteFile: build.mutation<void, {id: number}>({
            query: ({id}) => ({
                url: `/api/files/${id}/`,
                method: 'DELETE'
            }),
            invalidatesTags: ['File'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        addExistFile: build.mutation<void, Partial<IFieldData>>({
            query: ({...data}) => ({
                url: `/api/files/`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['File'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
    })
})

export const {
    useGetFilesQuery,
    useGetFileQuery,
    useGetFilesTableQuery,
    useAddFileMutation,
    useUpdateFileMutation,
    useDeleteFileMutation,
    useAddExistFileMutation,
    useOpenFileMutation
} = fileApi;
