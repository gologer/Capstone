# แหล่งข้อมูลสำหรับจัดทำ Web Map App
## Automated Land Use/Land Cover Change Detection Platform (ประเทศไทย)

เอกสารรวบรวมแหล่งข้อมูลที่ใช้ได้จริงสำหรับสร้างแพลตฟอร์มตรวจจับการเปลี่ยนแปลงการใช้ประโยชน์ที่ดินด้วย Deep Learning แบ่งเป็น 3 กลุ่มหลัก ได้แก่ Google Earth Engine, Web Service (WMS/WFS/WMTS/REST) และ Static Data พร้อมหมายเหตุการนำไปใช้

> หมายเหตุ: URL/endpoint ของหน่วยงานอาจเปลี่ยนแปลงได้ ควรตรวจสอบสถานะล่าสุดก่อนนำไป production

---

## 1. Google Earth Engine (GEE) — แกนหลักของงาน Change Detection ด้วย DL

### 1.1 ภาพดาวเทียมต้นทาง (Input สำหรับจำแนกประเภทและตรวจการเปลี่ยนแปลง)

| ชุดข้อมูล | Asset ID | ความละเอียด | ช่วงเวลา | จุดเด่นสำหรับงานไทย |
|---|---|---|---|---|
| Sentinel-2 SR Harmonized | `COPERNICUS/S2_SR_HARMONIZED` | 10 ม. | 2017–ปัจจุบัน | ความละเอียดสูง มี band หลากหลาย มี s2cloudless ช่วย mask เมฆ |
| Sentinel-1 GRD (SAR) | `COPERNICUS/S1_GRD` | 10 ม. | 2014–ปัจจุบัน | เรดาร์ทะลุเมฆได้ เหมาะกับหน้าฝน/มรสุมของไทยมาก |
| Landsat 8/9 Collection 2 | `LANDSAT/LC08/C02/T1_L2`, `LANDSAT/LC09/C02/T1_L2` | 30 ม. | 2013–ปัจจุบัน | ทำ time-series ยาว วิเคราะห์แนวโน้ม |
| Landsat 5/7 | `LANDSAT/LT05/C02/T1_L2`, `LANDSAT/LE07/C02/T1_L2` | 30 ม. | 1984–2022 | ย้อนอดีตสำหรับ change detection ระยะยาว |
| MODIS NDVI/EVI | `MODIS/061/MOD13Q1` | 250 ม. | 2000–ปัจจุบัน | ดูฤดูกาลพืชพรรณ (phenology) |

### 1.2 ชุดข้อมูล LULC สำเร็จรูป (ใช้เป็น baseline / label / เทียบผล)

| ชุดข้อมูล | Asset ID | ความละเอียด | หมายเหตุ |
|---|---|---|---|
| **Dynamic World V1** ⭐ | `GOOGLE/DYNAMICWORLD/V1` | 10 ม. | LULC จาก Deep Learning แบบ near-real-time (9 class) เทียบสองช่วงเวลาเพื่อหา change ได้ทันที — ตรงกับแนวคิดแพลตฟอร์มมากที่สุด |
| ESA WorldCover | `ESA/WorldCover/v100` (2020), `ESA/WorldCover/v200` (2021) | 10 ม. | 11 class มาตรฐานสากล |
| ESRI 10m Land Cover Time Series | `projects/sat-io/open-datasets/landcover/ESRI_Global-LULC_10m_TS` | 10 ม. | รายปี 2017–2023 (ผ่าน awesome-gee-community) |
| Copernicus Global Land Cover | `COPERNICUS/Landcover/100m/Proba-V-C3/Global` | 100 ม. | 2015–2019 |
| MODIS Land Cover | `MODIS/061/MCD12Q1` | 500 ม. | รายปี 2001–ปัจจุบัน หลาย classification scheme |

### 1.3 ชุดข้อมูลการเปลี่ยนแปลงเฉพาะด้าน (Thematic Change)

