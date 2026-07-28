import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ReportProvider } from './context/ReportContext.jsx'
import outputs from '../../amplify_outputs.json'

Amplify.configure(outputs)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ReportProvider>
        <App />
      </ReportProvider>
    </AuthProvider>
  </StrictMode>,
)
