import React, { createContext, useContext, useState } from 'react'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [user] = useState({
    name: 'Ramesh Kumar',
    city: 'Pune, Maharashtra',
    avatar: 'R',
  })

  const [toast, setToast] = useState(null)

  function showToast(message, type = 'info', duration = 3500) {
    setToast({ message, type, id: Date.now() })
    setTimeout(() => setToast(null), duration)
  }

  return (
    <UserContext.Provider value={{ user, toast, showToast }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
