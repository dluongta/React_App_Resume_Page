// import React, { useEffect, useRef, useState } from 'react';

// const GalaxyAnimation = ({ text = "DINH LUONG TA", imageUrls = ["luen_logo.png", "hexagon-main.png", "luen-1.jpg"] }) => {
//   const canvasRef = useRef(null);
//   const containerRef = useRef(null);

//   const [isLoading, setIsLoading] = useState(true);
//   const [fadeLoading, setFadeLoading] = useState(false);

//   // useRef lưu trữ trạng thái để không gây re-render làm giật lag
//   const state = useRef({
//     zoom: window.innerWidth < 768 ? 0.15 : 0.25,
//     initialZoom: window.innerWidth < 768 ? 0.15 : 0.25,
//     rotX: 1.8,
//     rotY: 0,
//     dragging: false,
//     lastX: 0,
//     lastY: 0,
//     initialPinchDist: null,
//     shootingStar: { active: false, x: 0, y: 0, len: 0, speed: 0, opacity: 0 }
//   });

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const container = containerRef.current;
//     if (!canvas || !container) return;

//     const ctx = canvas.getContext("2d", { alpha: false });
//     let requestId;

//     const isMobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
//     const STAR_COUNT = isMobile ? 250 : 600;
//     const PARTICLE_COUNT = isMobile ? 400 : 1200;
//     const IMAGE_SHOW_SCALE = 0.8;
//     const PERSPECTIVE = 2000;
//     const PLANET_RADIUS = 110;

//     let w, h, cx, cy;
//     let images = [], bgStars = [], particles = [];
//     const rand = (a, b) => Math.random() * (b - a) + a;

//     const RINGS = [
//       { text: "DINH ", radius: 220, tilt: -0.8, speed: 1.2, color: "#ff6200" },
//       { text: "LUONG ", radius: 320, tilt: 0.8, speed: 0.8, color: "#6a00ff" },
//       { text: "TA ", radius: 420, tilt: "vertical", speed: 0.5, color: "#ff0066" }
//     ];

//     // --- HỆ THỐNG CACHE VẼ TRƯỚC (GIẢM LAG) ---
//     const caches = { text: {}, planet: null, auraOrange: null, auraPurple: null };

//     const createCacheCanvas = (size, renderFunc) => {
//       const c = document.createElement('canvas');
//       c.width = size; c.height = size;
//       renderFunc(c.getContext('2d'), size / 2);
//       return c;
//     };

//     const initCaches = () => {
//       caches.planet = createCacheCanvas(400, (ctxCache, center) => {
//         const pr = 60;
//         ctxCache.globalCompositeOperation = "lighter";
//         const glow = ctxCache.createRadialGradient(center, center, pr * 0.2, center, center, pr * 3);
//         glow.addColorStop(0, "rgba(255,255,220,0.9)");
//         glow.addColorStop(0.2, "rgba(255,180,0,0.8)");
//         glow.addColorStop(0.5, "rgba(255,120,0,0.35)");
//         glow.addColorStop(1, "rgba(255,80,0,0)");
//         ctxCache.fillStyle = glow;
//         ctxCache.beginPath(); ctxCache.arc(center, center, pr * 3, 0, Math.PI * 2); ctxCache.fill();
        
//         const sun = ctxCache.createRadialGradient(center - pr * 0.3, center - pr * 0.3, pr * 0.1, center, center, pr);
//         sun.addColorStop(0, "#fff7cc"); sun.addColorStop(0.3, "#ffcc33");
//         sun.addColorStop(0.7, "#ff8800"); sun.addColorStop(1, "#ff5500");
//         ctxCache.fillStyle = sun;
//         ctxCache.beginPath(); ctxCache.arc(center, center, pr, 0, Math.PI * 2); ctxCache.fill();
//       });

//       const buildAura = (colorRGB) => createCacheCanvas(400, (ctxCache, center) => {
//         const g = ctxCache.createRadialGradient(center, center, 0, center, center, center);
//         g.addColorStop(0, `rgba(${colorRGB}, 0.5)`);
//         g.addColorStop(0.3, `rgba(${colorRGB}, 0.25)`);
//         g.addColorStop(0.7, `rgba(${colorRGB}, 0.08)`);
//         g.addColorStop(1, "rgba(0,0,0,0)");
//         ctxCache.fillStyle = g;
//         ctxCache.beginPath(); ctxCache.arc(center, center, center, 0, Math.PI * 2); ctxCache.fill();
//       });
//       caches.auraOrange = buildAura("255, 140, 0");
//       caches.auraPurple = buildAura("180, 0, 255");

//       RINGS.forEach(ring => {
//         const uniqueChars = [...new Set(ring.text)];
//         uniqueChars.forEach(char => {
//           const key = char + ring.color;
//           if (!caches.text[key]) {
//             caches.text[key] = createCacheCanvas(80, (ctxCache, center) => {
//               ctxCache.font = "bold 35px Impact, Arial";
//               ctxCache.textAlign = "center"; ctxCache.textBaseline = "middle";
//               ctxCache.shadowColor = ring.color; ctxCache.shadowBlur = 12;
//               ctxCache.strokeStyle = ring.color; ctxCache.lineWidth = 3; ctxCache.lineJoin = "round";
//               ctxCache.strokeText(char, center, center);
//               ctxCache.shadowBlur = 0;
//               ctxCache.fillStyle = "#ffffff";
//               ctxCache.fillText(char, center, center);
//             });
//           }
//         });
//       });
//     };

//     // --- KHỞI TẠO & PRELOAD ---
//     let isAppStarted = false;
//     const startUniverse = () => {
//       if (isAppStarted) return;
//       isAppStarted = true;

//       initCaches();
      
//       bgStars = Array.from({ length: STAR_COUNT }, () => ({
//         x: rand(-3000, 3000), y: rand(-3000, 3000), z: rand(-3000, 3000), size: rand(4, 7), color: "#ffffff"
//       }));

//       particles = Array.from({ length: PARTICLE_COUNT }, () => ({
//         radius: rand(500, 900), angle: Math.random() * Math.PI * 2,
//         speed: rand(0.0005, 0.002), yOffset: rand(-50, 50), size: rand(4, 6),
//         imgIndex: Math.floor(Math.random() * imageUrls.length)
//       }));

//       resize();
//       requestAnimationFrame(animate);

//       setFadeLoading(true);
//       setTimeout(() => setIsLoading(false), 500);
//     };

//     const preloadImages = () => {
//       const promises = imageUrls.map(src => {
//         return new Promise((resolve) => {
//           const img = new Image();
//           img.onload = () => resolve(img);
//           img.onerror = () => resolve(img);
//           img.src = src;
//         });
//       });

//       Promise.all(promises).then(loadedImages => {
//         images = loadedImages;
//         startUniverse();
//       });

//       setTimeout(() => startUniverse(), 3000); // Failsafe
//     };

//     const resize = () => {
//       if (!containerRef.current) return;
//       w = canvas.width = containerRef.current.clientWidth;
//       h = canvas.height = containerRef.current.clientHeight;
//       cx = w / 2; cy = h / 2;
//     };