| ชุดข้อมูล | Asset ID | ใช้ตรวจ |
|---|---|---|
| Hansen Global Forest Change | `UMD/hansen/global_forest_change_2023_v1_11` | การสูญเสีย/เพิ่มพื้นที่ป่า (2000–ปัจจุบัน) |
| JRC Global Surface Water | `JRC/GSW1_4/GlobalSurfaceWater` | การเปลี่ยนแปลงแหล่งน้ำ/น้ำท่วม |
| ALOS PALSAR Yearly Mosaic | `JAXA/ALOS/PALSAR/YEARLY/SAR_EPOCH` | โครงสร้างพืชพรรณ/ป่า ด้วย L-band SAR |
| GLAD (cropland, forest) | ผ่าน community datasets | พื้นที่เกษตร/ป่าไม้ |

### 1.4 ข้อมูลภูมิประเทศ/ประกอบ (Ancillary)

| ชุดข้อมูล | Asset ID | หมายเหตุ |
|---|---|---|
| SRTM DEM | `USGS/SRTMGL1_003` | 30 ม. ความสูงภูมิประเทศ |
| ALOS World 3D (AW3D30) | `JAXA/ALOS/AW3D30/V3_2` | DEM 30 ม. คุณภาพดี |
| WorldPop | `WorldPop/GP/100m/pop` | ความหนาแน่นประชากร |
| ขอบเขตการปกครอง | `FAO/GAUL/2015/level0`,`level1`,`level2` | ประเทศ/จังหวัด/อำเภอ |

### 1.5 แนวทางใช้ GEE ทำ Change Detection ด้วย DL
- ใช้ Sentinel-2/1 เป็น input ป้อนโมเดล (เช่น U-Net, Random Forest, หรือ TensorFlow ผ่าน `ee.Model`/Vertex AI)
- ใช้ Dynamic World หรือแผนที่ LDD เป็น training label
- Change detection: เทียบผลจำแนกสองช่วงเวลา (post-classification comparison) หรือใช้ image differencing/CVA (Change Vector Analysis) บน spectral indices (NDVI, NDBI, NDWI)
- Export ผลเป็น tile หรือใช้ `ee.data.getMapId()` ส่งเข้าเว็บโดยตรง

---

## 2. แหล่งข้อมูลหน่วยงานไทย (National / Government)

### 2.1 กรมพัฒนาที่ดิน (LDD) — สำคัญที่สุดสำหรับ "ป้ายอ้างอิงไทย"
- **แผนที่การใช้ประโยชน์ที่ดิน (Land Use)** จำแนกตามมาตรฐานไทย รายจังหวัด อัปเดตเป็นรอบ — ใช้เป็น ground truth / training label ได้ดีที่สุด
- ข้อมูลกลุ่มชุดดิน (Soil Group)
- **Agri-Map Online** — แผนที่เกษตรเชิงรุก แสดงความเหมาะสมของที่ดินกับพืช
- มีบริการแผนที่ผ่านพอร์ทัลของกรมฯ (ตรวจสอบ WMS/REST endpoint ล่าสุด)
- เว็บ: `www.ldd.go.th`

### 2.2 GISTDA (สำนักงานพัฒนาเทคโนโลยีอวกาศและภูมิสารสนเทศ)
- **sphere platform** (`sphere.gistda.or.th`) — ภาพถ่าย ผลิตภัณฑ์เชิงพื้นที่ ชั้นข้อมูลหลากหลาย
- ภาพดาวเทียม THEOS-1 / THEOS-2 (ความละเอียดสูง)
- ผลิตภัณฑ์เฉพาะทาง: น้ำท่วม, จุดความร้อน/burn scar, PM2.5, ภัยแล้ง
- บริการ actip / open data ของ GISTDA
- เว็บ: `www.gistda.or.th`

### 2.3 กรมป่าไม้ / กรมอุทยานแห่งชาติ (RFD / DNP)
- ข้อมูลพื้นที่ป่าไม้รายปี (สถิติและขอบเขต)
- ขอบเขตพื้นที่อนุรักษ์ อุทยานแห่งชาติ เขตรักษาพันธุ์สัตว์ป่า

### 2.4 พอร์ทัลข้อมูลเปิดและหน่วยงานอื่น
- **data.go.th** — ศูนย์กลางข้อมูลเปิดภาครัฐ (ค้นด้วยคำ "การใช้ที่ดิน", "ป่าไม้", "ขอบเขต")
- กรมที่ดิน (แปลงที่ดิน/โฉนด — บางส่วนจำกัดการเข้าถึง)
- สถาบันสารสนเทศทรัพยากรน้ำ (HII) / **Thaiwater.net** — ข้อมูลอุทกวิทยา
- สำนักงานสถิติแห่งชาติ (NSO) — ข้อมูลเชิงสถิติประกอบ

