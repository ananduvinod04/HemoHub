import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'


export default function Navbar(){
const { user, logout } = useAuthStore()
return (
<nav className="bg-white shadow">
<div className="container mx-auto flex items-center justify-between p-4">
<Link to="/" className="font-bold text-lg">HemoHub</Link>
<div className="flex items-center gap-4">
{user ? (
<>
<span>{user.name}</span>
<button onClick={logout} className="py-1 px-3 rounded border">Logout</button>
</>
) : (
<Link to="/login" className="py-1 px-3 rounded border">Login</Link>
)}
</div>
</div>
</nav>
)
}