//     // ==========================================
//     // KIỂM SOÁT TƯƠNG TÁC (ĐÃ FIX CHO PC & MOBILE)
//     // ==========================================
//     const getTouchDist = (touches) => Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);

//     // 1. Phóng to/Thu nhỏ bằng Chuột (PC)
//     const onWheel = (e) => {
//       e.preventDefault();
//       state.current.zoom = Math.max(0.05, Math.min(4, state.current.zoom * (e.deltaY > 0 ? 0.9 : 1.1)));
//     };

//     // 2. Kéo & Xoay ngân hà bằng Pointer Events (Hoạt động cho cả Chuột PC và 1 ngón tay Mobile)
//     const onPointerDown = (e) => {
//       state.current.dragging = true;
//       state.current.lastX = e.clientX;
//       state.current.lastY = e.clientY;
//       // Khóa pointer vào canvas để rê chuột ra ngoài mép màn hình vẫn xoay được
//       canvas.setPointerCapture(e.pointerId); 
//     };

//     const onPointerMove = (e) => {
//       if (!state.current.dragging) return;
//       state.current.rotY += (e.clientX - state.current.lastX) * 0.005;
//       state.current.rotX += (e.clientY - state.current.lastY) * 0.005;
//       state.current.lastX = e.clientX;
//       state.current.lastY = e.clientY;
//     };

//     const onPointerUp = (e) => {
//       state.current.dragging = false;
//       canvas.releasePointerCapture(e.pointerId);
//     };

//     // 3. Phóng to/Thu nhỏ bằng 2 ngón tay (Chỉ dành cho Mobile Touch)
//     const onTouchStart = (e) => {
//       if (e.touches.length === 2) {
//         state.current.dragging = false; // Vô hiệu hóa kéo xoay khi đang dùng 2 ngón
//         state.current.initialPinchDist = getTouchDist(e.touches);
//         state.current.initialZoom = state.current.zoom;
//       }
//     };

//     const onTouchMove = (e) => {
//       if (e.touches.length === 2 && state.current.initialPinchDist) {
//         e.preventDefault(); // Chống cuộn trang web
//         const dist = getTouchDist(e.touches);
//         state.current.zoom = Math.max(0.05, Math.min(4, state.current.initialZoom * (dist / state.current.initialPinchDist)));
//       }
//     };

//     // Gắn sự kiện chuẩn xác vào Canvas
//     window.addEventListener("resize", resize);
//     canvas.addEventListener("wheel", onWheel, { passive: false });
    
//     // Gắn Pointer Events (Thay thế cho mousedown/mousemove cũ)
//     canvas.addEventListener("pointerdown", onPointerDown);
//     canvas.addEventListener("pointermove", onPointerMove);
//     canvas.addEventListener("pointerup", onPointerUp);
//     canvas.addEventListener("pointercancel", onPointerUp); // Xử lý khi chuột bị ngắt đột ngột
    
//     // Gắn Touch Events dành riêng cho Pinch 2 ngón tay
//     canvas.addEventListener("touchstart", onTouchStart, { passive: true });
//     canvas.addEventListener("touchmove", onTouchMove, { passive: false });

//     // --- CORE RENDER ---
//     const MAX_RENDER = STAR_COUNT + PARTICLE_COUNT + 300;
//     const renderPool = Array.from({ length: MAX_RENDER }, () => ({
//       type: 0, x: 0, y: 0, z: 0, size: 0, charKey: '', imgIdx: 0, cache: null
//     }));
    
//     const PTX = Math.PI / 2.3, PTZ = Math.PI / 6;
//     const cPTX = Math.cos(PTX), sPTX = Math.sin(PTX), cPTZ = Math.cos(PTZ), sPTZ = Math.sin(PTZ);

//     const animate = () => {
//       const time = performance.now() * 0.0004;
//       ctx.fillStyle = "#000"; ctx.fillRect(0, 0, w, h);

//       const st = state.current;
//       const ss = st.shootingStar;

//       // SAO BĂNG CHẠY CHẬM VÀ ĐẸP HƠN
//       if (!ss.active && Math.random() < 0.01) { 
//         ss.active = true; ss.x = -400; ss.y = rand(50, h * 0.7);
//         ss.len = rand(150, 300); 
//         ss.speed = rand(15, 25); // Tốc độ bay chậm
//         ss.opacity = 1;
//       } else if (ss.active) {
//         ss.x += ss.speed; 
//         ss.opacity -= 0.003; // Hiệu ứng mờ dần chậm hơn
//         if (ss.x > w + 400 || ss.opacity <= 0) ss.active = false;
        
//         ctx.save(); ctx.globalCompositeOperation = "lighter";
//         const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.len, ss.y);
//         grad.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`);
//         grad.addColorStop(1, "rgba(255, 255, 255, 0)");
//         ctx.strokeStyle = grad; ctx.lineWidth = 2; ctx.beginPath();
//         ctx.moveTo(ss.x, ss.y); ctx.lineTo(ss.x - ss.len, ss.y);
//         ctx.stroke(); ctx.restore();
//       }

//       let cosRX = Math.cos(st.rotX), sinRX = Math.sin(st.rotX);
//       let cosRY = Math.cos(st.rotY), sinRY = Math.sin(st.rotY);
//       let rCount = 0;

//       const auraData = [
//         { cache: caches.auraOrange, tx: -1200 + Math.sin(time*0.5)*150, ty: 300 + Math.cos(time*0.3)*150, tz: -300 + Math.sin(time*0.5)*100, radius: 3200 },
//         { cache: caches.auraPurple, tx: 1200 + Math.sin(time*0.4)*150, ty: 300 + Math.cos(time*0.2)*150, tz: -300 + Math.sin(time*0.4)*100, radius: 3200 }
//       ];
//       for(let a of auraData) {
//         let y1 = a.ty * cosRX - a.tz * sinRX, z1 = a.ty * sinRX + a.tz * cosRX;
//         let r = renderPool[rCount++];
//         r.type = 5; r.x = a.tx * cosRY + z1 * sinRY; r.y = y1; r.z = -a.tx * sinRY + z1 * cosRY;
//         r.cache = a.cache; r.size = a.radius;
//       }

//       let rp = renderPool[rCount++];
//       rp.type = 3; rp.x = 0; rp.y = 0; rp.z = 0;

//       for (let i = 0; i < RINGS.length; i++) {
//         let ring = RINGS[i];
//         let repeatCount = Math.floor(ring.radius / 15);
//         let fullText = ring.text.repeat(repeatCount);
//         for (let j = 0; j < fullText.length; j++) {
//           let cA = (time * ring.speed) + (j * (Math.PI * 2 / fullText.length));
//           let tx = (ring.tilt === "vertical") ? 0 : Math.cos(cA) * ring.radius;
//           let tz = Math.sin(cA) * ring.radius;
//           let ty = (ring.tilt === "vertical") ? Math.cos(cA) * ring.radius : tx * ring.tilt;
          
//           let y1 = ty * cosRX - tz * sinRX, z1 = ty * sinRX + tz * cosRX;
//           let r = renderPool[rCount++];
//           r.type = 4; r.x = tx * cosRY + z1 * sinRY; r.y = y1; r.z = -tx * sinRY + z1 * cosRY;
//           r.charKey = fullText[j] + ring.color;
//         }
//       }

