import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext.jsx'
import { getRanking } from '../api/API.js'

function RankingPage() {
    const { user } = useContext(UserContext)
    const navigate = useNavigate()
    const [ranking, setRanking] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError]     = useState('')

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }
        getRanking()
            .then(data => {
                setRanking(data)
                setLoading(false)
            })
            .catch(() => {
                setError('Could not load ranking.')
                setLoading(false)
            })
    }, [user, navigate])

    if (loading) return <div className="page"><p>Loading ranking…</p></div>

    return (
        <div className="page">
            <h1>Ranking</h1>
            <p>Ranking of the best games among all players.</p>

            {error && <p className="error">{error}</p>}

            {ranking.length === 0 ? (
                <p>No finished games yet. <a href="/game">Play now!</a></p>
            ) : (
                <table className="ranking-table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Player</th>
                        <th>Best Score</th>
                    </tr>
                    </thead>
                    <tbody>
                    {ranking.map((row, i) => (
                        <tr key={row.username} className={row.username === user.username ? 'my-row' : ''}>
                            <td>{i + 1}</td>
                            <td>{row.username} {row.username === user.username ? '(you)' : ''}</td>
                            <td>{row.best_score} coins</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default RankingPage