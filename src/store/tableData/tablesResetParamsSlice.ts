import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IResetTableTimes {
    resetTableAllParamsTimeStamp?: number | undefined,
    resetTableFiltersTimeStamp?: number | undefined
}

interface ResetTableTime {
    [name: string]: IResetTableTimes
}

const initialState: ResetTableTime = {}

const keyMap: Record<string, string> = {
    allParams: 'AllParams',
    filters: 'Filters',
};

export const tablesResetParamsSlice = createSlice({
    name: 'tablesResetParams',
    initialState,
    reducers: {
        setResetTableParams(state, action: PayloadAction<{ type: 'allParams' | 'filters'; tableName: string }>) {
            const { type, tableName } = action.payload;
            const resetTypeKey = `resetTable${keyMap[type]}TimeStamp` as keyof IResetTableTimes;
            if (!state[tableName]) {
                state[tableName] = {};
            }
            state[tableName][resetTypeKey] = Date.now();
        },
        deleteResetTableParams(state, action: PayloadAction<{ type: 'allParams' | 'filters'; tableName: string }>) {
            const { type, tableName } = action.payload;
            const resetTypeKey = `resetTable${keyMap[type]}TimeStamp` as keyof IResetTableTimes;

            const existingItem = state[tableName][resetTypeKey];

            if (existingItem) {
                delete state[tableName][resetTypeKey];
            }
        },
    },
});

export const {setResetTableParams, deleteResetTableParams} = tablesResetParamsSlice.actions;

export default tablesResetParamsSlice.reducer;