//       for (let i = 0; i < particles.length; i++) {
//         let p = particles[i];
//         let curA = p.angle + time + (time * p.speed * 80);
//         let px = p.radius * Math.cos(curA), pz = p.radius * Math.sin(curA), py = p.yOffset;
//         let py1 = py * cPTX - pz * sPTX, pz1 = py * sPTX + pz * cPTX;
//         let tx = px * cPTZ - py1 * sPTZ, ty = px * sPTZ + py1 * cPTZ;
//         let y1 = ty * cosRX - pz1 * sinRX, z1 = ty * sinRX + pz1 * cosRX;
        
//         let r = renderPool[rCount++];
//         r.type = 2; r.x = tx * cosRY + z1 * sinRY; r.y = y1; r.z = -tx * sinRY + z1 * cosRY;
//         r.size = p.size; r.imgIdx = p.imgIndex;
//       }

//       for (let i = 0; i < bgStars.length; i++) {
//         let s = bgStars[i];
//         let y1 = s.y * cosRX - s.z * sinRX, z1 = s.y * sinRX + s.z * cosRX;
//         let r = renderPool[rCount++];
//         r.type = 1; r.x = s.x * cosRY + z1 * sinRY; r.y = y1; r.z = -s.x * sinRY + z1 * cosRY;
//         r.size = s.size;
//       }

//       let activeRender = renderPool.slice(0, rCount).sort((a, b) => b.z - a.z);
//       let currentBlend = "source-over";

//       for (let i = 0; i < rCount; i++) {
//         let item = activeRender[i];
//         let scale = (PERSPECTIVE / (PERSPECTIVE + item.z)) * st.zoom;
//         if (scale <= 0) continue;

//         let px = cx + item.x * scale;
//         let py = cy + item.y * scale;

//         if (item.type === 1) {
//           if (currentBlend !== "source-over") { ctx.globalCompositeOperation = "source-over"; currentBlend = "source-over"; }
//           let sSize = item.size * scale;
//           ctx.fillStyle = "#ffffff";
//           ctx.globalAlpha = Math.min(1, Math.max(0.1, (item.z + 3000) / 5000));
//           ctx.fillRect(px - sSize/2, py - sSize/2, sSize, sSize);
//         } 
//         else if (item.type === 2) {
//           if (currentBlend !== "source-over") { ctx.globalCompositeOperation = "source-over"; currentBlend = "source-over"; }
//           if (scale > IMAGE_SHOW_SCALE) {
//             let img = images[item.imgIdx];
//             if (img && img.complete && img.naturalWidth > 0) {
//               let isize = item.size * scale * 8;
//               ctx.globalAlpha = 1;
//               ctx.drawImage(img, px - isize/2, py - isize/2, isize, isize);
//             }
//           } else {
//             let sq = item.size * scale;
//             ctx.fillStyle = "#FF8C00";
//             ctx.globalAlpha = Math.min(1, (item.z + 2000) / 3000);
//             ctx.fillRect(px - sq/2, py - sq/2, sq, sq);
//           }
//         } 
//         else if (item.type === 3 && caches.planet) {
//           if (currentBlend !== "lighter") { ctx.globalCompositeOperation = "lighter"; currentBlend = "lighter"; }
//           ctx.globalAlpha = 1;
//           let pr = PLANET_RADIUS * scale * 3.5; 
//           ctx.drawImage(caches.planet, px - pr, py - pr, pr * 2, pr * 2);
//         }
//         else if (item.type === 4) {
//           if (currentBlend !== "source-over") { ctx.globalCompositeOperation = "source-over"; currentBlend = "source-over"; }
//           ctx.globalAlpha = 1;
//           let txtImg = caches.text[item.charKey];
//           if (txtImg) {
//             let ts = 30 * scale; 
//             ctx.drawImage(txtImg, px - ts, py - ts, ts * 2, ts * 2);
//           }
//         }
//         else if (item.type === 5 && item.cache) {
//           if (currentBlend !== "lighter") { ctx.globalCompositeOperation = "lighter"; currentBlend = "lighter"; }
//           ctx.globalAlpha = 1;
//           let gradRadius = item.size * scale;
//           if (gradRadius > 10) {
//             ctx.drawImage(item.cache, px - gradRadius, py - gradRadius, gradRadius * 2, gradRadius * 2);
//           }
//         }
//       }
      
//       ctx.globalAlpha = 1; 
//       requestId = requestAnimationFrame(animate);
//     };

//     preloadImages(); 

//     // Dọn dẹp sự kiện
//     return () => {
//       cancelAnimationFrame(requestId);
//       window.removeEventListener("resize", resize);
      
//       canvas.removeEventListener("wheel", onWheel);
//       canvas.removeEventListener("pointerdown", onPointerDown);
//       canvas.removeEventListener("pointermove", onPointerMove);
//       canvas.removeEventListener("pointerup", onPointerUp);
//       canvas.removeEventListener("pointercancel", onPointerUp);
      
//       canvas.removeEventListener("touchstart", onTouchStart);
//       canvas.removeEventListener("touchmove", onTouchMove);
//     };
//   }, [text, imageUrls]);

//   return (
//     <div className="galaxy-container" ref={containerRef}>
      
//       {/* Loading Screen */}
//       {isLoading && (
//         <div style={{
//           position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
//           backgroundColor: '#000', display: 'flex', flexDirection: 'column',
//           justifyContent: 'center', alignItems: 'center', zIndex: 9999,
//           opacity: fadeLoading ? 0 : 1, transition: 'opacity 0.5s ease'
//         }}>
//           <div style={{
//             width: '40px', height: '40px', border: '4px solid rgba(255, 140, 0, 0.2)',
//             borderTop: '4px solid #FF8C00', borderRadius: '50%',
//             animation: 'spin 1s linear infinite'
//           }} />
//           <div style={{ color: '#FF8C00', marginTop: '15px', fontWeight: 'bold', letterSpacing: '2px', fontSize: '14px' }}>
//             LOADING UNIVERSE...
//           </div>
//         </div>
//       )}

//       {/* Canvas */}
//       <canvas 
//         ref={canvasRef} 
//         style={{ display: 'block', width: '100%', height: '100%', touchAction: 'none' }} 
//       />

//       {/* CSS Nhúng */}
//       <style>
//         {`
//           .galaxy-container {
//             width: 100%;
//             height: 60vh; /* Giảm chiều cao trên PC */
//             min-height: 400px; /* Tránh bị quá bẹp */
//             position: relative;
//             overflow: hidden;
//             background-color: #000;
//             cursor: grab; /* Chỉ báo tương tác kéo thả */
//           }
          
//           .galaxy-container:active {
//             cursor: grabbing; /* Thay đổi icon khi nhấn giữ */
//           }

//           @media (max-width: 768px) {
//             .galaxy-container {
//               height: 50vh; /* Thu gọn cho Mobile */
//             }
//           }

//           @keyframes spin { 100% { transform: rotate(360deg); } }
//         `}
//       </style>
//     </div>
//   );
// };

