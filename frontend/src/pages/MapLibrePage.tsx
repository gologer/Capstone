import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import MapChrome from '../components/MapChrome'

// [lng, lat] — Bangkok
const CENTER: [number, number] = [100.5018, 13.7563]

export default function MapLibrePage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const map = new maplibregl.Map({
      container: el,
      // Free demo style — no API key required
      style: 'https://demotiles.maplibre.org/style.json',
      center: CENTER,
      zoom: 4.5,
    })
    map.addControl(new maplibregl.NavigationControl(), 'top-right')
    const marker = new maplibregl.Marker().setLngLat(CENTER).addTo(map)

    return () => {
      marker.remove()
      map.remove()
    }
  }, [])

  return (
    <MapChrome title="MapLibre GL JS">
      <div ref={containerRef} className="map-canvas" />
    </MapChrome>
  )
}
