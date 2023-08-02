import { createSlice } from '@reduxjs/toolkit'

export const envSlice = createSlice({
  name: '_ENV',
  initialState: {
    dev: false,
    backendUrl: "http://localhost:3030"
  },
  reducers: {
    changeBackendUrl: (state, action) => {
      state.backendUrl = action.payload
    }
  }
})

export const { changeBackendUrl } = envSlice.actions

export default envSlice.reducer
