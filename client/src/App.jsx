import { Routes, Route, Navigate } from 'react-router'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import NavBar from './components/NavBar.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RankingPage from './pages/RankingPage.jsx'
import GamePage from './pages/GamePage.jsx'
import InstructionsPage from './pages/InstructionsPage.jsx'
import Footer from './components/Footer.jsx'
import UserContext from './contexts/UserContext.jsx'
import { GameProvider } from './contexts/GameContext.jsx'
import { checkSession } from './api/auth.js'

function App() {
    const navigate = useNavigate()
    const [user, setUser] = useState({ id: undefined, username: undefined, email: undefined })

    // restore session on page load
    useEffect(() => {
        checkSession().then(result => {
            if (result) {
                setUser({ id: result.user_id, username: result.username, email: result.email })
            }
        })
    }, [])

    const handleLogin = (u) => {
        setUser({ id: u.user_id, username: u.username, email: u.email })
        navigate('/')
    }

    const handleLogout = () => {
        setUser({ id: undefined, username: undefined, email: undefined })
        navigate('/')
    }

    return (
        <UserContext.Provider value={user}>
            <NavBar user={user} onLogout={handleLogout} />
            <main>
                <Routes>
                    <Route path="/" element={<HomePage user={user} />} />
                    <Route path="/login" element={
                        user.id ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />
                    } />
                    <Route path="/ranking" element={
                        user.id ? <RankingPage /> : <Navigate to="/login" />
                    } />
                    <Route path="/instructions" element={<InstructionsPage />} />
                    <Route path="/game" element={
                        user.id ? <GameProvider><GamePage /></GameProvider> : <Navigate to="/login" />
                    } />
                </Routes>
            </main>
            <Footer />
        </UserContext.Provider>
    )
}

export default App