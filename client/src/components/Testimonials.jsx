import React, { useState, useEffect } from 'react'
import { useLang } from '../contexts/LangContext'

const TESTIMONIALS = [
  {
    text: "I had no idea how to get a ration card made. CityEase showed me the exact process and documents needed. Very easy!",
    name: 'Sunita Devi', role: 'Homemaker, Nagpur', avatar: 'S', stars: 5,
  },
  {
    text: "The live bus tracker saved me so much time every morning. Now I know exactly when to leave home. The app is incredibly helpful!",
    name: 'Arjun Mehta', role: 'IT Professional, Pune', avatar: 'A', stars: 5,
  },
  {
    text: "CityEase is the perfect platform! I easily understood the entire process and was able to comfortably pay my electricity bill.",
    name: 'Ramila Ben Patel', role: 'Housewife, Surat', avatar: 'R', stars: 5,
  },
  {
    text: "I moved to Pune 6 months ago. CityEase helped me find a hospital, register for water supply, and get my local bus pass in one weekend!",
    name: 'Ravi Shankar', role: 'Migrant Worker, Pune', avatar: 'R', stars: 5,
  },
]

export default function Testimonials() {
  const { tr } = useLang()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % TESTIMONIALS.length), 5000)
    return () => clearInterval(t)
  }, [])

  const perView = window.innerWidth < 768 ? 1 : 2
  const translateX = current * (100 / perView)

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">Citizen Stories</div>
          <h2>What <span className="gradient-text">Real Citizens</span> Say</h2>
        </div>

        <div className="testimonials-slider">
          <div className="testimonial-track" style={{ transform: `translateX(-${translateX}%)` }}>
            {TESTIMONIALS.map((t, i) => (
              <article key={i} className="testimonial-card">
                <div className="testi-quote" aria-hidden="true">"</div>
                <p className="testi-text">{t.text}</p>
                <div className="testi-author">
                  <div className="testi-avatar">{t.avatar}</div>
                  <div>
                    <span className="testi-name">{t.name}</span>
                    <span className="testi-role">{t.role}</span>
                  </div>
                  <div className="testi-stars">{'★'.repeat(t.stars)}</div>
                </div>
              </article>
            ))}
          </div>

          <div className="slider-controls">
            <button className="slider-btn" onClick={() => setCurrent(c => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}>←</button>
            <div className="slider-dots">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} className={`sdot${i === current ? ' active' : ''}`} onClick={() => setCurrent(i)}/>
              ))}
            </div>
            <button className="slider-btn" onClick={() => setCurrent(c => (c + 1) % TESTIMONIALS.length)}>→</button>
          </div>
        </div>
      </div>
    </section>
  )
}
