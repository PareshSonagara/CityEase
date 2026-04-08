import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { LangProvider } from './contexts/LangContext'
import { UserProvider } from './contexts/UserContext'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LangProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </LangProvider>
    </BrowserRouter>
  </React.StrictMode>
)
