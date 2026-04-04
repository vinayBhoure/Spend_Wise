import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { checkSession, setSession } from './store/slices/authSlice'
import { supabase } from './lib/supabase'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import ScrollToTop from './components/layout/ScrollToTop'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Onboarding from './pages/Onboarding'
import Auth from './pages/Auth'
import OTPVerification from './pages/OTPVerification'
import EmailVerification from './pages/EmailVerification'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import AddAccount from './pages/AddAccount'
import SetupCurrency from './pages/SetupCurrency'
import SetupAccount from './pages/SetupAccount'
import { Dashboard } from './pages/Dashboard'
import Transactions from './pages/Transactions'
import AddTransaction from './pages/AddTransaction'
import EditTransaction from './pages/EditTransaction'
import TransferFunds from './pages/TransferFunds'
import Statistics from './pages/Statistics'
import Settings from './pages/Settings'
import Accounts from './pages/Accounts'
import EditAccount from './pages/EditAccount'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import DeleteConfirmation from './pages/DeleteConfirmation'
import Plans from './pages/Plans'
import { ManageCategories } from './pages/ManageCategories'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Initial session check
    dispatch(checkSession())

    // Listen to Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session))
    })

    return () => subscription.unsubscribe()
  }, [dispatch])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <ToastContainer position="top-center" autoClose={3000} theme="dark" />
      <div className='max-w-[430px] mx-auto'>
        <Routes>
          {/* Public Routes */}
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/otp" element={<OTPVerification />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/setup-currency" element={<SetupCurrency />} />
          <Route path="/setup-account" element={<SetupAccount />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-account" element={<AddAccount />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/add-transaction" element={<AddTransaction />} />
            <Route path="/edit-transaction/:id" element={<EditTransaction />} />
            <Route path="/transfer" element={<TransferFunds />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/edit-account/:id" element={<EditAccount />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/delete-confirmation" element={<DeleteConfirmation />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/manage-categories" element={<ManageCategories />} />
          </Route>

          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
