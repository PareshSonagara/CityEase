import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ServiceDetail from './pages/ServiceDetail'
import SearchResults from './pages/SearchResults'
import Toast from './components/Toast'
import FloatingChat from './components/Chatbot/FloatingChat'
import { useUser } from './contexts/UserContext'

export default function App() {
  const { toast } = useUser()

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </main>
      <FloatingChat />
      {toast && <Toast key={toast.id} message={toast.message} type={toast.type} />}
    </>
  )
}
