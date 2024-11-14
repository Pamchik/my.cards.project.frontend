import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IGalleries {
    id: number,
    file: string,
    name: string,
    file_extension: string,
    number: number | null,
    created_date: string,
    file_type: string,
    active: boolean,
    model_type: string,
    other: string | null,
    folder_name: string,
    preview_image: string,
    deleted: boolean
}

export const galleryApi = createApi({
    reducerPath: 'galleryApi',
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
    tagTypes: ['Gallery'],
    endpoints: (build) => ({
        getGalleries: build.query<IGalleries[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/galleries/',
                params: params,
            }),
            providesTags: ['Gallery']
        }),
        getGallery: build.query<IGalleries[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/galleries/',
                params: params
            }),
            providesTags: ['Gallery']
        }),   
        addGallery: build.mutation<void, { file: File, data: IFieldData }>({
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
                    url: '/api/galleries/',
                    method: 'POST',
                    body: formData,
                  };
            },
            invalidatesTags: ['Gallery'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateGallery: build.mutation<void, Partial<IFieldData>>({
            query: ({...data }) => ({
                url: `/api/galleries/`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Gallery'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        openGallery: build.mutation<void, Partial<IFieldData>>({
            query: ({...data }) => ({
                url: `/api/galleries/`,
                method: 'POST',
                body: data
            }),
        }),
        deleteGallery: build.mutation<void, {id: number}>({
            query: ({id}) => ({
                url: `/api/galleries/${id}/`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Gallery'],
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
    useGetGalleriesQuery,
    useGetGalleryQuery,
    useAddGalleryMutation,
    useUpdateGalleryMutation,
    useDeleteGalleryMutation,
    useOpenGalleryMutation
} = galleryApi;