---

## 3. Web Services (WMS / WFS / WMTS / REST) — สำหรับแสดงผลสดในเว็บแมป

| แหล่ง | ประเภทบริการ | การใช้งาน |
|---|---|---|
| LDD Map Service | WMS/REST | ซ้อนชั้นการใช้ที่ดิน/ชุดดินไทย |
| GISTDA / sphere services | WMS/WMTS/REST | ภาพและชั้นข้อมูลของ GISTDA |
| Longdo Map / NOSTRA | Tile API (เชิงพาณิชย์) | Basemap ภาษาไทยคุณภาพดี |
| OpenStreetMap tiles | XYZ tiles | Basemap ฟรี |
| Esri/Google/Bing basemap | Tile services | Basemap ภาพถ่ายดาวเทียม (ตรวจเงื่อนไขลิขสิทธิ์) |
| NASA GIBS | WMTS | ภาพ MODIS/VIIRS รายวัน |

> เทคนิค: ชั้นข้อมูลที่ประมวลผลใน GEE สามารถ publish เป็น XYZ tile แล้วนำเข้า Leaflet/OpenLayers/MapLibre ได้ ทำให้รวม Web Service ภาครัฐกับผลจากโมเดลในแผนที่เดียว

---

## 4. Static Data (ดาวน์โหลดเก็บไว้ประมวลผล/แสดงผล)

| ข้อมูล | แหล่ง | รูปแบบ | หมายเหตุ |
|---|---|---|---|
| OpenStreetMap Thailand | Geofabrik (`download.geofabrik.de`) | .osm.pbf / shapefile | ถนน อาคาร land use |
| ขอบเขตการปกครอง | **GADM** (`gadm.org`) | shapefile/GeoPackage | ระดับ 0–3 (ประเทศ–ตำบล) |
| ขอบเขต + ประชากร | **HDX** (`data.humdata.org`) | shapefile/CSV | ข้อมูล humanitarian ของไทย |
| Natural Earth | `naturalearthdata.com` | shapefile | ขอบเขตหยาบ ทำ context |
| ESA WorldCover GeoTIFF | `esa-worldcover.org` | GeoTIFF | LULC 10 ม. โหลดตัด AOI |
| Copernicus DEM (GLO-30) | Copernicus Data Space | GeoTIFF | DEM 30 ม. |
| GHSL (Built-up/Population) | JRC GHSL | GeoTIFF | พื้นที่สิ่งปลูกสร้างเชิงเวลา |

---

## 5. สถาปัตยกรรมและ Workflow ที่แนะนำ

**Backend (ประมวลผล)**
- Google Earth Engine Python API + `geemap` สำหรับ prototyping
- โมเดล DL: TensorFlow/PyTorch (U-Net, DeepLabv3+, หรือ transformer segmentation) เทรนบน label จาก LDD + Dynamic World
- API layer: FastAPI/Flask ส่งผลลัพธ์เป็น tile หรือ GeoJSON

**Frontend (เว็บแมป)**
- Leaflet / OpenLayers / MapLibre GL
- ซ้อนชั้น: basemap → ภาพดาวเทียม → ผลจำแนก LULC → ชั้น change → ขอบเขตปกครอง
- ฟีเจอร์ที่ควรมี: เลื่อนเปรียบเทียบสองช่วงเวลา (swipe), สถิติพื้นที่เปลี่ยนแปลงตามจังหวัด/อำเภอ, ดาวน์โหลดผล

**การจำแนกและตรวจการเปลี่ยนแปลง**
- Post-classification comparison: จำแนก LULC ปีต้น–ปีปลาย แล้วทำ change matrix
- ใช้ LDD land use เป็น validation set เพื่อรายงานความแม่นยำ (accuracy assessment, kappa)

---

## สรุปลำดับความสำคัญของแหล่งข้อมูล
1. **GEE – Dynamic World + Sentinel-2/1** = แกนหลักในการทำ change detection ด้วย DL
2. **LDD Land Use maps** = label/ground truth ตามมาตรฐานไทย
3. **GISTDA (sphere, THEOS-2)** = ภาพความละเอียดสูงและบริการแผนที่ไทย
4. **OSM / GADM / HDX** = ขอบเขตและ context สำหรับแสดงผล
