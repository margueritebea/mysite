import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useNavigate } from "react-router-dom"

const LoginForm = () => {
    const navigate = useNavigate()
    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .min(5, 'username be at least 5 characters long')
                .matches(/[a-z]/, 'the name must contain at least one lower case letter')
                .max(20, 'The name may not exceed 20 characters')
                .matches(/^[a-zA-Z0-9_]+$/, 'The name may only contain letters, numerals and underscores')
                .matches(/[0-9]/, 'The name must contain at least one digit')
                .required('Required name'),
            password: Yup.string()
                .min(7, 'must be at least 7 characters long')
                .max(30, 'Le mot de passe ne peut pas dépasser 30 caractères')
                .matches(/[a-z]/, 'the password must contain at least one lower case letter')
                .matches(/[A-Z]/, 'the password must contain at least one upper case letter')
                .matches(/[0-9]/, 'The password must contain at least one digit')
                .matches(/[\W_]/, 'The password must contain at least one special character')
                .required('Password required'),
        }),
        onSubmit: async (values) => {
            try {
                const res = await axios.post('http://127.0.0.1:8000/api/auth/token/', values)
                localStorage.setItem('access', res.data.access)
                localStorage.setItem('refresh', res.data.refresh)
                alert('Successful connection !')
                // rediriger vers le tableau de bord, profil, etc.
                navigate("/")
            } catch (error) {
                alert("Échec de connexion")
                console.error(error)
            }
        }
    })

    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-center bg-primary-red mb-6">Connexion</h2>
                <form onSubmit={formik.handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-700">Username</label>
                        <input
                        type="text"
                        name="username"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        onChange={formik.handleChange}
                        value={formik.values.username}
                        />
                        {formik.errors.username && <div className="text-red-500 text-sm">{formik.errors.username}</div>}
                    </div>

                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input
                        type="password"
                        name="password"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        />
                        {formik.errors.password && <div className="text-red-500 text-sm">{formik.errors.password}</div>}
                    </div>

                    <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-100 hover:border hover:border-green-600 text-green py-2 rounded-lg transition duration-300"
                    >
                        Se connecter
                    </button>
                </form>
            </div>
        </div>
    )

}

export default LoginForm
