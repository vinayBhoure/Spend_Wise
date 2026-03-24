import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import dashboardReducer from './slices/dashboardSlice'
import transactionsReducer from './slices/transactionsSlice'
import editTransactionReducer from './slices/editTransactionSlice'
import addTransactionReducer from './slices/addTransactionSlice'
import transferFundsReducer from './slices/transferFundsSlice'
import profileReducer from './slices/profileSlice'
import accountsReducer from './slices/accountsSlice'
import categoriesReducer from './slices/categoriesSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    transactions: transactionsReducer,
    editTransaction: editTransactionReducer,
    addTransaction: addTransactionReducer,
    transferFunds: transferFundsReducer,
    profile: profileReducer,
    accounts: accountsReducer,
    categories: categoriesReducer,
  },
})

// Optional: Type support or common state hooks if this was TS
// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch
