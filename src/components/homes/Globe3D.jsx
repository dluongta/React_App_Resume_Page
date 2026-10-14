import React, { useEffect, useRef, useState, useCallback } from 'react';

// ============================================================================
// 1. CONTINENT POLYGONS & INLAND-CALIBRATED TECH HUBS DATA
// ============================================================================
const CONTINENT_POLYGONS = [
  // Bắc Mỹ
  [[-168,65],[-140,70],[-120,74],[-85,75],[-60,65],[-53,47],[-70,42],[-81,25],[-90,20],[-84,9],[-77,8],[-92,15],[-105,20],[-117,32],[-124,48],[-140,60],[-165,60]],
  // Greenland
  [[-55,60],[-44,60],[-20,70],[-18,81],[-50,82],[-68,76]],
  // Nam Mỹ
  [[-80,10],[-62,10],[-50,0],[-35,-6],[-38,-15],[-48,-28],[-58,-38],[-68,-54],[-75,-50],[-72,-35],[-70,-18],[-81,-5]],
  // Châu Âu
  [[-10,36],[5,36],[15,38],[28,36],[35,45],[60,55],[60,70],[28,71],[10,63],[5,50],[-5,48],[-10,43]],
  // Vương quốc Anh
  [[-10,51],[2,51],[0,58],[-8,58]],
  // Châu Phi
  [[-17,15],[-6,35],[11,37],[33,31],[43,12],[51,11],[40,-10],[35,-25],[20,-35],[14,-22],[9,-2],[5,5],[-8,4]],
  // Madagascar
  [[44,-13],[50,-13],[48,-25],[43,-25]],
  // Châu Á
  [[28,41],[45,40],[55,22],[72,20],[78,8],[88,22],[100,13],[104,1],[109,15],[122,23],[122,38],[132,42],[142,52],[170,66],[178,68],[105,76],[65,72],[60,55],[35,45]],
  // Nhật Bản
  [[130,31],[141,35],[145,44],[139,41],[130,34]],
  // Đông Nam Á / Indonesia
  [[95,5],[106,-6],[120,-8],[140,-5],[135,2],[120,18],[115,6]],
  // Châu Úc
  [[113,-22],[122,-14],[136,-12],[143,-11],[153,-25],[148,-38],[138,-35],[115,-34]],
  // New Zealand
  [[166,-46],[178,-37],[175,-41],[168,-46]]
];

// Tọa độ các Hub đã được tinh chỉnh nằm sâu bên trong đa giác lục địa
const RAW_TECH_HUBS = [
  // Bắc Mỹ
  { lat: 39.5, lng: -116.0 },
  { lat: 41.5, lng: -77.5 },
  { lat: 47.5, lng: -119.0 },
  { lat: 33.0, lng: -98.0 },
  { lat: 45.0, lng: -79.5 },
  { lat: 23.5, lng: -101.0 },
  { lat: 54.0, lng: -110.0 },
  // Nam Mỹ
  { lat: -21.0, lng: -49.0 },
  { lat: -33.5, lng: -61.5 },
  { lat: -32.0, lng: -68.0 },
  { lat: 4.7, lng: -73.0 },
  { lat: -10.0, lng: -55.0 },
  { lat: -14.0, lng: -72.0 },
  // Châu Âu
  { lat: 53.5, lng: -2.5 },
  { lat: 47.5, lng: 2.5 },
  { lat: 51.5, lng: 11.5 },
  { lat: 52.0, lng: 6.5 },
  { lat: 60.5, lng: 16.0 },
  { lat: 47.0, lng: 8.5 },
  { lat: 40.5, lng: -3.7 },
  { lat: 52.0, lng: 20.0 },
  { lat: 50.5, lng: 30.5 },
  { lat: 56.5, lng: 38.0 },
  // Trung Đông & Châu Phi
  { lat: 39.5, lng: 34.0 },
  { lat: 33.5, lng: 42.0 },
  { lat: 26.0, lng: 45.0 },
  { lat: 9.5, lng: 8.0 },
  { lat: -1.3, lng: 35.5 },
  { lat: 28.0, lng: 29.5 },
  { lat: -25.0, lng: 25.0 },
  { lat: 16.0, lng: 2.0 },
  // Châu Á
  { lat: 15.5, lng: 77.5 },
  { lat: 21.0, lng: 76.0 },
  { lat: 28.0, lng: 78.0 },
  { lat: 3.5, lng: 102.5 },
  { lat: 21.5, lng: 104.5 },
  { lat: 15.5, lng: 101.0 },
  { lat: -2.0, lng: 112.0 },
  { lat: 12.0, lng: 120.0 },
  { lat: 36.5, lng: 138.0 },
  { lat: 39.9, lng: 115.5 },
  { lat: 31.5, lng: 117.5 },
  { lat: 25.0, lng: 113.5 },
  { lat: 48.0, lng: 106.0 },
  // Châu Đại Dương
  { lat: -31.0, lng: 147.0 },
  { lat: -34.0, lng: 142.0 },
  { lat: -25.0, lng: 128.0 },
  { lat: -42.5, lng: 172.5 }
];

const ARC_COLORS = [
  { r: 56, g: 189, b: 248 },   // Sky (#38bdf8)
  { r: 168, g: 85, b: 247 },   // Purple (#a855f7)
  { r: 52, g: 211, b: 153 },   // Emerald (#34d399)
  { r: 244, g: 114, b: 182 },  // Pink (#f472b6)
  { r: 251, g: 191, b: 36 }    // Amber (#fbbf24)
];

const DENSITY_NAMES = ["Low", "Moderate", "Normal", "High", "Extreme"];
const GLOBE_RADIUS = 100;
const FOV_RAD = (45 * Math.PI) / 180;

// ============================================================================
// 2. PURE 3D MATH, LAND VERIFICATION & PROJECTION HELPERS
// ============================================================================
function isPointInPolygon(lng, lat, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = ((yi > lat) !== (yj > lat)) &&
      (lng < (xj - xi) * (lat - yi) / (yj - yi + 0.00001) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function isLand(lng, lat) {
  for (let k = 0; k < CONTINENT_POLYGONS.length; k++) {
    if (isPointInPolygon(lng, lat, CONTINENT_POLYGONS[k])) return true;
  }
  return false;
}

// Kiểm tra điểm và 4 hướng xung quanh để đảm bảo Hub nằm trọn trên đất liền
function isSafeInland(lng, lat) {
  if (!isLand(lng, lat)) return false;
  const margin = 1.2;
  return (
    isLand(lng + margin, lat) &&
    isLand(lng - margin, lat) &&
    isLand(lng, lat + margin) &&
    isLand(lng, lat - margin)
  );
}

// Tự động dời bất kỳ điểm nào bị lệch ra biển vào vùng đất liền gần nhất
function snapToGuaranteedLand(lat, lng) {
  if (isSafeInland(lng, lat)) return { lat, lng };
  if (isLand(lng, lat)) return { lat, lng };

  for (let r = 0.5; r <= 30; r += 0.5) {
    for (let deg = 0; deg < 360; deg += 15) {
      const rad = (deg * Math.PI) / 180;
      const testLat = Math.max(-85, Math.min(85, lat + Math.sin(rad) * r));
      const testLng = ((lng + Math.cos(rad) * r + 540) % 360) - 180;
      if (isSafeInland(testLng, testLat)) {
        return { lat: testLat, lng: testLng };
      }
    }
  }
  for (let r = 0.5; r <= 30; r += 0.5) {
    for (let deg = 0; deg < 360; deg += 15) {
      const rad = (deg * Math.PI) / 180;
      const testLat = Math.max(-85, Math.min(85, lat + Math.sin(rad) * r));
      const testLng = ((lng + Math.cos(rad) * r + 540) % 360) - 180;
      if (isLand(testLng, testLat)) {
        return { lat: testLat, lng: testLng };
      }
    }
  }
  return { lat: 21.5, lng: 104.5 };
}

const VERIFIED_LAND_HUBS = RAW_TECH_HUBS.map((hub) => snapToGuaranteedLand(hub.lat, hub.lng));

function latLngToVec3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return {
    x: -(radius * Math.sin(phi) * Math.cos(theta)),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta)
  };
}

function vecDist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

function vecLerpNormalized(a, b, t, length) {
  const x = a.x + (b.x - a.x) * t;
  const y = a.y + (b.y - a.y) * t;
  const z = a.z + (b.z - a.z) * t;
  const mag = Math.hypot(x, y, z) || 1;
  return {
    x: (x / mag) * length,
    y: (y / mag) * length,
    z: (z / mag) * length
  };
}

function cubicBezier3D(p0, p1, p2, p3, t) {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;
  return {
    x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
    y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
    z: uuu * p0.z + 3 * uu * t * p1.z + 3 * u * tt * p2.z + ttt * p3.z
  };
}

function createSurfaceRingPoints(lat, lng, radius, ringRadius, segments) {
  const center = latLngToVec3(lat, lng, radius);
  const mag = Math.hypot(center.x, center.y, center.z) || 1;
  const nx = center.x / mag, ny = center.y / mag, nz = center.z / mag;

  let ux = 0, uy = 1, uz = 0;
  if (Math.abs(ny) > 0.9) { ux = 1; uy = 0; }

  let t1x = uy * nz - uz * ny;
  let t1y = uz * nx - ux * nz;
  let t1z = ux * ny - uy * nx;
  const t1Mag = Math.hypot(t1x, t1y, t1z) || 1;
  t1x /= t1Mag; t1y /= t1Mag; t1z /= t1Mag;

  const t2x = ny * t1z - nz * t1y;
  const t2y = nz * t1x - nx * t1z;
  const t2z = nx * t1y - ny * t1x;

  const pts = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const cosA = Math.cos(angle) * ringRadius;
    const sinA = Math.sin(angle) * ringRadius;
    pts.push({
      x: center.x + t1x * cosA + t2x * sinA,
      y: center.y + t1y * cosA + t2y * sinA,
      z: center.z + t1z * cosA + t2z * sinA
    });
  }
  return { center, pts, t1: { x: t1x, y: t1y, z: t1z }, t2: { x: t2x, y: t2y, z: t2z } };
}

