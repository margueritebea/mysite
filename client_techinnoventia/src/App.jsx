import './App.css'
import Test from "./Test"

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './pages/home/Home'
import About from './pages/home/About'
import LoginForm from './pages/auth/LoginForm'
import RegisterForm from './pages/auth/RegisterForm'

import PublicLayout from './layouts/PublicLayout'
import AuthLayout from './layouts/AuthLayout'
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
        </Route>
      </Routes>
    </Router>
  )
}

export default App



// nhdksjk
