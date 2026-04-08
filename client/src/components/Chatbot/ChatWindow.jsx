import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useLang } from '../../contexts/LangContext'
import { useUser } from '../../contexts/UserContext'
import ReactMarkdown from 'react-markdown'

const QUICK_REPLIES = [
  { label: '📄 Birth Certificate', msg: 'How to apply for birth certificate?' },
  { label: '🏥 Nearby Hospitals',  msg: 'Show me nearby hospitals' },
  { label: '💡 Pay Electricity Bill', msg: 'How to pay electricity bill online?' },
  { label: '🛒 Ration Card Docs',  msg: 'What documents for ration card?' },
]

export default function ChatWindow({ onClose }) {
  const { tr } = useLang()
  const { showToast } = useUser()
  const navigate = useNavigate()

  const [messages,  setMessages]  = useState([])
  const [input,     setInput]     = useState('')
  const [typing,    setTyping]    = useState(false)
  const messagesEndRef = useRef()

  // Greet on mount
  useEffect(() => {
    loadGreeting()
  }, [])

  async function loadGreeting() {
    setMessages([])
    try {
      const { data } = await axios.post('/api/chat', { message: 'hello' })
      setMessages([{
        id: Date.now(),
        role: 'bot',
        text: data.message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }])
    } catch {
      setMessages([{
        id: Date.now(), role: 'bot',
        text: "Hello! I'm Sakhi, your city guide. How can I help?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }])
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  async function sendMessage(text = input) {
    const msg = text.trim()
    if (!msg) return
    setInput('')

    const userMsg = {
      id: Date.now(), role: 'user', text: msg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => [...prev, userMsg])
    setTyping(true)

    try {
      const { data } = await axios.post('/api/chat', { message: msg })
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'bot', text: data.message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'bot',
        text: "Sorry, I couldn't connect. Please try again.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }])
    } finally {
      setTyping(false)
    }
  }

  function handleVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { showToast('Voice not supported', 'error'); return }
    const r = new SR()
    r.lang = 'en-IN'
    r.onresult = e => sendMessage(e.results[0][0].transcript)
    r.start()
  }

  return (
    <div className="chat-window" role="dialog" aria-modal="true" aria-label="Sakhi AI chatbot">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-avatar">
          <div className="avatar-ring"/>
          <span>🤖</span>
        </div>
        <div className="chat-info">
          <span className="chat-name">Sakhi</span>
          <span className="chat-status">● {tr('chatbot.status', 'Online — Ready to Help')}</span>
        </div>
        {onClose && (
          <button className="chat-close-btn" onClick={onClose} aria-label="Close chatbot">✕</button>
        )}
      </div>

      {/* Messages */}
      <div className="chat-messages" role="log" aria-live="polite">
        {messages.map(msg => (
          <div key={msg.id} className={`chat-msg ${msg.role}`}>
            <div className="chat-bubble">
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
            <div className="chat-msg-time">{msg.time}</div>
          </div>
        ))}
        {typing && (
          <div className="chat-msg bot">
            <div className="typing-indicator">
              <span/><span/><span/>
            </div>
          </div>
        )}
        <div ref={messagesEndRef}/>
      </div>

      {/* Quick Replies */}
      <div className="chat-quick-replies">
        {QUICK_REPLIES.map((r, i) => (
          <button key={i} className="qr-btn" onClick={() => sendMessage(r.msg)}>
            {r.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <button className="chat-voice-btn" onClick={handleVoice} aria-label="Voice input">🎙️</button>
        <input
          type="text"
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') sendMessage() }}
          placeholder={tr('chatbot.placeholder', 'Type your question…')}
          aria-label="Chat input"
        />
        <button
          className="chat-send-btn"
          onClick={() => sendMessage()}
          aria-label="Send"
          disabled={!input.trim() || typing}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
