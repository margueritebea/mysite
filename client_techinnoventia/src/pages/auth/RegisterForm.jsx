import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from "react-router-dom"
import { authAPI } from '../../services/api'

const RegisterForm = () => {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showVerificationMessage, setShowVerificationMessage] = useState(false)

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            username: Yup.string()
                        .min(3, 'Au moins 3 caractères')
                        .max(20, 'Max 20 caractères')
                        .matches(/^[a-zA-Z0-9_]+$/, 'Lettres, chiffres et underscore uniquement')
                        .required("Nom d'utilisateur requis"),
            email: Yup.string()
                    .email('Email invalide')
                    .required('Email requis'),
            password: Yup.string()
                    .min(7, 'Min 7 caractères')
                    .matches(/[A-Z]/, 'Une majuscule est requise')
                    .matches(/[a-z]/, 'Une minuscule est requise')
                    .matches(/[0-9]/, 'Un chiffre est requis')
                    .matches(/[\W_]/, 'Un caractère spécial est requis')
                    .required('Mot de passe requis'),
            confirmPassword: Yup.string()
                    .oneOf([Yup.ref('password')], 'Les mots de passe doivent correspondre')
                    .required('Confirmation requise')
        }),
        onSubmit: async (values) => {
            setIsSubmitting(true)
            try {
                const payload = {
                    username: values.username,
                    email: values.email,
                    password: values.password
                }

                await authAPI.register(payload)
                setShowVerificationMessage(true)
                alert("Inscription réussie ! Vérifiez votre email pour activer votre compte.")
            } catch (error) {
                if (error.response?.data?.errors) {
                    const errorMessages = Object.values(error.response.data.errors).flat()
                    alert(`Erreur d'inscription: ${errorMessages.join(', ')}`)
                } else if (error.response?.data?.message) {
                    alert(`Erreur d'inscription: ${error.response.data.message}`)
                } else {
                    alert("Échec de l'inscription")
                }
                console.error(error)
            } finally {
                setIsSubmitting(false)
            }
        }
    })

    if (showVerificationMessage) {
        return (
            <div className="min-h-screen bg-blue-50 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="text-green-500 text-6xl mb-4">✓</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Inscription réussie !</h2>
                    <p className="text-gray-600 mb-6">
                        Un email de vérification a été envoyé à <strong>{formik.values.email}</strong>
                    </p>
                    <p className="text-gray-500 text-sm mb-6">
                        Cliquez sur le lien dans l'email pour activer votre compte.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-300 font-medium"
                    >
                        Aller à la connexion
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Créer un compte</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div>
        <label className="block text-gray-700 mb-2">Nom d'utilisateur</label>
        <input
        type="text"
        name="username"
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.username}
        />
        {formik.touched.username && formik.errors.username && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.username}</div>
        )}
        </div>

        <div>
        <label className="block text-gray-700 mb-2">Email</label>
        <input
        type="email"
        name="email"
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
        )}
        </div>

        <div>
        <label className="block text-gray-700 mb-2">Mot de passe</label>
        <input
        type="password"
        name="password"
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
        )}
        </div>

        <div>
        <label className="block text-gray-700 mb-2">Confirmer le mot de passe</label>
        <input
        type="password"
        name="confirmPassword"
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.confirmPassword}
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</div>
        )}
        </div>

        <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg transition duration-300 font-medium"
        >
        {isSubmitting ? 'Inscription en cours...' : "S'inscrire"}
        </button>
        </form>
        </div>
        </div>
    )
}

export default RegisterForm
