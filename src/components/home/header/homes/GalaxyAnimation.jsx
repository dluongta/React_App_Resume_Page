import React, { useEffect, useRef } from 'react';

const GalaxyAnimation = ({ text = "DINH LUONG TA", imageUrls = [] }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  // Sử dụng Refs để lưu trữ trạng thái mà không gây re-render
  const state = useRef({
    zoom: window.innerWidth < 768 ? 0.25 : 0.4,
    rotX: 1.8,
    rotY: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
    initialPinchDist: null,
    initialZoom: 0.4,
    // Trạng thái sao băng
    shootingStar: {
      active: false,
      x: 0,
      y: 0,
      len: 0,
      speed: 0,
      opacity: 0
    }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    let w, h, cx, cy;
    let requestId;

    const PERSPECTIVE = 1200;
    const PLANET_RADIUS = 110;
    const ORBIT_RADIUS = 280;
    const ORBIT_TILT = -80;
    const IMAGE_SHOW_SCALE = 0.8;
    const BLUE_COLOR = "#00ccff";

    // Khởi tạo hình ảnh
    const images = imageUrls.map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });

    const rand = (a, b) => Math.random() * (b - a) + a;

    // Khởi tạo dữ liệu tĩnh (Stars, Particles)
    const stars = Array.from({ length: 800 }, () => ({
      x: rand(-3000, 3000), y: rand(-3000, 3000), z: rand(-3000, 3000),
      size: rand(2.0, 4.5),
    }));

    const particles = Array.from({ length: 1500 }, () => ({
      radius: rand(300, 600),
      angle: Math.random() * Math.PI * 2,
      speed: rand(0.0005, 0.002),
      yOffset: rand(-50, 50),
      size: rand(4, 7),
      imgIndex: Math.floor(Math.random() * images.length)
    }));

    const resize = () => {
      w = canvas.width = container.offsetWidth;
      h = canvas.height = container.offsetHeight;
      cx = w / 2;
      cy = h / 2;
    };

    const rotate3D = (x, y, z) => {
      const { rotX, rotY } = state.current;
      let y1 = y * Math.cos(rotX) - z * Math.sin(rotX);
      let z1 = y * Math.sin(rotX) + z * Math.cos(rotX);
      let x2 = x * Math.cos(rotY) + z1 * Math.sin(rotY);
      let z2 = -x * Math.sin(rotY) + z1 * Math.cos(rotY);
      return { x: x2, y: y1, z: z2 };
    };

    const project = (p) => {
      const s = (PERSPECTIVE / (PERSPECTIVE + p.z)) * state.current.zoom;
      return { x: cx + p.x * s, y: cy + p.y * s, s, z: p.z };
    };

    // --- LOGIC SAO BĂNG CHẠY NGANG ---
    const updateShootingStar = () => {
      const ss = state.current.shootingStar;
      if (!ss.active) {
        if (Math.random() < 0.006) { // Tần suất xuất hiện
          ss.active = true;
          ss.x = -400; 
          ss.y = rand(50, h * 0.8);
          ss.len = rand(200, 400);
          ss.speed = rand(15, 30);
          ss.opacity = 1;
        }
      } else {
        ss.x += ss.speed;
        ss.opacity -= 0.007;
        if (ss.x > w + 400 || ss.opacity <= 0) {
          ss.active = false;
        }
      }
    };

    const drawShootingStar = () => {
      const ss = state.current.shootingStar;
      if (!ss.active) return;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.len, ss.y);
      grad.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`);
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(ss.x - ss.len, ss.y);
      ctx.stroke();
      ctx.restore();
    };

    // --- XỬ LÝ SỰ KIỆN TƯƠNG TÁC ---
    const onWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.95 : 1.05;
      state.current.zoom = Math.max(0.05, Math.min(3, state.current.zoom * delta));
    };

    const getTouchDist = (touches) => {
      return Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        state.current.dragging = true;
        state.current.lastX = e.touches[0].clientX;
        state.current.lastY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        state.current.dragging = false;
        state.current.initialPinchDist = getTouchDist(e.touches);
        state.current.initialZoom = state.current.zoom;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 1 && state.current.dragging) {
        const touch = e.touches[0];
        state.current.rotY += (touch.clientX - state.current.lastX) * 0.005;
        state.current.rotX += (touch.clientY - state.current.lastY) * 0.005;
        state.current.lastX = touch.clientX;
        state.current.lastY = touch.clientY;
      } else if (e.touches.length === 2 && state.current.initialPinchDist) {
        e.preventDefault();
        const currentDist = getTouchDist(e.touches);
        const ratio = currentDist / state.current.initialPinchDist;
        state.current.zoom = Math.max(0.05, Math.min(3, state.current.initialZoom * ratio));
      }
    };

    const handleTouchEnd = () => {
      state.current.dragging = false;
      state.current.initialPinchDist = null;
    };

    // --- RENDER LOGIC ---
    function drawDynamicAura(time) {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const colors = ["rgba(0, 150, 255, 0.3)", "rgba(180, 0, 255, 0.3)", "rgba(255, 100, 0, 0.2)"];
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

    let time = 0;
    const draw = () => {
      time += 0.004;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);

      drawDynamicAura(time);
      
      // Vẽ sao băng ở lớp phía sau
      updateShootingStar();
      drawShootingStar();

      const renderList = [];
      stars.forEach(s => renderList.push({ type: 'star', ...rotate3D(s.x, s.y, s.z), size: s.size }));
      renderList.push({ type: 'planet', ...rotate3D(0, 0, 0) });

      for (let i = 0; i < text.length; i++) {
        const charA = time * 1.5 + (i * (Math.PI * 2 / text.length) * 0.5);
        renderList.push({ type: 'text', char: text[i], ...rotate3D(Math.cos(charA) * ORBIT_RADIUS, Math.sin(charA) * ORBIT_TILT * 0.2, Math.sin(charA) * ORBIT_RADIUS) });
      }

      particles.forEach(p => {
        const curA = p.angle + time + (time * p.speed * 80);
        let px = p.radius * Math.cos(curA), pz = p.radius * Math.sin(curA), py = p.yOffset;
        const PARTICLE_TILT_X = Math.PI / 2.3;
        const PARTICLE_TILT_Z = Math.PI / 6;
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
        } else if (item.type === 'planet') {
          const pr = PLANET_RADIUS * p.s;
          const g = ctx.createRadialGradient(p.x, p.y, pr * 0.1, p.x, p.y, pr * 2);
          g.addColorStop(0, "#fffbe6"); g.addColorStop(0.5, "#ff6600"); g.addColorStop(1, "transparent");
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(p.x, p.y, pr * 2, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#fff";
          ctx.beginPath(); ctx.arc(p.x, p.y, pr * 0.7, 0, Math.PI * 2); ctx.fill();
        } else if (item.type === 'particle') {
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
        } else if (item.type === 'text') {
          ctx.fillStyle = "#fff";
          ctx.font = `bold ${24 * p.s}px Arial`;
          ctx.shadowBlur = 15 * p.s; ctx.shadowColor = "#ffcc00";
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
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd);

    const onMouseDown = (e) => {
        state.current.dragging = true;
        state.current.lastX = e.clientX;
        state.current.lastY = e.clientY;
    };
    const onMouseMove = (e) => {
        if (!state.current.dragging) return;
        state.current.rotY += (e.clientX - state.current.lastX) * 0.003;
        state.current.rotX += (e.clientY - state.current.lastY) * 0.003;
        state.current.lastX = e.clientX;
        state.current.lastY = e.clientY;
    };
    const onMouseUp = () => state.current.dragging = false;

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    resize();
    draw();

    return () => {
      cancelAnimationFrame(requestId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [text, imageUrls]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#000' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%', touchAction: 'none' }} />
    </div>
  );
};

export default GalaxyAnimation;