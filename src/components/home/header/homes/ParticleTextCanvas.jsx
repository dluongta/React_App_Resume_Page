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
    const particleSize = 2.2;
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

    class Particle {
      constructor(x = 0, y = 0) {
        this.init(x, y);
      }

      init(x, y) {
        this.x = x;
        this.y = y;
        this.tx = x;
        this.ty = y;
        this.size = particleSize;
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
        this.startX = this.x; // Kế thừa vị trí hiện tại (giúp hiệu ứng morphing mượt)
        this.startY = this.y;
        this.tx = targetX;
        this.ty = targetY;
        this.startTime = now;
        this.duration = dur;
        
        const hue = 200 + Math.random() * 140;
        this.color = `hsla(${hue}, 85%, ${45 + Math.random() * 10}%, 1)`;
        
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
          // Nhấp nhô khi đứng im tại chỗ
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

    function buildTargetsForText(text, maxWidth) {
      const w = Math.min(window.innerWidth, 1200);
      let fontSize;
      
      if (text.length <= 3) {
        fontSize = Math.round(w * 0.45);
      } else if (text.length >= 10) {
        fontSize = Math.round(w * 0.09); 
      } else {
        fontSize = Math.round(w * 0.12);
      }
      fontSize = Math.max(24, Math.min(fontSize, 420));

      off.width = Math.floor(Math.min(maxWidth, canvas.width / DPR));
      off.height = Math.floor(Math.min(400, canvas.height / DPR));
      offCtx.clearRect(0, 0, off.width, off.height);

      offCtx.font = `bold ${fontSize}px "Segoe UI", "Roboto", Arial`;
      let textWidth = offCtx.measureText(text).width;

      const maxAllowedWidth = off.width - 20; 
      if (textWidth > maxAllowedWidth) {
        fontSize = Math.floor(fontSize * (maxAllowedWidth / textWidth));
        offCtx.font = `bold ${fontSize}px "Segoe UI", "Roboto", Arial`;
      }

      offCtx.textBaseline = "middle";
      offCtx.textAlign = "center";
      offCtx.fillStyle = "#fff";

      const cx = off.width / 2;
      const cy = off.height / 2;
      offCtx.fillText(text, cx, cy);

      const img = offCtx.getImageData(0, 0, off.width, off.height);
      const data = img.data;
      const targets = [];

      const isMobile = window.innerWidth < 768;
      const dynamicSampleGap = isMobile ? 3 : 6;

      for (let y = 0; y < off.height; y += dynamicSampleGap) {
        for (let x = 0; x < off.width; x += dynamicSampleGap) {
          const idx = (y * off.width + x) * 4;
          const alpha = data[idx + 3];
          if (alpha > 120) {
            const tx = (x - off.width / 2) + (canvas.width / DPR) / 2;
            const ty = (y - off.height / 2) + (canvas.height / DPR) / 2;
            targets.push({ x: tx, y: ty });
          }
        }
      }
      return targets;
    }

    function buildSequence() {
      const arr = useAccentRef.current ? textsAccented : textsUnaccented;
      const screenPadding = window.innerWidth < 768 ? 20 : 80;
      sequenceRef.current = arr.map(t => buildTargetsForText(t, Math.floor(canvas.width / DPR) - screenPadding));
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

      // Sinh thêm hạt nếu cần và cho alpha = 0 để fade-in
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
      
      // Sắp xếp hạt và điểm đích theo khoảng cách đến tâm để không bị đan chéo rối loạn
      particles.sort((a, b) => Math.hypot(a.x - cx, a.y - cy) - Math.hypot(b.x - cx, b.y - cy));
      targets.sort((a, b) => Math.hypot(a.x - cx, a.y - cy) - Math.hypot(b.x - cx, b.y - cy));

      for (let i = 0; i < targets.length; i++) {
        const t = targets[i];
        const p = particles[i];
        p.to(t.x + (Math.random() - 0.5) * 0.5, t.y + (Math.random() - 0.5) * 0.5, now, formDuration + Math.random() * 200, 1);
      }

      // Hạt thừa trôi dạt nhẹ tại chỗ và fade-out biến mất
      for (let i = targets.length; i < particles.length; i++) {
        const p = particles[i];
        const driftX = p.x + (Math.random() - 0.5) * 60;
        const driftY = p.y + (Math.random() - 0.5) * 60;
        p.to(driftX, driftY, now, formDuration, 0);
      }
    }

    function runNextStage() {
      const sequence = sequenceRef.current;
      if (!sequence.length) return;

      const now = performance.now();
      const targets = sequence[seqIndexRef.current];
      assignToTargets(targets, now);

      clearTimeout(timeoutRef.current);

      // Chờ thời gian morph + giữ, sau đó qua từ tiếp theo
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

      drawRain(logicalW, logicalH, now);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(now);
      }

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      
      // Lượt vẽ 1: Quầng sáng
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.alpha <= 0) continue;
        ctx.globalAlpha = Math.min(0.9, p.alpha * 0.9);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Lượt vẽ 2: Lõi hạt
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.alpha <= 0) continue;
        ctx.globalAlpha = Math.min(1, p.alpha);
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.9, p.size * 0.9), 0, Math.PI * 2);
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

    // Gắn hàm startSequence vào ref để có thể gọi lại từ bên ngoài
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
