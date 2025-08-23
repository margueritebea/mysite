import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api'

const PasswordReset = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [step, setStep] = useState('request') // 'request' or 'confirm'
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    // Check if we have uid and token in URL (step 2)
    const uid = searchParams.get('uid')
    const token = searchParams.get('token')

    React.useEffect(() => {
        if (uid && token) {
            setStep('confirm')
        }
    }, [uid, token])

    const requestFormik = useFormik({
        initialValues: {
            email: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Email invalide')
                .required('Email requis')
        }),
        onSubmit: async (values) => {
            setIsSubmitting(true)
            try {
                await authAPI.requestPasswordReset(values.email)
                setShowSuccess(true)
            } catch (error) {
                if (error.response?.data?.detail) {
                    alert(error.response.data.detail)
                } else {
                    alert('Erreur lors de l\'envoi de l\'email de réinitialisation')
                }
            } finally {
                setIsSubmitting(false)
            }
        }
    })

    const confirmFormik = useFormik({
        initialValues: {
            new_password: '',
            confirm_password: ''
        },
        validationSchema: Yup.object({
            new_password: Yup.string()
                .min(7, 'Min 7 caractères')
                .matches(/[A-Z]/, 'Une majuscule est requise')
                .matches(/[a-z]/, 'Une minuscule est requise')
                .matches(/[0-9]/, 'Un chiffre est requis')
                .matches(/[\W_]/, 'Un caractère spécial est requis')
                .required('Nouveau mot de passe requis'),
            confirm_password: Yup.string()
                .oneOf([Yup.ref('new_password')], 'Les mots de passe doivent correspondre')
                .required('Confirmation requise')
        }),
        onSubmit: async (values) => {
            setIsSubmitting(true)
            try {
                await authAPI.confirmPasswordReset(uid, token, values.new_password)
                alert('Mot de passe réinitialisé avec succès !')
                navigate('/login')
            } catch (error) {
                if (error.response?.data?.detail) {
                    alert(error.response.data.detail)
                } else {
                    alert('Erreur lors de la réinitialisation du mot de passe')
                }
            } finally {
                setIsSubmitting(false)
            }
        }
    })

    if (showSuccess) {
        return (
            <div className="min-h-screen bg-blue-50 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="text-green-500 text-6xl mb-4">✓</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Email envoyé !</h2>
                    <p className="text-gray-600 mb-6">
                        Un email de réinitialisation a été envoyé à <strong>{requestFormik.values.email}</strong>
                    </p>
                    <p className="text-gray-500 text-sm mb-6">
                        Cliquez sur le lien dans l'email pour réinitialiser votre mot de passe.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-300 font-medium"
                    >
                        Retour à la connexion
                    </button>
                </div>
            </div>
        )
    }

    if (step === 'confirm') {
        return (
            <div className="min-h-screen bg-blue-50 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Nouveau mot de passe</h2>
                    <form onSubmit={confirmFormik.handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-gray-700 mb-2">Nouveau mot de passe</label>
                            <input
                                type="password"
                                name="new_password"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent"
                                onChange={confirmFormik.handleChange}
                                onBlur={confirmFormik.handleBlur}
                                value={confirmFormik.values.new_password}
                            />
                            {confirmFormik.touched.new_password && confirmFormik.errors.new_password && (
                                <div className="text-red-500 text-sm mt-1">{confirmFormik.errors.new_password}</div>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Confirmer le mot de passe</label>
                            <input
                                type="password"
                                name="confirm_password"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent"
                                onChange={confirmFormik.handleChange}
                                onBlur={confirmFormik.handleBlur}
                                value={confirmFormik.values.confirm_password}
                            />
                            {confirmFormik.touched.confirm_password && confirmFormik.errors.confirm_password && (
                                <div className="text-red-500 text-sm mt-1">{confirmFormik.errors.confirm_password}</div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg transition duration-300 font-medium"
                        >
                            {isSubmitting ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Réinitialiser le mot de passe</h2>
                <p className="text-gray-600 text-center mb-6">
                    Entrez votre adresse email pour recevoir un lien de réinitialisation.
                </p>
                <form onSubmit={requestFormik.handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent"
                            onChange={requestFormik.handleChange}
                            onBlur={requestFormik.handleBlur}
                            value={requestFormik.values.email}
                        />
                        {requestFormik.touched.email && requestFormik.errors.email && (
                            <div className="text-red-500 text-sm mt-1">{requestFormik.errors.email}</div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg transition duration-300 font-medium"
                    >
                        {isSubmitting ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default PasswordReset
