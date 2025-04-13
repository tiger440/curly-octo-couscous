import { createSlice } from '@reduxjs/toolkit'

export interface formDataType {
    userData: any,
}

const initialState: formDataType = {
    userData: null,
}

export const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        addUser: (state, action) => {
            return {
                ...state,
                userData: { ...action.payload }
            }
        },
        logout: (state) => {
            return {
                ...state,
                userData: null
            }
        }
    },
})

export const { addUser, logout } = auth.actions
export default auth.reducer