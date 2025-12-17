import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ConstructionPage } from '../pages/ConstructionPage'

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ConstructionPage />} />
      </Routes>
    </BrowserRouter>
  )
}

