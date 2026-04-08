import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useLang } from '../../contexts/LangContext'
import { useUser } from '../../contexts/UserContext'
import { formatCurrency, daysUntil, statusColor, statusLabel, formatDate } from '../../utils/helpers'

export default function Dashboard() {
  const { lang, tr } = useLang()
  const { user, showToast } = useUser()

  const [activeTab,    setActiveTab]    = useState('overview')
  const [bills,        setBills]        = useState([])
  const [applications, setApplications] = useState([])
  const [reminders,    setReminders]    = useState([])
  const [transit,      setTransit]      = useState([])
  const [loading,      setLoading]      = useState(true)

  async function loadAll() {
    try {
      const [billsR, appsR, remsR, transitR] = await Promise.all([
        axios.get('/api/bills'),
        axios.get('/api/applications'),
        axios.get('/api/reminders'),
        axios.get('/api/transit'),
      ])
      setBills(billsR.data.data)
      setApplications(appsR.data.data)
      setReminders(remsR.data.data)
      setTransit(transitR.data.data)
    } catch {
      showToast('Failed to load dashboard data', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
    // Refresh transit every 30 seconds
    const t = setInterval(async () => {
      try {
        const { data } = await axios.get('/api/transit')
        setTransit(data.data)
      } catch {}
    }, 30000)
    return () => clearInterval(t)
  }, [])

  async function payBill(billId) {
    try {
      showToast('💳 Processing payment…', 'info')
      await axios.post(`/api/bills/${billId}/pay`)
      showToast('✅ Payment successful! Receipt saved.', 'success', 4000)
      const { data } = await axios.get('/api/bills')
      setBills(data.data)
    } catch {
      showToast('Payment failed. Please try again.', 'error')
    }
  }

  async function completeReminder(remId) {
    await axios.post(`/api/reminders/${remId}/complete`)
    setReminders(prev => prev.filter(r => r.id !== remId))
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'
  const greetingLabel = tr('dashboard.welcome', greeting)

  const unpaidBills = bills.filter(b => !b.paid)
  const totalDue    = unpaidBills.reduce((s, b) => s + b.amount, 0)
  const activeApps  = applications.filter(a => a.status !== 'completed')

  const navItems = [
    { id: 'overview',     icon: '📊', label: tr('dashboard.nav.overview',     'Overview')    },
    { id: 'applications', icon: '📋', label: tr('dashboard.nav.applications', 'My Applications') },
    { id: 'payments',     icon: '💳', label: tr('dashboard.nav.payments',     'Payments'),   badge: unpaidBills.length },
    { id: 'reminders',    icon: '🔔', label: tr('dashboard.nav.reminders',    'Reminders'),  badge: reminders.length },
    { id: 'transport',    icon: '🚌', label: tr('dashboard.nav.transport',    'Transport')   },
  ]

  return (
    <section className="dashboard-section" id="dashboard">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">{tr('dashboard.sectionBadge', 'Your Hub')}</div>
          <h2>{tr('dashboard.heading', 'Track Everything in Your')} <span className="gradient-text">Personal Dashboard</span></h2>
          <p>{tr('dashboard.subtext', 'Manage applications, bills, and service history.')}</p>
        </div>

        <div className="dashboard-preview">
          {/* Sidebar */}
          <aside className="db-sidebar">
            <div className="db-user">
              <div className="db-avatar">{user.avatar}</div>
              <div className="db-user-info">
                <span className="db-name">{user.name}</span>
                <span className="db-loc">📍 {user.city}</span>
              </div>
            </div>
            <nav className="db-nav">
              {navItems.map(item => (
                <button
                  key={item.id}
                  className={`db-nav-item${activeTab === item.id ? ' active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="db-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge > 0 && <span className="db-badge">{item.badge}</span>}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <div className="db-main">
            {loading ? (
              <div className="db-loading">
                <div className="spinner"/>
                <p>Loading your dashboard…</p>
              </div>
            ) : (
              <>
                <div className="db-top">
                  <div>
                    <h3>{greetingLabel}, {user.name.split(' ')[0]} 👋</h3>
                    <span className="db-date">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>

                {activeTab === 'overview' && (
                  <div className="db-widgets">
                    {/* Applications Widget */}
                    <div className="widget">
                      <div className="w-header">
                        <h4>📋 {tr('dashboard.applications', 'Applications')}</h4>
                        <span className="w-count">{activeApps.length} {tr('dashboard.activeLabel', 'Active')}</span>
                      </div>
                      {applications.slice(0, 3).map(app => (
                        <div key={app.id} className="w-item">
                          <span className="w-label">{app.service_name}</span>
                          <div className="w-progress-bar">
                            <div className="w-progress" style={{ width: `${app.progress}%`, background: statusColor(app.status) }}/>
                          </div>
                          <span className="w-status" style={{ color: statusColor(app.status) }}>
                            {statusLabel(app.status)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Bills Widget */}
                    <div className="widget">
                      <div className="w-header">
                        <h4>💡 {tr('dashboard.upcomingBills', 'Upcoming Bills')}</h4>
                        <span className="w-count">{formatCurrency(totalDue)} {tr('dashboard.dueLabel', 'Due')}</span>
                      </div>
                      {unpaidBills.slice(0, 3).map(bill => (
                        <div key={bill.id} className="bill-item">
                          <span className="bill-icon">{bill.icon}</span>
                          <div className="bill-info">
                            <span>{bill.provider}</span>
                            <small style={{ color: daysUntil(bill.due_date) <= 3 ? '#EF4444' : '#6B7280' }}>
                              Due {daysUntil(bill.due_date)} days · {formatDate(bill.due_date)}
                            </small>
                          </div>
                          <span className="bill-amount">{formatCurrency(bill.amount)}</span>
                          <button className="bill-pay-btn" onClick={() => payBill(bill.id)}>
                            {tr('dashboard.payBtn', 'Pay')}
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Reminders Widget */}
                    <div className="widget">
                      <div className="w-header">
                        <h4>🔔 {tr('dashboard.reminders', 'Reminders')}</h4>
                        <span className="w-count">{reminders.length} {tr('dashboard.pendingLabel', 'Pending')}</span>
                      </div>
                      {reminders.map(rem => (
                        <div key={rem.id} className="reminder-item">
                          <span className={`ri-circle${rem.urgent ? ' urgent' : ''}`}/>
                          <div className="ri-text">
                            <strong>{rem.title}</strong>
                            {rem.description && <p>{rem.description}</p>}
                          </div>
                          <button className="ri-done-btn" onClick={() => completeReminder(rem.id)}>✓</button>
                        </div>
                      ))}
                    </div>

                    {/* Transit Widget */}
                    <div className="widget">
                      <div className="w-header">
                        <h4>🚌 {tr('dashboard.liveTransit', 'Live Transit')}</h4>
                        <span className="w-live">{tr('dashboard.liveLabel', 'LIVE')}</span>
                      </div>
                      {transit.slice(0, 4).map(t => (
                        <div key={t.id} className="transit-item">
                          <span className="ti-route">{t.route}</span>
                          <span className="ti-dest">→ {t.destination}</span>
                          <span className={`ti-time${t.status === 'arriving' ? ' arriving' : ''}`}>
                            {t.minutesAway} min
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'applications' && (
                  <div className="tab-content">
                    <h4 className="tc-heading">All Applications</h4>
                    {applications.length === 0 ? (
                      <div className="empty-state">
                        <span>📋</span>
                        <p>No applications yet. Browse services to apply.</p>
                      </div>
                    ) : (
                      applications.map(app => (
                        <div key={app.id} className="app-row">
                          <div className="app-row-info">
                            <h5>{app.service_name}</h5>
                            <p>Ref: {app.reference} · Submitted {formatDate(app.created_at)}</p>
                          </div>
                          <div className="app-row-progress">
                            <div className="w-progress-bar wide">
                              <div className="w-progress" style={{ width: `${app.progress}%`, background: statusColor(app.status) }}/>
                            </div>
                            <span className="w-status" style={{ color: statusColor(app.status) }}>
                              {statusLabel(app.status)} ({app.progress}%)
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'payments' && (
                  <div className="tab-content">
                    <h4 className="tc-heading">All Bills</h4>
                    {bills.map(bill => (
                      <div key={bill.id} className={`bill-item full${bill.paid ? ' paid' : ''}`}>
                        <span className="bill-icon">{bill.icon}</span>
                        <div className="bill-info">
                          <span>{bill.provider} — {bill.type}</span>
                          <small>{bill.paid ? `Paid on ${formatDate(bill.paid_at)}` : `Due ${formatDate(bill.due_date)}`}</small>
                        </div>
                        <span className="bill-amount">{formatCurrency(bill.amount)}</span>
                        {!bill.paid ? (
                          <button className="bill-pay-btn" onClick={() => payBill(bill.id)}>
                            {tr('dashboard.payBtn', 'Pay')}
                          </button>
                        ) : (
                          <span className="paid-badge">✓ Paid</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reminders' && (
                  <div className="tab-content">
                    <h4 className="tc-heading">All Reminders</h4>
                    {reminders.length === 0 ? (
                      <div className="empty-state"><span>🎉</span><p>No pending reminders!</p></div>
                    ) : (
                      reminders.map(rem => (
                        <div key={rem.id} className="reminder-item full">
                          <span className={`ri-circle${rem.urgent ? ' urgent' : ''}`}/>
                          <div className="ri-text">
                            <strong>{rem.title}</strong>
                            <p>{rem.description}</p>
                            <small>{rem.due_date ? `Due: ${formatDate(rem.due_date)}` : ''}</small>
                          </div>
                          <button className="ri-done-btn" onClick={() => completeReminder(rem.id)}>✓ Done</button>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'transport' && (
                  <div className="tab-content">
                    <div className="transit-header">
                      <h4 className="tc-heading">Live Transit Updates</h4>
                      <span className="w-live blink">● LIVE</span>
                    </div>
                    <div className="transit-full-list">
                      {transit.map(t => (
                        <div key={t.id} className="transit-full-item">
                          <span className={`tf-icon ${t.type}`}>{t.type === 'metro' ? '🚇' : '🚌'}</span>
                          <div className="tf-info">
                            <strong>{t.route}</strong>
                            <span>→ {t.destination}</span>
                            {t.platform && <span className="tf-platform">Platform {t.platform?.replace('Platform ','')}</span>}
                          </div>
                          <div className={`tf-time${t.status === 'arriving' ? ' arriving' : ''}`}>
                            <span className="tf-min">{t.minutesAway}</span>
                            <span className="tf-min-label">min</span>
                          </div>
                          {t.status === 'arriving' && <span className="tf-arriving-badge">Arriving!</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
