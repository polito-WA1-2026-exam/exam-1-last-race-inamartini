import metroMap from "../assets/metro_with_lines.png"

function SetupPhase({ onReady, loading }) {
    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start",
            gap: "2rem", width: "100%"}}>
            <p style={{ fontSize: "1.2rem", textAlign: "center" }}>
                Take a look at the map before starting your game!
            </p>
            <img
                src={metroMap}
                alt="Metro map with connecting lines"
                style={{ maxWidth: "100%", height: "auto" }} />
            <button className="btn btn-primary"
                    onClick={onReady} disabled={loading}>
                {loading ? "Starting…" : "Start playing!"}
            </button>
        </div>
    )
}

export default SetupPhase