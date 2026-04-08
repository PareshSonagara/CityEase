import React from 'react'
import { useLang } from '../contexts/LangContext'
import ChatWindow from './Chatbot/ChatWindow'

export default function ChatbotSection() {
  const { tr } = useLang()

  const features = [
    { icon: '🌐', title: 'English', desc: 'English natural language support.' },
    { icon: '🎙️', title: 'Voice Enabled', desc: 'Speak your query — perfect for elderly or low-literacy users.' },
    { icon: '🧠', title: 'Smart Guidance', desc: 'Step-by-step guides, document lists, and direct links.' },
    { icon: '⏰', title: '24/7 Available', desc: 'No wait times, no office hours — always available.' },
  ]

  return (
    <section className="chatbot-section" id="chatbot">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">{tr('chatbot.sectionBadge', 'AI Assistant')}</div>
          <h2>Meet <span className="gradient-text">Sakhi</span> — Your City Guide</h2>
          <p>{tr('chatbot.subtext', 'Ask in English. Get instant guidance on any city service.')}</p>
        </div>

        <div className="chatbot-layout">
          <ChatWindow />
          <div className="chatbot-features">
            {features.map((f, i) => (
              <div key={i} className="cf-item">
                <div className="cf-icon">{f.icon}</div>
                <div className="cf-text">
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
