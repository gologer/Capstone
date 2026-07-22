import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import MapChrome from '../components/MapChrome'

// Center of Thailand (fallback view before data loads)
const CENTER: L.LatLngTuple = [13.7563, 100.5018]
const PROVINCES_URL = `${import.meta.env.BASE_URL}data/provinces.geojson`
const ADMIN_URL = `${import.meta.env.BASE_URL}data/thai-admin.json`

/* ---- Data shapes (compact records from public/data/thai-admin.json) ---- */
type LatLng = [number, number]
interface Province {
  id: number
  code: string
  nameTh: string
  nameEn: string
  center: LatLng | null
}
interface District {
  id: number
  provinceId: number
  nameTh: string
  nameEn: string
  center: LatLng | null
}
interface Subdistrict {
  id: number
  districtId: number
  nameTh: string
  nameEn: string
  center: LatLng | null
}
interface AdminData {
  provinces: Province[]
  districts: District[]
  subdistricts: Subdistrict[]
}

/* GeoJSON feature properties in provinces.geojson */
interface GeoProvinceProps {
  code: string
  nameTh: string
  nameEn: string
}

const BASE_STYLE: L.PathOptions = {
  color: '#2563eb',
  weight: 1,
  fillColor: '#2563eb',
  fillOpacity: 0.06,
}
const HILITE_STYLE: L.PathOptions = {
  color: '#dc2626',
  weight: 2.5,
  fillColor: '#f97316',
  fillOpacity: 0.2,
}

const byNameTh = (a: { nameTh: string }, b: { nameTh: string }) =>
  a.nameTh.localeCompare(b.nameTh, 'th')

