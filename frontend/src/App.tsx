import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import LeafletPage from './pages/LeafletPage'
import MapLibrePage from './pages/MapLibrePage'
import CesiumPage from './pages/CesiumPage'
import ReportPage from './pages/ReportPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/leaflet" element={<LeafletPage />} />
      <Route path="/maplibre" element={<MapLibrePage />} />
      <Route path="/cesium" element={<CesiumPage />} />
      <Route path="/report" element={<ReportPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
