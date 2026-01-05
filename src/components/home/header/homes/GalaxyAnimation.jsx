import React, { useEffect, useRef } from 'react';

const GalaxyAnimation = ({
  imageUrls = [],
  text = "DINH LUONG TA"
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    let w, h, cx, cy;
    let requestId;

    // --- CONFIG ---
    let zoom = 0.4;
    const PERSPECTIVE = 900;
    let rotX = 0;
    let rotY = 0;

    // --- LOAD IMAGES ---
    const images = imageUrls.map(url => {
      const img = new Image();
      img.src = url;
      return img;
    });

    // --- HELPER FUNCTIONS ---
    const rand = (a, b) => Math.random() * (b - a) + a;

    function resize() {
      if (!canvas || !container) return;
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

    // --- INIT PARTICLES ---
    const stars = Array.from({ length: 800 }, () => ({
      x: rand(-w * 3, w * 3),
      y: rand(-h * 3, h * 3),
      z: rand(-3000, 3000),
      r: Math.random() * 1.5,
      a: Math.random() * Math.PI * 2
    }));

    const particles = [];
    for (let i = 0; i < 1500; i++) {
      const minR = 350;
      const maxR = 550;
      const radius = rand(minR, maxR);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(rand(-1, 1));

      particles.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.cos(phi),
        z: radius * Math.sin(phi) * Math.sin(theta),
        size: rand(3, 6),
        imgIndex: Math.floor(Math.random() * images.length)
      });
    }

    // --- EVENTS ---
    let dragging = false;
    let px = 0;
    let py = 0;

    // Xử lý Zoom bằng chuột (Lăn chuột)
    const onWheel = (e) => {
      // [QUAN TRỌNG] Ngăn chặn cuộn trang khi lăn chuột trên canvas
      e.preventDefault(); 
      zoom += e.deltaY * -0.0005;
      zoom = Math.max(0.1, Math.min(6, zoom));
    };

    const onMouseDown = (e) => {
      dragging = true;
      px = e.clientX;
      py = e.clientY;
    };

    const onMouseUp = () => dragging = false;

    const onMouseMove = (e) => {
      if (!dragging) return;
      rotY += (e.clientX - px) * 0.003;
      rotX += (e.clientY - py) * 0.003;
      px = e.clientX;
      py = e.clientY;
    };

    // --- TOUCH EVENTS (MOBILE) ---
    let lastTouchX = 0;
    let lastTouchY = 0;
    let initialPinchDistance = null;

    function getDistance(touches) {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    const onTouchStart = (e) => {
        // Ngăn hành vi mặc định (nếu cần thiết để tránh lỗi click ảo)
        if(e.cancelable) e.preventDefault(); 

        if (e.touches.length === 1) {
            dragging = true;
            lastTouchX = e.touches[0].clientX;
            lastTouchY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
            dragging = false;
            initialPinchDistance = getDistance(e.touches);
        }
    };

    const onTouchMove = (e) => {
        // [QUAN TRỌNG] Luôn ngăn chặn hành vi cuộn trang của trình duyệt
        if(e.cancelable) e.preventDefault();

        // Xử lý Zoom (2 ngón tay)
        if (e.touches.length === 2) {
            const currentDistance = getDistance(e.touches);
            if (initialPinchDistance) {
                const diff = currentDistance - initialPinchDistance;
                zoom += diff * 0.005; 
                zoom = Math.max(0.1, Math.min(6, zoom));
                initialPinchDistance = currentDistance;
            }
            return;
        }

        // Xử lý Xoay (1 ngón tay)
        if (e.touches.length === 1 && dragging) {
            const x = e.touches[0].clientX;
            const y = e.touches[0].clientY;
            
            // Tính toán độ lệch để xoay
            const dx = x - lastTouchX;
            const dy = y - lastTouchY;
            
            rotY += dx * 0.005; 
            rotX += dy * 0.005;
            
            lastTouchX = x;
            lastTouchY = y;
        }
    };

    const onTouchEnd = () => {
      dragging = false;
      initialPinchDistance = null;
    };

    // --- ATTACH LISTENERS ---
    window.addEventListener("resize", resize);

    // Lưu ý: { passive: false } là bắt buộc để dùng e.preventDefault()
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);

    // Initial resize
    resize();

    // --- ANIMATION LOOP ---
    const LETTER_SPACE = 0.35;
    const PLANET_RADIUS = 90;
    let time = 0;

    function draw() {
      time += 0.003;
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, w, h);

      /* Background */
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h));
      bg.addColorStop(0, "#050010");
      bg.addColorStop(1, "#000");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      /* Stars */
      ctx.fillStyle = "#fff";
      stars.forEach(s => {
        s.a += 0.02;
        const p = project(rotate3D(s.x, s.y, s.z));
        ctx.globalAlpha = 0.3 + Math.sin(s.a) * 0.3;
        ctx.fillRect(p.x, p.y, s.r * p.s, s.r * p.s);
      });
      ctx.globalAlpha = 1;

      /* Galaxy Particles */
      particles.forEach(p => {
        const r = rotate3D(
          p.x * Math.cos(time) - p.z * Math.sin(time),
          p.y,
          p.x * Math.sin(time) + p.z * Math.cos(time)
        );
        const pr = project(r);

        if (pr.s <= 0) return;

        const displaySize = p.size * pr.s;
        const imgThreshold = 2.5;
        let squareAlpha = 1;

        if (pr.s > imgThreshold) {
          squareAlpha = Math.max(0, 1 - (pr.s - imgThreshold));
        }

        if (squareAlpha > 0) {
          ctx.save();
          ctx.globalAlpha = squareAlpha;
          const grad = ctx.createLinearGradient(
            pr.x - displaySize / 2, pr.y - displaySize / 2,
            pr.x + displaySize / 2, pr.y + displaySize / 2
          );
          grad.addColorStop(0, "#00ffff");
          grad.addColorStop(0.5, "#bd00ff");
          grad.addColorStop(1, "#ff0066");
          ctx.fillStyle = grad;
          ctx.fillRect(
            pr.x - displaySize / 2, pr.y - displaySize / 2,
            displaySize, displaySize
          );
          ctx.restore();
        }

        /* Vẽ Ảnh */
        if (pr.s > imgThreshold && images.length > 0) {
          const currentImg = images[p.imgIndex];
          if (currentImg && currentImg.complete) {
            const imgSize = displaySize * 3;
            let imgAlpha = (pr.s - imgThreshold);
            imgAlpha = Math.max(0, Math.min(1, imgAlpha));

            if (imgAlpha > 0.01) {
              ctx.save();
              ctx.globalAlpha = imgAlpha;
              ctx.drawImage(
                currentImg,
                pr.x - imgSize / 2,
                pr.y - imgSize / 2,
                imgSize, imgSize
              );
              ctx.restore();
            }
          }
        }
      });

      /* ===== PLANET ===== */
      const planet3D = rotate3D(0, 0, 0);
      const planet = project(planet3D);
      const planetScreenRadius = PLANET_RADIUS * planet.s;

      const g = ctx.createRadialGradient(
        planet.x - 30 * planet.s,
        planet.y - 30 * planet.s,
        20 * planet.s,
        planet.x,
        planet.y,
        planetScreenRadius
      );
      g.addColorStop(0, "#ffd1ff");
      g.addColorStop(0.5, "#ff8ad4");
      g.addColorStop(1, "#C77DFF");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(planet.x, planet.y, planetScreenRadius, 0, Math.PI * 2);
      ctx.fill();

      /* ===== TEXT ORBIT ===== */
      ctx.fillStyle = "#fff";
      ctx.font = `bold ${30 * planet.s}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let i = 0; i < text.length; i++) {
        const a = time * 2 + i * LETTER_SPACE;
        const letter3D = rotate3D(
          Math.cos(a) * 220,
          Math.sin(a) * 80,
          0
        );
        const letter = project(letter3D);

        const dx = letter.x - planet.x;
        const dy = letter.y - planet.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const behindPlanet = dist < planetScreenRadius && letter.z > planet.z;

        if (behindPlanet) continue;
        ctx.fillText(text[i], letter.x, letter.y);
      }

      requestId = requestAnimationFrame(draw);
    }

    requestId = requestAnimationFrame(draw);

    // --- CLEANUP ---
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);

      if (canvas) {
        canvas.removeEventListener("wheel", onWheel);
        canvas.removeEventListener("mousedown", onMouseDown);
        canvas.removeEventListener("touchstart", onTouchStart);
        canvas.removeEventListener("touchmove", onTouchMove);
        canvas.removeEventListener("touchend", onTouchEnd);
      }
      cancelAnimationFrame(requestId);
    };
  }, [imageUrls, text]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{ 
            display: 'block', 
            width: '100%', 
            height: '100%', 
            touchAction: 'none' 
        }}
      />
    </div>
  );
};

export default GalaxyAnimation;