import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const initialState: string[] = []

export const modalsSlice = createSlice({
    name: 'modals',
    initialState,
    reducers: {
        setModalOpen: (state, action: PayloadAction<string>) => {
            const uniqueValues = Array.from(new Set([...state, action.payload]))
            return uniqueValues
        },
        setModalClose: (state, action: PayloadAction<string>) => {
            return state.filter(item => item !== action.payload)
        }
    }
})

export const { setModalOpen, setModalClose } = modalsSlice.actions
export default modalsSlice.reducer