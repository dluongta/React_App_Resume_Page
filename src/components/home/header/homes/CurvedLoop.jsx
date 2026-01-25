import { useRef, useEffect, useState, useMemo, useId } from 'react';
import './CurvedLoop.css';

const CurvedLoop = ({
  marqueeText = '',
  speed = 2,
  className = '',
  curveAmount = 400,
  direction = 'left',
  interactive = true
}) => {
  const text = useMemo(() => {
    const hasTrailing = /\s|\u00A0$/.test(marqueeText);
    return (hasTrailing ? marqueeText.replace(/\s+$/, '') : marqueeText) + '\u00A0';
  }, [marqueeText]);

  const measureRef = useRef(null);
  const textPathRef = useRef(null);
  const pathRef = useRef(null);

  const [spacing, setSpacing] = useState(0);
  const [offset, setOffset] = useState(0);

  const uid = useId();
  const pathId = `curve-${uid}`;

  const pathD = `M-100,40 Q500,${40 + curveAmount} 1540,40`;

  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef(direction);
  const velRef = useRef(0);

  const totalText = spacing
    ? Array(Math.ceil(1800 / spacing) + 2).fill(text).join('')
    : text;

  useEffect(() => {
    if (measureRef.current) {
      setSpacing(measureRef.current.getComputedTextLength());
    }
  }, [text]);

  useEffect(() => {
    if (!spacing || !textPathRef.current) return;
    const start = -spacing;
    textPathRef.current.setAttribute('startOffset', start + 'px');
    setOffset(start);
  }, [spacing]);

  useEffect(() => {
    if (!spacing) return;
    let raf;

    const animate = () => {
      if (!dragRef.current && textPathRef.current) {
        const delta = dirRef.current === 'right' ? speed : -speed;
        let current = parseFloat(textPathRef.current.getAttribute('startOffset'));
        let next = current + delta;

        if (next <= -spacing) next += spacing;
        if (next > 0) next -= spacing;

        textPathRef.current.setAttribute('startOffset', next + 'px');
        setOffset(next);
      }
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [spacing, speed]);

  const onPointerDown = e => {
    if (!interactive) return;
    dragRef.current = true;
    lastXRef.current = e.clientX;
    e.target.setPointerCapture(e.pointerId);
  };

  const onPointerMove = e => {
    if (!interactive || !dragRef.current || !textPathRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;

    let current = parseFloat(textPathRef.current.getAttribute('startOffset'));
    let next = current + dx;

    if (next <= -spacing) next += spacing;
    if (next > 0) next -= spacing;

    textPathRef.current.setAttribute('startOffset', next + 'px');
    velRef.current = dx;
  };

  const endDrag = () => {
    dragRef.current = false;
    dirRef.current = velRef.current > 0 ? 'right' : 'left';
  };

  return (
    <div
      className="curved-loop-jacket"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <svg className="curved-loop-svg" viewBox="0 0 1440 120">
  <defs>
    <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#00e5ff">
        <animate attributeName="offset" values="0;1" dur="6s" repeatCount="indefinite" />
      </stop>
      <stop offset="50%" stopColor="#7b2cff">
        <animate attributeName="offset" values="0.5;1.5" dur="6s" repeatCount="indefinite" />
      </stop>
      <stop offset="100%" stopColor="#ff3cac">
        <animate attributeName="offset" values="1;2" dur="6s" repeatCount="indefinite" />
      </stop>
    </linearGradient>

    <path id={pathId} d={pathD} fill="none" />
  </defs>

  <text
    ref={measureRef}
    style={{ visibility: 'hidden' }}
    xmlSpace="preserve"
  >
    {text}
  </text>

  <text
    className={className}
    fill="url(#textGradient)"
    fontWeight="800"
  >
    <textPath
      ref={textPathRef}
      href={`#${pathId}`}
      startOffset={offset}
    >
      {totalText}
    </textPath>
  </text>
</svg>

    </div>
  );
};

export default CurvedLoop;
