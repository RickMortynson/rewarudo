import { combineReducers, configureStore } from '@reduxjs/toolkit'
import UserSlice from './reducers/UserSlice'

const rootReducer = combineReducers({
  UserSlice
})

export const store = configureStore({
  reducer: rootReducer
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
