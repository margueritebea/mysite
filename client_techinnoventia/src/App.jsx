import './App.css'
import Test from "./Test"

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './pages/home/Home'
import About from './pages/home/About'
import LoginForm from './pages/auth/LoginForm'
import RegisterForm from './pages/auth/RegisterForm'
import EmailVerification from './pages/auth/EmailVerification'
import PasswordReset from './pages/auth/PasswordReset'
import UserProfile from './pages/profile/UserProfile'
import RoleManagement from './pages/admin/RoleManagement'

import PublicLayout from './layouts/PublicLayout'
import AuthLayout from './layouts/AuthLayout'
import PrivateLayout from './layouts/PrivateLayout'
import Navbar from './components/Navbar'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages (avec Navbar) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Route>

        {/* Auth pages (sans Navbar) */}
        <Route element={<AuthLayout/>} >
          <Route path="/login" element={<LoginForm/>} />
          <Route path="/register" element={<RegisterForm/>} />
          <Route path="/verify-email" element={<EmailVerification/>} />
          <Route path="/password-reset" element={<PasswordReset/>} />
        </Route>

        {/* Private pages (avec Navbar et authentification) */}
        <Route element={<PrivateLayout/>} >
          <Route path="/profile" element={<UserProfile/>} />
          <Route path="/admin/roles" element={<RoleManagement/>} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App



// nhdksjk
