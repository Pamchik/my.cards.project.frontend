import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const initialState: string[] = []

export const componentsAPIUpdateSlice = createSlice({
    name: 'componentsAPIUpdate',
    initialState,
    reducers: {
        setComponentsAPIUpdate: (state, action: PayloadAction<string[]>) => {
            const uniqueValues = Array.from(new Set([...state, ...action.payload]))
            return uniqueValues
        },
        deleteComponentsAPIUpdate: (state, action: PayloadAction<string[]>) => {
            return state.filter(item => !action.payload.includes(item))
        }
    }
})

export const { setComponentsAPIUpdate, deleteComponentsAPIUpdate } = componentsAPIUpdateSlice.actions
export default componentsAPIUpdateSlice.reducer