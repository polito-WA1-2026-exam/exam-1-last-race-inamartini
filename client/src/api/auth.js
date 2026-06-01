const SERVER = 'http://localhost:3001'

async function login(username, password) {
    const res = await fetch(`${SERVER}/api/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
    })
    if (res.ok)  {
        return await res.json() // returns { user_id, username, email }
    } else {
        throw new Error('Invalid credentials')
    }
}

async function logout()  {
    await fetch(`${SERVER}/api/sessions/current`, {
        method: 'DELETE',
        credentials: 'include'
    })
}

async function checkSession() {
    const response = await fetch(`${SERVER}/api/sessions/current`, {
        credentials: "include"
    })
    if (response.ok) {
        return await response.json()
    } else {
        return null
    }
}

export { login, logout, checkSession }