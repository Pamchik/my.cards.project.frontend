import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface IComponentReadOnly {
    [componentName: string]: { status: boolean }
}

const initialState: IComponentReadOnly = {}

export const componentsReadOnlySlice = createSlice({
    name: 'componentsReadOnly',
    initialState,
    reducers: {
        setComponentReadOnly: (state, action: PayloadAction<{componentName: string}>) => {
            const existingItem = state[action.payload.componentName];
            if (existingItem) {
                state[action.payload.componentName].status = true
            } else {
                state[action.payload.componentName] = { status: true }
            }
        },
        changeComponentReadOnly: (state, action: PayloadAction<{componentName: string, newStatus: boolean}>) => {
            const existingItem = state[action.payload.componentName];
            if (existingItem) {
                state[action.payload.componentName].status = action.payload.newStatus
            } else {
                state[action.payload.componentName] = { status: true }
            }
        },
        resetReadOnlyComponent: (state, action: PayloadAction<{componentName: string}>) => {
            const existingItem = state[action.payload.componentName];
            if (existingItem) {
                delete state[action.payload.componentName]
            }
        }
    }
})

export const { setComponentReadOnly, changeComponentReadOnly, resetReadOnlyComponent } = componentsReadOnlySlice.actions
export default componentsReadOnlySlice.reducer