// export default GalaxyAnimation;
// import React, { useEffect, useRef, useState } from 'react';

// const GalaxyAnimation = ({ text = "DINH LUONG TA", imageUrls = ["luen_logo.png", "hexagon-main.png", "luen-1.jpg"] }) => {
//   const canvasRef = useRef(null);
//   const containerRef = useRef(null);

//   const [isLoading, setIsLoading] = useState(true);
//   const [fadeLoading, setFadeLoading] = useState(false);

//   const state = useRef({
//     zoom: window.innerWidth < 768 ? 0.15 : 0.25,
//     initialZoom: window.innerWidth < 768 ? 0.15 : 0.25,
//     rotX: 1.8,
//     rotY: 0,
//     dragging: false,
//     lastX: 0,
//     lastY: 0,
//     initialPinchDist: null,
//     shootingStar: { active: false, x: 0, y: 0, len: 0, speed: 0, opacity: 0 }
//   });

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const container = containerRef.current;
//     if (!canvas || !container) return;

//     const ctx = canvas.getContext("2d", { alpha: false });
//     let requestId;

//     const isMobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
//     const STAR_COUNT = isMobile ? 250 : 600;
//     const PARTICLE_COUNT = isMobile ? 400 : 1200;
//     const IMAGE_SHOW_SCALE = 0.8;
//     const PERSPECTIVE = 2000;
//     const PLANET_RADIUS = 110;

//     let w, h, cx, cy;
//     let images = [], bgStars = [], particles = [];
//     const rand = (a, b) => Math.random() * (b - a) + a;

//     const RINGS = [
//       { text: "DINH ", radius: 220, tilt: -0.8, speed: 1.2, color: "#ff6200" },
//       { text: "LUONG ", radius: 320, tilt: 0.8, speed: 0.8, color: "#6a00ff" },
//       { text: "TA ", radius: 420, tilt: "vertical", speed: 0.5, color: "#ff0066" }
//     ];

//     const caches = { text: {}, planet: null, auraOrange: null, auraPurple: null };

//     const createCacheCanvas = (size, renderFunc) => {
//       const c = document.createElement('canvas');
//       c.width = size; c.height = size;
//       renderFunc(c.getContext('2d'), size / 2);
//       return c;
//     };

//     const initCaches = () => {
//       caches.planet = createCacheCanvas(400, (ctxCache, center) => {
//         const pr = 60;
//         ctxCache.globalCompositeOperation = "lighter";
//         const glow = ctxCache.createRadialGradient(center, center, pr * 0.2, center, center, pr * 3);
//         glow.addColorStop(0, "rgba(255,255,220,0.9)");
//         glow.addColorStop(0.2, "rgba(255,180,0,0.8)");
//         glow.addColorStop(0.5, "rgba(255,120,0,0.35)");
//         glow.addColorStop(1, "rgba(255,80,0,0)");
//         ctxCache.fillStyle = glow;
//         ctxCache.beginPath(); ctxCache.arc(center, center, pr * 3, 0, Math.PI * 2); ctxCache.fill();
        
//         const sun = ctxCache.createRadialGradient(center - pr * 0.3, center - pr * 0.3, pr * 0.1, center, center, pr);
//         sun.addColorStop(0, "#fff7cc"); sun.addColorStop(0.3, "#ffcc33");
//         sun.addColorStop(0.7, "#ff8800"); sun.addColorStop(1, "#ff5500");
//         ctxCache.fillStyle = sun;
//         ctxCache.beginPath(); ctxCache.arc(center, center, pr, 0, Math.PI * 2); ctxCache.fill();
//       });

//       const buildAura = (colorRGB) => createCacheCanvas(400, (ctxCache, center) => {
//         const g = ctxCache.createRadialGradient(center, center, 0, center, center, center);
//         g.addColorStop(0, `rgba(${colorRGB}, 0.5)`);
//         g.addColorStop(0.3, `rgba(${colorRGB}, 0.25)`);
//         g.addColorStop(0.7, `rgba(${colorRGB}, 0.08)`);
//         g.addColorStop(1, "rgba(0,0,0,0)");
//         ctxCache.fillStyle = g;
//         ctxCache.beginPath(); ctxCache.arc(center, center, center, 0, Math.PI * 2); ctxCache.fill();
//       });
//       caches.auraOrange = buildAura("255, 140, 0");
//       caches.auraPurple = buildAura("180, 0, 255");

//       RINGS.forEach(ring => {
//         const uniqueChars = [...new Set(ring.text)];
//         uniqueChars.forEach(char => {
//           const key = char + ring.color;
//           if (!caches.text[key]) {
//             caches.text[key] = createCacheCanvas(80, (ctxCache, center) => {
//               ctxCache.font = "bold 35px Impact, Arial";
//               ctxCache.textAlign = "center"; ctxCache.textBaseline = "middle";
//               ctxCache.shadowColor = ring.color; ctxCache.shadowBlur = 12;
//               ctxCache.strokeStyle = ring.color; ctxCache.lineWidth = 3; ctxCache.lineJoin = "round";
//               ctxCache.strokeText(char, center, center);
//               ctxCache.shadowBlur = 0;
//               ctxCache.fillStyle = "#ffffff";
//               ctxCache.fillText(char, center, center);
//             });
//           }
//         });
//       });
//     };

//     let isAppStarted = false;

//     const startUniverse = () => {
//       if (isAppStarted) return;
//       isAppStarted = true;

//       initCaches();
      
//       bgStars = Array.from({ length: STAR_COUNT }, () => ({
//         x: rand(-3000, 3000), y: rand(-3000, 3000), z: rand(-3000, 3000),
//         size: rand(4, 7), color: "#ffffff"
//       }));

//       particles = Array.from({ length: PARTICLE_COUNT }, () => ({
//         radius: rand(500, 900), angle: Math.random() * Math.PI * 2,
//         speed: rand(0.0005, 0.002), yOffset: rand(-50, 50), size: rand(4, 6),
//         imgIndex: Math.floor(Math.random() * imageUrls.length)
//       }));

//       resize();
//       requestAnimationFrame(animate);

//       setFadeLoading(true);
//       setTimeout(() => setIsLoading(false), 500);
//     };

//     const preloadImages = () => {
//       const promises = imageUrls.map(src => {
//         return new Promise((resolve) => {
//           const img = new Image();
//           img.onload = () => resolve(img);
//           img.onerror = () => resolve(img);
//           img.src = src;
//         });
//       });

//       Promise.all(promises).then(loadedImages => {
//         images = loadedImages;
//         startUniverse();
//       });

//       setTimeout(() => startUniverse(), 3000);
//     };

//     const resize = () => {
//       if (!containerRef.current) return;
//       w = canvas.width = containerRef.current.clientWidth;
//       h = canvas.height = containerRef.current.clientHeight;
//       cx = w / 2; cy = h / 2;
//     };

//     // ==========================================
//     // KIỂM SOÁT TƯƠNG TÁC (CHẶN ZOOM & XOAY Ở PC)
//     // ==========================================
//     const getTouchDist = (touches) => Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);

