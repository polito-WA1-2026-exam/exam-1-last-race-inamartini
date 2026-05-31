import { Link } from 'react-router-dom'

function HomePage({ user }) {
    return (
        <div className="page">
            <h1>Last Race 🚇</h1>
            <p>Race through the underground network to reach your destination before time runs out.</p>
            <div className="btn-container">
                {user
                    ? <Link to="/game" className="btn btn-primary">Start a new game</Link>
                    : <Link to="/login" className="btn btn-primary">Login to play</Link>
                }
            </div>
        </div>
    )
}

export default HomePage