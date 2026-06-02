import metroMap2 from "../assets/metro.png"
import start from "../assets/metro_icon.png";
import end from "../assets/filag_pink.png";
import timer from "../assets/timer.png";


function PlanningPhase({ network, game, route, setRoute, onSubmit, loading, timeLeft }) {
    const lastStation = route[route.length - 1]

    const addSegment = (seg) => {
        if (seg.station_1_id === lastStation) {
            setRoute(r => [...r, seg.station_2_id])
        } else if (seg.station_2_id === lastStation) {
            setRoute(r => [...r, seg.station_1_id])
        } else {
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

            <div className={`timer ${timeLeft <= 10 ? 'timer-urgent' : ''}`}>
                <img
                    src={timer}
                    alt="Timer icon"
                    className="start-end-icon"
                /> {timeLeft}s remaining
            </div>

            <div className="assignment-box">
                <p> <img
                    src={start}
                    alt="Start icon"
                    className="start-end-icon"
                /> <strong>Start:</strong> {game.start_station.station_name}</p>
                <p> <img
                    src={end}
                    alt="End icon"
                    className="start-end-icon"
                /><strong>Destination:</strong> {game.destination_station.station_name}</p>
            </div>

            <div className="planning-map-container">
                <img
                    src={metroMap2}
                    alt="Metro map without lines"
                    className="planning-map"
                />
            </div>
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

            <h2>Choose next segment</h2>
            <ul className="segment-list">
                {network.segments.map(seg => (
                    <li key={seg.segment_id}>
                        <button className="segment-link" onClick={() => addSegment(seg)}>
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

export default PlanningPhase