//     // Kéo & Xoay ngân hà bằng Pointer Events
//     const onPointerDown = (e) => {
//       // FIX: Chặn thao tác bằng chuột trên PC
//       if (e.pointerType === 'mouse') return; 

//       state.current.dragging = true;
//       state.current.lastX = e.clientX;
//       state.current.lastY = e.clientY;
//       canvas.setPointerCapture(e.pointerId); 
//     };

//     const onPointerMove = (e) => {
//       if (!state.current.dragging) return;
//       state.current.rotY += (e.clientX - state.current.lastX) * 0.006;
//       state.current.rotX += (e.clientY - state.current.lastY) * 0.006;
//       state.current.lastX = e.clientX;
//       state.current.lastY = e.clientY;
//     };

//     const onPointerUp = (e) => {
//       state.current.dragging = false;
//       canvas.releasePointerCapture(e.pointerId);
//     };

//     // Thu/Phóng bằng 2 ngón tay (Chỉ áp dụng Touch trên Mobile)
//     const onTouchStart = (e) => {
//       if (e.touches.length === 2) {
//         state.current.dragging = false; 
//         state.current.initialPinchDist = getTouchDist(e.touches);
//         state.current.initialZoom = state.current.zoom;
//       }
//     };

//     const onTouchMove = (e) => {
//       if (e.touches.length === 2 && state.current.initialPinchDist) {
//         e.preventDefault(); 
//         const dist = getTouchDist(e.touches);
//         state.current.zoom = Math.max(0.05, Math.min(4, state.current.initialZoom * (dist / state.current.initialPinchDist)));
//       }
//     };

//     // Đăng ký sự kiện (Lưu ý: Không add sự kiện "wheel" để giữ chức năng cuộn chuột mặc định của trình duyệt)
//     window.addEventListener("resize", resize);
    
//     canvas.addEventListener("pointerdown", onPointerDown);
//     canvas.addEventListener("pointermove", onPointerMove);
//     canvas.addEventListener("pointerup", onPointerUp);
//     canvas.addEventListener("pointercancel", onPointerUp); 
    
//     canvas.addEventListener("touchstart", onTouchStart, { passive: true });
//     canvas.addEventListener("touchmove", onTouchMove, { passive: false });

//     // --- CORE RENDER ---
//     const MAX_RENDER = STAR_COUNT + PARTICLE_COUNT + 300;
//     const renderPool = Array.from({ length: MAX_RENDER }, () => ({
//       type: 0, x: 0, y: 0, z: 0, size: 0, charKey: '', imgIdx: 0, cache: null
//     }));
    
//     const PTX = Math.PI / 2.3, PTZ = Math.PI / 6;
//     const cPTX = Math.cos(PTX), sPTX = Math.sin(PTX), cPTZ = Math.cos(PTZ), sPTZ = Math.sin(PTZ);

//     const animate = () => {
//       const time = performance.now() * 0.0004;
//       ctx.fillStyle = "#000"; ctx.fillRect(0, 0, w, h);

//       const st = state.current;
//       const ss = st.shootingStar;

//       if (!ss.active && Math.random() < 0.01) { 
//         ss.active = true; ss.x = -400; ss.y = rand(50, h * 0.7);
//         ss.len = rand(150, 300); 
//         ss.speed = rand(15, 25); 
//         ss.opacity = 1;
//       } else if (ss.active) {
//         ss.x += ss.speed; 
//         ss.opacity -= 0.003; 
//         if (ss.x > w + 400 || ss.opacity <= 0) ss.active = false;
        
//         ctx.save(); ctx.globalCompositeOperation = "lighter";
//         const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.len, ss.y);
//         grad.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`);
//         grad.addColorStop(1, "rgba(255, 255, 255, 0)");
//         ctx.strokeStyle = grad; ctx.lineWidth = 2; ctx.beginPath();
//         ctx.moveTo(ss.x, ss.y); ctx.lineTo(ss.x - ss.len, ss.y);
//         ctx.stroke(); ctx.restore();
//       }

//       let cosRX = Math.cos(st.rotX), sinRX = Math.sin(st.rotX);
//       let cosRY = Math.cos(st.rotY), sinRY = Math.sin(st.rotY);
//       let rCount = 0;

//       const auraData = [
//         { cache: caches.auraOrange, tx: -1200 + Math.sin(time*0.5)*150, ty: 300 + Math.cos(time*0.3)*150, tz: -300 + Math.sin(time*0.5)*100, radius: 3200 },
//         { cache: caches.auraPurple, tx: 1200 + Math.sin(time*0.4)*150, ty: 300 + Math.cos(time*0.2)*150, tz: -300 + Math.sin(time*0.4)*100, radius: 3200 }
//       ];
//       for(let a of auraData) {
//         let y1 = a.ty * cosRX - a.tz * sinRX, z1 = a.ty * sinRX + a.tz * cosRX;
//         let r = renderPool[rCount++];
//         r.type = 5; r.x = a.tx * cosRY + z1 * sinRY; r.y = y1; r.z = -a.tx * sinRY + z1 * cosRY;
//         r.cache = a.cache; r.size = a.radius;
//       }

//       let rp = renderPool[rCount++];
//       rp.type = 3; rp.x = 0; rp.y = 0; rp.z = 0;

//       for (let i = 0; i < RINGS.length; i++) {
//         let ring = RINGS[i];
//         let repeatCount = Math.floor(ring.radius / 15);
//         let fullText = ring.text.repeat(repeatCount);
//         for (let j = 0; j < fullText.length; j++) {
//           let cA = (time * ring.speed) + (j * (Math.PI * 2 / fullText.length));
//           let tx = (ring.tilt === "vertical") ? 0 : Math.cos(cA) * ring.radius;
//           let tz = Math.sin(cA) * ring.radius;
//           let ty = (ring.tilt === "vertical") ? Math.cos(cA) * ring.radius : tx * ring.tilt;
          
//           let y1 = ty * cosRX - tz * sinRX, z1 = ty * sinRX + tz * cosRX;
//           let r = renderPool[rCount++];
//           r.type = 4; r.x = tx * cosRY + z1 * sinRY; r.y = y1; r.z = -tx * sinRY + z1 * cosRY;
//           r.charKey = fullText[j] + ring.color;
//         }
//       }

//       for (let i = 0; i < particles.length; i++) {
//         let p = particles[i];
//         let curA = p.angle + time + (time * p.speed * 80);
//         let px = p.radius * Math.cos(curA), pz = p.radius * Math.sin(curA), py = p.yOffset;
//         let py1 = py * cPTX - pz * sPTX, pz1 = py * sPTX + pz * cPTX;
//         let tx = px * cPTZ - py1 * sPTZ, ty = px * sPTZ + py1 * cPTZ;
//         let y1 = ty * cosRX - pz1 * sinRX, z1 = ty * sinRX + pz1 * cosRX;
        
//         let r = renderPool[rCount++];
//         r.type = 2; r.x = tx * cosRY + z1 * sinRY; r.y = y1; r.z = -tx * sinRY + z1 * cosRY;
//         r.size = p.size; r.imgIdx = p.imgIndex;
//       }

