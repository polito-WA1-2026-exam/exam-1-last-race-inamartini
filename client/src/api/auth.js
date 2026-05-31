const SERVER = 'http://localhost:3001'

export const login = async (username, password) => {
    const res = await fetch(`${SERVER}/api/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',                          // sends the session cookie
        body: JSON.stringify({ username, password })
    })
    if (!res.ok) throw new Error('Invalid credentials')
    console.log(username)
    return await res.json()   // returns { user_id, username, email }
}

export const logout = async () => {
    await fetch(`${SERVER}/api/sessions/current`, {
        method: 'DELETE',
        credentials: 'include'
    })
}

export const getSessionUser = async () => {
    const res = await fetch(`${SERVER}/api/sessions/current`, {
        credentials: 'include'
    })
    if (!res.ok) return null
    return await res.json()
}

export const createUser = async (username, email, password) => {
    const res = await fetch(`${SERVER}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    })
    if (!res.ok) throw new Error('Registration failed')
    return await res.json()
}