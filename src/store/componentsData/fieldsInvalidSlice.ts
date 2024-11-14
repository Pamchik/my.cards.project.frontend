import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface IFieldInvalidStatus {
    [name: string]: {
        status: boolean,
        message: string | undefined
    }
}

export interface IInvalid {
    [componentName: string]: IFieldInvalidStatus
}

const initialState: IInvalid = {}

export const fieldsInvalidSlice = createSlice({
    name: 'fieldsInvalid',
    initialState,
    reducers: {
        setFieldInvalid: (state, action: PayloadAction<{componentName: string, data: IFieldInvalidStatus}>) => {
            const existingItem = state[action.payload.componentName];

            if (existingItem) {
                state[action.payload.componentName] = action.payload.data
            } else {
                state[action.payload.componentName] = action.payload.data
            }
        },
        deleteFieldInvalid: (state, action: PayloadAction<{componentName: string}>) => {
            const existingItem = state[action.payload.componentName];
            if (existingItem) {
                state[action.payload.componentName] = {}
            }
        },
        resetFieldInvalidComponent: (state, action: PayloadAction<{componentName: string}>) => {
            const existingItem = state[action.payload.componentName];
            if (existingItem) {
                delete state[action.payload.componentName]
            }
        }
    }
})

export const {setFieldInvalid, deleteFieldInvalid, resetFieldInvalidComponent} = fieldsInvalidSlice.actions
export default fieldsInvalidSlice.reducer