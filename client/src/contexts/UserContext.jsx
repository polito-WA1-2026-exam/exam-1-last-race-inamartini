import { createContext, useContext, useState, useEffect } from 'react'
import { getSessionUser } from '../api/auth.js'

const UserContext = createContext(null)

export function UserProvider({ children }) {
    const [user, setUser] = useState(null)

    useEffect(() => {
        getSessionUser()
            .then(u => { if (u) setUser(u) })
            .catch(() => {})
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)