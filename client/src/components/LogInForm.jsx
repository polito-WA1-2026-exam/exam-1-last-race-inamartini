import {useEffect, useState} from 'react'
import {login, logout} from '../api/auth.js'
import {useNavigate} from "react-router";

function LoginForm({ onLogin, navigate }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError]       = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            const user = await login(username, password)
            onLogin(user)
            navigate('/')
        } catch {
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

function Logout(props) {
    const navigate = useNavigate()

    useEffect( ()=>{
        logout().then( () =>
        {
            props.doLogin({ id: undefined, email: undefined, name: undefined })
            navigate('/')
        } )
    }, [] )

    return "Logging out..."

}

export {LoginForm, Logout}
