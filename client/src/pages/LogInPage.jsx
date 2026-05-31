import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, createUser } from '../api/auth.js'


function LoginPage({ onLogin }) {
    const [view, setView] = useState('login')   // 'login' | 'register'
    const navigate = useNavigate()

    return (
        <div className="auth-container">
            <div className="auth-tabs">
                <button
                    className={view === 'login' ? 'tab active' : 'tab'}
                    onClick={() => setView('login')}
                >Login</button>
                <button
                    className={view === 'register' ? 'tab active' : 'tab'}
                    onClick={() => setView('register')}
                >Register</button>
            </div>

            {view === 'login'
                ? <LoginForm onLogin={onLogin} navigate={navigate} />
                : <RegisterForm onDone={() => setView('login')} />
            }
        </div>
    )
}

function LoginForm({ onLogin, navigate }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            const user = await login(username, password)
            onLogin(user)
            navigate('/')
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError('Invalid username or password.')
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
            <button type="submit" className="btn btn-primary">Login</button>
        </form>
    )
}

function RegisterForm({ onDone }) {
    const [username, setUsername] = useState('')
    const [email, setEmail]       = useState('')
    const [password, setPassword] = useState('')
    const [error, setError]       = useState('')
    const [success, setSuccess]   = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            await createUser(username, email, password)
            setSuccess(true)
            setTimeout(onDone, 1500)
        } catch (err) {
            setError(err.message)
        }
    }

    if (success) return <p className="success">Account created! Redirecting to login…</p>

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Create account</h2>
            {error && <p className="error">{error}</p>}
            <label>Username
                <input value={username} onChange={e => setUsername(e.target.value)} required />
            </label>
            <label>Email
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </label>
            <label>Password
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </label>
            <button type="submit" className="btn btn-primary">Create account</button>
        </form>
    )
}

export default LoginPage