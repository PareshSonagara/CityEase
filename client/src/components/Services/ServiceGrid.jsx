import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useLang } from '../../contexts/LangContext'
import { useUser } from '../../contexts/UserContext'

const CATEGORY_META = {
  transport:  { icon: '🚌', label: 'Transport',   color: 'linear-gradient(135deg,#3B82F6,#4F6EF7)' },
  health:     { icon: '🏥', label: 'Healthcare',  color: 'linear-gradient(135deg,#EC4899,#EF4444)' },
  utilities:  { icon: '💡', label: 'Utilities',   color: 'linear-gradient(135deg,#F59E0B,#F97316)' },
  municipal:  { icon: '🏛️', label: 'Municipal',   color: 'linear-gradient(135deg,#10B981,#059669)' },
  schemes:    { icon: '🏅', label: 'Schemes',     color: 'linear-gradient(135deg,#7C3AED,#9333EA)' },
  documents:  { icon: '📄', label: 'Documents',   color: 'linear-gradient(135deg,#06B6D4,#0284C7)' },
}

export default function ServiceGrid() {
  const { lang, tr } = useLang()
  const { showToast } = useUser()
  const navigate = useNavigate()

  const [services,  setServices]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [filter,    setFilter]    = useState('all')

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const { data } = await axios.get(`/api/services?lang=${lang}`)
        setServices(data.data)
      } catch {
        showToast('Failed to load services', 'error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [lang])

  const categories = ['all', ...Object.keys(CATEGORY_META)]
  const filtered = filter === 'all' ? services : services.filter(s => s.category === filter)

  return (
    <section className="services-section" id="services">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">{tr('services.sectionBadge', 'All Services')}</div>
          <h2>{tr('services.heading', 'Everything You Need,')} <span className="gradient-text">In One Place</span></h2>
          <p>{tr('services.subtext', 'From paying bills to tracking buses — access every urban service without stepping out.')}</p>
        </div>

        {/* Category tabs */}
        <div className="service-filters" role="group" aria-label="Service categories">
          {categories.map(cat => (
            <button
              key={cat}
              className={`sf-btn${filter === cat ? ' active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat === 'all' ? '🗂️ All' : `${CATEGORY_META[cat]?.icon} ${CATEGORY_META[cat]?.label}`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="services-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="service-card skeleton">
                <div className="skeleton-icon"/>
                <div className="skeleton-title"/>
                <div className="skeleton-text"/>
                <div className="skeleton-text short"/>
              </div>
            ))}
          </div>
        ) : (
          <div className="services-grid">
            {filtered.map(svc => (
              <ServiceCard
                key={svc.id}
                svc={svc}
                meta={CATEGORY_META[svc.category]}
                tr={tr}
                onClick={() => navigate(`/service/${svc.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function ServiceCard({ svc, meta, tr, onClick }) {
  return (
    <article
      className="service-card"
      onClick={onClick}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick() }}
      tabIndex={0}
      role="button"
      aria-label={`${svc.name} — ${svc.description}`}
    >
      <div className="sc-icon" style={{ background: meta?.color || '#4F6EF7' }}>
        <span style={{ fontSize: '1.5rem' }}>{svc.icon}</span>
      </div>
      <h3 className="sc-title">{svc.name}</h3>
      <p className="sc-desc">{svc.description}</p>
      <div className="sc-meta">
        <span className="sc-cost">💰 {svc.cost}</span>
        <span className="sc-time">⏱ {svc.time}</span>
      </div>
      <div className="sc-tags">
        {svc.tags?.slice(0, 3).map(t => <span key={t}>{t}</span>)}
      </div>
      <span className="sc-link">{tr('services.exploreBtn', 'Explore →')}</span>
    </article>
  )
}
