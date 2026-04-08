import React from 'react'
import SearchBar from '../components/SearchBar'
import { useLang } from '../contexts/LangContext'
import { useUser } from '../contexts/UserContext'

const STATS = [
  { target: 200, unit: '+', label: 'services' },
  { target: 12,  unit: 'L+', label: 'citizensHelped' },
  { target: 50,   unit: '+',  label: 'cities' },
  { target: 24,  unit: '/7', label: 'available' },
]

const MOCKUP_ITEMS = [
  { icon: '🚌', title: 'Bus 42 — Departure', sub: 'in 8 minutes', badge: 'LIVE', badgeType: 'live' },
  { icon: '💡', title: 'Electricity Bill', sub: 'Due in 3 days — ₹847', badge: 'PAY',  badgeType: 'warn' },
  { icon: '📄', title: 'Aadhaar Update', sub: 'Application #2024-8391', badge: 'DONE', badgeType: 'success' },
  { icon: '🏥', title: 'Health Appointment', sub: 'City Hospital — Apr 10', badge: 'SOON', badgeType: 'info' },
]

export default function Hero() {
  const { tr } = useLang()
  const { user } = useUser()

  return (
    <section className="hero" id="hero">
      <div className="hero-bg-anim">
        <div className="orb orb1"/><div className="orb orb2"/><div className="orb orb3"/>
      </div>

      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-dot"/>
          {tr('hero.badge', 'Smart City Services — Live & Updated')}
        </div>

        <h1 className="hero-heading">
          {tr('hero.heading1', 'Your City.')}<br/>
          <span className="gradient-text">{tr('hero.heading2', 'One Platform.')}</span><br/>
          {tr('hero.heading3', 'Zero Confusion.')}
        </h1>

        <p className="hero-sub">{tr('hero.subtext', 'CityEase brings all urban services together in one friendly, accessible place.')}</p>

        <SearchBar />

        <div className="hero-stats">
          {STATS.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <div className="stat-divider"/>}
              <div className="stat-item">
                <div className="stat-num-row">
                  <AnimatedNumber target={s.target}/>
                  <span className="stat-unit">{s.unit}</span>
                </div>
                <span className="stat-label">{tr(`hero.stats.${s.label}`, s.label)}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="hero-visual">
        <div className="mockup-card">
          <div className="mockup-header">
            <div className="mockup-dots"><span/><span/><span/></div>
            <span className="mockup-title">CityEase Dashboard</span>
          </div>
          <div className="mockup-body">
            <div className="mockup-welcome">Good Morning, {user.name.split(' ')[0]} 👋</div>
            <div className="mockup-items">
              {MOCKUP_ITEMS.map((item, i) => (
                <div key={i} className={`mockup-item${i === 0 ? ' active' : ''}`}>
                  <span className="mi-icon">{item.icon}</span>
                  <div className="mi-info">
                    <span>{item.title}</span>
                    <small>{item.sub}</small>
                  </div>
                  <span className={`mi-badge ${item.badgeType}`}>{item.badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function AnimatedNumber({ target }) {
  const [val, setVal] = React.useState(0)
  const ref = React.useRef()

  React.useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      let start = null
      const animate = (ts) => {
        if (!start) start = ts
        const progress = Math.min((ts - start) / 1600, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setVal(Math.floor(eased * target))
        if (progress < 1) requestAnimationFrame(animate)
        else setVal(target)
      }
      requestAnimationFrame(animate)
      io.disconnect()
    })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [target])

  return <span className="stat-num" ref={ref}>{val}</span>
}
