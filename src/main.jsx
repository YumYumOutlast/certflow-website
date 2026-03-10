import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CommandCenter from './CommandCenter.jsx'
import { inject } from '@vercel/analytics'

inject()

function Router() {
  const path = window.location.pathname;
  if (path === '/engine') return <CommandCenter />;
  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
)