import { Link } from 'react-router-dom'

interface Demo {
  to: string
  name: string
  desc: string
  tag: string
  icon: string
}

const demos: Demo[] = [
  {
    to: '/leaflet',
    name: 'Leaflet',
    desc: 'ไลบรารีแผนที่ 2D ยอดนิยม เบา ใช้ง่าย เหมาะกับ raster/vector tiles',
    tag: '2D · Raster',
    icon: '🍃',
  },
  {
    to: '/maplibre',
    name: 'MapLibre GL JS',
    desc: 'เรนเดอร์ vector tiles ด้วย WebGL หมุน/เอียงมุมมองได้ Open-source',
    tag: '2D/2.5D · Vector · WebGL',
    icon: '🗺️',
  },
  {
    to: '/cesium',
    name: 'CesiumJS',
    desc: 'ลูกโลก 3D และข้อมูลภูมิสารสนเทศเชิงพื้นที่แบบ full 3D',
    tag: '3D Globe · WebGL',
    icon: '🌏',
  },
]

export default function Home() {
  return (
    <main className="home">
      <header className="home-header">
        <h1>WebMapApp</h1>
        <p>ตัวอย่างการใช้งาน Web Map API ทั้ง 3 แบบ — เลือกดูได้เลย</p>
      </header>

      <Link to="/report" className="report-banner">
        <span className="report-banner-icon" aria-hidden="true">📑</span>
        <span className="report-banner-text">
          <strong>รายงานสรุป Capstone</strong>
          <span>Automated Land Use/Land Cover Change Detection Platform — ตรวจจับการเปลี่ยนแปลงการใช้ที่ดินด้วย AI</span>
        </span>
        <span className="report-banner-cta" aria-hidden="true">→</span>
      </Link>

      <div className="card-grid">
        {demos.map((d) => (
          <Link key={d.to} to={d.to} className="card">
            <span className="card-icon" aria-hidden="true">{d.icon}</span>
            <h2>{d.name}</h2>
            <span className="card-tag">{d.tag}</span>
            <p>{d.desc}</p>
            <span className="card-cta">เปิดตัวอย่าง →</span>
          </Link>
        ))}
      </div>
    </main>
  )
}
