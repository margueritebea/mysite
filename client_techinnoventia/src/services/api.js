import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000/api'

// Create axios instance with base configuration
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const refreshToken = localStorage.getItem('refresh_token')
                if (refreshToken) {
                    const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
                        refresh: refreshToken
                    })
                    
                    localStorage.setItem('access_token', response.data.access)
                    originalRequest.headers.Authorization = `Bearer ${response.data.access}`
                    
                    return api(originalRequest)
                }
            } catch (refreshError) {
                // Refresh token expired, redirect to login
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
                localStorage.removeItem('user')
                window.location.href = '/login'
            }
        }

        return Promise.reject(error)
    }
)

// Auth API calls
export const authAPI = {
    // Login
    login: (credentials) => api.post('/auth/login/', credentials),
    
    // Register
    register: (userData) => api.post('/auth/register/', userData),
    
    // Email verification
    verifyEmail: (uid, token) => api.post('/auth/verify-email/', { uid, token }),
    resendVerification: (email) => api.post('/auth/verify-email/resend/', { email }),
    
    // Password reset
    requestPasswordReset: (email) => api.post('/auth/password-reset/', { email }),
    confirmPasswordReset: (uid, token, newPassword) => 
        api.post('/auth/password-reset/confirm/', { uid, token, new_password: newPassword }),
    
    // Token refresh
    refreshToken: (refreshToken) => api.post('/auth/token/refresh/', { refresh: refreshToken }),
    
    // Logout (blacklist refresh token)
    logout: (refreshToken) => api.post('/auth/logout/', { refresh: refreshToken }),
}

// User API calls
export const userAPI = {
    // Get user profile
    getProfile: () => api.get('/auth/profil/'),
    
    // Update user profile
    updateProfile: (profileData) => api.put('/auth/profil/', profileData),
    
    // Get users list (admin only)
    getUsersList: () => api.get('/auth/user-list/'),
}

// Role management API calls (superadmin only)
export const roleAPI = {
    // Get all users with roles
    getUsersWithRoles: () => api.get('/auth/roles/'),
    
    // Assign role to user
    assignRole: (userId, newRole) => api.post('/auth/roles/', { user_id: userId, new_role: newRole }),
    
    // Update user role
    updateUserRole: (userId, role) => api.put(`/auth/roles/${userId}/`, { role }),
}

// Utility functions
export const authUtils = {
    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('access_token')
    },
    
    // Get current user data
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user')
        return userStr ? JSON.parse(userStr) : null
    },
    
    // Check if user has specific role
    hasRole: (role) => {
        const user = authUtils.getCurrentUser()
        return user?.profil?.role === role
    },
    
    // Check if user has any of the specified roles
    hasAnyRole: (roles) => {
        const user = authUtils.getCurrentUser()
        return roles.includes(user?.profil?.role)
    },
    
    // Logout user
    logout: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
    },
}

export default api
