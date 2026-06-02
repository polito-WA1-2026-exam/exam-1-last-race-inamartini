import { useState } from 'react'
import coin from "../assets/coin.png";
import PageComponent from "./PageContent.jsx";

function ExecutionPhase({ result, network, onDone }) {
    const [stepIndex, setStepIndex] = useState(0)

    const stationName = (id) => network.stations.find(s => s.station_id === id)?.station_name ?? id

    if (!result.valid) {
        return (
            <PageComponent title="Executing Route">
                <p>Your route was invalid or incomplete. You lose all 20 coins.</p>
                <p className="score-display">Final score: <strong>0</strong> coins</p>
                <button className="btn btn-primary" onClick={onDone}>See Result</button>
            </PageComponent>
        )
    }

    const currentStep = result.steps[stepIndex]
    const isLast = stepIndex === result.steps.length - 1

    return (
        <PageComponent title="Executing Route">
            <p>Step {stepIndex + 1} of {result.steps.length}</p>

            <div className="step-card">
                <p>
                    <strong>{stationName(currentStep.from_station_id)}</strong>
                    {' → '}
                    <strong>{stationName(currentStep.to_station_id)}</strong>
                </p>
                <p className="event-description">
                     {currentStep.event.description}{' '}
                    <span className={currentStep.event.effect >= 0 ? 'positive' : 'negative'}>
                        ({currentStep.event.effect >= 0 ? '+' : ''}{currentStep.event.effect} coins)
                    </span>
                </p>
                <p><img
                    src={coin}
                    alt="Coin icon"
                    className="coin-icon"
                /> Coins after this step: <strong>{currentStep.coins_after}</strong></p>
            </div>

            <button
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
                onClick={() => isLast ? onDone() : setStepIndex(i => i + 1)}
            >
                {isLast ? 'See final result →' : 'Next step →'}
            </button>
        </PageComponent>
    )
}

export default ExecutionPhase