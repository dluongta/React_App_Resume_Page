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

    /* ===== CONFIG ===== */
    let zoom = 0.45;
    const PERSPECTIVE = 1500; // zoom xa hơn
    let rotX = 0;
    let rotY = 0;

    const PLANET_RADIUS = 120;
    const IMAGE_SHOW_SCALE = 0.85;

    /* ===== LOAD IMAGES ===== */
    const images = importedImages.map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });

    const rand = (a, b) => Math.random() * (b - a) + a;

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

    /* ===== STARS ===== */
    const stars = Array.from({ length: 800 }, () => ({
      x: rand(-w * 3, w * 3),
      y: rand(-h * 3, h * 3),
      z: rand(-3000, 3000),
      r: Math.random() * 1.5,
      a: Math.random() * Math.PI * 2
    }));

    /* ===== PARTICLES ===== */
    const particles = [];
    for (let i = 0; i < 1500; i++) {
      const radius = rand(200, 520);
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

    /* ===== EVENTS ===== */
    let dragging = false;
    let px = 0, py = 0;

    const onWheel = e => {
      e.preventDefault();
      zoom += e.deltaY * -0.0005;
      zoom = Math.max(0.2, Math.min(6, zoom));
    };

    const onMouseDown = e => {
      dragging = true;
      px = e.clientX;
      py = e.clientY;
    };

    const onMouseMove = e => {
      if (!dragging) return;
      rotY += (e.clientX - px) * 0.003;
      rotX += (e.clientY - py) * 0.003;
      px = e.clientX;
      py = e.clientY;
    };

    const onMouseUp = () => dragging = false;

    window.addEventListener("resize", resize);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    resize();

    /* ===== DRAW LOOP ===== */
    let time = 0;
    function draw() {
      time += 0.003;
      ctx.clearRect(0, 0, w, h);

      /* ===== BACKGROUND ===== */
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h));
      bg.addColorStop(0, "#050010");
      bg.addColorStop(1, "#000");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      /* ===== STARS ===== */
      ctx.fillStyle = "#fff";
      stars.forEach(s => {
        s.a += 0.02;
        const p = project(rotate3D(s.x, s.y, s.z));
        ctx.globalAlpha = 0.3 + Math.sin(s.a) * 0.3;
        ctx.fillRect(p.x, p.y, s.r * p.s, s.r * p.s);
      });
      ctx.globalAlpha = 1;

      /* ===== SORT PARTICLES THEO Z (XA TRƯỚC) ===== */
      const sortedParticles = particles.slice().sort((a, b) => {
        const ra = rotate3D(
          a.x * Math.cos(time) - a.z * Math.sin(time),
          a.y,
          a.x * Math.sin(time) + a.z * Math.cos(time)
        );
        const rb = rotate3D(
          b.x * Math.cos(time) - b.z * Math.sin(time),
          b.y,
          b.x * Math.sin(time) + b.z * Math.cos(time)
        );
        return ra.z - rb.z; // xa hơn trước
      });

      /* ===== VẼ PARTICLES + IMAGES ===== */
      sortedParticles.forEach(p => {
        const r = rotate3D(
          p.x * Math.cos(time) - p.z * Math.sin(time),
          p.y,
          p.x * Math.sin(time) + p.z * Math.cos(time)
        );

        const pr = project(r);
        if (pr.s <= 0) return;

        const displaySize = p.size * pr.s;

        // Particle square
        const grad = ctx.createLinearGradient(
          pr.x - displaySize / 2,
          pr.y - displaySize / 2,
          pr.x + displaySize / 2,
          pr.y + displaySize / 2
        );
        grad.addColorStop(0, "#00ffff");
        grad.addColorStop(0.5, "#bd00ff");
        grad.addColorStop(1, "#ff0066");
        ctx.fillStyle = grad;
        ctx.fillRect(
          pr.x - displaySize / 2,
          pr.y - displaySize / 2,
          displaySize,
          displaySize
        );

        // Image
        if (pr.s > IMAGE_SHOW_SCALE) {
          const img = images[p.imgIndex];
          if (img && img.complete) {
            const imgSize = displaySize * 3.2;
            ctx.drawImage(
              img,
              pr.x - imgSize / 2,
              pr.y - imgSize / 2,
              imgSize,
              imgSize
            );
          }
        }
      });

      /* ===== PLANET (VẼ CUỐI CÙNG, LUÔN TRÊN CÁC PARTICLE) ===== */
      const planet = project(rotate3D(0, 0, 0));
      const planetR = PLANET_RADIUS * planet.s;

      const g = ctx.createRadialGradient(
        planet.x - 40 * planet.s,
        planet.y - 40 * planet.s,
        20 * planet.s,
        planet.x,
        planet.y,
        planetR
      );
      g.addColorStop(0, "#ffd1ff");
      g.addColorStop(0.5, "#ff8ad4");
      g.addColorStop(1, "#C77DFF");

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(planet.x, planet.y, planetR, 0, Math.PI * 2);
      ctx.fill();

      /* ===== TEXT ORBIT ===== */
      ctx.fillStyle = "#fff";
      ctx.font = `bold ${30 * planet.s}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let i = 0; i < text.length; i++) {
        const a = time * 2 + i * 0.35;
        const lp = project(
          rotate3D(Math.cos(a) * 220, Math.sin(a) * 80, 0)
        );
        ctx.fillText(text[i], lp.x, lp.y);
      }

      requestId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(requestId);
      window.removeEventListener("resize", resize);
    };
  }, [text]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
};

export default GalaxyAnimation;
