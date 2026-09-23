import { useRef, useEffect, useState, useMemo, useId } from 'react';
import './CurvedLoop.css';

const CurvedLoop = ({
  marqueeText = "BE ✦ CREATIVE ✦ WITH ✦ DLUONGTA ✦ TSCEND ✦ ",
  speed = 1.8,
  mobileSpeed = 3.8,
}) => {
  const text = useMemo(() => {
    const hasTrailing = /\s|\u00A0$/.test(marqueeText);
    return (hasTrailing ? marqueeText.replace(/\s+$/, '') : marqueeText) + '\u00A0';
  }, [marqueeText]);

  const measureRef = useRef(null);
  const textPathRef = useRef(null);
  
  const [spacing, setSpacing] = useState(0);
  

  const offsetRef = useRef(0);
  
  const uid = useId();
  const pathId = `curve-${uid}`;

  const pathD = `M-100,220 Q720,20 1540,220`;

  const textLength = spacing;
  const totalText = textLength
    ? Array(Math.ceil(1800 / textLength) + 2)
      .fill(text)
      .join('')
    : text;
  const ready = spacing > 0;

  useEffect(() => {
    if (measureRef.current) {
      setSpacing(measureRef.current.getComputedTextLength());
    }
  }, [text]);

  useEffect(() => {
    if (!spacing || !ready) return;
    
    let frame = 0;
    let lastTime = 0;

    // Khởi tạo vị trí offset ban đầu bằng số âm của 1 đoạn text
    offsetRef.current = -spacing;

    const step = (time) => {
      if (!lastTime) lastTime = time;
      const delta = time - lastTime;
      lastTime = time;

      const speedMultiplier = Math.min(delta, 50) / 16.66;
      const isMobile = window.innerWidth <= 768;
      const currentSpeed = isMobile ? mobileSpeed : speed;

      offsetRef.current += (currentSpeed * speedMultiplier);
      

      if (offsetRef.current > 0) {
        offsetRef.current -= spacing;
      }

      if (textPathRef.current) {
        textPathRef.current.setAttribute('startOffset', offsetRef.current + 'px');
      }

      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [spacing, speed, mobileSpeed, ready]);

  return (
    <div className="curved-loop-jacket" style={{ visibility: ready ? 'visible' : 'hidden' }}>
      <svg className="curved-loop-svg" viewBox="0 0 1440 260">
        <defs>
          <path id={pathId} d={pathD} fill="none" />
          
          <linearGradient id="gradient-bg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff5a00" />
            <stop offset="50%" stopColor="#ff1493" />
            <stop offset="100%" stopColor="#7b2cff" />
          </linearGradient>
        </defs>

        <text ref={measureRef} xmlSpace="preserve" style={{ visibility: 'hidden', opacity: 0, pointerEvents: 'none' }}>
          {text}
        </text>

        {ready && (
          <>
            <use 
              href={`#${pathId}`} 
              fill="none" 
              // stroke="url(#gradient-bg)" 
              stroke="#ff5a00"
              strokeWidth="130" 
              strokeLinecap="round" 
            />

            <text
              fontWeight="bold"
              xmlSpace="preserve"
              fill="#FFFFFF"
              dominantBaseline="central" 
            >
              <textPath 
                ref={textPathRef} 
                href={`#${pathId}`} 
                startOffset="0px" 
                xmlSpace="preserve"
              >
                {totalText}
              </textPath>
            </text>
          </>
        )}
      </svg>
    </div>
  );
};

export default CurvedLoop;