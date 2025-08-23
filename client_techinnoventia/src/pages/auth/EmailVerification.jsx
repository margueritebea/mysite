import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api'

const EmailVerification = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [status, setStatus] = useState('verifying') // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('')

    useEffect(() => {
        const verifyEmail = async () => {
            const uid = searchParams.get('uid')
            const token = searchParams.get('token')

            if (!uid || !token) {
                setStatus('error')
                setMessage('Lien de vérification invalide')
                return
            }

            try {
                await authAPI.verifyEmail(uid, token)
                setStatus('success')
                setMessage('Email vérifié avec succès ! Votre compte est maintenant actif.')
            } catch (error) {
                setStatus('error')
                if (error.response?.data?.detail) {
                    setMessage(error.response.data.detail)
                } else {
                    setMessage('Erreur lors de la vérification de l\'email')
                }
            }
        }

        verifyEmail()
    }, [searchParams])

    const renderContent = () => {
        switch (status) {
            case 'verifying':
                return (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Vérification en cours...</h2>
                        <p className="text-gray-600">Veuillez patienter pendant que nous vérifions votre email.</p>
                    </div>
                )
            
            case 'success':
                return (
                    <div className="text-center">
                        <div className="text-green-500 text-6xl mb-4">✓</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Email vérifié !</h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-300 font-medium"
                        >
                            Se connecter
                        </button>
                    </div>
                )
            
            case 'error':
                return (
                    <div className="text-center">
                        <div className="text-red-500 text-6xl mb-4">✗</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Erreur de vérification</h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-300 font-medium"
                            >
                                Aller à la connexion
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition duration-300 font-medium"
                            >
                                Créer un nouveau compte
                            </button>
                        </div>
                    </div>
                )
            
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                {renderContent()}
            </div>
        </div>
    )
}

export default EmailVerification
