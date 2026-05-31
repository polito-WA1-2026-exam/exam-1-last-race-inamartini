import { Routes, Route, Navigate } from 'react-router-dom'
import {useEffect, useState} from 'react'
import NavBar from './components/NavBar.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RankingPage from './pages/RankingPage.jsx'
import GamePage from './pages/GamePage.jsx'
import InstructionsPage from "./pages/InstructionsPage.jsx";
import Footer from './components/Footer.jsx'
import { getSessionUser } from './api/auth.js'

function App() {
  const [user, setUser] = useState(null)  // null = not logged in

    // on mount, check if there's already a valid session
    useEffect(() => {
        getSessionUser().then(user => setUser(user))
    }, [])

  const handleLogin = (loggedInUser) => setUser(loggedInUser)
  const handleLogout = () => setUser(null)

  return (
      <>
        <NavBar user={user} onLogout={handleLogout} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
            <Route path="/login" element={
              user ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />
            } />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/instructions" element={<InstructionsPage />} />
            <Route path="/game" element={
              user ? <GamePage user={user} /> : <Navigate to="/login" />
            } />
          </Routes>
        </main>
        <Footer />
      </>
  )
}

export default App