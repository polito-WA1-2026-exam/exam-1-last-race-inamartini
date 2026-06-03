import {useState} from 'react'
import {login} from '../api/auth.js'

function LoginForm({ onLogin, navigate }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError]       = useState('')
    const [loading, setLoading] = useState(false)

    // runs when the form is submitted
    const handleSubmit = async (e) => {
        e.preventDefault() // prevent default browser submission
        setError('')
        setLoading(true)
        try {
            const user = await login(username, password) // calls login from auth.js
            onLogin(user) // success: update parents state
            navigate('/') // navigate to home page
        } catch {
            setError('Invalid username or password.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Welcome back</h2>
            {error && <p className="error">{error}</p>}
            <label>Username
                <input value={username} onChange={e => setUsername(e.target.value)} required />
            </label>
            <label>Password
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </label>
            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
            </button>
        </form>
    )
}

export {LoginForm}