//       for (let i = 0; i < bgStars.length; i++) {
//         let s = bgStars[i];
//         let y1 = s.y * cosRX - s.z * sinRX, z1 = s.y * sinRX + s.z * cosRX;
//         let r = renderPool[rCount++];
//         r.type = 1; r.x = s.x * cosRY + z1 * sinRY; r.y = y1; r.z = -s.x * sinRY + z1 * cosRY;
//         r.size = s.size;
//       }

//       let activeRender = renderPool.slice(0, rCount).sort((a, b) => b.z - a.z);
//       let currentBlend = "source-over";

//       for (let i = 0; i < rCount; i++) {
//         let item = activeRender[i];
//         let scale = (PERSPECTIVE / (PERSPECTIVE + item.z)) * st.zoom;
//         if (scale <= 0) continue;

//         let px = cx + item.x * scale;
//         let py = cy + item.y * scale;

//         if (item.type === 1) {
//           if (currentBlend !== "source-over") { ctx.globalCompositeOperation = "source-over"; currentBlend = "source-over"; }
//           let sSize = item.size * scale;
//           ctx.fillStyle = "#ffffff";
//           ctx.globalAlpha = Math.min(1, Math.max(0.1, (item.z + 3000) / 5000));
//           ctx.fillRect(px - sSize/2, py - sSize/2, sSize, sSize);
//         } 
//         else if (item.type === 2) {
//           if (currentBlend !== "source-over") { ctx.globalCompositeOperation = "source-over"; currentBlend = "source-over"; }
//           if (scale > IMAGE_SHOW_SCALE) {
//             let img = images[item.imgIdx];
//             if (img && img.complete && img.naturalWidth > 0) {
//               let isize = item.size * scale * 8;
//               ctx.globalAlpha = 1;
//               ctx.drawImage(img, px - isize/2, py - isize/2, isize, isize);
//             }
//           } else {
//             let sq = item.size * scale;
//             ctx.fillStyle = "#FF8C00";
//             ctx.globalAlpha = Math.min(1, (item.z + 2000) / 3000);
//             ctx.fillRect(px - sq/2, py - sq/2, sq, sq);
//           }
//         } 
//         else if (item.type === 3 && caches.planet) {
//           if (currentBlend !== "lighter") { ctx.globalCompositeOperation = "lighter"; currentBlend = "lighter"; }
//           ctx.globalAlpha = 1;
//           let pr = PLANET_RADIUS * scale * 3.5; 
//           ctx.drawImage(caches.planet, px - pr, py - pr, pr * 2, pr * 2);
//         }
//         else if (item.type === 4) {
//           if (currentBlend !== "source-over") { ctx.globalCompositeOperation = "source-over"; currentBlend = "source-over"; }
//           ctx.globalAlpha = 1;
//           let txtImg = caches.text[item.charKey];
//           if (txtImg) {
//             let ts = 30 * scale; 
//             ctx.drawImage(txtImg, px - ts, py - ts, ts * 2, ts * 2);
//           }
//         }
//         else if (item.type === 5 && item.cache) {
//           if (currentBlend !== "lighter") { ctx.globalCompositeOperation = "lighter"; currentBlend = "lighter"; }
//           ctx.globalAlpha = 1;
//           let gradRadius = item.size * scale;
//           if (gradRadius > 10) {
//             ctx.drawImage(item.cache, px - gradRadius, py - gradRadius, gradRadius * 2, gradRadius * 2);
//           }
//         }
//       }
      
//       ctx.globalAlpha = 1; 
//       requestId = requestAnimationFrame(animate);
//     };

//     preloadImages(); 

//     return () => {
//       cancelAnimationFrame(requestId);
//       window.removeEventListener("resize", resize);
      
//       canvas.removeEventListener("pointerdown", onPointerDown);
//       canvas.removeEventListener("pointermove", onPointerMove);
//       canvas.removeEventListener("pointerup", onPointerUp);
//       canvas.removeEventListener("pointercancel", onPointerUp);
      
//       canvas.removeEventListener("touchstart", onTouchStart);
//       canvas.removeEventListener("touchmove", onTouchMove);
//     };
//   }, [text, imageUrls]);

//   return (
//     <div className="galaxy-container" ref={containerRef}>
      
//       {/* Loading Screen */}
//       {isLoading && (
//         <div style={{
//           position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
//           backgroundColor: '#000', display: 'flex', flexDirection: 'column',
//           justifyContent: 'center', alignItems: 'center', zIndex: 9999,
//           opacity: fadeLoading ? 0 : 1, transition: 'opacity 0.5s ease'
//         }}>
//           <div style={{
//             width: '40px', height: '40px', border: '4px solid rgba(255, 140, 0, 0.2)',
//             borderTop: '4px solid #FF8C00', borderRadius: '50%',
//             animation: 'spin 1s linear infinite'
//           }} />
//           <div style={{ color: '#FF8C00', marginTop: '15px', fontWeight: 'bold', letterSpacing: '2px', fontSize: '14px' }}>
//             LOADING UNIVERSE...
//           </div>
//         </div>
//       )}

//       {/* Canvas */}
//       <canvas 
//         ref={canvasRef} 
//         style={{ display: 'block', width: '100%', height: '100%', touchAction: 'none' }} 
//       />

//       {/* CSS Nhúng */}
//       <style>
//         {`
//           .galaxy-container {
//             width: 100%;
//             height: 100vh; /* FIX 1: Trả về origin 100vh (full màn hình) */
//             position: relative;
//             overflow: hidden;
//             background-color: #000;
//             /* Xóa con trỏ 'grab' vì PC không kéo được nữa */
//           }

//           @media (max-width: 768px) {
//             .galaxy-container {
//               height: 50vh; /* Vẫn giữ tỷ lệ ngắn gọn cho Mobile */
//             }
//           }

//           @keyframes spin { 100% { transform: rotate(360deg); } }
//         `}
//       </style>
//     </div>
//   );
// };

// export default GalaxyAnimation;
import React, { useEffect, useRef, useState } from 'react';

