import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useLang } from '../contexts/LangContext'
import { useUser } from '../contexts/UserContext'

const FILTER_MAP = {
  all:       '🗺️ All',
  hospital:  '🏥 Hospitals',
  transport: '🚌 Transport',
  office:    '🏛️ Offices',
  utility:   '💡 Utility',
}

export default function Location() {
  const { lang, tr } = useLang()
  const { showToast } = useUser()
  const [filter,  setFilter]  = useState('all')
  const [places,  setPlaces]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    axios.get(`/api/nearby?filter=${filter}`)
      .then(r => setPlaces(r.data.data))
      .catch(() => showToast('Failed to load nearby places', 'error'))
      .finally(() => setLoading(false))
  }, [filter])

  const filters = Object.entries(FILTER_MAP)

  return (
    <section className="location-section" id="location">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">{tr('location.sectionBadge', 'Near You')}</div>
          <h2>{tr('location.heading', 'Services')} <span className="gradient-text">Around You</span></h2>
          <p>{tr('location.subtext', 'Find hospitals, offices, transport, and centers near your location.')}</p>
        </div>

        <div className="location-filters">
          {filters.map(([key, label]) => (
            <button
              key={key}
              className={`loc-filter${filter === key ? ' active' : ''}`}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="location-content">
          {/* Map Placeholder */}
          <div className="map-placeholder" role="img" aria-label="Interactive map">
            <div className="map-grid-bg"/>
            <div className="map-pins" aria-hidden="true">
              {places.map((p, i) => (
                <div
                  key={p.id}
                  className={`map-pin ${p.type}`}
                  style={{
                    top:  `${20 + (i * 12) % 60}%`,
                    left: `${15 + (i * 17) % 70}%`,
                  }}
                  title={p.name}
                >
                  {p.icon}
                </div>
              ))}
              <div className="map-pulse-center" style={{ top: '50%', left: '50%' }}>📍</div>
            </div>
            <div className="map-legend">
              <div><span className="legend-dot hospital"/>Hospitals</div>
              <div><span className="legend-dot transport"/>Transport</div>
              <div><span className="legend-dot office"/>Offices</div>
              <div><span className="legend-dot utility"/>Utilities</div>
            </div>
            <div className="map-bottom">
              <span className="map-label">{tr('location.mapLabel', 'Enable location for personalization')}</span>
              <button
                className="map-enable-btn"
                onClick={() => {
                  navigator.geolocation?.getCurrentPosition(
                    () => showToast('📍 Location enabled!', 'success'),
                    () => showToast('Location access denied', 'warn')
                  )
                }}
              >
                {tr('location.enableLocation', '📍 Use My Location')}
              </button>
            </div>
          </div>

          {/* Nearby List */}
          <div className="nearby-list">
            {loading ? (
              [...Array(4)].map((_, i) => <div key={i} className="nearby-item skeleton"/>)
            ) : places.map(p => (
              <div key={p.id} className="nearby-item">
                <div className={`ni-icon ${p.type}`}>{p.icon}</div>
                <div className="ni-info">
                  <h4>{p.name}</h4>
                  <p>{p.distanceKm} km · {p.hours}</p>
                  {p.phone && <p className="ni-phone">📞 {p.phone}</p>}
                  <div className="ni-tags">
                    {p.features?.map(f => <span key={f}>{f}</span>)}
                  </div>
                </div>
                <a
                  href={`https://maps.google.com/?q=${p.name}&ll=${p.lat},${p.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ni-action"
                  aria-label={`Get directions to ${p.name}`}
                >
                  {tr('location.directionsBtn', 'Directions')}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
