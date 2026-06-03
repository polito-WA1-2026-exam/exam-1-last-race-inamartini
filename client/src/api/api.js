const SERVER = 'http://localhost:3001'

// GET /api/network
// fetches the metro network data, credentials included
async function getNetwork() {
    try {
        const res = await fetch(`${SERVER}/api/network`, { credentials: 'include' })
        if (res.ok){
            return await res.json()
        } else {
            // 4xx or 5xx status code
            throw new Error('HTTP error: Failed to load network, code ' + res.status)
        }
    } catch (ex) {
        // handle network errors + parsing errors
        throw new Error('Failed to load network', {cause: ex})
    }
}

// POST /api/games
// creates a new game session on the server, credentials included
// returns the new game data, including game_id
async function startGame() {
    try {
        const res = await fetch(`${SERVER}/api/games`, {
            method: 'POST',
            credentials: 'include'
        })
        if (res.ok) {
            return res.json()
        } else {
            // 4xx or 5xx status code
            throw new Error('HTTP error: Failed to start game, code ' + res.status)
        }
    } catch (ex){
        // handle network errors + parsing errors
        throw new Error('Failed to start game', {cause: ex})
    }

}

// POST /api/games/:id/execute
// submits the chosen route for the user, post with a JSON containing the route, the server
// evaluates it and returns the result
async function executeGame(gameId, route) {
    try {
        const res = await fetch(`${SERVER}/api/games/${gameId}/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ route })
        })
        if (res.ok) {
            return res.json()
        } else {
            // 4xx or 5xx status code
            throw new Error('HTTP error: Failed to execute game, code ' + res.status)
        }
    } catch (ex){
        // handle network errors + parsing errors
        throw new Error('Failed to execute game', {cause: ex})
    }
}

// GET /api/ranking
// fetches the leaderboard, credentials included so the users own score can be highlighted
async function getRanking() {
    try {
        const res = await fetch(`${SERVER}/api/ranking`, {
            credentials: 'include'
        })
        if (res.ok) {
            return res.json()
        } else {
            // 4xx or 5xx status code
            throw new Error('HTTP error: Failed to load ranking, code ' + res.status)
        }
    } catch (ex){
        throw new Error('Failed to load ranking', {cause: ex})
    }
}

export { getNetwork, startGame, executeGame, getRanking }