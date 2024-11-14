import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import Cookies from 'js-cookie';

export interface IFileFormat {
    id: number,
    name: string,
    file_extension: string,
    available_for_image_gallery: boolean,
    available_for_video_gallery: boolean,
    available_for_file_gallery: boolean,
}

export const fileFormatApi = createApi({
    reducerPath: 'fileFormatApi',
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
        getFileFormats: build.query<IFileFormat[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/files-formats/',
                params: params,
            }),
        }) 
    })
})

export const {
    useGetFileFormatsQuery,
} = fileFormatApi;