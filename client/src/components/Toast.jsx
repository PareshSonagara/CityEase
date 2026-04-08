import React, { useEffect, useState } from 'react'

export default function Toast({ message, type = 'info' }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 3000)
    return () => clearTimeout(t)
  }, [])

  if (!visible) return null

  const colors = {
    info:    '#4F6EF7',
    success: '#10B981',
    error:   '#EF4444',
    warn:    '#F59E0B',
  }

  return (
    <div
      className="toast"
      role="alert"
      style={{ borderLeftColor: colors[type] || colors.info }}
    >
      {message}
    </div>
  )
}
