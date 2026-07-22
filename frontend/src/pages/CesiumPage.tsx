import { useEffect, useRef } from 'react'
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import MapChrome from '../components/MapChrome'

export default function CesiumPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Use Esri World Imagery as the base layer. It needs no Cesium ion token and
    // is CORS-enabled. (The OpenStreetMap tile server intermittently blocks
    // Cesium's tile requests / returns non-image responses, which surfaced as
    // "InvalidStateError: The source image could not be decoded" and stopped
    // rendering.)
    const viewer = new Cesium.Viewer(el, {
      baseLayer: new Cesium.ImageryLayer(
        new Cesium.UrlTemplateImageryProvider({
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          maximumLevel: 19,
          credit: 'Tiles © Esri, Maxar, Earthstar Geographics',
        }),
      ),
      baseLayerPicker: false,
      geocoder: false,
      timeline: false,
      animation: false,
      sceneModePicker: true,
      navigationHelpButton: false,
    })

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
