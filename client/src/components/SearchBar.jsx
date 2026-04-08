import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useLang } from '../contexts/LangContext'
import { useUser } from '../contexts/UserContext'
import { debounce } from '../utils/helpers'

const QUICK_TAGS = [
  { label: '💧 Water Bill',    query: 'Pay water bill online' },
  { label: '🏥 Hospital Near', query: 'Nearest government hospital' },
  { label: '🚌 Bus Routes',    query: 'Bus route finder' },
  { label: '📋 Ration Card',   query: 'Ration card apply' },
  { label: '📄 Birth Cert.',   query: 'Birth certificate' },
]

export default function SearchBar() {
  const { tr } = useLang()
  const { showToast } = useUser()
  const navigate   = useNavigate()
  const inputRef   = useRef()
  const suggRef    = useRef()

  const [query,       setQuery]       = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSugg,    setShowSugg]    = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [listening,   setListening]   = useState(false)

  const fetchSuggestions = useCallback(
    debounce(async (q) => {
      if (!q.trim()) { setSuggestions([]); return }
      try {
        setLoading(true)
        const { data } = await axios.get(`/api/search?q=${encodeURIComponent(q)}`)
        setSuggestions(data.data || [])
      } catch {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 300),
    []
  )

  useEffect(() => {
    fetchSuggestions(query)
  }, [query, fetchSuggestions])

  useEffect(() => {
    const close = (e) => {
      if (suggRef.current && !suggRef.current.contains(e.target) && e.target !== inputRef.current) {
        setShowSugg(false)
      }
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  function handleSearch(q = query) {
    if (!q.trim()) return
    setShowSugg(false)
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  function handleSelect(result) {
    setShowSugg(false)
    if (result.type === 'service') navigate(`/service/${result.id}`)
    else if (result.url?.startsWith('/service/')) navigate(result.url)
    else handleSearch(result.title)
  }

  function handleVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { showToast('Voice search not supported in this browser', 'error'); return }

    const recognition = new SR()
    recognition.lang = 'en-IN'
    recognition.interimResults = false
    recognition.continuous = false

    setListening(true)
    recognition.start()

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript
      setQuery(transcript)
      setListening(false)
      showToast(`🎙️ "${transcript}"`, 'info')
    }

    recognition.onerror = () => setListening(false)
    recognition.onend   = () => setListening(false)
  }

  const tags = QUICK_TAGS

  return (
    <div className="search-wrapper">
      <div className={`search-bar${showSugg && suggestions.length ? ' expanded' : ''}`}>
        <svg className="search-icon-svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" stroke="#6B7280" strokeWidth="2"/>
          <path d="M20 20l-3-3" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <input
          ref={inputRef}
          type="text"
          id="main-search-input"
          className="search-input"
          value={query}
          onChange={e => { setQuery(e.target.value); setShowSugg(true) }}
          onFocus={() => setShowSugg(true)}
          onKeyDown={e => { if (e.key === 'Enter') handleSearch(); if (e.key === 'Escape') setShowSugg(false) }}
          placeholder={tr('hero.searchPlaceholder', "Search for city services…")}
          aria-label="Search for city services"
          autoComplete="off"
        />
        <button
          className={`search-voice-btn${listening ? ' listening' : ''}`}
          onClick={handleVoice}
          aria-label="Voice search"
          title="Voice search"
        >
          {listening ? (
            <span className="voice-pulse">🎙️</span>
          ) : (
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <rect x="9" y="2" width="6" height="11" rx="3" fill="#4F6EF7"/>
              <path d="M5 10a7 7 0 0014 0" stroke="#4F6EF7" strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="17" x2="12" y2="21" stroke="#4F6EF7" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </button>
        <button
          className="search-btn"
          onClick={() => handleSearch()}
          id="search-btn"
        >
          {loading ? '…' : tr('hero.searchBtn', 'Search')}
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSugg && suggestions.length > 0 && (
        <div className="search-suggestions" ref={suggRef} role="listbox">
          {suggestions.map((s, i) => (
            <button
              key={i}
              className="suggestion-item"
              role="option"
              onClick={() => handleSelect(s)}
            >
              <span className="si-icon">{s.icon}</span>
              <span className="si-text">{s.title}</span>
              <span className="si-desc">{s.description?.substring(0, 50)}…</span>
              <span className={`si-badge si-${s.type}`}>{s.type}</span>
            </button>
          ))}
        </div>
      )}

      {/* Quick Tags */}
      <div className="quick-tags">
        <span className="tag-label">{tr('hero.popular', 'Popular:')}</span>
        {tags.map((tag, i) => (
          <button
            key={i}
            className="quick-tag"
            onClick={() => { setQuery(tag.query); handleSearch(tag.query) }}
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  )
}
