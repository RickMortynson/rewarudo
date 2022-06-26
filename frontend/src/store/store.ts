import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// eslint-disable-next-line
import UserSlice from './reducers/UserSlice'

// config for redux-persist
const persistConfig = {
  key: 'root',
  storage
}

// actual root reducer
const rootReducer = combineReducers({
  UserSlice
})

// wrapper around rootReducer to use localStorage
const persistedReducer = persistReducer(persistConfig, rootReducer)

// configure store with redux-persist' wrapper around rootReducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
