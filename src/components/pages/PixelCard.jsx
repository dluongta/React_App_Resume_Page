import { useEffect, useRef } from 'react';
import './PixelCard.css';

class Pixel {
  constructor(canvas, context, x, y, color, speed, delay, isCorner = false) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = context;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = this.getRandomValue(0.1, 0.9) * speed;
    this.size = 0;
    this.sizeStep = Math.random() * 0.4 + (isCorner ? 0.2 : 0); // Góc xuất hiện nhanh hơn
    this.minSize = isCorner ? 2 : 0.5; // Giữ kích thước hạt ở góc rõ nét, không bị quá bé
    this.maxSizeInteger = 2.5;
    this.maxSize = isCorner ? 2.5 : this.getRandomValue(this.minSize, this.maxSizeInteger);
    this.delay = isCorner ? delay * 0.4 : delay;
    this.counter = 0;
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
    this.isIdle = false;
    this.isReverse = false;
    this.isShimmer = false;
  }

  getRandomValue(min, max) {
    return Math.random() * (max - min) + min;
  }

  draw() {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x + centerOffset, this.y + centerOffset, this.size, this.size);
  }

  appear() {
    this.isIdle = false;
    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }
    if (this.size >= this.maxSize) {
      this.isShimmer = true;
    }
    if (this.isShimmer) {
      this.shimmer();
    } else {
      this.size += this.sizeStep;
    }
    this.draw();
  }

  disappear() {
    this.isShimmer = false;
    this.counter = 0;
    if (this.size <= 0) {
      this.isIdle = true;
      return;
    } else {
      this.size -= 0.1;
    }
    this.draw();
  }

  shimmer() {
    if (this.size >= this.maxSize) {
      this.isReverse = true;
    } else if (this.size <= this.minSize) {
      this.isReverse = false;
    }
    if (this.isReverse) {
      this.size -= this.speed;
    } else {
      this.size += this.speed;
    }
  }
}

function getEffectiveSpeed(value, reducedMotion) {
  const min = 0;
  const max = 100;
  const throttle = 0.001;
  const parsed = parseInt(value, 10);

  if (parsed <= min || reducedMotion) {
    return min;
  } else if (parsed >= max) {
    return max * throttle;
  } else {
    return parsed * throttle;
  }
}

const VARIANTS = {
  default: { activeColor: null, gap: 5, speed: 35, colors: '#f8fafc,#f1f5f9,#cbd5e1', noFocus: false },
  blue: { activeColor: '#e0f2fe', gap: 10, speed: 25, colors: '#e0f2fe,#7dd3fc,#0ea5e9', noFocus: false },
  yellow: { activeColor: '#fef08a', gap: 3, speed: 20, colors: '#fef08a,#fde047,#eab308', noFocus: false },
  pink: { activeColor: '#fecdd3', gap: 6, speed: 80, colors: '#ff9ebd,#ff6b9e,#ff1461', noFocus: true },
  orange: { activeColor: '#ffedd5', gap: 6, speed: 60, colors: '#ffedd5,#fdba74,#f97316', noFocus: true }
};

export default function PixelCard({ variant = 'default', gap, speed, colors, noFocus, className = '', children }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const pixelsRef = useRef([]);
  const animationRef = useRef(null);
  const timePreviousRef = useRef(performance.now());
  const reducedMotion = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches).current;

  const variantCfg = VARIANTS[variant] || VARIANTS.default;
  const finalGap = gap ?? variantCfg.gap;
  const finalSpeed = speed ?? variantCfg.speed;
  const finalColors = colors ?? variantCfg.colors;
  const finalNoFocus = noFocus ?? variantCfg.noFocus;

  const initPixels = () => {
    if (!containerRef.current || !canvasRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);
    const ctx = canvasRef.current.getContext('2d');

    canvasRef.current.width = width;
    canvasRef.current.height = height;
    canvasRef.current.style.width = `${width}px`;
    canvasRef.current.style.height = `${height}px`;

    const colorsArray = finalColors.split(',');
    const pxs = [];
    const gapStep = parseInt(finalGap, 10);

    const xValues = [];
    for (let x = 0; x < width; x += gapStep) xValues.push(x);

    const yValues = [];
    for (let y = 0; y < height; y += gapStep) yValues.push(y);

    // Kiểm tra kích thước màn hình để quyết định xem có phải Mobile không (<= 768px là Mobile)
    const isMobile = window.innerWidth <= 768;
    // PC thì trừ 6px, Mobile thì trừ 0px
    const bottomOffset = isMobile ? 0 : 6;

    for (let i = 0; i < xValues.length; i++) {
      for (let j = 0; j < yValues.length; j++) {
        const x = xValues[i];
        const y = yValues[j];

        let drawX = x;
        let drawY = y;
        let isCorner = false;

        if (
          (i === 0 && j === 0) || 
          (i === xValues.length - 1 && j === 0) || 
          (i === 0 && j === yValues.length - 1) || 
          (i === xValues.length - 1 && j === yValues.length - 1)
        ) {
          isCorner = true;
        }

        // Áp dụng khoảng cách linh hoạt theo thiết bị
        if (j === yValues.length - 1) {
          drawY -= bottomOffset;
        }

        const color = isCorner ? '#ea580c' : colorsArray[Math.floor(Math.random() * colorsArray.length)];

        const dx = drawX - width / 2;
        const dy = drawY - height / 2 - bottomOffset; // Áp dụng đồng bộ offset cho khoảng cách delay
        const distance = Math.sqrt(dx * dx + dy * dy);
        const delay = reducedMotion ? 0 : distance;

        pxs.push(new Pixel(canvasRef.current, ctx, drawX, drawY, color, getEffectiveSpeed(finalSpeed, reducedMotion), delay, isCorner));
      }
    }
    pixelsRef.current = pxs;
  };

  const doAnimate = fnName => {
    animationRef.current = requestAnimationFrame(() => doAnimate(fnName));
    const timeNow = performance.now();
    const timePassed = timeNow - timePreviousRef.current;
    const timeInterval = 1000 / 60;

    if (timePassed < timeInterval) return;
    timePreviousRef.current = timeNow - (timePassed % timeInterval);

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasRef.current) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    let allIdle = true;
    for (let i = 0; i < pixelsRef.current.length; i++) {
      const pixel = pixelsRef.current[i];
      pixel[fnName]();
      if (!pixel.isIdle) {
        allIdle = false;
      }
    }
    if (allIdle) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleAnimation = name => {
    cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(() => doAnimate(name));
  };

  const onMouseEnter = () => handleAnimation('appear');
  const onMouseLeave = () => handleAnimation('disappear');
  const onFocus = e => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    handleAnimation('appear');
  };
  const onBlur = e => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    handleAnimation('disappear');
  };

  useEffect(() => {
    initPixels();
    const observer = new ResizeObserver(() => {
      initPixels();
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationRef.current);
    };
  }, [finalGap, finalSpeed, finalColors, finalNoFocus]);

  return (
    <div
      ref={containerRef}
      className={`pixel-card ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={finalNoFocus ? undefined : onFocus}
      onBlur={finalNoFocus ? undefined : onBlur}
      tabIndex={finalNoFocus ? -1 : 0}
    >
      <canvas className="pixel-canvas" ref={canvasRef} />
      {children}
    </div>
  );
}