import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ITableData {
    [name: string]: string
}

const initialState: ITableData = {}

export const tablesDataSlice = createSlice({
    name: 'tablesData',
    initialState,
    reducers: {
        setLocalStorageData(state, action: PayloadAction<{ tableName: string; params: string }>) {
            const { tableName, params } = action.payload;
            localStorage.setItem(tableName, params);
            state[tableName] = params
        },
        getLocalStorageData(state, action: PayloadAction<{tableName: string}>) {
            const params = localStorage.getItem(action.payload.tableName)
            if (params) {
                state[action.payload.tableName] = params
            }
        },
        removeLocalStorageData(state, action: PayloadAction<{ tableName: string }>) {
            const { tableName } = action.payload;
            localStorage.removeItem(tableName);
            delete state[tableName];
        }
    },
});

export const { setLocalStorageData, getLocalStorageData, removeLocalStorageData } = tablesDataSlice.actions;

export default tablesDataSlice.reducer;
