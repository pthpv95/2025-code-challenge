import { useState } from 'react'
import SwapForm from './components/SwapForm'
import './App.css'

function App() {
  const [isConnected, setIsConnected] = useState(false)

  return (
    <div className="app">
      <header className="header" onClick={() => {
        window.history.replaceState({}, '', window.location.pathname)
      }}>
        <div className="header-content">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 0L20 12L32 16L20 20L16 32L12 20L0 16L12 12L16 0Z" fill="url(#gradient)"/>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stopColor="#FF6B9D"/>
                  <stop offset="100%" stopColor="#C648C8"/>
                </linearGradient>
              </defs>
            </svg>
            <span className="logo-text">Mono Swap</span>
          </div>
          <button
            className={`connect-button ${isConnected ? 'connected' : ''}`}
            onClick={() => setIsConnected(!isConnected)}
          >
            {isConnected ? '0x1234...5678' : 'Connect Wallet'}
          </button>
        </div>
      </header>
      <main className="main">
        <SwapForm />
      </main>
      <div className="background-gradient"></div>
    </div>
  )
}

export default App
