import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface ISavingProcess {
    status: boolean,
    isSuccessful?: boolean | undefined
    message?: string | Record<string, any>, 
}

export interface IComponentSavingProcess {
    [componentName: string]: ISavingProcess
}

const initialState: IComponentSavingProcess = {}

export const savingProcessSlice = createSlice({
    name: 'savingProcess',
    initialState,
    reducers: {
        setSavingStatus: (state, action: PayloadAction<{componentName: string, data: ISavingProcess}>) => {
            state[action.payload.componentName] = {
                status: action.payload.data.status,
                isSuccessful: action.payload.data.isSuccessful,
                message: action.payload.data.message
            }
        },
        resetSavingStatusComponent: (state, action: PayloadAction<{componentName: string}>) => {
            const existingItem = state[action.payload.componentName];
            if (existingItem) {
                delete state[action.payload.componentName]
            }
        }
    }
})

export const { setSavingStatus, resetSavingStatusComponent } = savingProcessSlice.actions
export default savingProcessSlice.reducer