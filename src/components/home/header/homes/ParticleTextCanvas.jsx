import { useEffect, useRef, useState } from "react";
import styles from "./ParticleTextCanvas.module.css";

export default function ParticleTextCanvas() {
  const canvasRef = useRef(null);
  // Refs to manage animation state without triggering re-renders
  const particlesRef = useRef([]);
  const particlePoolRef = useRef([]);
  const rafRef = useRef(null);
  const timeoutRef = useRef(null);
  const resizeTimeoutRef = useRef(null);
  
  // Logic state stored in refs to be accessible inside the closure of useEffect
  const sequenceRef = useRef([]);
  const seqIndexRef = useRef(0);
  const useAccentRef = useRef(false); // Ref for animation logic reading
  
  // UI state for button label
  const [accentLabel, setAccentLabel] = useState("TẮT");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });

    /* ===== CONFIG FROM HTML ===== */
    const particleSize = 2.2;
    const sampleGap = 6;
    const formDuration = 900;
    const holdDuration = 700;
    const explodeDuration = 800;
    const betweenDuration = 200;
    
    const textsUnaccented = ['3','2','1','CHUC', 'MUNG', 'SINH' ,'NHAT','09/01/2003','DINH LUONG TA', 'DLUONGTA'];
    const textsAccented = ['3','2','1','CHÚC', 'MỪNG', 'SINH', 'NHẬT','09/01/2003','ĐÌNH LƯƠNG TẠ', 'DLUONGTA'];

    let DPR = window.devicePixelRatio || 1;
    let lastTime = performance.now();

    // Offscreen canvas for text analysis
    const off = document.createElement("canvas");
    const offCtx = off.getContext("2d");

    /* ===== HELPER FUNCTIONS ===== */
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const lerp = (a, b, t) => a + (b - a) * t;

    /* ===== PARTICLE CLASS ===== */
    class Particle {
      constructor(x = 0, y = 0) {
        this.init(x, y);
      }
      
      init(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.tx = x;
        this.ty = y;
        this.life = 1;
        this.size = particleSize;
        this.phase = 0; // 0: moving to target, 1: exploded, 2: idle
        this.startTime = 0;
        this.startX = x;
        this.startY = y;
        this.duration = formDuration;
        this.alpha = 1;
        this.color = "#fff";
      }

      to(targetX, targetY, now, dur = formDuration) {
        this.phase = 0;
        this.startX = this.x;
        this.startY = this.y;
        this.tx = targetX;
        this.ty = targetY;
        this.startTime = now;
        this.duration = dur;
        // Subtle color variation
        const hue = 200 + Math.random() * 140;
        this.color = `hsla(${hue}, 85%, ${45 + Math.random() * 10}%, 1)`;
      }

      explode(now) {
        this.phase = 1;
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - (1 + Math.random() * 1.5);
        this.startTime = now;
        this.duration = explodeDuration;
        this.alpha = 1;
      }

      update(dt, now) {
        if (this.phase === 0) {
          const t = Math.min(1, (now - this.startTime) / this.duration);
          const e = easeOutCubic(t);
          this.x = lerp(this.startX, this.tx, e);
          this.y = lerp(this.startY, this.ty, e);
          this.alpha = 0.95;
          if (t >= 1) {
            this.phase = 2; // Arrived
          }
        } else if (this.phase === 1) {
          // Ballistic with damping
          this.vy += 0.06 * (1 + Math.random() * 0.5); // gravity
          this.x += this.vx;
          this.y += this.vy;
          // Fade out slowly
          const t = Math.min(1, (now - this.startTime) / this.duration);
          this.alpha = 1 - t;
          if (t >= 1) this.alpha = 0;
        } else {
          // Idle slight float
          this.y += Math.sin(now / 800 + this.x * 0.001) * 0.02;
        }
      }
    }

    /* ===== CORE LOGIC ===== */

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
      } else {
        fontSize = Math.round(w * 0.12);
      }
      fontSize = Math.max(28, Math.min(fontSize, 420));

      off.width = Math.floor(Math.min(maxWidth, canvas.width / DPR));
      off.height = Math.floor(Math.min(400, canvas.height / DPR));
      offCtx.clearRect(0, 0, off.width, off.height);

      offCtx.textBaseline = "middle";
      offCtx.textAlign = "center";
      offCtx.fillStyle = "#fff";
      offCtx.font = `bold ${fontSize}px "Segoe UI", "Roboto", Arial`;
      
      const cx = off.width / 2;
      const cy = off.height / 2;
      offCtx.fillText(text, cx, cy);

      const img = offCtx.getImageData(0, 0, off.width, off.height);
      const data = img.data;
      const targets = [];
      
      for (let y = 0; y < off.height; y += sampleGap) {
        for (let x = 0; x < off.width; x += sampleGap) {
          const idx = (y * off.width + x) * 4;
          const alpha = data[idx + 3];
          if (alpha > 120) {
            // Center in main canvas
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
      sequenceRef.current = arr.map(t => buildTargetsForText(t, Math.floor(canvas.width / DPR) - 80));
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
      
      // Create extras if needed
      if (particles.length < targets.length) {
        const need = targets.length - particles.length;
        for (let i = 0; i < need; i++) {
          const px = Math.random() * (canvas.width / DPR);
          const py = Math.random() * (canvas.height / DPR);
          particles.push(createOrReuseParticle(px, py));
        }
      }

      // Sort by distance to center for natural movement
      const cx = (canvas.width / DPR) / 2;
      const cy = (canvas.height / DPR) / 2;
      particles.sort((a, b) => Math.hypot(a.x - cx, a.y - cy) - Math.hypot(b.x - cx, b.y - cy));

      // Assign to targets
      for (let i = 0; i < targets.length; i++) {
        const t = targets[i];
        const p = particles[i];
        p.to(t.x + (Math.random() - 0.5) * 0.6, t.y + (Math.random() - 0.5) * 0.6, now, formDuration + Math.random() * 200);
      }

      // Extras go to edges
      for (let i = targets.length; i < particles.length; i++) {
        const p = particles[i];
        const edgeX = Math.random() < 0.5 ? -30 : (canvas.width / DPR) + 30;
        const py = Math.random() * (canvas.height / DPR);
        p.to(edgeX, py, now, 1000 + Math.random() * 800);
      }
    }

    function explodeAll(now) {
      particlesRef.current.forEach(p => p.explode(now));
    }

    function runNextStage() {
      const sequence = sequenceRef.current;
      if (!sequence.length) return;
      
      const now = performance.now();
      const targets = sequence[seqIndexRef.current];
      assignToTargets(targets, now);

      clearTimeout(timeoutRef.current);
      
      // Hold
      timeoutRef.current = setTimeout(() => {
        explodeAll(performance.now());
        
        // Next
        timeoutRef.current = setTimeout(() => {
          seqIndexRef.current++;
          if (seqIndexRef.current >= sequence.length) {
            // Loop logic
            timeoutRef.current = setTimeout(() => {
              seqIndexRef.current = 0;
              runNextStage();
            }, 1200);
          } else {
            runNextStage();
          }
        }, explodeDuration + betweenDuration);
      }, formDuration + holdDuration);
    }

    function drawBackground(ctx) {
        const w = canvas.width / DPR;
        const h = canvas.height / DPR;
        // Replicate the gradient from HTML source logic
        const g = ctx.createRadialGradient(w * 0.5, h * 0.4, Math.min(w, h) * 0.1, w * 0.5, h * 0.4, Math.max(w, h) * 0.9);
        g.addColorStop(0, 'rgba(20,12,40,0.85)');
        g.addColorStop(0.5, 'rgba(10,6,20,0.7)');
        g.addColorStop(1, 'rgba(2,2,6,0.9)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
    }

    function render(now) {
      const dt = now - lastTime;
      lastTime = now;
      
      // Canvas clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBackground(ctx);

      const particles = particlesRef.current;

      // Update
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(dt, now);
      }

      // Draw Glow
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.alpha <= 0) continue;
        ctx.globalAlpha = Math.min(0.9, p.alpha * 0.9);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Core
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

    /* ===== INIT & EVENTS ===== */
    
    // START FUNCTION (Exposed to be called by buttons)
    const startSequence = () => {
        buildSequence();
        const maxCount = Math.max(...sequenceRef.current.map(a => a.length));
        
        // If restarting, recycle current particles
        if (particlesRef.current.length > 0) {
            particlePoolRef.current.push(...particlesRef.current);
            particlesRef.current = [];
        }
        
        initParticles(Math.min(1500, maxCount + 200));
        seqIndexRef.current = 0;
        runNextStage();
    };

    // Resize Handler
    const handleResize = () => {
      DPR = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * DPR);
      canvas.height = Math.floor(window.innerHeight * DPR);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(() => {
         buildSequence();
         const now = performance.now();
         const targets = sequenceRef.current[seqIndexRef.current];
         if (targets) assignToTargets(targets, now);
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial size set
    
    // Start loop
    startSequence();
    rafRef.current = requestAnimationFrame(render);

    // Attach control function to ref for external access if needed, 
    // but here we use refs inside useEffect, so we need a way to trigger from outside.
    // We will attach a custom event listener or just use the refs if we keep logic inside.
    // Better approach: Assign startSequence to a mutable ref that the button handler can call.
    canvasRef.current.__startSequence = startSequence;

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timeoutRef.current);
      clearTimeout(resizeTimeoutRef.current);
    };
  }, []); // Run once on mount

  // Handlers
  const handleRestart = () => {
    clearTimeout(timeoutRef.current);
    if (canvasRef.current && canvasRef.current.__startSequence) {
        canvasRef.current.__startSequence();
    }
  };

  const handleToggleAccent = () => {
    useAccentRef.current = !useAccentRef.current;
    setAccentLabel(useAccentRef.current ? "BẬT" : "TẮT");
    handleRestart(); // Restart to apply new text
  };

  return (
    <div className={styles.root}>
      <div className={styles.overlay}>
        <div className={styles.overlayContent}>
            <div className={styles.title}>DLUONGTA PARTICLE TEXT</div>
            <div className={styles.small}>
            3 → 2 → 1 → CHÚC MỪNG SINH NHẬT → 09/01/2003 → ĐÌNH LƯƠNG TẠ → DLUONGTA
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
      <canvas ref={canvasRef} />
      <div className={styles.hint}>
        Website được tạo bởi DINH LUONG TA và sử dụng hiệu ứng Particle Text Canvas
      </div>
    </div>
  );
}