import { UpdateStateAction } from './actions/userActions'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as nearConnect from '@near/connect'
type User = {
  id: string
  balance: string
  loggedIn: boolean
}

const initialState = {} as User

export const UserSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    UpdateState(state, action: PayloadAction<UpdateStateAction>) {
      action.payload.id && (state.id = action.payload.id)
      action.payload.balance && (state.balance = action.payload.balance)
      action.payload.loggedIn && (state.loggedIn = action.payload.loggedIn)
    },
    Logout(state) {
      state = {} as User
      nearConnect.logout()
    }
  }
})

export default UserSlice.reducer
