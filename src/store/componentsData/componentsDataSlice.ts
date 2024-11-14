import { PayloadAction, createSlice } from '@reduxjs/toolkit' 

export type IInputValue = string | number | null
export type ITextareaValue = string | null
export type ISelectValue = number | null
export type ICheckValue = boolean
export type ITotalValue = IInputValue | ITextareaValue | ISelectValue | ICheckValue | any[] 

export interface IFieldData {
    [name: string]: ITotalValue
}

export interface IComponentFieldData {
    [componentName: string]: {
        objInputData: IFieldData,
        objInputAndChangedData: IFieldData,
        objChangedData: IFieldData,
    }
}

const initialState: IComponentFieldData = {}

export const componentsDataSlice = createSlice({
    name: 'componentsData',
    initialState,
    reducers: {
        setInputData: (state, action: PayloadAction<{componentName: string, data: IFieldData}> ) => {
            const existingItem = state[action.payload.componentName];
            if (existingItem) {
                state[action.payload.componentName].objInputData = action.payload.data
                state[action.payload.componentName].objInputAndChangedData = action.payload.data
            } else {
                state[action.payload.componentName] = {
                    objInputData: {...action.payload.data},
                    objInputAndChangedData: {...action.payload.data},
                    objChangedData: {}
                }
            }
        },
        setChangedData: (state, action: PayloadAction<{componentName: string, data: IFieldData}>) => {
            const existingItem = state[action.payload.componentName];
            if (existingItem) {
                state[action.payload.componentName].objInputAndChangedData = action.payload.data
                state[action.payload.componentName].objChangedData = action.payload.data
            } else {
                state[action.payload.componentName] = {
                    objInputData: {},
                    objInputAndChangedData: {...action.payload.data},
                    objChangedData: {...action.payload.data}
                }
            }
        },
        changeInputAndChangedData: (state, action: PayloadAction<{componentName: string, data: IFieldData}>) => {
            const existingItem = state[action.payload.componentName];
            if (existingItem) {
                const objKey = Object.keys(action.payload.data)[0]
                const objValue = action.payload.data[objKey]
                state[action.payload.componentName].objInputAndChangedData[objKey] = objValue
                state[action.payload.componentName].objChangedData[objKey] = objValue
            } else {
                state[action.payload.componentName] = {
                    objInputData: {},
                    objInputAndChangedData: {...action.payload.data},
                    objChangedData: {...action.payload.data}
                }
            }
        },
        deleteAllComponentData: (state, action: PayloadAction<{componentName: string}>) => {
            const existingItem = state[action.payload.componentName];
            if (existingItem) {
                state[action.payload.componentName] = {
                    objInputData: {},
                    objInputAndChangedData: {},
                    objChangedData: {}
                }
            }
        },
        deleteChangedComponentData: (state, action: PayloadAction<{componentName: string}>) => {
            const existingItem = state[action.payload.componentName];
            if (existingItem) {
                state[action.payload.componentName].objChangedData = {}
                state[action.payload.componentName].objInputAndChangedData = state[action.payload.componentName].objInputData
            }
        },
        resetAllComponentDataComponent: (state, action: PayloadAction<{componentName: string}>) => {
            const existingItem = state[action.payload.componentName];
            if (existingItem) {
                delete state[action.payload.componentName]
            }
        }
    }
})

export const { setInputData, setChangedData, changeInputAndChangedData, deleteAllComponentData, deleteChangedComponentData, resetAllComponentDataComponent } = componentsDataSlice.actions
export default componentsDataSlice.reducer