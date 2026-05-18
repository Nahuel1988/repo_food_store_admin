import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './shared/App/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
