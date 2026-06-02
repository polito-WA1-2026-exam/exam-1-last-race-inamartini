import { useNavigate } from 'react-router'
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