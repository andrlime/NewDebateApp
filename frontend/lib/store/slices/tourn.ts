import { createSlice } from '@reduxjs/toolkit'

export const tournSlice = createSlice({
  name: '_TOURN',
  initialState: {
    tournamentName: "SET MANUALLY",
    padding: 100
  },
  reducers: {
    setTName: (state, payload) => {
      state.tournamentName = payload.payload;
    },
    setPadding: (state, payload) => {
      state.padding = payload.payload;
    }
  }
})

export const { setTName, setPadding } = tournSlice.actions

export default tournSlice.reducer
