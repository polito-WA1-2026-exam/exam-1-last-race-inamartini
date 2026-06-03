import { Link, useNavigate } from 'react-router'
import { logout } from '../api/auth.js'
import profile from "../assets/profile.png"
import metro from "../assets/metro_icon.png"

function NavBar({ user, onLogout }) {
    const navigate = useNavigate()

    // calls lougout() from auth.js to destroy the session on the server
    const handleLogout = async () => {
        await logout()
        onLogout() // clear the user state
        navigate('/') // go to home page
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
                {user.id ? ( // only shown if logged in
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
                ) : ( // shown if the user is logged out
                    <Link to="/login" className="btn btn-primary">Login</Link>
                )}
            </div>
        </nav>
    )
}

export default NavBar