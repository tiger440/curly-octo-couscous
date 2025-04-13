import { combineReducers } from "@reduxjs/toolkit"
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import enterpriseForm from "./slices/enterpriseForm"
import auth from "./slices/auth"
const persistConfig = {
    key: 'hermes',
    storage,
    whitelist: ['auth']
}

const rootReducer = combineReducers({
    enterpriseForm: enterpriseForm,
    auth: auth
})

export const persistedReducer = persistReducer(persistConfig, rootReducer)



