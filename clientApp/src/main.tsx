import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApiProvider } from './context/apiProvider.tsx'
import App from './App.tsx'
import './main.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApiProvider>
      <App />
    </ApiProvider>
  </StrictMode>,
)
