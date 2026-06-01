const SERVER = 'http://localhost:3001'

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