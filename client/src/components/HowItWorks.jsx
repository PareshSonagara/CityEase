import React from 'react'
import { useLang } from '../contexts/LangContext'
import { useUser } from '../contexts/UserContext'

export default function HowItWorks() {
  const { tr } = useLang()

  const steps = [
    {
      num: '01', icon: '🔍',
      title: tr('howItWorks.steps.0.title', 'Search or Browse'),
      desc:  tr('howItWorks.steps.0.desc', 'Type your query in plain language or browse by category.'),
      example: tr('howItWorks.steps.0.example', '"How do I apply for a ration card?"'),
    },
    {
      num: '02', icon: '📋',
      title: tr('howItWorks.steps.1.title', 'Follow Step-by-Step Guide'),
      desc:  tr('howItWorks.steps.1.desc', 'Get clear instructions with required documents, costs, and timelines.'),
      example: tr('howItWorks.steps.1.example', 'Documents needed, time: 7 days, cost: Free'),
    },
    {
      num: '03', icon: '✅',
      title: tr('howItWorks.steps.2.title', 'Track & Complete'),
      desc:  tr('howItWorks.steps.2.desc', 'Apply online or know exactly where to go. Track your progress live.'),
      example: tr('howItWorks.steps.2.example', 'Application #2024-8391 — In Review'),
    },
  ]

  const flowNodes = [
    { icon: '🏠', label: 'Visit CityEase', type: 'start', tooltip: null },
    { icon: '🔍', label: 'Search Service', type: '', tooltip: null },
    { icon: '📄', label: 'Prepare Docs', type: '', tooltip: 'Aadhaar, Hospital Record, Photo ID' },
    { icon: '🖥️', label: 'Apply Online', type: '', tooltip: null },
    { icon: '✅', label: 'Done!', type: 'end', tooltip: 'Delivered in 7 days' },
  ]

  return (
    <section className="how-section" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">{tr('howItWorks.sectionBadge', 'Simple Process')}</div>
          <h2>{tr('howItWorks.heading', 'How')} <span className="gradient-text">CityEase</span> Works</h2>
          <p>{tr('howItWorks.subtext', 'Three simple steps from confusion to clarity. No middlemen.')}</p>
        </div>

        <div className="steps-container">
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <div className="step-item">
                <div className="step-num">{step.num}</div>
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                <div className="step-example">{step.example}</div>
              </div>
              {i < steps.length - 1 && (
                <div className="step-connector">
                  <div className="connector-arrow">→</div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Flow Diagram */}
        <div className="flow-diagram">
          <div className="flow-title">Visual Process Flow — Birth Certificate Application</div>
          <div className="flow-steps">
            {flowNodes.map((node, i) => (
              <React.Fragment key={i}>
                <div className={`flow-node${node.type ? ` ${node.type}` : ''}`}>
                  <div className="fn-icon">{node.icon}</div>
                  <div className="fn-label">{node.label}</div>
                  {node.tooltip && <div className="fn-tooltip">{node.tooltip}</div>}
                </div>
                {i < flowNodes.length - 1 && <div className="flow-arrow">→</div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
