import { useState, useEffect } from 'react'
import { getNetwork, startGame, executeGame } from '../api/API.js'
import metroMap from "../assets/metro_with_lines.png";
import metroMap2 from "../assets/metro.png";

// phase: 'setup' | 'planning' | 'execution' | 'result'

function GamePage({ user }) {
    const [phase, setPhase]       = useState('setup')
    const [network, setNetwork]   = useState(null)
    const [game, setGame]         = useState(null)      // { game_id, start_station, destination_station }
    const [route, setRoute]       = useState([])        // array of station_ids in order
    const [result, setResult]     = useState(null)      // { valid, score, steps }
    const [error, setError]       = useState('')
    const [loading, setLoading]   = useState(false)

    // load network on mount
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
            setRoute([g.start_station.station_id])   // route begins at start
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

    if (!network) return <div className="page"><p>Loading network…</p></div>

    return (
        <div className="page">
            {error && <p className="error">{error}</p>}

            {phase === 'setup'     && <SetupPhase network={network} onReady={handleStartPlanning} loading={loading} />}
            {phase === 'planning'  && <PlanningPhase network={network} game={game} route={route} setRoute={setRoute} onSubmit={handleSubmitRoute} loading={loading} />}
            {phase === 'execution' && <ExecutionPhase result={result} network={network} onDone={() => setPhase('result')} />}
            {phase === 'result'    && <ResultPhase result={result} onRestart={handleRestart} />}
        </div>
    )
}

// ── SETUP ────────────────────────────────────────────────────────────────────

function SetupPhase({ onReady, loading }) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2rem"
            }}
        >
            <img
                src={metroMap}
                alt="Metro map with connecting lines"
                style={{
                    maxWidth: "80%",
                    height: "auto"
                }}
            />

            <button
                className="btn btn-primary"
                onClick={onReady}
                disabled={loading}
            >
                {loading ? "Starting…" : "I'm ready: Start!"}
            </button>
        </div>
    )
}

// ── PLANNING ─────────────────────────────────────────────────────────────────

function PlanningPhase({ network, game, route, setRoute, onSubmit, loading }) {
    const lastStation = route[route.length - 1]

    const availableSegments = network.segments

    const addSegment = (seg) => {
        if (seg.station_1_id === lastStation) {
            setRoute(r => [...r, seg.station_2_id])
        }
        else if (seg.station_2_id === lastStation) {
            setRoute(r => [...r, seg.station_1_id])
        }
        else {
            // invalid move, but allow user to choose it
            setRoute(r => [...r, seg.station_1_id, seg.station_2_id])
        }
    }

    const removeLast = () => {
        if (route.length <= 1) return
        setRoute(r => r.slice(0, -1))
    }

    const stationName = (id) => network.stations.find(s => s.station_id === id)?.station_name ?? id

    return (
        <div>
            <h1>Plan Your Route</h1>

            <div className="assignment-box">
                <p>🚉 <strong>Start:</strong> {game.start_station.station_name}</p>
                <p>🏁 <strong>Destination:</strong> {game.destination_station.station_name}</p>
            </div>

            <img
                src={metroMap2}
                alt="Metro map with connecting lines"
                style={{
                    maxWidth: "80%",
                    height: "auto",
                }}
            />

            <h2>Your route so far</h2>
            <div className="route-display">
                {route.map((id, i) => (
                    <span key={i}>
            {i > 0 && ' → '}
                        <span className={id === game.destination_station.station_id ? 'station-destination' : ''}>
              {stationName(id)}
            </span>
          </span>
                ))}
            </div>

            <h2>Choose next route</h2>

            <ul className="segment-list">
                {availableSegments.map(seg => (
                    <li key={seg.segment_id}>
                        <button
                            className="segment-link"
                            onClick={() => addSegment(seg)}
                        >
                            {stationName(seg.station_1_id)} ↔ {stationName(seg.station_2_id)}
                        </button>
                    </li>
                ))}
            </ul>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button className="btn btn-secondary" onClick={removeLast} disabled={route.length <= 1}>
                    ← Undo last stop
                </button>
                <button className="btn btn-primary" onClick={onSubmit} disabled={loading}>
                    {loading ? 'Submitting…' : 'Submit route'}
                </button>
            </div>
        </div>
    )
}

// ── EXECUTION ─────────────────────────────────────────────────────────────────

function ExecutionPhase({ result, network, onDone }) {
    const [stepIndex, setStepIndex] = useState(0)

    const stationName = (id) => network.stations.find(s => s.station_id === id)?.station_name ?? id

    if (!result.valid) {
        return (
            <div>
                <h1>Invalid Route ❌</h1>
                <p>Your route was invalid or incomplete. You lose all 20 coins.</p>
                <p className="score-display">Final score: <strong>0</strong> coins</p>
                <button className="btn btn-primary" onClick={onDone}>See Result</button>
            </div>
        )
    }

    const currentStep = result.steps[stepIndex]
    const isLast = stepIndex === result.steps.length - 1

    return (
        <div>
            <h1>Executing Route 🚇</h1>
            <p>Step {stepIndex + 1} of {result.steps.length}</p>

            <div className="step-card">
                <p>
                    <strong>{stationName(currentStep.from_station_id)}</strong>
                    {' → '}
                    <strong>{stationName(currentStep.to_station_id)}</strong>
                </p>
                <p className="event-description">
                    🎲 {currentStep.event.description}
                    {' '}
                    <span className={currentStep.event.effect >= 0 ? 'positive' : 'negative'}>
            ({currentStep.event.effect >= 0 ? '+' : ''}{currentStep.event.effect} coins)
          </span>
                </p>
                <p>💰 Coins after this step: <strong>{currentStep.coins_after}</strong></p>
            </div>

            <button
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
                onClick={() => isLast ? onDone() : setStepIndex(i => i + 1)}
            >
                {isLast ? 'See final result →' : 'Next step →'}
            </button>
        </div>
    )
}

// ── RESULT ────────────────────────────────────────────────────────────────────

function ResultPhase({ result, onRestart }) {
    return (
        <div>
            <h1>Game Over 🏁</h1>
            {result.valid
                ? <p>You completed the route!</p>
                : <p>Your route was invalid.</p>
            }
            <p className="score-display">Final score: <strong>{result.score}</strong> coins</p>
            <button className="btn btn-primary" onClick={onRestart}>Play again</button>
        </div>
    )
}

export default GamePage