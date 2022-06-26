import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import * as nearConnect from '@/near/connect'

import { UpdateStateAction } from './actions/userActions'

type User = {
  id: string
  balance: string
  loggedIn: boolean
}

const initialState = {
  id: '',
  balance: '',
  loggedIn: false
} as User

export const UserSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    UpdateState(state, action: PayloadAction<UpdateStateAction>) {
      // none of these values is required, so set them in this way
      action.payload.id && (state.id = action.payload.id)
      action.payload.balance && (state.balance = action.payload.balance)
      action.payload.loggedIn && (state.loggedIn = action.payload.loggedIn)
    },

    Logout(state) {
      // eslint-disable-next-line
      state.id = initialState.id
      state.balance = initialState.balance
      state.loggedIn = false

      nearConnect.wallet.signOut()
      location.reload()
    }
  }
})

export default UserSlice.reducer