export default function LeafletPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const polyRef = useRef<Record<string, L.Polygon>>({}) // province polygons keyed by code
  const highlightRef = useRef<string>('') // currently highlighted province code
  const markerRef = useRef<L.CircleMarker | null>(null)
  const layersCtrlRef = useRef<L.Control.Layers | null>(null)

  const [admin, setAdmin] = useState<AdminData | null>(null)
  const [selProv, setSelProv] = useState('') // province id (string)
  const [selDist, setSelDist] = useState('') // district id (string)
  const [selSub, setSelSub] = useState('') // subdistrict id (string)

  /* ---- Derived lookups (memoised on the loaded dataset) ---- */
  const provinceList = useMemo(
    () => (admin ? [...admin.provinces].sort(byNameTh) : []),
    [admin],
  )
  const provById = useMemo(() => {
    const m = new Map<string, Province>()
    admin?.provinces.forEach((p) => m.set(String(p.id), p))
    return m
  }, [admin])
  const provByCode = useMemo(() => {
    const m = new Map<string, Province>()
    admin?.provinces.forEach((p) => m.set(p.code, p))
    return m
  }, [admin])
  const distById = useMemo(() => {
    const m = new Map<string, District>()
    admin?.districts.forEach((d) => m.set(String(d.id), d))
    return m
  }, [admin])
  const subById = useMemo(() => {
    const m = new Map<string, Subdistrict>()
    admin?.subdistricts.forEach((s) => m.set(String(s.id), s))
    return m
  }, [admin])
  const distsByProv = useMemo(() => {
    const m = new Map<string, District[]>()
    admin?.districts.forEach((d) => {
      const k = String(d.provinceId)
      const arr = m.get(k)
      if (arr) arr.push(d)
      else m.set(k, [d])
    })
    return m
  }, [admin])
  const subsByDist = useMemo(() => {
    const m = new Map<string, Subdistrict[]>()
    admin?.subdistricts.forEach((s) => {
      const k = String(s.districtId)
      const arr = m.get(k)
      if (arr) arr.push(s)
      else m.set(k, [s])
    })
    return m
  }, [admin])

  const districtList = useMemo(
    () => (selProv ? [...(distsByProv.get(selProv) ?? [])].sort(byNameTh) : []),
    [distsByProv, selProv],
  )
  const subList = useMemo(
    () => (selDist ? [...(subsByDist.get(selDist) ?? [])].sort(byNameTh) : []),
    [subsByDist, selDist],
  )

  /* ---- Map helpers ---- */
  function clearMarker() {
    if (markerRef.current) {
      markerRef.current.remove()
      markerRef.current = null
    }
  }
  function placeMarker(center: LatLng, label: string) {
    const map = mapRef.current
    if (!map) return
    clearMarker()
    markerRef.current = L.circleMarker(center, {
      radius: 8,
      color: '#dc2626',
      weight: 2,
      fillColor: '#f97316',
      fillOpacity: 0.95,
    })
      .addTo(map)
      .bindTooltip(label, { direction: 'top' })
  }
  function highlightProvince(code: string) {
    const prev = highlightRef.current
    if (prev && prev !== code && polyRef.current[prev]) {
      polyRef.current[prev].setStyle(BASE_STYLE)
    }
    highlightRef.current = code
    const layer = polyRef.current[code]
    if (layer) {
      layer.setStyle(HILITE_STYLE)
      layer.bringToFront()
    }
  }
  function clearHighlight() {
    const prev = highlightRef.current
    if (prev && polyRef.current[prev]) polyRef.current[prev].setStyle(BASE_STYLE)
    highlightRef.current = ''
  }
  function fitProvince(prov: Province) {
    const map = mapRef.current
    if (!map) return
    const layer = polyRef.current[prov.code]
    if (layer) map.fitBounds(layer.getBounds(), { padding: [24, 24], maxZoom: 11 })
    else if (prov.center) map.setView(prov.center, 9)
  }

  /* ---- Selection handlers (cascade: province → district → subdistrict) ---- */
  function selectProvince(id: string) {
    setSelProv(id)
    setSelDist('')
    setSelSub('')
    clearMarker()
    const prov = provById.get(id)
    if (!prov) {
      clearHighlight()
      return
    }
    highlightProvince(prov.code)
    fitProvince(prov)
  }

  function selectDistrict(id: string) {
    setSelDist(id)
    setSelSub('')
    clearMarker()
    const map = mapRef.current
    const dist = distById.get(id)
    if (!map) return
    if (!dist) {
      // "ทั้งหมด" → zoom back out to the selected province
      const prov = provById.get(selProv)
      if (prov) fitProvince(prov)
      return
    }
    // Prefer fitting the bounds of the district's subdistrict points for a tight view.
    const pts = (subsByDist.get(id) ?? [])
      .map((s) => s.center)
      .filter((c): c is LatLng => !!c)
    if (pts.length >= 2) {
      map.fitBounds(L.latLngBounds(pts), { padding: [30, 30], maxZoom: 12 })
    } else if (dist.center) {
      map.setView(dist.center, 11)
    }
    if (dist.center) placeMarker(dist.center, `${dist.nameTh} (อำเภอ)`)
  }

  function selectSubdistrict(id: string) {
    setSelSub(id)
    clearMarker()
    const map = mapRef.current
    const sub = subById.get(id)
    if (!map) return
    if (!sub) {
      // "ทั้งหมด" → zoom back out to the selected district
      const dist = distById.get(selDist)
      if (dist?.center) map.setView(dist.center, 11)
      return
    }
    if (sub.center) {
      map.setView(sub.center, 13)
      placeMarker(sub.center, `${sub.nameTh} (ตำบล)`)
    }
  }

  /* Latest polygon-click handler, kept in a ref so the once-created Leaflet
     click binding always sees current data & handlers (no stale closure). */
  const onPolygonClickRef = useRef<(code: string) => void>(() => {})
  useEffect(() => {
    onPolygonClickRef.current = (code: string) => {
      const prov = provByCode.get(code)
      if (prov) selectProvince(String(prov.id))
    }
  })

  /* ---- Init map + load data (once) ---- */
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const map = L.map(el).setView(CENTER, 6)
    mapRef.current = map

    // Recent date for NASA GIBS daily imagery (near-real-time lags a day or two).
    const gibsDate = new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10)

    // Selectable tile layers — basemaps + satellite/land-monitoring services
    // relevant to the LULC change-detection topic (all keyless & verified).
    const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    })
    const esriImagery = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { maxNativeZoom: 19, maxZoom: 19, attribution: 'Tiles © Esri, Maxar, Earthstar Geographics' },
    )
    const esriTopo = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      { maxNativeZoom: 19, maxZoom: 19, attribution: 'Tiles © Esri' },
    )
    const openTopo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxNativeZoom: 17,
      maxZoom: 19,
      attribution: '© OpenTopoMap (CC-BY-SA)',
    })
    const cartoLight = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      { maxZoom: 19, subdomains: 'abcd', attribution: '© OpenStreetMap © CARTO' },
    )
    const gibsModis = L.tileLayer(
      `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${gibsDate}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`,
      { maxNativeZoom: 9, maxZoom: 19, attribution: 'Imagery © NASA EOSDIS GIBS · MODIS Terra' },
    )
    const gibsViirs = L.tileLayer(
      `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/${gibsDate}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`,
      { maxNativeZoom: 9, maxZoom: 19, attribution: 'Imagery © NASA EOSDIS GIBS · VIIRS SNPP' },
    )

    osm.addTo(map) // default basemap

    const baseLayers: Record<string, L.Layer> = {
      OpenStreetMap: osm,
      'ภาพถ่ายดาวเทียม — Esri World Imagery': esriImagery,
      'ภูมิประเทศ — Esri Topographic': esriTopo,
      'ภูมิประเทศ/เส้นชั้นความสูง — OpenTopoMap': openTopo,
      'แผนที่โทนสว่าง — CARTO': cartoLight,
      'ดาวเทียมรายวัน — NASA GIBS (MODIS)': gibsModis,
      'ดาวเทียมรายวัน — NASA GIBS (VIIRS)': gibsViirs,
    }
    // Layer switcher button, top-right of the map.
    layersCtrlRef.current = L.control
      .layers(baseLayers, undefined, { position: 'topright', collapsed: true })
      .addTo(map)

    const controller = new AbortController()

    fetch(PROVINCES_URL, { signal: controller.signal })
      .then((r) => r.json())
      .then((geojson: GeoJSON.FeatureCollection) => {
        const layer = L.geoJSON(geojson, {
          style: () => BASE_STYLE,
          onEachFeature: (feature, lyr) => {
            const props = feature.properties as GeoProvinceProps
            polyRef.current[props.code] = lyr as L.Polygon
            lyr.bindTooltip(props.nameTh, { sticky: true })
            lyr.on('click', () => onPolygonClickRef.current(props.code))
          },
        }).addTo(map)
        map.fitBounds(layer.getBounds())
        layersCtrlRef.current?.addOverlay(layer, 'ขอบเขตจังหวัด')
      })
      .catch((e: Error) => {
        if (e.name !== 'AbortError') console.error('provinces load failed', e)
      })

    fetch(ADMIN_URL, { signal: controller.signal })
      .then((r) => r.json())
      .then((data: AdminData) => setAdmin(data))
      .catch((e: Error) => {
        if (e.name !== 'AbortError') console.error('admin load failed', e)
      })

    return () => {
      controller.abort()
      map.remove()
      mapRef.current = null
      polyRef.current = {}
      highlightRef.current = ''
      markerRef.current = null
      layersCtrlRef.current = null
    }
  }, [])

  const loading = admin === null

  return (
    <MapChrome title="Leaflet — เลือกจังหวัด / อำเภอ / ตำบล เพื่อซูม">
      <div className="map-control map-control-multi">
        <span className="control-field">
          <label htmlFor="sel-prov">จังหวัด</label>
          <select
            id="sel-prov"
            value={selProv}
            onChange={(e) => selectProvince(e.target.value)}
            disabled={loading}
          >
            <option value="">{loading ? 'กำลังโหลด…' : '— ทั้งหมด —'}</option>
            {provinceList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nameTh}
              </option>
            ))}
          </select>
        </span>

        <span className="control-field">
          <label htmlFor="sel-dist">อำเภอ</label>
          <select
            id="sel-dist"
            value={selDist}
            onChange={(e) => selectDistrict(e.target.value)}
            disabled={!selProv}
          >
            <option value="">
              {selProv ? `— ทั้งหมด (${districtList.length}) —` : '— เลือกจังหวัดก่อน —'}
            </option>
            {districtList.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nameTh}
              </option>
            ))}
          </select>
        </span>

        <span className="control-field">
          <label htmlFor="sel-sub">ตำบล</label>
          <select
            id="sel-sub"
            value={selSub}
            onChange={(e) => selectSubdistrict(e.target.value)}
            disabled={!selDist}
          >
            <option value="">
              {selDist ? `— ทั้งหมด (${subList.length}) —` : '— เลือกอำเภอก่อน —'}
            </option>
            {subList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nameTh}
              </option>
            ))}
          </select>
        </span>
      </div>
      <div ref={containerRef} className="map-canvas" />
    </MapChrome>
  )
}
