import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from "react-router-dom"
import { authAPI, authUtils } from '../../services/api'

const LoginForm = () => {
    const navigate = useNavigate()
    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .min(3, 'Username must be at least 3 characters long')
                .max(20, 'Username may not exceed 20 characters')
                .required('Username is required'),
            password: Yup.string()
                .min(7, 'Password must be at least 7 characters long')
                .max(30, 'Password may not exceed 30 characters')
                .required('Password is required'),
        }),
        onSubmit: async (values) => {
            try {
                const res = await authAPI.login(values)
                
                // Store tokens and user data
                localStorage.setItem('access_token', res.data.access)
                localStorage.setItem('refresh_token', res.data.refresh)
                localStorage.setItem('user', JSON.stringify({
                    username: res.data.username,
                    email: res.data.email,
                    profil: res.data.profil
                }))
                
                alert('Connexion réussie !')
                navigate("/")
            } catch (error) {
                if (error.response?.data?.detail) {
                    alert(`Erreur de connexion: ${error.response.data.detail}`)
                } else {
                    alert("Échec de connexion")
                }
                console.error(error)
            }
        }
    })

    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Connexion</h2>
                <form onSubmit={formik.handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 mb-2">Nom d'utilisateur</label>
                        <input
                        type="text"
                        name="username"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                        />
                        {formik.touched.username && formik.errors.username && (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.username}</div>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Mot de passe</label>
                        <input
                        type="password"
                        name="password"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                        )}
                    </div>

                    <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-300 font-medium"
                    >
                        Se connecter
                    </button>
                    
                    <div className="text-center mt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/password-reset')}
                            className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                            Mot de passe oublié ?
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginForm
