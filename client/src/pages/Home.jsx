import React from 'react'
import Hero from '../components/Hero'
import ServiceGrid from '../components/Services/ServiceGrid'
import HowItWorks from '../components/HowItWorks'
import Location from '../components/Location'
import Emergency from '../components/Emergency'
import ChatbotSection from '../components/ChatbotSection'
import Dashboard from '../components/Dashboard/Dashboard'
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Hero />
      <ServiceGrid />
      <HowItWorks />
      <Location />
      <Emergency />
      <ChatbotSection />
      <Dashboard />
      <Testimonials />
      <Footer />
    </>
  )
}
