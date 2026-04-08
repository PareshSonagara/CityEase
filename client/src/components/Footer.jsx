import React from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../contexts/LangContext'

export default function Footer() {
  const { tr } = useLang()

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-content">
        <div className="footer-brand">
          <Link to="/" className="nav-logo footer-logo">
            <div className="logo-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="8" fill="url(#footerLogoGrad)"/>
                <path d="M7 20V12L14 7L21 12V20H16V16H12V20H7Z" fill="white"/>
                <defs>
                  <linearGradient id="footerLogoGrad" x1="0" y1="0" x2="28" y2="28">
                    <stop stopColor="#4F6EF7"/>
                    <stop offset="1" stopColor="#7C3AED"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="logo-text">CityEase</span>
          </Link>
          <p className="footer-tagline">{tr('footer.tagline', 'Simplifying city life for every citizen.')}</p>
          <div className="footer-socials">
            {['𝕏', 'f', '📸', '▶'].map((icon, i) => (
              <a key={i} href="#" className="social-btn" onClick={e => e.preventDefault()}>{icon}</a>
            ))}
          </div>
        </div>

        <div className="footer-links-group">
          <h4>{tr('footer.services', 'Services')}</h4>
          <ul>
            {['transport','health','utilities','municipal','schemes'].map(id => (
              <li key={id}><button className="footer-link-btn" onClick={() => scrollTo('services')}>{id.charAt(0).toUpperCase() + id.slice(1)}</button></li>
            ))}
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>{tr('footer.support', 'Support')}</h4>
          <ul>
            {['Help Center', 'AI Chatbot', 'Feedback', 'Accessibility'].map(item => (
              <li key={item}><a href="#">{item}</a></li>
            ))}
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>{tr('footer.about', 'About')}</h4>
          <ul>
            {['About CityEase', 'Privacy Policy', 'Terms of Use', 'Open Data'].map(item => (
              <li key={item}><a href="#">{item}</a></li>
            ))}
          </ul>
        </div>

        <div className="footer-app">
          <h4>{tr('footer.getApp', 'Get the App')}</h4>
          <p>{tr('footer.appSubtext', 'Available on Android and iOS')}</p>
          <a href="#" className="app-store-btn"><span>🤖</span> Google Play</a>
          <a href="#" className="app-store-btn"><span>🍎</span> App Store</a>

        </div>
      </div>

      <div className="footer-bottom">
        <p>{tr('footer.copyright', '© 2026 CityEase. A Smart City Initiative. All rights reserved.')}</p>
        <div className="footer-badges">
          {(tr('footer.badges') || ['🇮🇳 Digital India', '🏙️ Smart Cities Mission', '♿ WCAG 2.1 AA']).map((b, i) => (
            <span key={i} className="fb-badge">{b}</span>
          ))}
        </div>
      </div>
    </footer>
  )
}