function getResponsiveView(w, h) {
  const aspect = w / Math.max(h, 1);

  if (w < 640 || aspect < 0.85) {
    const mobileZoom = Math.min(650, Math.max(480, Math.round(330 / Math.max(aspect, 0.45))));
    return {
      zoom: mobileZoom,
      offsetY: -28,
      autoRotateSpeed: 0.0086 // Xoay nhanh hơn trên Mobile
    };
  } else if (w < 1024) {
    return {
      zoom: 430,
      offsetY: -10,
      autoRotateSpeed: 0.0080 // Xoay nhanh trên Tablet
    };
  } else {
    return {
      zoom: 390,
      offsetY: -6,
      autoRotateSpeed: 0.0046 // Xoay nhanh trên PC
    };
  }
}

// ============================================================================
// 3. MAIN REACT COMPONENT
// ============================================================================
export default function Globe3D() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // States cho màn hình Loading
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // States cho bảng điều khiển góc trên bên phải
  const [autoRotate, setAutoRotate] = useState(true);
  const [spawnDensity, setSpawnDensity] = useState(4);

  // Refs đồng bộ state vào vòng lặp requestAnimationFrame
  const autoRotateRef = useRef(autoRotate);
  const spawnDensityRef = useRef(spawnDensity);
  const engineRef = useRef(null);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    spawnDensityRef.current = spawnDensity;
  }, [spawnDensity]);

  // Nút Release Surge
  const handleBurst = useCallback(() => {
    if (engineRef.current) {
      for (let i = 0; i < 12; i++) {
        engineRef.current.spawnRandomArc(0);
      }
    }
  }, []);

  // Nút Reset View
  const handleReset = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.resetView();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let isCancelled = false;

    let screenW = container.clientWidth || window.innerWidth;
    let screenH = container.clientHeight || window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let focalLength = 500;

    let targetRotation = { x: 0.25, y: -1.8 };
    let currentRotation = { x: 0.25, y: -2.4 };

    let viewConfig = getResponsiveView(screenW, screenH);
    let cameraZoom = viewConfig.zoom + 140;
    let targetZoom = viewConfig.zoom;
    let currentOffsetY = viewConfig.offsetY;
    let targetOffsetY = viewConfig.offsetY;

    const stars = [];
    const landDots = [];
    const graticuleLines = [];
    const cityHubs = [];
    const activeArcs = [];
    const activeRipples = [];

    function project3D(pt, sinX, cosX, sinY, cosY) {
      const x1 = pt.x * cosY + pt.z * sinY;
      const z1 = -pt.x * sinY + pt.z * cosY;

      const y2 = pt.y * cosX - z1 * sinX;
      const z2 = pt.y * sinX + z1 * cosX;

      const worldY = y2 + currentOffsetY;
      const depth = cameraZoom - z2;
      if (depth <= 10) return null;

      const scale = focalLength / depth;
      return {
        sx: screenW * 0.5 + x1 * scale,
        sy: screenH * 0.5 - worldY * scale,
        z: z2,
        scale: scale
      };
    }

    // Khởi tạo dữ liệu bất đồng bộ theo từng chunk
    async function buildSceneDataAsync() {
      const yieldFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

      // Bước 1: Khởi tạo Sao & Lưới kinh/vĩ tuyến (15%)
      for (let i = 0; i < 380; i++) {
        const tint = Math.random();
        let color = 'rgba(195, 220, 255, ';
        if (tint > 0.6 && tint <= 0.85) color = 'rgba(115, 195, 255, ';
        else if (tint > 0.85) color = 'rgba(205, 155, 255, ';

        stars.push({
          u: Math.random(),
          v: Math.random(),
          size: 0.6 + Math.random() * 1.3,
          alpha: 0.25 + Math.random() * 0.6,
          twinkleSpeed: 0.01 + Math.random() * 0.025,
          phase: Math.random() * Math.PI * 2,
          colorPrefix: color
        });
      }

      const latitudes = [-75, -60, -30, 0, 30, 60, 75];
      for (let i = 0; i < latitudes.length; i++) {
        const lat = latitudes[i];
        const ring = [];
        for (let lng = -180; lng <= 180; lng += 3) {
          ring.push(latLngToVec3(lat, lng, GLOBE_RADIUS));
        }
        graticuleLines.push(ring);
      }

      for (let lng = -180; lng < 180; lng += 30) {
        const line = [];
        for (let lat = -90; lat <= 90; lat += 2) {
          line.push(latLngToVec3(lat, lng, GLOBE_RADIUS));
        }
        graticuleLines.push(line);
      }

      if (isCancelled) return;
      setLoadProgress(15);
      await yieldFrame();

      // Bước 2: Chia nhỏ tính toán 18,000 điểm lục địa thành 6 đợt (15% -> 90%)
      const totalSamples = 18000;
      const chunkSize = 3000;
      const goldenRatio = (1 + Math.sqrt(5)) / 2;

      for (let start = 0; start < totalSamples; start += chunkSize) {
        if (isCancelled) return;
        const end = Math.min(start + chunkSize, totalSamples);

        for (let i = start; i < end; i++) {
          const y = 1 - (i / (totalSamples - 1)) * 2;
          const radiusAtY = Math.sqrt(1 - y * y);
          const theta = (2 * Math.PI * i) / goldenRatio;

          const x = Math.cos(theta) * radiusAtY;
          const z = Math.sin(theta) * radiusAtY;

          const lat = Math.asin(y) * (180 / Math.PI);
          const lng = Math.atan2(z, -x) * (180 / Math.PI) - 180;
          const normLng = ((lng + 540) % 360) - 180;

          if (isLand(normLng, lat)) {
            landDots.push({
              x: x * GLOBE_RADIUS,
              y: y * GLOBE_RADIUS,
              z: z * GLOBE_RADIUS,
              lat,
              lng: normLng
            });
          }
        }

        const currentProgress = 15 + Math.round((end / totalSamples) * 75);
        setLoadProgress(currentProgress);
        await yieldFrame();
      }

      if (isCancelled) return;

      // Bước 3: Khởi tạo Tech Hubs gắn chặt vào đúng các hạt đất liền (landDots) (90% -> 100%)
      VERIFIED_LAND_HUBS.forEach((hub, index) => {
        const targetVec = latLngToVec3(hub.lat, hub.lng, GLOBE_RADIUS);
        let closestDot = null;
        let minDist = Infinity;

        // Khóa cứng từng Hub vào đúng hạt đất liền gần nhất để không bao giờ nằm ở đại dương
        for (let j = 0; j < landDots.length; j++) {
          const d = vecDist(targetVec, landDots[j]);
          if (d < minDist) {
            minDist = d;
            closestDot = landDots[j];
          }
        }

        const finalLat = closestDot ? closestDot.lat : hub.lat;
        const finalLng = closestDot ? closestDot.lng : hub.lng;

        const isMajor = index % 3 === 0;
        const surfaceData = createSurfaceRingPoints(finalLat, finalLng, GLOBE_RADIUS * 1.004, 1.9, 16);
        cityHubs.push({
          lat: finalLat,
          lng: finalLng,
          center: surfaceData.center,
          ringPts: surfaceData.pts,
          color: isMajor ? '#38bdf8' : '#a855f7',
          rgb: isMajor ? '56, 189, 248' : '168, 85, 247'
        });
      });

      for (let i = 0; i < 16; i++) {
        spawnRandomArc(Math.random() * 0.85);
      }

      setLoadProgress(100);
      await yieldFrame();

      if (!isCancelled) {
        animate();
        setTimeout(() => {
          if (!isCancelled) setIsLoaded(true);
        }, 180);
      }
    }

    function spawnSurfaceRipple(lat, lng, colorObj) {
      const basis = createSurfaceRingPoints(lat, lng, GLOBE_RADIUS * 1.005, 1.0, 24);
      activeRipples.push({
        center: basis.center,
        t1: basis.t1,
        t2: basis.t2,
        color: colorObj,
        progress: 0,
        speed: 0.022
      });
    }

    function spawnRandomArc(initialProgress = 0) {
      if (cityHubs.length < 2) return;

      const startIdx = Math.floor(Math.random() * cityHubs.length);
      let endIdx = Math.floor(Math.random() * cityHubs.length);
      while (endIdx === startIdx) {
        endIdx = Math.floor(Math.random() * cityHubs.length);
      }

      // Điểm phát và điểm đến luôn lấy từ cityHubs đã khóa trên đất liền
      const startHub = cityHubs[startIdx];
      const endHub = cityHubs[endIdx];
      const colorObj = ARC_COLORS[Math.floor(Math.random() * ARC_COLORS.length)];

      const startVec = latLngToVec3(startHub.lat, startHub.lng, GLOBE_RADIUS);
      const endVec = latLngToVec3(endHub.lat, endHub.lng, GLOBE_RADIUS);

      const distance = vecDist(startVec, endVec);
      const altitude = Math.min(Math.max(distance * 0.42, 18), 85);

      const mid1 = vecLerpNormalized(startVec, endVec, 0.28, GLOBE_RADIUS + altitude);
      const mid2 = vecLerpNormalized(startVec, endVec, 0.72, GLOBE_RADIUS + altitude);

      const segments = 64;
      const points = [];
      for (let i = 0; i <= segments; i++) {
        points.push(cubicBezier3D(startVec, mid1, mid2, endVec, i / segments));
      }

      if (initialProgress === 0) {
        spawnSurfaceRipple(startHub.lat, startHub.lng, colorObj);
      }

      activeArcs.push({
        points,
        segments,
        progress: initialProgress,
        speed: 0.0055 + Math.random() * 0.0045,
        tailLength: 0.28,
        endHub,
        color: colorObj,
        impactTriggered: false
      });
    }

    function updateCanvasSize() {
      screenW = container.clientWidth || window.innerWidth;
      screenH = container.clientHeight || window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = screenW * dpr;
      canvas.height = screenH * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      focalLength = (screenH * 0.5) / Math.tan(FOV_RAD * 0.5);

      viewConfig = getResponsiveView(screenW, screenH);
      targetZoom = viewConfig.zoom;
      targetOffsetY = viewConfig.offsetY;
    }

    function resetView() {
      viewConfig = getResponsiveView(screenW, screenH);
      targetRotation = { x: 0.25, y: -1.8 };
      targetZoom = viewConfig.zoom;
      targetOffsetY = viewConfig.offsetY;
      setAutoRotate(true);
      setSpawnDensity(4);
    }

    engineRef.current = {
      spawnRandomArc,
      resetView
    };

    function drawArcSegmentPath(projPts, startIdx, endIdx, checkOcclusion, globeCenterX, globeCenterY, apparentRadius) {
      ctx.beginPath();
      let penDown = false;
      const rSq = apparentRadius * apparentRadius * 0.97;

      for (let i = startIdx; i <= endIdx; i++) {
        const p = projPts[i];
        if (!p) {
          penDown = false;
          continue;
        }
        if (checkOcclusion && p.z < 0) {
          const dx = p.sx - globeCenterX;
          const dy = p.sy - globeCenterY;
          if (dx * dx + dy * dy < rSq) {
            penDown = false;
            continue;
          }
        }
        if (!penDown) {
          ctx.moveTo(p.sx, p.sy);
          penDown = true;
        } else {
          ctx.lineTo(p.sx, p.sy);
        }
      }
      ctx.stroke();
    }

    function animate() {
      if (isCancelled) return;
      animationFrameId = requestAnimationFrame(animate);

      // 1. Update Camera & Globe Rotation (Tốc độ tự xoay nhanh trên cả Mobile & PC)
      if (autoRotateRef.current) {
        targetRotation.y += viewConfig.autoRotateSpeed;
      }
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.08;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.08;
      cameraZoom += (targetZoom - cameraZoom) * 0.06;
      currentOffsetY += (targetOffsetY - currentOffsetY) * 0.08;

      const sinX = Math.sin(currentRotation.x);
      const cosX = Math.cos(currentRotation.x);
      const sinY = Math.sin(currentRotation.y);
      const cosY = Math.cos(currentRotation.y);

      const globeCenterX = screenW * 0.5;
      const globeCenterY = screenH * 0.5 - currentOffsetY * (focalLength / cameraZoom);
      const apparentRadius = (GLOBE_RADIUS * focalLength) / Math.sqrt(Math.max(100, cameraZoom * cameraZoom - GLOBE_RADIUS * GLOBE_RADIUS));

      ctx.clearRect(0, 0, screenW, screenH);

      // 2. Render Background Starfield
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.phase += s.twinkleSpeed;
        const alpha = s.alpha * (0.65 + 0.35 * Math.sin(s.phase));
        const sx = ((s.u * screenW - currentRotation.y * 25) % screenW + screenW) % screenW;
        const sy = ((s.v * screenH - currentRotation.x * 25) % screenH + screenH) % screenH;

        ctx.fillStyle = s.colorPrefix + alpha.toFixed(2) + ')';
        ctx.fillRect(sx, sy, s.size, s.size);
      }

      // 3. Outer Atmosphere Halo Glow
      const outerGrad = ctx.createRadialGradient(
        globeCenterX, globeCenterY, apparentRadius * 0.82,
        globeCenterX, globeCenterY, apparentRadius * 1.26
      );
      outerGrad.addColorStop(0, 'rgba(56, 189, 248, 0.26)');
      outerGrad.addColorStop(0.45, 'rgba(139, 92, 246, 0.14)');
      outerGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');

      ctx.fillStyle = outerGrad;
      ctx.beginPath();
      ctx.arc(globeCenterX, globeCenterY, apparentRadius * 1.26, 0, Math.PI * 2);
      ctx.fill();

      // 4. Render 3D Shaded Earth Core Sphere
      const coreGrad = ctx.createRadialGradient(
        globeCenterX - apparentRadius * 0.32,
        globeCenterY - apparentRadius * 0.32,
        apparentRadius * 0.05,
        globeCenterX,
        globeCenterY,
        apparentRadius
      );
      coreGrad.addColorStop(0, '#11224d');
      coreGrad.addColorStop(0.55, '#070f26');
      coreGrad.addColorStop(1, '#040816');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(globeCenterX, globeCenterY, apparentRadius, 0, Math.PI * 2);
      ctx.fill();

      // Rim Fresnel Edge Highlight
      const rimGrad = ctx.createRadialGradient(
        globeCenterX, globeCenterY, apparentRadius * 0.86,
        globeCenterX, globeCenterY, apparentRadius
      );
      rimGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      rimGrad.addColorStop(0.75, 'rgba(56, 189, 248, 0.14)');
      rimGrad.addColorStop(1, 'rgba(168, 85, 247, 0.45)');

      ctx.fillStyle = rimGrad;
      ctx.beginPath();
      ctx.arc(globeCenterX, globeCenterY, apparentRadius, 0, Math.PI * 2);
      ctx.fill();

      // 5. Render Graticule Lines
      const horizonZ = (GLOBE_RADIUS * GLOBE_RADIUS) / cameraZoom;

      ctx.save();
      ctx.beginPath();
      ctx.arc(globeCenterX, globeCenterY, apparentRadius, 0, Math.PI * 2);
      ctx.clip();

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.16)';
      ctx.lineWidth = 0.85;

      for (let i = 0; i < graticuleLines.length; i++) {
        const line = graticuleLines[i];
        ctx.beginPath();
        let started = false;

        for (let j = 0; j < line.length; j++) {
          const p = project3D(line[j], sinX, cosX, sinY, cosY);
          if (p && p.z >= horizonZ - 2.5) {
            if (!started) {
              ctx.moveTo(p.sx, p.sy);
              started = true;
            } else {
              ctx.lineTo(p.sx, p.sy);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }
      ctx.restore();

      // 6. Render Continent Dot Matrix
      const baseDotSize = Math.max(1.0, (1.35 * focalLength) / cameraZoom);

      ctx.fillStyle = 'rgba(96, 165, 250, 0.42)';
      for (let i = 0; i < landDots.length; i++) {
        const p = project3D(landDots[i], sinX, cosX, sinY, cosY);
        if (p && p.z > -8 && p.z <= 38) {
          ctx.fillRect(p.sx - baseDotSize * 0.5, p.sy - baseDotSize * 0.5, baseDotSize, baseDotSize);
        }
      }

      ctx.fillStyle = 'rgba(135, 198, 255, 0.88)';
      for (let i = 0; i < landDots.length; i++) {
        const p = project3D(landDots[i], sinX, cosX, sinY, cosY);
        if (p && p.z > 38) {
          ctx.fillRect(p.sx - baseDotSize * 0.5, p.sy - baseDotSize * 0.5, baseDotSize * 1.08, baseDotSize * 1.08);
        }
      }

      // 7. Render Tech Hub Nodes & Surface Rings (100% trên đất liền)
      for (let i = 0; i < cityHubs.length; i++) {
        const hub = cityHubs[i];
        const centerProj = project3D(hub.center, sinX, cosX, sinY, cosY);
        if (!centerProj || centerProj.z < 5) continue;

        const fade = Math.min(1, centerProj.z / 35);

        ctx.beginPath();
        for (let j = 0; j < hub.ringPts.length; j++) {
          const rp = project3D(hub.ringPts[j], sinX, cosX, sinY, cosY);
          if (!rp) continue;
          if (j === 0) ctx.moveTo(rp.sx, rp.sy);
          else ctx.lineTo(rp.sx, rp.sy);
        }

        ctx.strokeStyle = `rgba(${hub.rgb}, ${(0.55 * fade).toFixed(2)})`;
        ctx.lineWidth = 1.1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerProj.sx, centerProj.sy, Math.max(1.4, 1.15 * centerProj.scale), 0, Math.PI * 2);
        ctx.fillStyle = hub.color;
        ctx.fill();
      }

      // 8. Update & Render Expanding Surface Ripples
      for (let i = activeRipples.length - 1; i >= 0; i--) {
        const ripple = activeRipples[i];
        ripple.progress += ripple.speed;

        if (ripple.progress >= 1.0) {
          activeRipples.splice(i, 1);
          continue;
        }

        const centerProj = project3D(ripple.center, sinX, cosX, sinY, cosY);
        if (!centerProj || centerProj.z < 0) continue;

        const radius = 0.8 + ripple.progress * 4.5;
        const alpha = (1.0 - ripple.progress) * 0.9 * Math.min(1, centerProj.z / 25);
        const segments = 20;

        ctx.beginPath();
        for (let s = 0; s <= segments; s++) {
          const angle = (s / segments) * Math.PI * 2;
          const cosA = Math.cos(angle) * radius;
          const sinA = Math.sin(angle) * radius;
          const pt3d = {
            x: ripple.center.x + ripple.t1.x * cosA + ripple.t2.x * sinA,
            y: ripple.center.y + ripple.t1.y * cosA + ripple.t2.y * sinA,
            z: ripple.center.z + ripple.t1.z * cosA + ripple.t2.z * sinA
          };
          const rp = project3D(pt3d, sinX, cosX, sinY, cosY);
          if (!rp) continue;
          if (s === 0) ctx.moveTo(rp.sx, rp.sy);
          else ctx.lineTo(rp.sx, rp.sy);
        }
        ctx.strokeStyle = `rgba(${ripple.color.r}, ${ripple.color.g}, ${ripple.color.b}, ${alpha.toFixed(2)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 9. Spawn & Render 3D Cubic Bezier Arcs
      const density = spawnDensityRef.current;
      const maxConcurrentArcs = density * 6;
      if (activeArcs.length < maxConcurrentArcs && Math.random() < density * 0.03) {
        spawnRandomArc(0);
      }

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';

      for (let i = activeArcs.length - 1; i >= 0; i--) {
        const arc = activeArcs[i];
        arc.progress += arc.speed;

        if (arc.progress > 1.0 && !arc.impactTriggered) {
          arc.impactTriggered = true;
          spawnSurfaceRipple(arc.endHub.lat, arc.endHub.lng, arc.color);
        }

        if (arc.progress >= 1.0 + arc.tailLength) {
          activeArcs.splice(i, 1);
          continue;
        }

        const projPts = new Array(arc.points.length);
        for (let j = 0; j < arc.points.length; j++) {
          projPts[j] = project3D(arc.points[j], sinX, cosX, sinY, cosY);
        }

        // A. Đường quỹ đạo mờ
        let bgAlpha = 0.16;
        if (arc.progress > 1.0) {
          bgAlpha = Math.max(0, (1.0 - (arc.progress - 1.0) / arc.tailLength) * 0.16);
        }
        ctx.strokeStyle = `rgba(${arc.color.r}, ${arc.color.g}, ${arc.color.b}, ${bgAlpha.toFixed(3)})`;
        ctx.lineWidth = 1.2;
        drawArcSegmentPath(projPts, 0, arc.segments, true, globeCenterX, globeCenterY, apparentRadius);

        // B. Tia năng lượng di chuyển
        const headT = Math.min(arc.progress, 1.0);
        const tailT = Math.max(arc.progress - arc.tailLength, 0.0);
        const startSeg = Math.floor(tailT * arc.segments);
        const endSeg = Math.ceil(headT * arc.segments);

        if (endSeg > startSeg) {
          ctx.strokeStyle = `rgba(${arc.color.r}, ${arc.color.g}, ${arc.color.b}, 0.65)`;
          ctx.lineWidth = 3.2;
          drawArcSegmentPath(projPts, startSeg, endSeg, true, globeCenterX, globeCenterY, apparentRadius);

          ctx.strokeStyle = `rgba(255, 255, 255, 0.92)`;
          ctx.lineWidth = 1.4;
          drawArcSegmentPath(projPts, startSeg, endSeg, true, globeCenterX, globeCenterY, apparentRadius);
        }

        // C. Hạt cầu sáng ở đầu tia
        if (arc.progress <= 1.0) {
          const headPt = projPts[endSeg];
          if (headPt) {
            const dx = headPt.sx - globeCenterX;
            const dy = headPt.sy - globeCenterY;
            const occluded = headPt.z < 0 && (dx * dx + dy * dy < apparentRadius * apparentRadius * 0.97);

            if (!occluded) {
              const r = Math.max(2.0, 1.2 * headPt.scale);
              ctx.beginPath();
              ctx.arc(headPt.sx, headPt.sy, r * 1.8, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${arc.color.r}, ${arc.color.g}, ${arc.color.b}, 0.55)`;
              ctx.fill();

              ctx.beginPath();
              ctx.arc(headPt.sx, headPt.sy, r * 0.9, 0, Math.PI * 2);
              ctx.fillStyle = '#ffffff';
              ctx.fill();
            }
          }
        }
      }

      ctx.restore();
    }

    updateCanvasSize();
    currentOffsetY = viewConfig.offsetY;
    buildSceneDataAsync();

    window.addEventListener('resize', updateCanvasSize);

    return () => {
      isCancelled = true;
      window.removeEventListener('resize', updateCanvasSize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="globe-root">
      <style>{`
        .globe-root {
          position: relative;
          width: 100%;
          height: 100vh;
          height: 100dvh;
          background-color: #040711;
          color: #f0f6fc;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          user-select: none;
          -webkit-user-select: none;
          -webkit-tap-highlight-color: transparent;
          /* Cho phép cuộn trang tự nhiên như các phần tử bình thường */
          touch-action: pan-y pan-x;
        }
        .globe-root * {
          box-sizing: border-box;
        }
        .globe-mono {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        }

        /* Màn hình Loading Overlay */
        .globe-loader-overlay {
          position: absolute;
          inset: 0;
          z-index: 30;
          background: radial-gradient(circle at 50% 50%, #0d162d 0%, #060913 60%, #020409 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1), visibility 0.75s ease;
          pointer-events: none;
        }
        .globe-loader-overlay.is-hidden {
          opacity: 0;
          visibility: hidden;
        }
        .globe-loader-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          width: 220px;
        }
        .globe-loader-text-row {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #94a3b8;
        }
        .globe-loader-percent {
          color: #38bdf8;
        }
        .globe-progress-track {
          width: 100%;
          height: 4px;
          background: rgba(30, 41, 59, 0.85);
          border-radius: 999px;
          overflow: hidden;
          border: 1px solid rgba(56, 189, 248, 0.16);
        }
        .globe-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #0ea5e9, #a855f7);
          border-radius: 999px;
          transition: width 0.2s ease-out;
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.6);
        }

        /* Vùng chứa Canvas (pointer-events: none để không chặn thao tác lướt trang) */
        .globe-canvas-container {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          background: radial-gradient(circle at 50% 55%, #0d162d 0%, #060913 55%, #020409 100%);
          pointer-events: none;
          opacity: 0;
          transform: scale(0.96);
          transition: opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1), transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .globe-canvas-container.is-ready {
          opacity: 1;
          transform: scale(1);
        }
        .globe-canvas-container canvas {
          display: block;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        /* Bảng điều khiển ở góc trên bên phải (nơi duy nhất nhận tương tác) */
        .globe-controls-wrapper {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 10;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          opacity: 0;
          transform: translateY(-8px);
          transition: opacity 0.6s ease 0.25s, transform 0.6s ease 0.25s;
        }
        .globe-controls-wrapper.is-ready {
          opacity: 1;
          transform: translateY(0);
        }
        .globe-glass-panel {
          pointer-events: auto;
          width: 224px;
          background: rgba(13, 17, 23, 0.68);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(48, 54, 61, 0.6);
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.45);
          border-radius: 14px;
          padding: 11px 13px;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }
        @media (min-width: 640px) {
          .globe-controls-wrapper {
            top: 24px;
            right: 24px;
          }
          .globe-glass-panel {
            width: 264px;
            padding: 14px 16px;
            gap: 11px;
            border-radius: 16px;
          }
        }
        .globe-controls-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
        }
        .globe-controls-title {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #cbd5e1;
        }
        .globe-btn {
          font-family: inherit;
          cursor: pointer;
          outline: none;
        }
        .globe-toggle-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 6px;
        }
        .globe-btn-toggle {
          padding: 5px 8px;
          border-radius: 7px;
          font-size: 11px;
          font-weight: 500;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          border: 1px solid #334155;
          background: rgba(30, 41, 59, 0.6);
          color: #94a3b8;
          white-space: nowrap;
        }
        .globe-btn-toggle.active-sky {
          border-color: rgba(14, 165, 233, 0.4);
          background: rgba(14, 165, 233, 0.15);
          color: #7dd3fc;
        }
        .globe-btn-burst {
          padding: 5px 8px;
          border-radius: 7px;
          border: none;
          background: linear-gradient(to right, #0ea5e9, #6366f1);
          color: #ffffff;
          font-size: 11px;
          font-weight: 500;
          box-shadow: 0 4px 6px -1px rgba(14, 165, 233, 0.2);
          transition: transform 0.15s ease, filter 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          white-space: nowrap;
        }
        .globe-btn-burst:hover {
          filter: brightness(1.1);
        }
        .globe-btn-burst:active {
          transform: scale(0.95);
        }
        .globe-slider-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .globe-slider-header {
          display: flex;
          justify-content: space-between;
          font-size: 10.5px;
          color: #94a3b8;
        }
        .globe-density-val {
          color: #38bdf8;
        }
        .globe-range {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          background: rgba(48, 54, 61, 0.8);
          height: 4px;
          border-radius: 999px;
          outline: none;
          margin: 0;
        }
        .globe-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: #38bdf8;
          cursor: pointer;
          box-shadow: 0 0 10px #38bdf8;
        }
        .globe-range::-moz-range-thumb {
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: #38bdf8;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px #38bdf8;
        }
        .globe-reset-row {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding-top: 8px;
          margin-top: 2px;
          border-top: 1px solid rgba(51, 65, 85, 0.45);
        }
        .globe-btn-reset {
          padding: 0;
          border: none;
          background: transparent;
          color: #38bdf8;
          font-size: 10px;
          font-weight: 400;
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .globe-btn-reset:hover {
          text-decoration: underline;
          text-underline-offset: 3px;
        }
      `}</style>

      {/* 1. Màn hình Preloader chỉ hiển thị thanh % */}
      <div className={`globe-loader-overlay ${isLoaded ? 'is-hidden' : ''}`}>
        <div className="globe-loader-info">
          <div className="globe-loader-text-row">
            <span>Initializing Globe</span>
            <span className="globe-mono globe-loader-percent">{loadProgress}%</span>
          </div>
          <div className="globe-progress-track">
            <div
              className="globe-progress-fill"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Vùng chứa Canvas 3D (Hoàn toàn không bắt sự kiện chuột/chạm để lướt mượt) */}
      <div className={`globe-canvas-container ${isLoaded ? 'is-ready' : ''}`}>
        <canvas ref={canvasRef} />
      </div>

      {/* 3. Bảng điều khiển góc trên bên phải (Nơi duy nhất nhận tương tác) */}
      <div className={`globe-controls-wrapper ${isLoaded ? 'is-ready' : ''}`}>
        <div className="globe-glass-panel">
          <div className="globe-controls-header">
            <span className="globe-controls-title">CONTROLS</span>
          </div>

          <div className="globe-toggle-grid">
            <button
              type="button"
              onClick={() => setAutoRotate((prev) => !prev)}
              className={`globe-btn globe-btn-toggle ${autoRotate ? 'active-sky' : ''}`}
            >
              <span>🔄</span> Rotate
            </button>

            <button
              type="button"
              onClick={handleBurst}
              className="globe-btn globe-btn-burst"
            >
              <span>⚡</span> Release Surge
            </button>
          </div>

          <div className="globe-slider-group">
            <div className="globe-slider-header">
              <span>Arc Spawn Rate</span>
              <span className="globe-mono globe-density-val">
                {DENSITY_NAMES[spawnDensity - 1]}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={spawnDensity}
              onChange={(e) => setSpawnDensity(Number(e.target.value))}
              className="globe-range"
            />
          </div>

          <div className="globe-reset-row">
            <button
              type="button"
              onClick={handleReset}
              className="globe-btn globe-btn-reset"
            >
              Reset View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}