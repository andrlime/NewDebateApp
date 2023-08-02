import { createSlice } from '@reduxjs/toolkit'

export const tournSlice = createSlice({
  name: '_TOURN',
  initialState: {
    tournamentName: "SET MANUALLY"
  },
  reducers: {
    setTName: (state, payload) => {
      state.tournamentName = payload.payload;
    }
  }
})

export const { setTName } = tournSlice.actions

export default tournSlice.reducer
