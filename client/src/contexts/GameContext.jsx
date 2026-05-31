import { createContext, useContext, useState, useEffect } from 'react'
import { getNetwork, startGame, executeGame } from '../api/API.js'

const GameContext = createContext(null)

export function GameProvider({ children }) {
    const [phase, setPhase]     = useState('setup')
    const [network, setNetwork] = useState(null)
    const [game, setGame]       = useState(null)
    const [route, setRoute]     = useState([])
    const [result, setResult]   = useState(null)
    const [error, setError]     = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getNetwork()
            .then(setNetwork)
            .catch(() => setError('Could not load network.'))
    }, [])

    const handleStartPlanning = async () => {
        setError('')
        setLoading(true)
        try {
            const g = await startGame()
            setGame(g)
            setRoute([g.start_station.station_id])
            setPhase('planning')
        } catch {
            setError('Failed to start game.')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmitRoute = async () => {
        setError('')
        setLoading(true)
        try {
            const res = await executeGame(game.game_id, route)
            setResult(res)
            setPhase('execution')
        } catch {
            setError('Failed to submit route.')
        } finally {
            setLoading(false)
        }
    }

    const handleRestart = () => {
        setPhase('setup')
        setGame(null)
        setRoute([])
        setResult(null)
        setError('')
    }

    return (
        <GameContext.Provider value={{
            phase, setPhase, network, game, route, setRoute,
            result, error, loading,
            handleStartPlanning, handleSubmitRoute, handleRestart
        }}>
            {children}
        </GameContext.Provider>
    )
}

export const useGame = () => useContext(GameContext)