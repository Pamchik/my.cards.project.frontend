import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { funcGetConfigDataFromLocalStorage } from '../../components/functions/funcGetConfigDataFromLocalStorage';
import { IFieldData } from '../componentsData/componentsDataSlice';
import Cookies from 'js-cookie';
import { changelogApi } from './changelogApiSlice';

export interface IProjectApiData {
    id: number,
    number: string | null,
    general_line_status: number,
    bank: number,
    vendor: number,
    bank_employee: number | null,
    vendor_employee: number | null,
    vendor_manufacture_country: number | null,
    product_type: number,
    payment_system: number,
    product_category: number | null,
    product_name: string,
    product_code: string | null,
    product_revision: string | null,
    product_qty_from_bank: number | null,
    product_qty_to_vendor: number | null,
    chip: number | null,
    applet: number | null,
    chip_color: number | null,
    mifare: number | null,
    mifare_access_key: number | null,
    antenna_size: number | null,
    material_type: number | null,
    material_color: number | null,
    magstripe_color: number | null,
    magstripe_tracks: number | null,
    lamination_face: number | null,
    lamination_back: number | null,
    product_effects: number[],
    bank_communication: string | null,
    vendor_communication: string | null,    
    general_comment: string | null,
    display_year: number | null,
    active: boolean,
    preview_image: string,
    isUrgent: boolean,
    isProject: boolean,
}

export interface IProjectTableApiData {
    id: number | null,
    number: string | null,
    preview_image: string,
    bank: string | null,
    bank_employee: string | null,
    vendor: string | null,
    vendor_employee: string | null,
    vendor_manufacture_country: string | null,
    product_type: string | null,
    payment_system: string | null,
    product_category: string | null,
    product_name: string | null,
    product_full_name: string | null,
    chip_full_name: string | null,
    chip: string | null,
    applet: string | null,
    chip_color: string | null,
    mifare: string | null,
    antenna_size: string | null,
    magstripe_tracks: string | null,
    magstripe_color: string | null,
    material_type: string | null,
    material_color: string | null,
    lamination_face: string | null,
    lamination_back: string | null,
    product_effects_common: string[],
    product_effects: string[],
    product_effects_qty: string | null,
    product_code: string | null,
    product_revision: string | null,
    product_qty_from_bank: string | null,
    product_qty_to_vendor: string | null,
    general_line_status: string | null,
    general_comment: string | null,
    isUrgent: boolean,

    country: string | null, 

    created_date: string | null,    

    lead_time_vendor: string | null,
    deviation_vendor: string | null,
    lead_time_bank: string | null,
    deviation_bank: string | null,

    process_step_status_1: string | null,
    process_step_status_2: string | null,
    process_step_status_3: string | null,
    process_step_status_4: string | null,
    process_step_status_5: string | null,
    process_step_status_6: string | null,
    process_step_status_7: string | null,
    process_step_status_8: string | null,
    process_step_status_9: string | null,
    process_step_status_10: string | null,
    process_step_status_11: string | null,
    process_step_status_12: string | null,
    process_step_status_13: string | null,

    process_step_comment_1: string | null,
    process_step_comment_2: string | null,
    process_step_comment_3: string | null,
    process_step_comment_4: string | null,
    process_step_comment_5: string | null,
    process_step_comment_6: string | null,
    process_step_comment_7: string | null,
    process_step_comment_8: string | null,
    process_step_comment_9: string | null,
    process_step_comment_10: string | null,
    process_step_comment_11: string | null,
    process_step_comment_12: string | null,
    process_step_comment_13: string | null,

    unit_price_bank: string | null,
    unit_price_bank_additional: string | null,
    prepaid_percent_bank: string | null,
    postpaid_percent_bank: string | null,

    unit_price_vendor: string | null,
    unit_price_vendor_additional: string | null,
    prepaid_percent_vendor: string | null,
    postpaid_percent_vendor: string | null,
    // additional_vendor_cost: string | null,

    exchange_rates_bank: string | null,
    prepaid_value_bank: string | null,
    postpaid_value_bank: string | null,
    prepaid_value_vendor: string | null,
    postpaid_value_vendor: string | null,
    payment_plan_bank: string | null,
    additional_payment_plan_bank: string | null,
    payment_plan_vendor: string | null,
    additional_payment_plan_vendor: string | null,
    payment_fact_bank: string | null,
    payment_fact_vendor: string | null,

    payment_system_data: string | null,
    approval_date: string | null,

    month_plan: string | null,
    date_plan: string | null,
    date_client: string | null,
    date_fact: string | null,

    fact_qty_vendor: string | null,
    fact_qty_bank: string | null,
}

export interface IShortProjectTableApiData {
    id: number,
    number: string | null,
    bank: string,
    vendor: string,
    product_type: string,
    product_full_name: string,
    chip_full_name: string,
    display_year: number,
}

export const projectApi = createApi({
    reducerPath: 'projectApi',
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
    tagTypes: ['Project'],
    endpoints: (build) => ({
        getProjects: build.query<IProjectApiData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/projects/',
                params: params,
            }),
            providesTags: ['Project']
        }),
        getProject: build.query<IProjectApiData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/projects/',
                params: params
            }),
            providesTags: ['Project']
        }), 
        getProjectsTable: build.query<IProjectTableApiData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/projects-table/',
                params: params
            }),
            providesTags: ['Project']
        }),     
        getShortProjectsTable: build.query<IShortProjectTableApiData[], Record<string, number | string | undefined> | undefined>({
            query: (params: Record<string, number | string | undefined> | undefined) => ({
                url: '/api/projects-limited-info/',
                params: params
            }),
            providesTags: ['Project']
        }),     
        addProject: build.mutation<IProjectApiData, IFieldData>({
            query: (data: IFieldData) => ({
              url: '/api/projects/',
              method: 'POST',
              body: data
            }),
            invalidatesTags: ['Project'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateProject: build.mutation<void, Partial<IProjectApiData> & Pick<IProjectApiData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/projects/${id}/`,
              method: 'PATCH',
              body: data
            }),
            invalidatesTags: ['Project'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }),
        updateProjectWithoutReloading: build.mutation<void, Partial<IProjectApiData> & Pick<IProjectApiData, 'id'>>({
            query: ({ id, ...data }) => ({
              url: `/api/projects/${id}/`,
              method: 'PATCH',
              body: data
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                  await queryFulfilled;
                  dispatch(changelogApi.util.resetApiState());
                } catch (error) {}
              },
        }), 
        updateProjectWithFile: build.mutation<void, { file: File, data: IFieldData, id: number }>({
            query: ({ file, data, id }) => {
                const formData = new FormData();
                formData.append('preview_image', file);

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
                    url: `/api/projects/${id}/`,
                    method: 'PATCH',
                    body: formData,
                };
            },
            invalidatesTags: ['Project'],
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
    useGetProjectsQuery,
    useGetProjectQuery,
    useGetProjectsTableQuery,
    useGetShortProjectsTableQuery,
    useAddProjectMutation,
    useUpdateProjectMutation,
    useUpdateProjectWithoutReloadingMutation,
    useUpdateProjectWithFileMutation,
} = projectApi;
