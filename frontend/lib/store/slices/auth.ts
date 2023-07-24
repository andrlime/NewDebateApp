import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: '_AUTH',
  initialState: {
    login: false,
    name: "NOT LOGGED IN",
    email: "NOT LOGGED IN",
    perm: 2,
  },
  reducers: {
    login: state => {
      state.login = true;
    },
    logout: state => {
      state.login = false;
    },
    setName: (state, payload) => {
      state.name = payload.payload
    },
    setEmail: (state, payload) => {
      state.email = payload.payload
    },
  }
})

export const { login, logout } = authSlice.actions

export default authSlice.reducer
