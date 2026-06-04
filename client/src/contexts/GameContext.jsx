import {createContext, useState, useEffect, useRef} from 'react'
import {startGame, executeGame, getNetwork} from '../api/api.js'

// creates the default shape for the Game Context
const GameContext = createContext({
    phase: 'setup',
    setPhase: () => {},
    network: null,
    game: null,
    route: [],
    setRoute: () => {},
    result: null,
    error: '',
    loading: false,
    timeLeft: 90,
    handleStartPlanning: () => {},
    handleSubmitRoute: () => {},
    handleRestart: () => {}
})

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

    // makes sure the timer submits the latest game object
    const gameRef = useRef(game)
    useEffect(() => { gameRef.current = game }, [game])

    // fetches the network from the backend and saves it at network
    useEffect(() => {
        getNetwork()
            .then(setNetwork)
            .catch(() => setError('Could not load network.'))
    }, [])

    // submits the selected route to the backend
    const submitRoute = async (currentRoute, currentGame) => {
        setError('')
        setLoading(true)
        try {
            const res = await executeGame(currentGame.game_id, currentRoute)
            setResult(res)

            // if route is valid set to show execution, otherwise show result page
            if (res.valid) {
                setPhase('execution')
            } else {
                setPhase('result')
            }
        } catch {
            setError('Failed to submit route.')
        } finally {
            setLoading(false)
        }
    }

    // timer, only used during planning phase, user has 90 seconds to submit route
    useEffect(() => {
        if (phase !== 'planning') return

        // starts a countdown
        const interval = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(interval)
                    submitRoute(routeRef.current, gameRef.current) // automatically submit when timer reaches 0
                    return 0
                }
                return t - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [phase])

    // starts a new game
    const handleStartPlanning = async () => {
        setError('')
        setLoading(true)
        try {
            const g = await startGame()
            setGame(g) // stores game g
            setRoute([g.start_station.station_id]) // starts route at start station
            setTimeLeft(90) // reset timer to 90 seconds
            setPhase('planning') // move to planning phase
        } catch {
            setError('Failed to start game.')
        } finally {
            setLoading(false)
        }
    }

    // submit route when user clicks submit
    const handleSubmitRoute = () => submitRoute(routeRef.current, gameRef.current)

    // restart game and restart all properties
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