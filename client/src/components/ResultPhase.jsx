import PageComponent from "./PageContent.jsx";

function ResultPhase({ result, onRestart }) {
    return (
        <PageComponent title="Game Over">
            {result.valid
                ? <p>You completed the route!</p>
                : <p>Your route was invalid.</p>
            }
            <p className="score-display">Final score: <strong>{result.score}</strong> coins</p>
            <button className="btn btn-primary" onClick={onRestart}>Play again</button>
        </PageComponent>
    )
}

export default ResultPhase