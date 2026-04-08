import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../contexts/LangContext'
import { useUser } from '../contexts/UserContext'

export default function Navbar() {
  const { tr } = useLang()
  const { showToast } = useUser()
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  function scrollTo(id) {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else navigate('/')
  }

  const links = [
    { label: tr('nav.services',     'Services'),      id: 'services'    },
    { label: tr('nav.howItWorks',   'How It Works'),  id: 'how-it-works'},
    { label: tr('nav.emergency',    '🚨 Emergency'),   id: 'emergency',   className: 'nav-emergency' },
    { label: tr('nav.aiAssistant',  'AI Assistant'),  id: 'chatbot'     },
  ]

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} role="navigation">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo" aria-label="CityEase home">
          <div className="logo-icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="url(#logoGrad)"/>
              <path d="M7 20V12L14 7L21 12V20H16V16H12V20H7Z" fill="white"/>
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28">
                  <stop stopColor="#4F6EF7"/>
                  <stop offset="1" stopColor="#7C3AED"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="logo-text">CityEase</span>
        </Link>

        {/* Desktop Nav */}
        <div className={`nav-links${menuOpen ? ' open' : ''}`}>
          {links.map(link => (
            <button
              key={link.id}
              className={`nav-link${link.className ? ` ${link.className}` : ''}`}
              onClick={() => scrollTo(link.id)}
            >
              {link.label}
            </button>
          ))}
          <button className="nav-btn" onClick={() => scrollTo('dashboard')}>
            {tr('nav.dashboard', 'My Dashboard')}
          </button>
        </div>

        {/* Actions */}
        <div className="nav-actions">
          {/* Hamburger */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : '' }}/>
            <span style={{ opacity: menuOpen ? 0 : 1 }}/>
            <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : '' }}/>
          </button>
        </div>
      </div>
    </nav>
  )
}
