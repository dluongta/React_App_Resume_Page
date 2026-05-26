import { useEffect, useRef, useState } from "react";
import styles from "./ParticleTextCanvas.module.css";

export default function ParticleTextCanvas() {
  const canvasRef = useRef(null);
  const rainCanvasRef = useRef(null);
  const particlesRef = useRef([]);
  const particlePoolRef = useRef([]);
  const rainDropsRef = useRef([]);
  const rafRef = useRef(null);
  const timeoutRef = useRef(null);
  const resizeTimeoutRef = useRef(null);
  const lastRainDrawTimeRef = useRef(0);

  const sequenceRef = useRef([]);
  const seqIndexRef = useRef(0);
  const useAccentRef = useRef(false);

  const [accentLabel, setAccentLabel] = useState("BẬT");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });

    const rainCanvas = rainCanvasRef.current;
    const rainCtx = rainCanvas.getContext("2d", { alpha: true });

    // --- CẤU HÌNH PARTICLE TEXT ---
    const formDuration = 1400; // Thời gian hạt di chuyển để ghép thành chữ mới
    const holdDuration = 1200; // Thời gian giữ chữ tĩnh để đọc

    const textsUnaccented = ['3','2','1','CHUC', 'MUNG', 'SINH' ,'NHAT','09/01/2003','DINH LUONG TA'];
    const textsAccented = ['3','2','1','CHÚC', 'MỪNG', 'SINH', 'NHẬT','09/01/2003','ĐÌNH LƯƠNG TẠ'];

    // --- CẤU HÌNH CODE RAIN ---
    const rainFontSize = 18;
    const rainString = "DINHLUONGTA ";
    const rainColors = ['#9370db', '#00bfff', '#ff69b4', '#ffa500'];
    const rainUpdateInterval = 60; 

    let DPR = window.devicePixelRatio || 1;

    const off = document.createElement("canvas");
    const offCtx = off.getContext("2d");

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const lerp = (a, b, t) => a + (b - a) * t;

    // Giữ kích thước hạt cân đối để vừa thấy màu vừa thấy nét chữ
    const getParticleSize = () => window.innerWidth < 768 ? 1.4 : 2.0;

    class Particle {
      constructor(x = 0, y = 0) {
        this.init(x, y);
      }

      init(x, y) {
        this.x = x;
        this.y = y;
        this.tx = x;
        this.ty = y;
        this.size = getParticleSize();
        this.phase = 2; // 0: Đang di chuyển, 2: Đang đứng yên nhấp nhô
        this.startX = x;
        this.startY = y;
        this.duration = formDuration;
        this.alpha = 1;
        this.startAlpha = 1;
        this.targetAlpha = 1;
        this.color = "#fff";
      }

      to(targetX, targetY, now, dur = formDuration, targetAlpha = 1) {
        this.phase = 0;
        this.startX = this.x; 
        this.startY = this.y;
        this.tx = targetX;
        this.ty = targetY;
        this.startTime = now;
        this.duration = dur;
        
        // Dải màu: Hue từ 200 đến 340 (Chính xác là Xanh dương -> Tím -> Hồng)
        const hue = 200 + Math.random() * 140;
        this.color = `hsla(${hue}, 85%, ${55 + Math.random() * 10}%, 1)`;
        
        this.startAlpha = this.alpha;
        this.targetAlpha = targetAlpha;
      }

      update(now) {
        if (this.phase === 0) {
          const t = Math.min(1, (now - this.startTime) / this.duration);
          const e = easeOutCubic(t);
          this.x = lerp(this.startX, this.tx, e);
          this.y = lerp(this.startY, this.ty, e);
          this.alpha = lerp(this.startAlpha, this.targetAlpha, e);
          if (t >= 1) this.phase = 2;
        } else {
          // Nhấp nhô cực nhẹ
          this.y += Math.sin(now / 800 + this.x * 0.001) * 0.02;
          this.alpha = this.targetAlpha;
        }
      }
    }

    function createOrReuseParticle(x, y) {
      let p;
      if (particlePoolRef.current.length > 0) {
        p = particlePoolRef.current.pop();
        p.init(x, y);
      } else {
        p = new Particle(x, y);
      }
      return p;
    }

    // Luôn lấy mẫu ở độ phân giải siêu cao (để giữ dấu rõ ràng) rồi thu nhỏ lại
    function buildTargetsForText(text) {
      const isMobile = window.innerWidth < 768;
      
      const offW = 1600;
      const offH = 600;
      off.width = offW;
      off.height = offH;
      offCtx.clearRect(0, 0, offW, offH);

      let fontSize = text.length <= 3 ? 300 : 130; 

      offCtx.font = `bold ${fontSize}px "Segoe UI", "Roboto", Arial`;
      let textWidth = offCtx.measureText(text).width;

      if (textWidth > offW - 60) {
        fontSize = Math.floor(fontSize * ((offW - 60) / textWidth));
        offCtx.font = `bold ${fontSize}px "Segoe UI", "Roboto", Arial`;
      }

      offCtx.textBaseline = "middle";
      offCtx.textAlign = "center";
      offCtx.fillStyle = "#fff";
      offCtx.fillText(text, offW / 2, offH / 2);

      const img = offCtx.getImageData(0, 0, offW, offH);
      const data = img.data;
      const targets = [];
      const sampleGap = 4; // Lấy mẫu dày để nét không bị đứt

      const actualCanvasWidth = canvas.width / DPR;
      const actualCanvasHeight = canvas.height / DPR;
      const screenPadding = isMobile ? 20 : 80;
      const maxAllowedWidth = actualCanvasWidth - screenPadding;

      let minX = offW, maxX = 0;
      for (let y = 0; y < offH; y += sampleGap) {
        for (let x = 0; x < offW; x += sampleGap) {
          if (data[(y * offW + x) * 4 + 3] > 120) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
          }
        }
      }
      const drawnWidth = maxX - minX;

      let scale = 1;
      if (drawnWidth > 0 && drawnWidth > maxAllowedWidth) {
        scale = maxAllowedWidth / drawnWidth;
      }
      if (isMobile) scale *= 0.85; 

      for (let y = 0; y < offH; y += sampleGap) {
        for (let x = 0; x < offW; x += sampleGap) {
          const idx = (y * offW + x) * 4;
          const alpha = data[idx + 3];
          if (alpha > 120) {
            const offsetX = (x - offW / 2) * scale;
            const offsetY = (y - offH / 2) * scale;
            
            const tx = (actualCanvasWidth / 2) + offsetX;
            const ty = (actualCanvasHeight / 2) + offsetY;
            targets.push({ x: tx, y: ty });
          }
        }
      }
      return targets;
    }

    function buildSequence() {
      const arr = useAccentRef.current ? textsAccented : textsUnaccented;
      sequenceRef.current = arr.map(t => buildTargetsForText(t));
      seqIndexRef.current = 0;
    }

    function initParticles(count) {
      particlesRef.current = [];
      for (let i = 0; i < count; i++) {
        const px = Math.random() * (canvas.width / DPR);
        const py = Math.random() * (canvas.height / DPR);
        const p = createOrReuseParticle(px, py);
        p.phase = 2;
        particlesRef.current.push(p);
      }
    }

    function assignToTargets(targets, now) {
      const particles = particlesRef.current;
      const isMobile = window.innerWidth < 768;

      if (particles.length < targets.length) {
        const need = targets.length - particles.length;
        for (let i = 0; i < need; i++) {
          const px = Math.random() * (canvas.width / DPR);
          const py = Math.random() * (canvas.height / DPR);
          const p = createOrReuseParticle(px, py);
          p.alpha = 0; 
          particles.push(p);
        }
      }

      const cx = (canvas.width / DPR) / 2;
      const cy = (canvas.height / DPR) / 2;
      
      particles.sort((a, b) => Math.hypot(a.x - cx, a.y - cy) - Math.hypot(b.x - cx, b.y - cy));
      targets.sort((a, b) => Math.hypot(a.x - cx, a.y - cy) - Math.hypot(b.x - cx, b.y - cy));

      // 1. Phân bổ các hạt TẠO HÌNH CHỮ CHÍNH
      for (let i = 0; i < targets.length; i++) {
        const t = targets[i];
        const p = particles[i];
        
        const angle = Math.random() * Math.PI * 2;
        const radius = isMobile ? Math.random() * 0.5 : Math.random() * 1.2; 
        
        p.to(t.x + Math.cos(angle)*radius, t.y + Math.sin(angle)*radius, now, formDuration + Math.random() * 200, 1);
      }

      // 2. Phân bổ các HẠT DƯ THỪA (ĐÃ FIX: Xóa sạch sự lộn xộn)
      // Chỉnh alpha của các hạt thừa về 0 để nét chữ sắc sảo, không bị mờ đục xung quanh
      const surplusTargetAlpha = 0; 

      for (let i = targets.length; i < particles.length; i++) {
        const t = targets[i % targets.length];
        const p = particles[i];
        
        const angle = Math.random() * Math.PI * 2;
        const radius = 2 + Math.random() * 5; 

        p.to(t.x + Math.cos(angle)*radius, t.y + Math.sin(angle)*radius, now, formDuration + Math.random() * 200, surplusTargetAlpha);
      }
    }

    function runNextStage() {
      const sequence = sequenceRef.current;
      if (!sequence.length) return;

      const now = performance.now();
      const targets = sequence[seqIndexRef.current];
      assignToTargets(targets, now);

      clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        seqIndexRef.current++;
        if (seqIndexRef.current >= sequence.length) {
          seqIndexRef.current = 0;
        }
        runNextStage();
      }, formDuration + holdDuration);
    }

    function drawRain(logicalW, logicalH, now) {
      if (now - lastRainDrawTimeRef.current < rainUpdateInterval) return;
      lastRainDrawTimeRef.current = now;

      rainCtx.fillStyle = 'rgba(7, 5, 10, 0.05)';
      rainCtx.fillRect(0, 0, logicalW, logicalH);

      rainCtx.font = `bold ${rainFontSize}px monospace`;
      rainCtx.textAlign = "center";

      const drops = rainDropsRef.current;
      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];

        if (drop.y >= 0) {
          const charIndex = drop.y % rainString.length;
          const text = rainString.charAt(charIndex);

          rainCtx.fillStyle = drop.color;
          rainCtx.shadowColor = drop.color;

          rainCtx.fillText(text, drop.x * rainFontSize, drop.y * rainFontSize);
          rainCtx.shadowBlur = 0;
        }

        if (drop.y * rainFontSize > logicalH) {
          drop.y = Math.floor(Math.random() * -3);
          drop.color = rainColors[Math.floor(Math.random() * rainColors.length)];
        } else {
          drop.y++;
        }
      }
    }

    function render(now) {
      const logicalW = window.innerWidth;
      const logicalH = window.innerHeight;
      const isMobile = logicalW < 768;

      drawRain(logicalW, logicalH, now);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(now);
      }

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      
      // Lượt vẽ 1: Quầng sáng màu (Hồng, Tím, Xanh)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.alpha <= 0.05) continue; 
        
        // Tăng độ đậm màu trên mobile, giảm cường độ sáng quá gắt trên PC
        const auraAlpha = isMobile ? 0.7 : 0.45; 
        ctx.globalAlpha = p.alpha * auraAlpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        // Bán kính quầng màu đủ lớn để bao phủ
        ctx.arc(p.x, p.y, p.size * (isMobile ? 2.2 : 2.6), 0, Math.PI * 2);
        ctx.fill();
      }

      // Lượt vẽ 2: Lõi hạt màu trắng
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.alpha <= 0.05) continue;
        
        // Giảm Alpha lõi trắng xuống một chút trên PC để tránh tình trạng "sáng quá"
        ctx.globalAlpha = p.alpha * (isMobile ? 0.9 : 0.6); 
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        // Thu nhỏ nhẹ kích thước lõi trắng để nhường không gian cho quầng sáng màu hiển thị
        ctx.arc(p.x, p.y, p.size * 0.75, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      rafRef.current = requestAnimationFrame(render);
    }

    const startSequence = () => {
      buildSequence();
      const maxCount = Math.max(...sequenceRef.current.map(a => a.length));

      if (particlesRef.current.length > 0) {
        particlePoolRef.current.push(...particlesRef.current);
        particlesRef.current = [];
      }
      
      initParticles(Math.min(3000, maxCount + 200));
      seqIndexRef.current = 0;
      runNextStage();
    };

    const handleResize = () => {
      DPR = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      rainCanvas.width = Math.floor(w * DPR);
      rainCanvas.height = Math.floor(h * DPR);
      rainCanvas.style.width = w + 'px';
      rainCanvas.style.height = h + 'px';
      rainCtx.setTransform(DPR, 0, 0, DPR, 0, 0);

      const rainColumns = Math.floor(w / rainFontSize) + 1;
      const dropsPerColumn = 2;
      const totalDrops = rainColumns * dropsPerColumn;

      rainDropsRef.current = Array.from({ length: totalDrops }).map((_, index) => {
        const col = index % rainColumns;
        return {
          x: col,
          y: Math.floor(Math.random() * -60), 
          color: rainColors[Math.floor(Math.random() * rainColors.length)]
        };
      });

      particlesRef.current.forEach(p => p.size = getParticleSize());

      clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(() => {
        buildSequence();
        const now = performance.now();
        const targets = sequenceRef.current[seqIndexRef.current];
        if (targets) assignToTargets(targets, now);
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    startSequence();
    rafRef.current = requestAnimationFrame(render);

    canvasRef.current.__startSequence = startSequence;

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timeoutRef.current);
      clearTimeout(resizeTimeoutRef.current);
    };
  }, []);

  const handleRestart = () => {
    clearTimeout(timeoutRef.current);
    if (canvasRef.current && canvasRef.current.__startSequence) {
      canvasRef.current.__startSequence();
    }
  };

  const handleToggleAccent = () => {
    useAccentRef.current = !useAccentRef.current;
    setAccentLabel(useAccentRef.current ? "TẮT" : "BẬT");
    handleRestart();
  };

  return (
    <div className={styles.root}>
      <div className={styles.overlay}>
        <div className={styles.overlayContent}>
          <div className={styles.title}>DLUONGTA PARTICLE TEXT</div>
          <div className={styles.small}>
            3 → 2 → 1 → CHÚC MỪNG SINH NHẬT → 09/01/2003 → ĐÌNH LƯƠNG TẠ
          </div>
          <div className={styles.controls}>
            <button className={styles.button} onClick={handleRestart}>
              Chạy lại
            </button>
            <button className={styles.button} onClick={handleToggleAccent}>
              Chữ có dấu: {accentLabel}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.canvasContainer}>
        <canvas ref={rainCanvasRef} className={styles.rainCanvas} />
        <canvas ref={canvasRef} className={styles.particleCanvas} />
      </div>

      <div className={styles.hint}>
        Website được tạo bởi DINH LUONG TA và sử dụng hiệu ứng Particle Text Canvas.
      </div>
    </div>
  );
}