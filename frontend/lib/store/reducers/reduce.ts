import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../slices/auth'
import envReducer from '../slices/env'

const store = configureStore({
  reducer: {
    auth: authReducer,
    env: envReducer
  }
})

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;