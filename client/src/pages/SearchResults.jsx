import React, { useEffect, useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useLang } from '../contexts/LangContext'

export default function SearchResults() {
  const { lang, tr } = useLang()
  const [params]     = useSearchParams()
  const query        = params.get('q') || ''
  const navigate     = useNavigate()

  const [results,  setResults]  = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    if (!query) return
    setLoading(true)
    axios.get(`/api/search?q=${encodeURIComponent(query)}&lang=${lang}`)
      .then(r => setResults(r.data.data))
      .finally(() => setLoading(false))
  }, [query, lang])

  return (
    <div className="search-results-page">
      <div className="container">
        <div className="sr-header">
          <Link to="/" className="back-btn">← Back</Link>
          <h1>Search Results for: <span className="gradient-text">"{query}"</span></h1>
          <p>{loading ? 'Searching…' : `${results.length} results found`}</p>
        </div>

        {loading ? (
          <div className="sr-grid">
            {[...Array(4)].map((_, i) => <div key={i} className="sr-card skeleton"/>)}
          </div>
        ) : results.length === 0 ? (
          <div className="empty-state full">
            <span>🔍</span>
            <h3>No results found</h3>
            <p>Try different keywords or browse all services below.</p>
            <Link to="/" className="nav-btn">Browse All Services</Link>
          </div>
        ) : (
          <div className="sr-grid">
            {results.map((r, i) => (
              <div
                key={i}
                className="sr-card"
                onClick={() => {
                  if (r.type === 'service') navigate(`/service/${r.id}`)
                  else if (r.url?.startsWith('/service/')) navigate(r.url)
                }}
              >
                <div className="sr-icon">{r.icon}</div>
                <div className="sr-content">
                  <h3>{r.title}</h3>
                  <p>{r.description}</p>
                  {r.cost && <span className="sr-cost">💰 {r.cost}</span>}
                  {r.time && <span className="sr-time">⏱ {r.time}</span>}
                </div>
                <span className={`sr-type-badge ${r.type}`}>{r.type}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