const GalaxyAnimation = ({ text = "DINH LUONG TA", imageUrls = ["luen_logo.png", "hexagon-main.png", "luen-1.jpg"] }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [fadeLoading, setFadeLoading] = useState(false);

  // Chỉ giữ lại các thông số góc nhìn cố định
  const state = useRef({
    zoom: window.innerWidth < 768 ? 0.25 : 0.35,
    rotX: 1.8,
    rotY: 0,
    shootingStar: { active: false, x: 0, y: 0, len: 0, speed: 0, opacity: 0 }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    let requestId;

    const isMobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    // const STAR_COUNT = isMobile ? 250 : 600;
    // const PARTICLE_COUNT = isMobile ? 400 : 1200;
    const STAR_COUNT = 600;
    const PARTICLE_COUNT = 1200;
    const IMAGE_SHOW_SCALE = 0.8;
    const PERSPECTIVE = 2000;
    const PLANET_RADIUS = 110;

    let w, h, cx, cy;
    let images = [], bgStars = [], particles = [];
    const rand = (a, b) => Math.random() * (b - a) + a;

    const RINGS = [
      { text: "DINH ", radius: 220, tilt: -0.8, speed: 1.2, color: "#ff6200" },
      { text: "LUONG ", radius: 320, tilt: 0.8, speed: 0.8, color: "#6a00ff" },
      { text: "TA ", radius: 420, tilt: "vertical", speed: 0.5, color: "#ff0066" }
    ];

    const caches = { text: {}, planet: null, auraOrange: null, auraPurple: null };

    const createCacheCanvas = (size, renderFunc) => {
      const c = document.createElement('canvas');
      c.width = size; c.height = size;
      renderFunc(c.getContext('2d'), size / 2);
      return c;
    };

    const initCaches = () => {
      caches.planet = createCacheCanvas(400, (ctxCache, center) => {
        const pr = 60;
        ctxCache.globalCompositeOperation = "lighter";
        const glow = ctxCache.createRadialGradient(center, center, pr * 0.2, center, center, pr * 3);
        glow.addColorStop(0, "rgba(255,255,220,0.9)");
        glow.addColorStop(0.2, "rgba(255,180,0,0.8)");
        glow.addColorStop(0.5, "rgba(255,120,0,0.35)");
        glow.addColorStop(1, "rgba(255,80,0,0)");
        ctxCache.fillStyle = glow;
        ctxCache.beginPath(); ctxCache.arc(center, center, pr * 3, 0, Math.PI * 2); ctxCache.fill();
        
        const sun = ctxCache.createRadialGradient(center - pr * 0.3, center - pr * 0.3, pr * 0.1, center, center, pr);
        sun.addColorStop(0, "#fff7cc"); sun.addColorStop(0.3, "#ffcc33");
        sun.addColorStop(0.7, "#ff8800"); sun.addColorStop(1, "#ff5500");
        ctxCache.fillStyle = sun;
        ctxCache.beginPath(); ctxCache.arc(center, center, pr, 0, Math.PI * 2); ctxCache.fill();
      });

      const buildAura = (colorRGB) => createCacheCanvas(400, (ctxCache, center) => {
        const g = ctxCache.createRadialGradient(center, center, 0, center, center, center);
        g.addColorStop(0, `rgba(${colorRGB}, 0.5)`);
        g.addColorStop(0.3, `rgba(${colorRGB}, 0.25)`);
        g.addColorStop(0.7, `rgba(${colorRGB}, 0.08)`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctxCache.fillStyle = g;
        ctxCache.beginPath(); ctxCache.arc(center, center, center, 0, Math.PI * 2); ctxCache.fill();
      });
      caches.auraOrange = buildAura("255, 140, 0");
      caches.auraPurple = buildAura("180, 0, 255");

      RINGS.forEach(ring => {
        const uniqueChars = [...new Set(ring.text)];
        uniqueChars.forEach(char => {
          const key = char + ring.color;
          if (!caches.text[key]) {
            caches.text[key] = createCacheCanvas(80, (ctxCache, center) => {
              ctxCache.font = "bold 35px Impact, Arial";
              ctxCache.textAlign = "center"; ctxCache.textBaseline = "middle";
              ctxCache.shadowColor = ring.color; ctxCache.shadowBlur = 12;
              ctxCache.strokeStyle = ring.color; ctxCache.lineWidth = 3; ctxCache.lineJoin = "round";
              ctxCache.strokeText(char, center, center);
              ctxCache.shadowBlur = 0;
              ctxCache.fillStyle = "#ffffff";
              ctxCache.fillText(char, center, center);
            });
          }
        });
      });
    };

    let isAppStarted = false;

    const startUniverse = () => {
      if (isAppStarted) return;
      isAppStarted = true;

      initCaches();
      
      bgStars = Array.from({ length: STAR_COUNT }, () => ({
        x: rand(-3000, 3000), y: rand(-3000, 3000), z: rand(-3000, 3000),
        size: rand(4, 7), color: "#ffffff"
      }));

      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        radius: rand(500, 900), angle: Math.random() * Math.PI * 2,
        speed: rand(0.0005, 0.002), yOffset: rand(-50, 50), size: rand(4, 6),
        imgIndex: Math.floor(Math.random() * imageUrls.length)
      }));

      resize();
      requestAnimationFrame(animate);

      setFadeLoading(true);
      setTimeout(() => setIsLoading(false), 500);
    };

    const preloadImages = () => {
      const promises = imageUrls.map(src => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => resolve(img);
          img.src = src;
        });
      });

      Promise.all(promises).then(loadedImages => {
        images = loadedImages;
        startUniverse();
      });

      setTimeout(() => startUniverse(), 3000);
    };

    const resize = () => {
      if (!containerRef.current) return;
      w = canvas.width = containerRef.current.clientWidth;
      h = canvas.height = containerRef.current.clientHeight;
      cx = w / 2; cy = h / 2;
    };

    // Chỉ giữ lại sự kiện thay đổi kích thước màn hình
    window.addEventListener("resize", resize);

    // --- CORE RENDER ---
    const MAX_RENDER = STAR_COUNT + PARTICLE_COUNT + 300;
    const renderPool = Array.from({ length: MAX_RENDER }, () => ({
      type: 0, x: 0, y: 0, z: 0, size: 0, charKey: '', imgIdx: 0, cache: null
    }));
    
    const PTX = Math.PI / 2.3, PTZ = Math.PI / 6;
    const cPTX = Math.cos(PTX), sPTX = Math.sin(PTX), cPTZ = Math.cos(PTZ), sPTZ = Math.sin(PTZ);

    const animate = () => {
      const time = performance.now() * 0.0004;
      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, w, h);

      const st = state.current;
      const ss = st.shootingStar;

      if (!ss.active && Math.random() < 0.01) { 
        ss.active = true; ss.x = -400; ss.y = rand(50, h * 0.7);
        ss.len = rand(150, 300); 
        ss.speed = rand(20, 40); 
        ss.opacity = 1;
      } else if (ss.active) {
        ss.x += ss.speed; 
        ss.opacity -= 0.003; 
        if (ss.x > w + 400 || ss.opacity <= 0) ss.active = false;
        
        ctx.save(); ctx.globalCompositeOperation = "lighter";
        const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.len, ss.y);
        grad.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`);
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.strokeStyle = grad; ctx.lineWidth = 2; ctx.beginPath();
        ctx.moveTo(ss.x, ss.y); ctx.lineTo(ss.x - ss.len, ss.y);
        ctx.stroke(); ctx.restore();
      }

      let cosRX = Math.cos(st.rotX), sinRX = Math.sin(st.rotX);
      let cosRY = Math.cos(st.rotY), sinRY = Math.sin(st.rotY);
      let rCount = 0;

      const auraData = [
        { cache: caches.auraOrange, tx: -1200 + Math.sin(time*0.5)*150, ty: 300 + Math.cos(time*0.3)*150, tz: -300 + Math.sin(time*0.5)*100, radius: 3200 },
        { cache: caches.auraPurple, tx: 1200 + Math.sin(time*0.4)*150, ty: 300 + Math.cos(time*0.2)*150, tz: -300 + Math.sin(time*0.4)*100, radius: 3200 }
      ];
      for(let a of auraData) {
        let y1 = a.ty * cosRX - a.tz * sinRX, z1 = a.ty * sinRX + a.tz * cosRX;
        let r = renderPool[rCount++];
        r.type = 5; r.x = a.tx * cosRY + z1 * sinRY; r.y = y1; r.z = -a.tx * sinRY + z1 * cosRY;
        r.cache = a.cache; r.size = a.radius;
      }

      let rp = renderPool[rCount++];
      rp.type = 3; rp.x = 0; rp.y = 0; rp.z = 0;

      for (let i = 0; i < RINGS.length; i++) {
        let ring = RINGS[i];
        let repeatCount = Math.floor(ring.radius / 15);
        let fullText = ring.text.repeat(repeatCount);
        for (let j = 0; j < fullText.length; j++) {
          let cA = (time * ring.speed) + (j * (Math.PI * 2 / fullText.length));
          let tx = (ring.tilt === "vertical") ? 0 : Math.cos(cA) * ring.radius;
          let tz = Math.sin(cA) * ring.radius;
          let ty = (ring.tilt === "vertical") ? Math.cos(cA) * ring.radius : tx * ring.tilt;
          
          let y1 = ty * cosRX - tz * sinRX, z1 = ty * sinRX + tz * cosRX;
          let r = renderPool[rCount++];
          r.type = 4; r.x = tx * cosRY + z1 * sinRY; r.y = y1; r.z = -tx * sinRY + z1 * cosRY;
          r.charKey = fullText[j] + ring.color;
        }
      }

      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        let curA = p.angle + time + (time * p.speed * 80);
        let px = p.radius * Math.cos(curA), pz = p.radius * Math.sin(curA), py = p.yOffset;
        let py1 = py * cPTX - pz * sPTX, pz1 = py * sPTX + pz * cPTX;
        let tx = px * cPTZ - py1 * sPTZ, ty = px * sPTZ + py1 * cPTZ;
        let y1 = ty * cosRX - pz1 * sinRX, z1 = ty * sinRX + pz1 * cosRX;
        
        let r = renderPool[rCount++];
        r.type = 2; r.x = tx * cosRY + z1 * sinRY; r.y = y1; r.z = -tx * sinRY + z1 * cosRY;
        r.size = p.size; r.imgIdx = p.imgIndex;
      }

      for (let i = 0; i < bgStars.length; i++) {
        let s = bgStars[i];
        let y1 = s.y * cosRX - s.z * sinRX, z1 = s.y * sinRX + s.z * cosRX;
        let r = renderPool[rCount++];
        r.type = 1; r.x = s.x * cosRY + z1 * sinRY; r.y = y1; r.z = -s.x * sinRY + z1 * cosRY;
        r.size = s.size;
      }

      let activeRender = renderPool.slice(0, rCount).sort((a, b) => b.z - a.z);
      let currentBlend = "source-over";

      for (let i = 0; i < rCount; i++) {
        let item = activeRender[i];
        let scale = (PERSPECTIVE / (PERSPECTIVE + item.z)) * st.zoom;
        if (scale <= 0) continue;

        let px = cx + item.x * scale;
        let py = cy + item.y * scale;

        if (item.type === 1) {
          if (currentBlend !== "source-over") { ctx.globalCompositeOperation = "source-over"; currentBlend = "source-over"; }
          let sSize = item.size * scale;
          ctx.fillStyle = "#ffffff";
          ctx.globalAlpha = Math.min(1, Math.max(0.1, (item.z + 3000) / 5000));
          ctx.fillRect(px - sSize/2, py - sSize/2, sSize, sSize);
        } 
        else if (item.type === 2) {
          if (currentBlend !== "source-over") { ctx.globalCompositeOperation = "source-over"; currentBlend = "source-over"; }
          if (scale > IMAGE_SHOW_SCALE) {
            let img = images[item.imgIdx];
            if (img && img.complete && img.naturalWidth > 0) {
              let isize = item.size * scale * 8;
              ctx.globalAlpha = 1;
              ctx.drawImage(img, px - isize/2, py - isize/2, isize, isize);
            }
          } else {
            let sq = item.size * scale;
            ctx.fillStyle = "#FF8C00";
            ctx.globalAlpha = Math.min(1, (item.z + 2000) / 3000);
            ctx.fillRect(px - sq/2, py - sq/2, sq, sq);
          }
        } 
        else if (item.type === 3 && caches.planet) {
          if (currentBlend !== "lighter") { ctx.globalCompositeOperation = "lighter"; currentBlend = "lighter"; }
          ctx.globalAlpha = 1;
          let pr = PLANET_RADIUS * scale * 3.5; 
          ctx.drawImage(caches.planet, px - pr, py - pr, pr * 2, pr * 2);
        }
        else if (item.type === 4) {
          if (currentBlend !== "source-over") { ctx.globalCompositeOperation = "source-over"; currentBlend = "source-over"; }
          ctx.globalAlpha = 1;
          let txtImg = caches.text[item.charKey];
          if (txtImg) {
            let ts = 30 * scale; 
            ctx.drawImage(txtImg, px - ts, py - ts, ts * 2, ts * 2);
          }
        }
        else if (item.type === 5 && item.cache) {
          if (currentBlend !== "lighter") { ctx.globalCompositeOperation = "lighter"; currentBlend = "lighter"; }
          ctx.globalAlpha = 1;
          let gradRadius = item.size * scale;
          if (gradRadius > 10) {
            ctx.drawImage(item.cache, px - gradRadius, py - gradRadius, gradRadius * 2, gradRadius * 2);
          }
        }
      }
      
      ctx.globalAlpha = 1; 
      requestId = requestAnimationFrame(animate);
    };

    preloadImages(); 

    return () => {
      cancelAnimationFrame(requestId);
      window.removeEventListener("resize", resize);
    };
  }, [text, imageUrls]);

  return (
    <div className="galaxy-container" ref={containerRef}>
      
      {/* Loading Screen */}
      {isLoading && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: '#000', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', zIndex: 9999,
          opacity: fadeLoading ? 0 : 1, transition: 'opacity 0.5s ease'
        }}>
          <div style={{
            width: '40px', height: '40px', border: '4px solid rgba(255, 140, 0, 0.2)',
            borderTop: '4px solid #FF8C00', borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <div style={{ color: '#FF8C00', marginTop: '15px', fontWeight: 'bold', letterSpacing: '2px', fontSize: '14px' }}>
            LOADING UNIVERSE...
          </div>
        </div>
      )}

      {/* Canvas */}
      <canvas 
        ref={canvasRef} 
        style={{ display: 'block', width: '100%', height: '100%' }} // Đã xóa touchAction: 'none'
      />

      {/* CSS Nhúng */}
      <style>
        {`
          .galaxy-container {
            width: 100%;
            height: 100vh; /* Trả về origin 100vh (full màn hình) trên PC */
            position: relative;
            overflow: hidden;
            background-color: #000;
          }

          @media (max-width: 768px) {
            .galaxy-container {
              height: 60vh; /* Giữ tỷ lệ ngắn gọn cho Mobile */
            }
          }

          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}
      </style>
    </div>
  );
};

export default GalaxyAnimation;