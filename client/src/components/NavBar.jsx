import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../api/auth.js'
import profile from "../assets/profile.png"
import metro from "../assets/metro_icon.png"

function NavBar({ user, onLogout }) {
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        onLogout()
        navigate('/')
    }

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand"> <img
                src={metro}
                alt="Metro icon"
                className="metro-icon"
            />
                Last Race</Link>
            <div className="navbar-links">
                <Link to="/instructions">Game Instructions</Link>
                {user.id ? (
                    <>
                        <Link to="/ranking">Ranking</Link>
                        <div className="profile-group">
                            <img
                                src={profile}
                                alt="Profile icon"
                                className="profile-icon"
                            />
                            <span className="navbar-user">{user.username}</span>
                        </div>
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