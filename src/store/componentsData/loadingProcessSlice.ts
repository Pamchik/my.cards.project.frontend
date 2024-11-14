import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface IGetLoadingData {
    status: boolean,
    isSuccessful?: boolean, 
    fields: string[]
}

export interface ILoadingProcess {
    [name: string]: {
        status: boolean,
        isSuccessful?: boolean,         
    }
}

export interface IComponentLoadingProcess {
    [componentName: string]: ILoadingProcess
}

const initialState: IComponentLoadingProcess = {}

export const loadingProcessSlice = createSlice({
    name: 'loadingProcess',
    initialState,
    reducers: {
        setLoadingStatus: (state, action: PayloadAction<{componentName: string, data: IGetLoadingData}>) => {
            const existingItem = state[action.payload.componentName];
            if (existingItem) {
                if (action.payload.data.status) {
                    action.payload.data.fields.forEach((item) => {
                        state[action.payload.componentName][item] = {
                            status: true,
                            isSuccessful: undefined
                        }
                    })
                } else {
                    action.payload.data.fields.forEach((item) => {
                        state[action.payload.componentName][item] = {
                            status: false,
                            isSuccessful: action.payload.data.isSuccessful
                        }
                    })
                }
            } else {
                const data: ILoadingProcess = {}
                if (action.payload.data.status) {
                    action.payload.data.fields.forEach((item) => {
                        data[item] = {
                            status: true,
                            isSuccessful: undefined
                        }
                    })
                } else {
                    action.payload.data.fields.forEach((item) => {
                        data[item] = {
                            status: false,
                            isSuccessful: action.payload.data.isSuccessful
                        }
                    })
                }
                state[action.payload.componentName] = data
            }
        },
        resetLoadingComponent: (state, action: PayloadAction<{componentName: string}>) => {
            const existingItem = state[action.payload.componentName];
            if (existingItem) {
                delete state[action.payload.componentName]
            }
        }
    }
})

export const { setLoadingStatus, resetLoadingComponent } = loadingProcessSlice.actions
export default loadingProcessSlice.reducer