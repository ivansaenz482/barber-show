import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import StorePage from './StorePage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StorePage />
  </StrictMode>,
)
