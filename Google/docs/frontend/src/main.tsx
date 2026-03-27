import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import AppLayout from './layouts/AppLayout'
import Docs from './pages/Docs'
import Sheets from './pages/Sheets'
import Forms from './pages/Forms'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/tools" element={<AppLayout />}>
          <Route path="docs" element={<Docs />} />
          <Route path="sheets" element={<Sheets />} />
          <Route path="forms" element={<Forms />} />
          <Route index element={<Navigate to="docs" replace />} />
        </Route>
        <Route path="/" element={<Navigate to="/tools/docs" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
