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
    const PERSPECTIVE = 1500;
    let rotX = 2.0;
    let rotY = 0;

    const PLANET_RADIUS = 120;
    const IMAGE_SHOW_SCALE = 0.85;

    // Cấu hình quỹ đạo chữ (Giữ nguyên hoặc chỉnh nhẹ nếu muốn)
    const ORBIT_RADIUS = 240; 
    const ORBIT_TILT = -80;   

    // === CẤU HÌNH ĐĨA HẠT (MỚI) ===
    // Góc nghiêng của đĩa hạt để KHÔNG trùng với chữ
    // Chữ đang nghiêng theo trục X. Ta nghiêng hạt theo trục X khác đi và thêm trục Z để tạo độ "chéo".
    const PARTICLE_TILT_X = Math.PI / 2.5; // Nghiêng khoảng 70 độ về phía trước
    const PARTICLE_TILT_Z = Math.PI / 6;   // Nghiêng 30 độ sang bên (tạo hiệu ứng chéo góc)

    /* ===== LOAD IMAGES ===== */
    const images = importedImages.map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });

    const rand = (a, b) => Math.random() * (b - a) + a;

    /* ===== RESIZE ===== */
    function resize() {
      w = canvas.width = container.clientWidth;
      h = canvas.height = container.clientHeight;
      cx = w / 2;
      cy = h / 2;
    }

    /* ===== 3D HELPERS ===== */
    function rotate3D(x, y, z) {
      // Xoay theo thao tác chuột (Camera)
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

    /* ===== STARS (Background) ===== */
    const stars = Array.from({ length: 800 }, () => ({
      x: rand(-w * 3, w * 3),
      y: rand(-h * 3, h * 3),
      z: rand(-3000, 3000),
      r: Math.random() * 1.5,
      a: Math.random() * Math.PI * 2
    }));

    /* ===== PARTICLES (SỬA LẠI LOGIC TẠO HẠT) ===== */
    const particles = [];
    const particleCount = 1500;
    
    for (let i = 0; i < particleCount; i++) {
      // Thay vì tọa độ cầu, ta dùng tọa độ đĩa
      const rBase = rand(220, 650); // Bán kính từ gần hành tinh ra xa
      const angle = Math.random() * Math.PI * 2;
      
      particles.push({
        radius: rBase,
        angle: angle, // Góc ban đầu
        speed: rand(0.001, 0.003), // Tốc độ bay của từng hạt
        yOffset: rand(-15, 15), // Độ dày của đĩa (mỏng thôi mới ra đĩa)
        size: rand(2, 5),
        imgIndex: Math.floor(Math.random() * images.length)
      });
    }

    /* ===== EVENTS ===== */
    let dragging = false;
    let lastX = 0, lastY = 0;
    let initialPinchDistance = null;

    const onWheel = (e) => { e.preventDefault(); zoom += e.deltaY * -0.0005; zoom = Math.max(0.2, Math.min(6, zoom)); };
    const onMouseDown = (e) => { dragging = true; lastX = e.clientX; lastY = e.clientY; };
    const onMouseMove = (e) => { if (!dragging) return; rotY += (e.clientX - lastX) * 0.003; rotX += (e.clientY - lastY) * 0.003; lastX = e.clientX; lastY = e.clientY; };
    const onMouseUp = () => { dragging = false; };

    /* Touch Events */
    const getDistance = (touches) => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx*dx + dy*dy);
    }
    const onTouchStart = (e) => {
      if(e.touches.length === 1) {
        dragging = true;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        dragging = false;
        initialPinchDistance = getDistance(e.touches);
      }
    };
    const onTouchMove = (e) => {
      e.preventDefault();
      if(e.touches.length === 1 && dragging) {
        const touch = e.touches[0];
        rotY += (touch.clientX - lastX) * 0.003;
        rotX += (touch.clientY - lastY) * 0.003;
        lastX = touch.clientX;
        lastY = touch.clientY;
      } else if (e.touches.length === 2) {
        const newDistance = getDistance(e.touches);
        if(initialPinchDistance) {
          zoom *= newDistance / initialPinchDistance;
          zoom = Math.max(0.2, Math.min(6, zoom));
          initialPinchDistance = newDistance;
        }
      }
    };
    const onTouchEnd = (e) => { dragging = false; if(e.touches.length < 2) initialPinchDistance = null; };

    window.addEventListener("resize", resize);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);

    resize();

    /* ===== DRAW LOOP ===== */
    let time = 0;
    const draw = () => {
      time += 0.003;
      ctx.clearRect(0, 0, w, h);

      // 1. Background
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w,h));
      bg.addColorStop(0, "#050010");
      bg.addColorStop(1, "#000");
      ctx.fillStyle = bg;
      ctx.fillRect(0,0,w,h);

      // 2. Stars
      ctx.fillStyle = "#fff";
      stars.forEach(s => {
        const p = project(rotate3D(s.x, s.y, s.z));
        ctx.globalAlpha = 0.3 + Math.sin(s.a + time*5)*0.3;
        ctx.fillRect(p.x, p.y, s.r*p.s, s.r*p.s);
      });
      ctx.globalAlpha = 1;

      // 3. Render Queue
      const renderList = [];

      // A. Planet
      const planetRot = rotate3D(0, 0, 0);
      renderList.push({
        type: 'planet',
        z: planetRot.z,
        x: planetRot.x,
        y: planetRot.y
      });

      // B. Particles (SỬA LẠI LOGIC CHUYỂN ĐỘNG)
      particles.forEach(p => {
        // Tính góc hiện tại theo thời gian (quỹ đạo tròn)
        const currentA = p.angle + time + (time * p.speed * 100); 

        // 1. Tạo hình đĩa phẳng trên mặt phẳng X-Z
        let px = p.radius * Math.cos(currentA);
        let pz = p.radius * Math.sin(currentA);
        let py = p.yOffset; // Độ dày ngẫu nhiên

        // 2. Nghiêng đĩa (Rotation Matrix)
        // Nghiêng quanh trục X (để đĩa ngả xuống)
        let y1 = py * Math.cos(PARTICLE_TILT_X) - pz * Math.sin(PARTICLE_TILT_X);
        let z1 = py * Math.sin(PARTICLE_TILT_X) + pz * Math.cos(PARTICLE_TILT_X);
        
        // Nghiêng thêm quanh trục Z (để tạo độ chéo, khác với chữ)
        let x2 = px * Math.cos(PARTICLE_TILT_Z) - y1 * Math.sin(PARTICLE_TILT_Z);
        let y2 = px * Math.sin(PARTICLE_TILT_Z) + y1 * Math.cos(PARTICLE_TILT_Z);
        let z2 = z1;

        // 3. Xoay theo camera (Mouse/Touch)
        const r = rotate3D(x2, y2, z2);
        
        renderList.push({
          type: 'particle',
          z: r.z,
          x: r.x,
          y: r.y,
          original: p
        });
      });

      // C. Text
      for(let i = 0; i < text.length; i++){
        const a = time * 2 + i * 0.35;
        const tx = Math.cos(a) * ORBIT_RADIUS;
        const tz = Math.sin(a) * ORBIT_RADIUS;
        const ty = Math.sin(a) * ORBIT_TILT; // Chữ nghiêng theo kiểu ép dẹp trục Y

        const r = rotate3D(tx, ty, tz);

        renderList.push({
          type: 'text',
          z: r.z,
          x: r.x,
          y: r.y,
          char: text[i]
        });
      }

      // 4. Sort & Draw
      renderList.sort((a, b) => b.z - a.z);

      renderList.forEach(item => {
        const p = project(item);
        if(p.s <= 0) return;

        if (item.type === 'planet') {
          const planetR = PLANET_RADIUS * p.s;
          const g = ctx.createRadialGradient(
            p.x - 40 * p.s, p.y - 40 * p.s, 20 * p.s,
            p.x, p.y, planetR
          );
          g.addColorStop(0, "#ffd1ff");
          g.addColorStop(0.5, "#ff8ad4");
          g.addColorStop(1, "#C77DFF");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, planetR, 0, Math.PI * 2);
          ctx.fill();
        } 
        else if (item.type === 'particle') {
          const displaySize = item.original.size * p.s;
          // Gradient cho hạt
          const grad = ctx.createLinearGradient(
            p.x - displaySize/2, p.y - displaySize/2,
            p.x + displaySize/2, p.y + displaySize/2
          );
          grad.addColorStop(0, "#00ffff");
          grad.addColorStop(1, "#bd00ff");
          
          ctx.fillStyle = grad;
          ctx.fillRect(p.x - displaySize/2, p.y - displaySize/2, displaySize, displaySize);

          if(p.s > IMAGE_SHOW_SCALE) {
            const img = images[item.original.imgIndex];
            if(img && img.complete) {
              const imgSize = displaySize * 3.2;
              ctx.drawImage(img, p.x - imgSize/2, p.y - imgSize/2, imgSize, imgSize);
            }
          }
        } 
        else if (item.type === 'text') {
          ctx.fillStyle = "#fff";
          ctx.font = `bold ${30 * p.s}px Arial`; 
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(item.char, p.x, p.y);
        }
      });

      requestId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(requestId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };

  }, [text]);

  return (
    <div ref={containerRef} style={{ width:'100%', height:'100%' }}>
      <canvas ref={canvasRef} style={{ width:'100%', height:'100%', display:'block', touchAction: 'none' }} />
    </div>
  );
};

export default GalaxyAnimation;