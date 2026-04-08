import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useLang } from '../contexts/LangContext'
import { useUser } from '../contexts/UserContext'

export default function Emergency() {
  const { lang, tr } = useLang()
  const { showToast } = useUser()
  const [contacts, setContacts] = useState([])

  useEffect(() => {
    axios.get(`/api/emergency?lang=${lang}`)
      .then(r => setContacts(r.data.data))
      .catch(() => showToast('Failed to load emergency contacts', 'error'))
  }, [lang])

  return (
    <section className="emergency-section" id="emergency">
      <div className="container">
        <div className="emergency-banner">
          <div className="em-header">
            <div className="em-pulse"/>
            <h2 id="emergency-heading">{tr('emergency.heading', '🚨 Emergency Quick Access')}</h2>
            <p>{tr('emergency.subtext', 'One tap to reach critical services. Available 24/7.')}</p>
          </div>
          <div className="emergency-grid" role="list">
            {contacts.map(c => (
              <a
                key={c.id}
                href={`tel:${c.number}`}
                className={`em-card ${c.type}`}
                role="listitem"
                aria-label={`Call ${c.name} — ${c.number}`}
                onClick={() => showToast(`📞 Calling ${c.name} — ${c.number}`, 'info')}
              >
                <div className="em-icon">{c.icon}</div>
                <div className="em-info">
                  <span className="em-name">{c.name}</span>
                  <span className="em-num">{c.number}</span>
                </div>
                <span className="em-call">{tr('emergency.callNow', 'Call Now')}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
