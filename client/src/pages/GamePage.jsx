import { useContext } from 'react'
import { GameContext } from '../contexts/GameContext.jsx'
import SetupPhase from '../components/SetupPhase.jsx'
import PlanningPhase from '../components/PlanningPhase.jsx'
import ExecutionPhase from '../components/ExecutionPhase.jsx'
import ResultPhase from '../components/ResultPhase.jsx'

function GamePage() {
    const { phase, setPhase, network, game, route, setRoute, result,
        error, loading, timeLeft,
        handleStartPlanning, handleSubmitRoute, handleRestart } = useContext(GameContext)

    if (!network) return <div className="page"><p>Loading network…</p></div>

    return (
        <div className="page">
            {error && <p className="error">{error}</p>}
            {phase === 'setup'     && <SetupPhase onReady={handleStartPlanning} loading={loading} />}
            {phase === 'planning'  && <PlanningPhase network={network} game={game} route={route} setRoute={setRoute}
                                                     onSubmit={handleSubmitRoute} loading={loading} timeLeft={timeLeft} />}
            {phase === 'execution' && <ExecutionPhase result={result} network={network} onDone={() => setPhase('result')} />}
            {phase === 'result'    && <ResultPhase result={result} onRestart={handleRestart} />}
        </div>
    )
}

export default GamePage