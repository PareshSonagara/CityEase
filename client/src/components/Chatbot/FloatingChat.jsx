import React, { useState } from 'react'
import ChatWindow from './ChatWindow'

export default function FloatingChat() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {open && (
        <div className="floating-chat-window">
          <ChatWindow onClose={() => setOpen(false)} />
        </div>
      )}
      <button
        className="floating-chat-btn"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close chatbot' : 'Open chatbot Sakhi'}
      >
        <span className="fc-icon">{open ? '✕' : '💬'}</span>
        {!open && <span className="fc-label">Ask Sakhi</span>}
        {!open && <div className="fc-pulse"/>}
      </button>
    </>
  )
}
