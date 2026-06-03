const SERVER = 'http://localhost:3001'

// POST /api/sessions
// posts credentials, returns the user object (user_id, username, email) if successful
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

// DELETE /api/session/current
// destroys the session on the server for the user to log out
async function logout()  {
    await fetch(`${SERVER}/api/sessions/current`, {
        method: 'DELETE',
        credentials: 'include'
    })
}

// GET /api/session/current
// verify the user is still logged in. Returns the user object if the user is still logged in
async function checkSession() {
    try {
        const response = await fetch(`${SERVER}/api/sessions/current`, {
            credentials: "include"
        });

        if (response.ok) {
            return await response.json();
        } else {
            return null; // if not logged in, just return null
        }
    } catch (err) {
        console.error("Session check failed:", err);
        return null;
    }
}

export { login, logout, checkSession }