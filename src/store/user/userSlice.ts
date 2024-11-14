import { createSlice } from '@reduxjs/toolkit'

export interface IUserData {
    username: string | null,
    email: string | null,
    active: boolean,
    role: string | null, 
    isCkecked: boolean  
}

const initialState: IUserData | null = {
    username: null,
    email: null,
    active: false,
    role: null, 
    isCkecked: false,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.active = action.payload.active;
            state.role = action.payload.role;
            state.isCkecked = true
        },
        removeUser: (state, action) => {
            state.username = null;
            state.email = null;
            state.active = false;
            state.role = null;
            state.isCkecked = true
        },
    },
})

export const { setUser, removeUser } = userSlice.actions
export default userSlice.reducer