const SERVER = 'http://localhost:3001'

export const getNetwork = async () => {
    const res = await fetch(`${SERVER}/api/network`, { credentials: 'include' })
    if (!res.ok) throw new Error('Failed to load network')
    return res.json()
}

export const startGame = async () => {
    const res = await fetch(`${SERVER}/api/games`, {
        method: 'POST',
        credentials: 'include'
    })
    if (!res.ok) throw new Error('Failed to start game')
    return res.json()
}

export const executeGame = async (gameId, route) => {
    const res = await fetch(`${SERVER}/api/games/${gameId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ route })
    })
    if (!res.ok) throw new Error('Failed to execute game')
    return res.json()
}