import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
    Bars3Icon,
    XMarkIcon,
    MagnifyingGlassIcon,
    UserIcon,
    PencilSquareIcon,
    ChevronDownIcon,
} from '@heroicons/react/24/outline'

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const navigate = useNavigate()

    // Simuler un utilisateur
    const user = { username: 'Jean' }

    const handleLogout = () => {
        console.log('Déconnexion')
        // navigate('/login')
    }

    return (
//         <header className="bg-primary/95 backdrop-blur-md text-white sticky top-0 z-50 shadow-sm">
        <header className="bg-gradient-to-r from-primary via-primary-dark to-accent text-white sticky top-0 z-50 shadow-sm backdrop-blur-md">

        <nav className="container mx-auto flex flex-wrap items-center justify-between px-4 sm:px-6 py-4 font-sans">
        {/* Logo */}
        <Link
        to="/"
        className="text-2xl font-extrabold tracking-tight hover:text-accent transition-colors"
        >
        TECH INNOVENTIA
        </Link>

        {/* Bouton burger mobile */}
        <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="text-white md:hidden focus:outline-none"
        aria-label="Toggle menu"
        >
        {menuOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
        </button>

        {/* Menu principal */}
        <div
        className={`w-full md:flex md:items-center md:justify-between md:w-auto ${
            menuOpen ? 'block mt-4' : 'hidden'
        } transition-all duration-300`}
        >
        <ul className="flex flex-col md:flex-row md:items-center md:gap-6 text-lg font-medium">
        {[
            { to: '/', label: 'Home' },
            { to: '/about', label: 'About' },
            { to: '/services', label: 'Services' },
            { to: '/contact', label: 'Contact' },
        ].map(({ to, label }) => (
            <li key={to}>
            <NavLink
            to={to}
            className={({ isActive }) =>
            `transition-colors duration-200 hover:text-accent ${
                isActive ? 'text-accent underline underline-offset-4' : ''
            }`
            }
            >
            {label}
            </NavLink>
            </li>
        ))}
        </ul>

        {/* Barre de recherche */}
        <div className="relative mt-4 md:mt-0 md:w-64">
        <input
        type="text"
        placeholder="Search..."
        className="w-full pl-10 pr-4 py-2 rounded-full bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
        aria-label="Search"
        />
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
        </div>

        {/* Auth ou profil */}
        <div className="mt-4 md:mt-0 flex flex-col gap-2 md:flex-row md:items-center md:gap-4 relative">
        {!user ? (
            <>
            <Link
            to="/login"
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-secondary hover:bg-secondary-light shadow-md transition duration-200"
            >
            <UserIcon className="w-5 h-5" />
            <span>Se connecter</span>
            </Link>
            <Link
            to="/register"
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-accent hover:bg-accent-dark text-white shadow-md transition duration-200"
            >
            <PencilSquareIcon className="w-5 h-5" />
            <span>S'inscrire</span>
            </Link>
            </>
        ) : (
            <div className="relative">
            <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-5 py-2 bg-secondary text-white rounded-full shadow-md hover:bg-secondary-light transition duration-200"
            aria-expanded={dropdownOpen}
            >
            @{user.username}
            <ChevronDownIcon className="w-4 h-4" />
            </button>

            {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg py-2 z-50">
                <Link
                to="/profile"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
                >
                Profil
                </Link>
                <button
                onClick={() => {
                    handleLogout()
                    setDropdownOpen(false)
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                Déconnexion
                </button>
                </div>
            )}
            </div>
        )}
        </div>
        </div>
        </nav>
        </header>
    )
}
