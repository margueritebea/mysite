import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'

const RegisterForm = () => {
    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            username: Yup.string()
                        .min(4, 'Au moins 4 caractères')
                        .max(20, 'Max 20 caractères')
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
            try {
                const payload = {
                    username: values.username,
                    email: values.email,
                    password: values.password
                }

                const res = await axios.post('http://127.0.0.1:8000/api/auth/register/', payload)
                alert("Inscription réussie ! Connectez-vous.")
                // Tu peux aussi rediriger automatiquement ici
            } catch (error) {
                alert("Échec de l'inscription")
                console.error(error)
            }
        }
    })

    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-primary mb-6">Créer un compte</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div>
        <label className="block text-gray-700">Nom d'utilisateur</label>
        <input
        type="text"
        name="username"
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:outline-none"
        onChange={formik.handleChange}
        value={formik.values.username}
        />
        {formik.errors.username && <div className="text-red-500 text-sm">{formik.errors.username}</div>}
        </div>

        <div>
        <label className="block text-gray-700">Email</label>
        <input
        type="email"
        name="email"
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:outline-none"
        onChange={formik.handleChange}
        value={formik.values.email}
        />
        {formik.errors.email && <div className="text-red-500 text-sm">{formik.errors.email}</div>}
        </div>

        <div>
        <label className="block text-gray-700">Mot de passe</label>
        <input
        type="password"
        name="password"
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:outline-none"
        onChange={formik.handleChange}
        value={formik.values.password}
        />
        {formik.errors.password && <div className="text-red-500 text-sm">{formik.errors.password}</div>}
        </div>

        <div>
        <label className="block text-gray-700">Confirmer le mot de passe</label>
        <input
        type="password"
        name="confirmPassword"
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:outline-none"
        onChange={formik.handleChange}
        value={formik.values.confirmPassword}
        />
        {formik.errors.confirmPassword && <div className="text-red-500 text-sm">{formik.errors.confirmPassword}</div>}
        </div>

        <button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-100 hover:border hover:border-green-600 text-green py-2 rounded-lg transition duration-300"
        >
        S'inscrire
        </button>
        </form>
        </div>
        </div>
    )
}

export default RegisterForm
