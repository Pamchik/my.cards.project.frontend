import { createSlice } from '@reduxjs/toolkit'

const initialState: {
    id: string | null} = {id: null}

export const sessionIdSlice = createSlice({
    name: 'sessionId',
    initialState,
    reducers: {
        setSessionId: (state, action) => {
            state.id = action.payload.id;
        },
        removeSessionId: (state, action) => {
            state.id = null;
        },
    },
})

export const { setSessionId, removeSessionId } = sessionIdSlice.actions
export default sessionIdSlice.reducer