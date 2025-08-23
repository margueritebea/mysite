import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { authUtils } from '../services/api'

const PrivateLayout = () => {
  // Vérifier si l'utilisateur est authentifié
  if (!authUtils.isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default PrivateLayout
