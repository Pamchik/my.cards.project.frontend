import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type IInputTypes = 'text' | 'number' | 'float' | 'date' | 'email' | 'phone' | 'password' | 'null' | 'folder'
export type ITextareaTypes = 'text' | 'null'
export type ISelectTypes = 'number' | 'null'
export type ICheckTypes = 'boolean'
export type ITotalTypes = IInputTypes | ITextareaTypes | ISelectTypes | ICheckTypes | 'array';

export interface IFieldParams {
    [name: string]: {
        isRequired: boolean, 
        type: ITotalTypes, 
        valueMinMax? :{  
            min?: number | undefined, 
            max?: number | undefined
        }
    }
}

export interface IComponentFieldParams {
    [componentName: string]: IFieldParams
}

const initialState: IComponentFieldParams = {}

export const fieldsParamsSlice = createSlice({
    name: 'fieldsParams',
    initialState,
    reducers: {
        setFieldParams: (state, action: PayloadAction<{componentName: string, data: IFieldParams}>) => {
            state[action.payload.componentName] = action.payload.data
        },
        resetFieldParamsComponent: (state, action: PayloadAction<{componentName: string}>) => {
            const existingItem = state[action.payload.componentName];
            if (existingItem) {
                delete state[action.payload.componentName]
            }
        }
    }
})

export const { setFieldParams, resetFieldParamsComponent } = fieldsParamsSlice.actions
export default fieldsParamsSlice.reducer