import { createSlice } from '@reduxjs/toolkit'

export const envSlice = createSlice({
  name: '_AUTH',
  initialState: {
    dev: false,
    backendUrl: "localhost:9093"
  },
  reducers: {
    changeBackendUrl: (state, payload) => state.backendUrl = payload.payload
  }
})

export const { changeBackendUrl } = envSlice.actions

export default envSlice.reducer
