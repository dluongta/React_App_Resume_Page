import { useRef, useEffect, useState, useMemo, useId } from 'react';
import './CurvedLoop.css';

const CurvedLoop = ({
  marqueeText = 'CREATIVE MIND ✦ DLUONGTA TSCEND ✦ ',
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
  const [offset, setOffset] = useState(0);
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
    if (measureRef.current) setSpacing(measureRef.current.getComputedTextLength());
  }, [text]);

  useEffect(() => {
    if (!spacing) return;
    if (textPathRef.current) {
      const initial = -spacing;
      textPathRef.current.setAttribute('startOffset', initial + 'px');
      setOffset(initial);
    }
  }, [spacing]);

  useEffect(() => {
    if (!spacing || !ready) return;
    let frame = 0;
    let lastTime = 0;

    const step = (time) => {
      if (!lastTime) lastTime = time;
      const delta = time - lastTime;
      lastTime = time;

      const speedMultiplier = Math.min(delta, 50) / 16.66;

      if (textPathRef.current) {
        const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');

        const isMobile = window.innerWidth <= 768;
        const currentSpeed = isMobile ? mobileSpeed : speed;

        let newOffset = currentOffset + (currentSpeed * speedMultiplier);

        const wrapPoint = spacing;
        if (newOffset > 0) newOffset -= wrapPoint;

        textPathRef.current.setAttribute('startOffset', newOffset + 'px');
        setOffset(newOffset);
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
          <path id={pathId} d={pathD} fill="none" stroke="transparent" />

          <linearGradient id="moving-gradient" x1="-200%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#007BFF" />
            <stop offset="25%" stopColor="#007BFF" />
            <stop offset="50%" stopColor="#007BFF" />
            <stop offset="75%" stopColor="#007BFF" />
            <stop offset="100%" stopColor="#007BFF" />
            <animate attributeName="x1" values="-200%; 0%" dur="5s" repeatCount="indefinite" />
            <animate attributeName="x2" values="0%; 200%" dur="5s" repeatCount="indefinite" />
          </linearGradient>
        </defs>

        <text ref={measureRef} xmlSpace="preserve" style={{ visibility: 'hidden', opacity: 0, pointerEvents: 'none' }}>
          {text}
        </text>

        {ready && (
          <text
            fontWeight="bold"
            xmlSpace="preserve"
            fill="url(#moving-gradient)"
          >
            <textPath ref={textPathRef} href={`#${pathId}`} startOffset={offset + 'px'} xmlSpace="preserve">
              {totalText}
            </textPath>
          </text>
        )}
      </svg>
    </div>
  );
};

export default CurvedLoop;