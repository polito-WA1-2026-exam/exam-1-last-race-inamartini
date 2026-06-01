import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../api/auth.js'

function NavBar({ user, onLogout }) {
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        onLogout()
        navigate('/')
    }

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">🚇 Last Race</Link>
            <div className="navbar-links">
                <Link to="/instructions">Game Instructions</Link>
                {user.id ? (
                    <>
                        <Link to="/ranking">Ranking</Link>
                        <span className="navbar-user">{user.username}</span>
                        <Link to="/game" className="btn btn-primary">Play</Link>
                        <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <Link to="/login" className="btn btn-primary">Login</Link>
                )}
            </div>
        </nav>
    )
}

export default NavBar