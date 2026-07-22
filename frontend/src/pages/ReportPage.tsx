import { Link } from 'react-router-dom'

/* ------------------------------------------------------------------ */
/* Small presentational helpers                                        */
/* ------------------------------------------------------------------ */

interface TableProps {
  headers: string[]
  rows: (string | { code: string })[][]
}

/** A responsive table that scrolls horizontally on narrow screens. */
function Table({ headers, rows }: TableProps) {
  return (
    <div className="table-scroll">
      <table className="report-table">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) =>
                typeof cell === 'string' ? (
                  <td key={j} dangerouslySetInnerHTML={{ __html: cell }} />
                ) : (
                  <td key={j}>
                    <code>{cell.code}</code>
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Report page                                                         */
/* ------------------------------------------------------------------ */

export default function ReportPage() {
  return (
    <div className="report-page">
      <div className="report-topbar">
        <Link to="/" className="back-link">← กลับหน้าหลัก</Link>
        <span className="map-title">รายงานสรุป Capstone</span>
      </div>

      <article className="report-article">
        {/* ---- Hero ---- */}
        <header className="report-hero">
          <span className="report-kicker">รายงานสรุป Capstone</span>
          <h1>Automated Land Use/Land Cover Change Detection Platform</h1>
          <p className="report-lead">
            แพลตฟอร์มตรวจจับการเปลี่ยนแปลงการใช้ประโยชน์ที่ดินด้วยปัญญาประดิษฐ์ —
            ประยุกต์ใช้ Deep Learning ในการจำแนกประเภทที่ดินและตรวจหาการเปลี่ยนแปลงแบบอัตโนมัติ
          </p>
          <div className="report-tags">
            <span>Deep Learning</span>
            <span>Google Earth Engine</span>
            <span>Sentinel-1/2</span>
            <span>Change Detection</span>
            <span>ประเทศไทย</span>
          </div>
        </header>

        <p className="report-intro">
          เอกสารรวบรวมแหล่งข้อมูลที่ใช้ได้จริงสำหรับสร้างแพลตฟอร์มตรวจจับการเปลี่ยนแปลงการใช้ประโยชน์ที่ดินด้วย
          Deep Learning แบ่งเป็น 3 กลุ่มหลัก ได้แก่ Google Earth Engine, Web Service
          (WMS/WFS/WMTS/REST) และ Static Data พร้อมหมายเหตุการนำไปใช้
        </p>
        <p className="report-note">
          หมายเหตุ: URL/endpoint ของหน่วยงานอาจเปลี่ยนแปลงได้ ควรตรวจสอบสถานะล่าสุดก่อนนำไป production
        </p>

        {/* ---- 1. GEE ---- */}
        <section className="report-section">
          <h2>
            <span className="section-num">1</span>
            Google Earth Engine (GEE) — แกนหลักของงาน Change Detection ด้วย DL
          </h2>

          <h3>1.1 ภาพดาวเทียมต้นทาง (Input สำหรับจำแนกประเภทและตรวจการเปลี่ยนแปลง)</h3>
          <Table
            headers={['ชุดข้อมูล', 'Asset ID', 'ความละเอียด', 'ช่วงเวลา', 'จุดเด่นสำหรับงานไทย']}
            rows={[
              ['Sentinel-2 SR Harmonized', { code: 'COPERNICUS/S2_SR_HARMONIZED' }, '10 ม.', '2017–ปัจจุบัน', 'ความละเอียดสูง มี band หลากหลาย มี s2cloudless ช่วย mask เมฆ'],
              ['Sentinel-1 GRD (SAR)', { code: 'COPERNICUS/S1_GRD' }, '10 ม.', '2014–ปัจจุบัน', 'เรดาร์ทะลุเมฆได้ เหมาะกับหน้าฝน/มรสุมของไทยมาก'],
              ['Landsat 8/9 Collection 2', { code: 'LANDSAT/LC08/C02/T1_L2' }, '30 ม.', '2013–ปัจจุบัน', 'ทำ time-series ยาว วิเคราะห์แนวโน้ม'],
              ['Landsat 5/7', { code: 'LANDSAT/LT05/C02/T1_L2' }, '30 ม.', '1984–2022', 'ย้อนอดีตสำหรับ change detection ระยะยาว'],
              ['MODIS NDVI/EVI', { code: 'MODIS/061/MOD13Q1' }, '250 ม.', '2000–ปัจจุบัน', 'ดูฤดูกาลพืชพรรณ (phenology)'],
            ]}
          />

          <h3>1.2 ชุดข้อมูล LULC สำเร็จรูป (ใช้เป็น baseline / label / เทียบผล)</h3>
          <Table
            headers={['ชุดข้อมูล', 'Asset ID', 'ความละเอียด', 'หมายเหตุ']}
            rows={[
              ['<strong>Dynamic World V1</strong> ⭐', { code: 'GOOGLE/DYNAMICWORLD/V1' }, '10 ม.', 'LULC จาก Deep Learning แบบ near-real-time (9 class) เทียบสองช่วงเวลาเพื่อหา change ได้ทันที — ตรงกับแนวคิดแพลตฟอร์มมากที่สุด'],
              ['ESA WorldCover', { code: 'ESA/WorldCover/v100 · v200' }, '10 ม.', '11 class มาตรฐานสากล (2020 / 2021)'],
              ['ESRI 10m Land Cover Time Series', { code: 'projects/sat-io/open-datasets/landcover/ESRI_Global-LULC_10m_TS' }, '10 ม.', 'รายปี 2017–2023 (ผ่าน awesome-gee-community)'],
              ['Copernicus Global Land Cover', { code: 'COPERNICUS/Landcover/100m/Proba-V-C3/Global' }, '100 ม.', '2015–2019'],
              ['MODIS Land Cover', { code: 'MODIS/061/MCD12Q1' }, '500 ม.', 'รายปี 2001–ปัจจุบัน หลาย classification scheme'],
            ]}
          />

          <h3>1.3 ชุดข้อมูลการเปลี่ยนแปลงเฉพาะด้าน (Thematic Change)</h3>
          <Table
            headers={['ชุดข้อมูล', 'Asset ID', 'ใช้ตรวจ']}
            rows={[
              ['Hansen Global Forest Change', { code: 'UMD/hansen/global_forest_change_2023_v1_11' }, 'การสูญเสีย/เพิ่มพื้นที่ป่า (2000–ปัจจุบัน)'],
              ['JRC Global Surface Water', { code: 'JRC/GSW1_4/GlobalSurfaceWater' }, 'การเปลี่ยนแปลงแหล่งน้ำ/น้ำท่วม'],
              ['ALOS PALSAR Yearly Mosaic', { code: 'JAXA/ALOS/PALSAR/YEARLY/SAR_EPOCH' }, 'โครงสร้างพืชพรรณ/ป่า ด้วย L-band SAR'],
              ['GLAD (cropland, forest)', 'ผ่าน community datasets', 'พื้นที่เกษตร/ป่าไม้'],
            ]}
          />

          <h3>1.4 ข้อมูลภูมิประเทศ/ประกอบ (Ancillary)</h3>
          <Table
            headers={['ชุดข้อมูล', 'Asset ID', 'หมายเหตุ']}
            rows={[
              ['SRTM DEM', { code: 'USGS/SRTMGL1_003' }, '30 ม. ความสูงภูมิประเทศ'],
              ['ALOS World 3D (AW3D30)', { code: 'JAXA/ALOS/AW3D30/V3_2' }, 'DEM 30 ม. คุณภาพดี'],
              ['WorldPop', { code: 'WorldPop/GP/100m/pop' }, 'ความหนาแน่นประชากร'],
              ['ขอบเขตการปกครอง', { code: 'FAO/GAUL/2015/level0–2' }, 'ประเทศ/จังหวัด/อำเภอ'],
            ]}
          />

          <h3>1.5 แนวทางใช้ GEE ทำ Change Detection ด้วย DL</h3>
          <ul className="report-list">
            <li>ใช้ Sentinel-2/1 เป็น input ป้อนโมเดล (เช่น U-Net, Random Forest, หรือ TensorFlow ผ่าน <code>ee.Model</code>/Vertex AI)</li>
            <li>ใช้ Dynamic World หรือแผนที่ LDD เป็น training label</li>
            <li>Change detection: เทียบผลจำแนกสองช่วงเวลา (post-classification comparison) หรือใช้ image differencing/CVA (Change Vector Analysis) บน spectral indices (NDVI, NDBI, NDWI)</li>
            <li>Export ผลเป็น tile หรือใช้ <code>ee.data.getMapId()</code> ส่งเข้าเว็บโดยตรง</li>
          </ul>
        </section>

        {/* ---- 2. Thai agencies ---- */}
        <section className="report-section">
          <h2>
            <span className="section-num">2</span>
            แหล่งข้อมูลหน่วยงานไทย (National / Government)
          </h2>

          <h3>2.1 กรมพัฒนาที่ดิน (LDD) — สำคัญที่สุดสำหรับ "ป้ายอ้างอิงไทย"</h3>
          <ul className="report-list">
            <li><strong>แผนที่การใช้ประโยชน์ที่ดิน (Land Use)</strong> จำแนกตามมาตรฐานไทย รายจังหวัด อัปเดตเป็นรอบ — ใช้เป็น ground truth / training label ได้ดีที่สุด</li>
            <li>ข้อมูลกลุ่มชุดดิน (Soil Group)</li>
            <li><strong>Agri-Map Online</strong> — แผนที่เกษตรเชิงรุก แสดงความเหมาะสมของที่ดินกับพืช</li>
            <li>มีบริการแผนที่ผ่านพอร์ทัลของกรมฯ (ตรวจสอบ WMS/REST endpoint ล่าสุด)</li>
            <li>เว็บ: <code>www.ldd.go.th</code></li>
          </ul>

          <h3>2.2 GISTDA (สำนักงานพัฒนาเทคโนโลยีอวกาศและภูมิสารสนเทศ)</h3>
          <ul className="report-list">
            <li><strong>sphere platform</strong> (<code>sphere.gistda.or.th</code>) — ภาพถ่าย ผลิตภัณฑ์เชิงพื้นที่ ชั้นข้อมูลหลากหลาย</li>
            <li>ภาพดาวเทียม THEOS-1 / THEOS-2 (ความละเอียดสูง)</li>
            <li>ผลิตภัณฑ์เฉพาะทาง: น้ำท่วม, จุดความร้อน/burn scar, PM2.5, ภัยแล้ง</li>
            <li>บริการ actip / open data ของ GISTDA — เว็บ: <code>www.gistda.or.th</code></li>
          </ul>

          <h3>2.3 กรมป่าไม้ / กรมอุทยานแห่งชาติ (RFD / DNP)</h3>
          <ul className="report-list">
            <li>ข้อมูลพื้นที่ป่าไม้รายปี (สถิติและขอบเขต)</li>
            <li>ขอบเขตพื้นที่อนุรักษ์ อุทยานแห่งชาติ เขตรักษาพันธุ์สัตว์ป่า</li>
          </ul>

          <h3>2.4 พอร์ทัลข้อมูลเปิดและหน่วยงานอื่น</h3>
          <ul className="report-list">
            <li><strong>data.go.th</strong> — ศูนย์กลางข้อมูลเปิดภาครัฐ (ค้นด้วยคำ "การใช้ที่ดิน", "ป่าไม้", "ขอบเขต")</li>
            <li>กรมที่ดิน (แปลงที่ดิน/โฉนด — บางส่วนจำกัดการเข้าถึง)</li>
            <li>สถาบันสารสนเทศทรัพยากรน้ำ (HII) / <strong>Thaiwater.net</strong> — ข้อมูลอุทกวิทยา</li>
            <li>สำนักงานสถิติแห่งชาติ (NSO) — ข้อมูลเชิงสถิติประกอบ</li>
          </ul>
        </section>

        {/* ---- 3. Web services ---- */}
        <section className="report-section">
          <h2>
            <span className="section-num">3</span>
            Web Services (WMS / WFS / WMTS / REST) — สำหรับแสดงผลสดในเว็บแมป
          </h2>
          <Table
            headers={['แหล่ง', 'ประเภทบริการ', 'การใช้งาน']}
            rows={[
              ['LDD Map Service', 'WMS/REST', 'ซ้อนชั้นการใช้ที่ดิน/ชุดดินไทย'],
              ['GISTDA / sphere services', 'WMS/WMTS/REST', 'ภาพและชั้นข้อมูลของ GISTDA'],
              ['Longdo Map / NOSTRA', 'Tile API (เชิงพาณิชย์)', 'Basemap ภาษาไทยคุณภาพดี'],
              ['OpenStreetMap tiles', 'XYZ tiles', 'Basemap ฟรี'],
              ['Esri/Google/Bing basemap', 'Tile services', 'Basemap ภาพถ่ายดาวเทียม (ตรวจเงื่อนไขลิขสิทธิ์)'],
              ['NASA GIBS', 'WMTS', 'ภาพ MODIS/VIIRS รายวัน'],
            ]}
          />
          <p className="report-note">
            เทคนิค: ชั้นข้อมูลที่ประมวลผลใน GEE สามารถ publish เป็น XYZ tile แล้วนำเข้า
            Leaflet/OpenLayers/MapLibre ได้ ทำให้รวม Web Service ภาครัฐกับผลจากโมเดลในแผนที่เดียว
          </p>
        </section>

        {/* ---- 4. Static data ---- */}
        <section className="report-section">
          <h2>
            <span className="section-num">4</span>
            Static Data (ดาวน์โหลดเก็บไว้ประมวลผล/แสดงผล)
          </h2>
          <Table
            headers={['ข้อมูล', 'แหล่ง', 'รูปแบบ', 'หมายเหตุ']}
            rows={[
              ['OpenStreetMap Thailand', 'Geofabrik', '.osm.pbf / shapefile', 'ถนน อาคาร land use'],
              ['ขอบเขตการปกครอง', '<strong>GADM</strong> (gadm.org)', 'shapefile/GeoPackage', 'ระดับ 0–3 (ประเทศ–ตำบล)'],
              ['ขอบเขต + ประชากร', '<strong>HDX</strong> (data.humdata.org)', 'shapefile/CSV', 'ข้อมูล humanitarian ของไทย'],
              ['Natural Earth', 'naturalearthdata.com', 'shapefile', 'ขอบเขตหยาบ ทำ context'],
              ['ESA WorldCover GeoTIFF', 'esa-worldcover.org', 'GeoTIFF', 'LULC 10 ม. โหลดตัด AOI'],
              ['Copernicus DEM (GLO-30)', 'Copernicus Data Space', 'GeoTIFF', 'DEM 30 ม.'],
              ['GHSL (Built-up/Population)', 'JRC GHSL', 'GeoTIFF', 'พื้นที่สิ่งปลูกสร้างเชิงเวลา'],
            ]}
          />
        </section>

        {/* ---- 5. Architecture ---- */}
        <section className="report-section">
          <h2>
            <span className="section-num">5</span>
            สถาปัตยกรรมและ Workflow ที่แนะนำ
          </h2>

          <div className="report-cols">
            <div className="report-panel">
              <h4>Backend (ประมวลผล)</h4>
              <ul className="report-list">
                <li>Google Earth Engine Python API + <code>geemap</code> สำหรับ prototyping</li>
                <li>โมเดล DL: TensorFlow/PyTorch (U-Net, DeepLabv3+, หรือ transformer segmentation) เทรนบน label จาก LDD + Dynamic World</li>
                <li>API layer: FastAPI/Flask ส่งผลลัพธ์เป็น tile หรือ GeoJSON</li>
              </ul>
            </div>
            <div className="report-panel">
              <h4>Frontend (เว็บแมป)</h4>
              <ul className="report-list">
                <li>Leaflet / OpenLayers / MapLibre GL</li>
                <li>ซ้อนชั้น: basemap → ภาพดาวเทียม → ผลจำแนก LULC → ชั้น change → ขอบเขตปกครอง</li>
                <li>ฟีเจอร์ที่ควรมี: เลื่อนเปรียบเทียบสองช่วงเวลา (swipe), สถิติพื้นที่เปลี่ยนแปลงตามจังหวัด/อำเภอ, ดาวน์โหลดผล</li>
              </ul>
            </div>
            <div className="report-panel">
              <h4>การจำแนกและตรวจการเปลี่ยนแปลง</h4>
              <ul className="report-list">
                <li>Post-classification comparison: จำแนก LULC ปีต้น–ปีปลาย แล้วทำ change matrix</li>
                <li>ใช้ LDD land use เป็น validation set เพื่อรายงานความแม่นยำ (accuracy assessment, kappa)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ---- Priority summary ---- */}
        <section className="report-section report-priority">
          <h2>สรุปลำดับความสำคัญของแหล่งข้อมูล</h2>
          <ol className="report-ranking">
            <li><strong>GEE – Dynamic World + Sentinel-2/1</strong> = แกนหลักในการทำ change detection ด้วย DL</li>
            <li><strong>LDD Land Use maps</strong> = label/ground truth ตามมาตรฐานไทย</li>
            <li><strong>GISTDA (sphere, THEOS-2)</strong> = ภาพความละเอียดสูงและบริการแผนที่ไทย</li>
            <li><strong>OSM / GADM / HDX</strong> = ขอบเขตและ context สำหรับแสดงผล</li>
          </ol>
        </section>

        <footer className="report-footer">
          <Link to="/" className="back-link">← กลับหน้าหลัก</Link>
        </footer>
      </article>
    </div>
  )
}
