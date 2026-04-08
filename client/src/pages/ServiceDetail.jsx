import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useLang } from '../contexts/LangContext'
import { useUser } from '../contexts/UserContext'

export default function ServiceDetail() {
  const { id }   = useParams()
  const { lang, tr } = useLang()
  const { showToast } = useUser()
  const navigate = useNavigate()

  const [service,   setService]   = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [applying,  setApplying]  = useState(false)
  const [applied,   setApplied]   = useState(false)

  useEffect(() => {
    setLoading(true)
    axios.get(`/api/services/${id}?lang=${lang}`)
      .then(r => setService(r.data.data))
      .catch(() => { showToast('Service not found', 'error'); navigate('/') })
      .finally(() => setLoading(false))
  }, [id, lang])

  async function handleApply() {
    if (applied || applying) return
    setApplying(true)
    try {
      const { data } = await axios.post('/api/applications', {
        service_id:   service.id,
        service_name: service.name,
      })
      setApplied(true)
      showToast(`✅ Application submitted! Reference: ${data.data.reference}`, 'success', 5000)
    } catch {
      showToast('Failed to submit application', 'error')
    } finally {
      setApplying(false)
    }
  }

  if (loading) return (
    <div className="service-detail-loading">
      <div className="spinner"/>
      <p>Loading service details…</p>
    </div>
  )

  if (!service) return null

  return (
    <div className="service-detail-page">
      <div className="container">
        {/* Back */}
        <Link to="/" className="back-btn">← Back to Services</Link>

        <div className="sd-layout">
          {/* Main */}
          <div className="sd-main">
            <div className="sd-hero">
              <div className="sd-icon" style={{ fontSize: '3rem' }}>{service.icon}</div>
              <div>
                <h1>{service.name}</h1>
                <p className="sd-desc">{service.description}</p>
              </div>
            </div>

            {/* Info Cards */}
            <div className="sd-info-cards">
              <div className="sic"><div className="sic-icon">💰</div><div className="sic-label">Cost</div><div className="sic-val">{service.cost}</div></div>
              <div className="sic"><div className="sic-icon">⏱️</div><div className="sic-label">Time</div><div className="sic-val">{service.time}</div></div>
              <div className="sic"><div className="sic-icon">🌐</div><div className="sic-label">Mode</div><div className="sic-val">{service.mode}</div></div>
            </div>

            {/* Steps */}
            <div className="sd-steps">
              <h2>{tr('modal.stepsTitle', 'Step-by-Step Process')}</h2>
              {service.steps?.map((step, i) => (
                <div key={i} className="sd-step">
                  <div className="sd-step-num">{i + 1}</div>
                  <div className="sd-step-text">{step}</div>
                </div>
              ))}
            </div>

            {/* Documents */}
            <div className="sd-docs">
              <h3>{tr('modal.docsTitle', 'Required Documents')}</h3>
              <ul>
                {service.documents?.map((doc, i) => (
                  <li key={i}><span className="doc-check">✓</span> {doc}</li>
                ))}
              </ul>
            </div>

            {/* Office Locations */}
            {service.officeLocations?.length > 0 && (
              <div className="sd-offices">
                <h3>📍 Where to Apply</h3>
                <div className="offices-list">
                  {service.officeLocations.map((loc, i) => (
                    <span key={i} className="office-tag">{loc}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="sd-sidebar">
            <div className="sd-apply-card">
              <h3>Ready to Apply?</h3>
              <p>Submit your application directly through CityEase and track its progress.</p>

              <button
                className={`sd-apply-btn${applied ? ' applied' : ''}`}
                onClick={handleApply}
                disabled={applying || applied}
              >
                {applied ? '✅ Application Submitted!' : applying ? 'Submitting…' : tr('modal.applyBtn', 'Apply / Access Now →')}
              </button>

              <Link to="/#chatbot" className="sd-help-btn">
                💬 {tr('modal.askBtn', 'Ask Sakhi for Help')}
              </Link>
            </div>

            <div className="sd-share-card">
              <h4>Share this service</h4>
              <div className="share-btns">
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); showToast('Link copied!', 'success') }}>📋 Copy Link</button>
                <a href={`https://wa.me/?text=${encodeURIComponent(`Check out ${service.name} on CityEase: ${window.location.href}`)}`} target="_blank" rel="noopener">📱 WhatsApp</a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
