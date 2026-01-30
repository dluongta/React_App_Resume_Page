import React, { useEffect, useRef } from 'react';
import heroImage1 from '../../../../assets/luen.jpg';
import heroImage2 from '../../../../assets/luen_logo.png';
import heroImage3 from '../../../../assets/hexagon-main.png';

const importedImages = [heroImage1, heroImage2, heroImage3];

const GalaxyAnimation = ({ text = "DINH LUONG TA" }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    let w, h, cx, cy;
    let requestId;

    /* ===== 1. CẤU HÌNH (CONFIG) ===== */
    let zoom = 0.35;
    const PERSPECTIVE = 1200;
    let rotX = 1.8;
    let rotY = 0;

    const PLANET_RADIUS = 110;
    const ORBIT_RADIUS = 280;
    const ORBIT_TILT = -80;
    const IMAGE_SHOW_SCALE = 0.8; 

    const PARTICLE_TILT_X = Math.PI / 2.3;
    const PARTICLE_TILT_Z = Math.PI / 6;
    const BLUE_COLOR = "#00ccff";

    /* ===== 2. TẢI ẢNH ===== */
    const images = importedImages.map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });

    const rand = (a, b) => Math.random() * (b - a) + a;

    /* ===== 3. KHỞI TẠO ĐỐI TƯỢNG ===== */
    // Sao nền
    const stars = Array.from({ length: 800 }, () => ({
      x: rand(-3000, 3000),
      y: rand(-3000, 3000),
      z: rand(-3000, 3000),
      size: rand(3.0, 5.5),
    }));

    // Hạt thiên hà
    const particles = [];
    for (let i = 0; i < 1500; i++) {
      particles.push({
        radius: rand(300, 600),
        angle: Math.random() * Math.PI * 2,
        speed: rand(0.0005, 0.002),
        yOffset: rand(-50, 50),
        size: rand(4, 7),
        imgIndex: Math.floor(Math.random() * images.length)
      });
    }

    /* ===== 4. LOGIC 3D & RESIZE ===== */
    function resize() {
      w = canvas.width = container.clientWidth;
      h = canvas.height = container.clientHeight;
      cx = w / 2;
      cy = h / 2;
    }

    function rotate3D(x, y, z) {
      let y1 = y * Math.cos(rotX) - z * Math.sin(rotX);
      let z1 = y * Math.sin(rotX) + z * Math.cos(rotX);
      let x2 = x * Math.cos(rotY) + z1 * Math.sin(rotY);
      let z2 = -x * Math.sin(rotY) + z1 * Math.cos(rotY);
      return { x: x2, y: y1, z: z2 };
    }

    function project(p) {
      const s = (PERSPECTIVE / (PERSPECTIVE + p.z)) * zoom;
      return { x: cx + p.x * s, y: cy + p.y * s, s, z: p.z };
    }

    /* ===== 5. TƯƠNG TÁC (PC & MOBILE PINCH ZOOM) ===== */
    let dragging = false;
    let lastX = 0, lastY = 0;
    let initialPinchDist = null;

    // Tính khoảng cách giữa 2 ngón tay
    const getTouchDist = (touches) => {
      return Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY
      );
    };

    const onWheel = (e) => {
      e.preventDefault();
      zoom += e.deltaY * -0.0006;
      zoom = Math.max(0.1, Math.min(5, zoom));
    };

    const onPointerDown = (x, y) => { dragging = true; lastX = x; lastY = y; };
    const onPointerMove = (x, y) => {
      if (!dragging) return;
      rotY += (x - lastX) * 0.004;
      rotX += (y - lastY) * 0.004;
      lastX = x; lastY = y;
    };
    const onPointerUp = () => { dragging = false; initialPinchDist = null; };

    // Sự kiện Touch (Mobile)
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
      } else if (e.touches.length === 2) {
        dragging = false; // Ngừng xoay khi đang zoom
        initialPinchDist = getTouchDist(e.touches);
      }
    };

    const handleTouchMove = (e) => {
      e.preventDefault(); // Chặn cuộn trang
      if (e.touches.length === 1) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      } else if (e.touches.length === 2 && initialPinchDist) {
        const currentDist = getTouchDist(e.touches);
        const diff = currentDist / initialPinchDist;
        zoom = Math.max(0.1, Math.min(5, zoom * diff));
        initialPinchDist = currentDist; // Cập nhật mốc khoảng cách liên tục
      }
    };

    /* ===== 6. HIỆU ỨNG VẦNG SÁNG (AURA) ===== */
    function drawDynamicAura(time) {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const colors = ["rgba(0, 150, 255, 0.2)", "rgba(180, 0, 255, 0.2)", "rgba(255, 100, 0, 0.2)"];
      colors.forEach((color, i) => {
        const angle = time * (0.4 + i * 0.1) + i * 2;
        const lx = cx + Math.cos(angle) * (w * 0.2);
        const ly = cy + Math.sin(angle) * (h * 0.2);
        const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, w * 0.7);
        g.addColorStop(0, color);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      });
      ctx.restore();
    }

    /* ===== 7. VÒNG LẶP RENDER ===== */
    let time = 0;
    const draw = () => {
      time += 0.004;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);

      drawDynamicAura(time);

      const renderList = [];

      // Gom tất cả vào Render List để sắp xếp Z-index
      stars.forEach(s => {
        const pos = rotate3D(s.x, s.y, s.z);
        renderList.push({ type: 'star', ...pos, size: s.size });
      });

      renderList.push({ type: 'planet', ...rotate3D(0, 0, 0) });

      for (let i = 0; i < text.length; i++) {
        const charA = time * 1.5 + (i * (Math.PI * 2 / text.length) * 0.5);
        const pos = rotate3D(Math.cos(charA) * ORBIT_RADIUS, Math.sin(charA) * ORBIT_TILT * 0.2, Math.sin(charA) * ORBIT_RADIUS);
        renderList.push({ type: 'text', char: text[i], ...pos });
      }

      particles.forEach(p => {
        const curA = p.angle + time + (time * p.speed * 80);
        let px = p.radius * Math.cos(curA), pz = p.radius * Math.sin(curA), py = p.yOffset;
        let y1 = py * Math.cos(PARTICLE_TILT_X) - pz * Math.sin(PARTICLE_TILT_X);
        let z1 = py * Math.sin(PARTICLE_TILT_X) + pz * Math.cos(PARTICLE_TILT_X);
        let x2 = px * Math.cos(PARTICLE_TILT_Z) - y1 * Math.sin(PARTICLE_TILT_Z);
        let y2 = px * Math.sin(PARTICLE_TILT_Z) + y1 * Math.cos(PARTICLE_TILT_Z);
        renderList.push({ type: 'particle', original: p, ...rotate3D(x2, y2, z1) });
      });

      renderList.sort((a, b) => b.z - a.z);

      renderList.forEach(item => {
        const p = project(item);
        if (p.s <= 0) return;

        if (item.type === 'star') {
          ctx.fillStyle = "#fff";
          ctx.globalAlpha = Math.min(1, Math.max(0.1, (item.z + 3000) / 5000));
          ctx.beginPath(); ctx.arc(p.x, p.y, item.size * p.s, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 1;
        } 
        else if (item.type === 'planet') {
          const pr = PLANET_RADIUS * p.s;
          const g = ctx.createRadialGradient(p.x, p.y, pr * 0.1, p.x, p.y, pr * 1.8);
          g.addColorStop(0, "#fffbe6"); g.addColorStop(0.5, "#ff6600"); g.addColorStop(1, "transparent");
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(p.x, p.y, pr * 1.8, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#fff";
          ctx.beginPath(); ctx.arc(p.x, p.y, pr * 0.7, 0, Math.PI * 2); ctx.fill();
        } 
        else if (item.type === 'particle') {
          if (p.s > IMAGE_SHOW_SCALE) {
            const img = images[item.original.imgIndex];
            if (img && img.complete) {
              const isize = item.original.size * p.s * 8;
              ctx.drawImage(img, p.x - isize / 2, p.y - isize / 2, isize, isize);
            }
          } else {
            const sq = item.original.size * p.s;
            ctx.fillStyle = BLUE_COLOR;
            ctx.globalAlpha = Math.min(1, (item.z + 2000) / 3000);
            ctx.fillRect(p.x - sq / 2, p.y - sq / 2, sq, sq);
            ctx.globalAlpha = 1;
          }
        } 
        else if (item.type === 'text') {
          ctx.fillStyle = "#fff";
          ctx.font = `bold ${26 * p.s}px Arial`;
          ctx.shadowBlur = 12 * p.s; ctx.shadowColor = "#ffcc00";
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(item.char, p.x, p.y);
          ctx.shadowBlur = 0;
        }
      });

      requestId = requestAnimationFrame(draw);
    };

    // Đăng ký sự kiện
    window.addEventListener("resize", resize);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("mousedown", (e) => onPointerDown(e.clientX, e.clientY));
    window.addEventListener("mousemove", (e) => onPointerMove(e.clientX, e.clientY));
    window.addEventListener("mouseup", onPointerUp);
    
    // Đăng ký Touch trực tiếp vào canvas với passive: false để e.preventDefault() hoạt động
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", onPointerUp);

    resize();
    draw();

    return () => {
      cancelAnimationFrame(requestId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("wheel", onWheel);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", onPointerUp);
    };
  }, [text]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100vh', background: '#000', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'block', touchAction: 'none' }} />
    </div>
  );
};

export default GalaxyAnimation;