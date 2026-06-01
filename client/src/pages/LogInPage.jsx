import { useNavigate } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm.jsx'

function LoginPage({ onLogin }) {
    const navigate = useNavigate()

    return (
        <div className="auth-container">
            <LoginForm
                onLogin={onLogin}
                navigate={navigate}
            />
        </div>
    )
}

export default LoginPage