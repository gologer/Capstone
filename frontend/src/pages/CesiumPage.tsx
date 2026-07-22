import { useEffect, useRef } from 'react'
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import MapChrome from '../components/MapChrome'

export default function CesiumPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const viewer = new Cesium.Viewer(el, {
      // Start with no imagery so no Cesium ion token is required...
      baseLayer: false,
      baseLayerPicker: false,
      geocoder: false,
      timeline: false,
      animation: false,
      sceneModePicker: true,
      navigationHelpButton: false,
    })

    // ...then use free OpenStreetMap raster tiles as the base layer.
    viewer.imageryLayers.addImageryProvider(
      new Cesium.OpenStreetMapImageryProvider({
        url: 'https://tile.openstreetmap.org/',
      }),
    )

    // Fly to Thailand
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(100.9925, 13.75, 2_500_000),
      duration: 0,
    })

    return () => {
      viewer.destroy()
    }
  }, [])

  return (
    <MapChrome title="CesiumJS">
      <div ref={containerRef} className="map-canvas" />
    </MapChrome>
  )
}
