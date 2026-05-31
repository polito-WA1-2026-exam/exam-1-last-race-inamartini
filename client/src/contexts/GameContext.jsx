import {createContext, useState, useEffect, useRef} from 'react'
import {startGame, executeGame, getNetwork} from '../api/API.js'

const GameContext = createContext(null)

export function GameProvider({ children }) {
    const [phase, setPhase]     = useState('setup')
    const [network, setNetwork] = useState(null)
    const [game, setGame]       = useState(null)
    const [route, setRoute]     = useState([])
    const [result, setResult]   = useState(null)
    const [error, setError]     = useState('')
    const [loading, setLoading] = useState(false)
    const [timeLeft, setTimeLeft] = useState(90)

    // ref so the timer callback always sees the latest route without re-creating the interval
    const routeRef = useRef(route)
    useEffect(() => { routeRef.current = route }, [route])

    const gameRef = useRef(game)
    useEffect(() => { gameRef.current = game }, [game])

    useEffect(() => {
        getNetwork()
            .then(setNetwork)
            .catch(() => setError('Could not load network.'))
    }, [])

    // timer — only runs during planning phase
    useEffect(() => {
        if (phase !== 'planning') return

        setTimeLeft(90)

        const interval = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(interval)
                    submitRoute(routeRef.current, gameRef.current)  // auto-submit with whatever route exists
                    return 0
                }
                return t - 1
            })
        }, 1000)

        return () => clearInterval(interval)   // cleanup if user submits early or phase changes
    }, [phase])

    // extracted so both manual submit and timer can call the same logic
    const submitRoute = async (currentRoute, currentGame) => {
        setError('')
        setLoading(true)
        try {
            const res = await executeGame(currentGame.game_id, currentRoute)
            setResult(res)
            setPhase('execution')
        } catch {
            setError('Failed to submit route.')
        } finally {
            setLoading(false)
        }
    }

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

    const handleSubmitRoute = () => submitRoute(routeRef.current, gameRef.current)

    const handleRestart = () => {
        setPhase('setup')
        setGame(null)
        setRoute([])
        setResult(null)
        setError('')
        setTimeLeft(90)
    }

    return (
        <GameContext.Provider value={{
            phase, setPhase, network, game, route, setRoute,
            result, error, loading, timeLeft,
            handleStartPlanning, handleSubmitRoute, handleRestart
        }}>
            {children}
        </GameContext.Provider>
    )
}

export { GameContext }