// src/utils/helpers.js
export function debounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatCurrency(amount) {
  return `₹${Number(amount).toLocaleString('en-IN')}`
}

export function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function statusColor(status) {
  const map = {
    completed:    '#10B981',
    in_review:    '#06B6D4',
    pending_docs: '#F59E0B',
    submitted:    '#4F6EF7',
    rejected:     '#EF4444',
  }
  return map[status] || '#6B7280'
}

export function statusLabel(status) {
  const map = {
    completed:    'Completed',
    in_review:    'In Review',
    pending_docs: 'Pending Docs',
    submitted:    'Submitted',
    rejected:     'Rejected',
  }
  return map[status] || status
}
