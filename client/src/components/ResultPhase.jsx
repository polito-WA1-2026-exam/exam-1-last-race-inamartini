function ResultPhase({ result, onRestart }) {
    return (
        <div>
            <h1>Game Over</h1>
            {result.valid
                ? <p>You completed the route!</p>
                : <p>Your route was invalid.</p>
            }
            <p className="score-display">Final score: <strong>{result.score}</strong> coins</p>
            <button className="btn btn-primary" onClick={onRestart}>Play again</button>
        </div>
    )
}

export default ResultPhase