import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Verificar se o elemento root existe
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

// Criar e renderizar a aplicação
const root = createRoot(rootElement)
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)

