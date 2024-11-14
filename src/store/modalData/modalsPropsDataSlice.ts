import { PayloadAction, createSlice } from '@reduxjs/toolkit' 
import { IFieldData } from '../componentsData/componentsDataSlice'

export interface IModalProps {
    objInputData?: IFieldData,
    objChangedData?: IFieldData,
    objReadOnlyFields?: string[],
    qtyFieldsForSavingBtn?: number
    other?: Record<string, any>
}


export interface IModalFieldData {
    [componentName: string]: IModalProps
}

const initialState: IModalFieldData = {}

export const modalsDataSlice = createSlice({
    name: 'modalsData',
    initialState,
    reducers: {
        setModalProps: (state, action: PayloadAction<{componentName: string, data: IModalProps}>) => {
            state[action.payload.componentName] = {
                objInputData: action.payload.data?.objInputData ? action.payload.data.objInputData : undefined,
                objChangedData: action.payload.data?.objChangedData ? action.payload.data.objChangedData : undefined,
                objReadOnlyFields: action.payload.data?.objReadOnlyFields ? action.payload.data.objReadOnlyFields : undefined,
                qtyFieldsForSavingBtn: action.payload.data?.qtyFieldsForSavingBtn ? action.payload.data.qtyFieldsForSavingBtn : undefined,
                other: action.payload.data?.other ? action.payload.data.other : undefined
            }
        },

        deleteModalProps: (state, action: PayloadAction<{componentName: string}>) => {
            const existingItem = state[action.payload.componentName];
            if (existingItem) {
                delete state[action.payload.componentName]
            }
        }
    }
})

export const { setModalProps, deleteModalProps } = modalsDataSlice.actions
export default modalsDataSlice.reducer