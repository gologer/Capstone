import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface MapChromeProps {
  title: string
  children: ReactNode
}

/** Full-screen wrapper for a map demo with a floating back-bar. */
export default function MapChrome({ title, children }: MapChromeProps) {
  return (
    <div className="map-page">
      <div className="map-topbar">
        <Link to="/" className="back-link">← กลับหน้าหลัก</Link>
        <span className="map-title">{title}</span>
      </div>
      {children}
    </div>
  )
}
