
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import './CurvedLoop.css';

const CurvedLoop = ({
  marqueeText = 'BE ✦ CREATIVE ✦ WITH ✦ DLUONGTA ✦ TSCEND ✦ ',
  speed = 1.8,
  mobileSpeed = 3.8,
}) => {
  const cleanText = useMemo(
    () => marqueeText.replace(/\s+$/, '') + '\u00A0',
    [marqueeText]
  );

  const measureRef = useRef(null);
  const textPathRef = useRef(null);
  const offsetRef = useRef(0);

  const [spacing, setSpacing] = useState(0);

  const uid = useId().replace(/:/g, '');
  const pathId = `curve-${uid}`;

  const pathD = 'M-100,220 Q720,20 1540,220';

  // Đo chiều dài chính xác của một chu kỳ chữ.
  useEffect(() => {
    const element = measureRef.current;

    if (!element) return;

    let resizeObserver;
    let frameId;

    const measureText = () => {
      cancelAnimationFrame(frameId);

      frameId = requestAnimationFrame(() => {
        if (!measureRef.current) return;

        const length = measureRef.current.getComputedTextLength();

        if (length > 0 && Number.isFinite(length)) {
          setSpacing((previous) =>
            Math.abs(previous - length) > 0.1 ? length : previous
          );
        }
      });
    };

    measureText();

    if (document.fonts?.ready) {
      document.fonts.ready.then(measureText);
    }

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(measureText);
      resizeObserver.observe(element);
    } else {
      window.addEventListener('resize', measureText);
    }

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', measureText);
    };
  }, [cleanText]);

  // Lặp đủ chu kỳ để không xuất hiện khoảng trống trên đường cong.
  const repeatCount = useMemo(() => {
    if (!spacing) return 2;

    // Đường cong dài khoảng 1.6 lần chiều rộng viewBox.
    // Dự phòng thêm nhiều chu kỳ cho đoạn chữ nằm ngoài khung nhìn.
    return Math.max(12, Math.ceil(2400 / spacing) + 8);
  }, [spacing]);

  const totalText = useMemo(
    () => cleanText.repeat(repeatCount),
    [cleanText, repeatCount]
  );

  // Animation liên tục, không phụ thuộc tốc độ khung hình.
  useEffect(() => {
    const textPath = textPathRef.current;

    if (!textPath || spacing <= 0) return;

    let rafId = 0;
    let previousTime = null;

    // Giữ offset trong [-spacing, 0), tránh reset gây nhảy hình.
    let offset = -spacing;
    offsetRef.current = offset;

    textPath.setAttribute('startOffset', `${offset}px`);

    const animate = (time) => {
      if (previousTime === null) {
        previousTime = time;
        rafId = requestAnimationFrame(animate);
        return;
      }

      // Giới hạn delta để tránh nhảy xa khi tab bị ẩn hoặc máy lag.
      const delta = Math.min(time - previousTime, 32);
      previousTime = time;

      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      const currentSpeed = isMobile ? mobileSpeed : speed;

      // speed được tính theo pixel mỗi frame ở mốc 60 FPS.
      const movement = currentSpeed * (delta / (1000 / 60));

      // Modulo giữ lại phần dư, không làm mất pixel khi lặp.
      offset = -spacing + ((offset + movement + spacing) % spacing);

      offsetRef.current = offset;
      textPath.setAttribute('startOffset', `${offset}px`);

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      previousTime = null;
    };
  }, [spacing, speed, mobileSpeed]);

  return (
    <div
      className="curved-loop-jacket"
      style={{ visibility: spacing > 0 ? 'visible' : 'hidden' }}
      aria-hidden="true"
    >
      <svg
        className="curved-loop-svg"
        viewBox="0 0 1440 260"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <path id={pathId} d={pathD} fill="none" />
        </defs>

        {/* Đo chính xác một chu kỳ chữ */}
        <text
          ref={measureRef}
          className="curved-loop-measure"
          xmlSpace="preserve"
        >
          {cleanText}
        </text>

        {spacing > 0 && (
          <>
            {/* Dải cong màu cam */}
            <use
              href={`#${pathId}`}
              className="curved-loop-band"
            />

            {/* Chữ chạy liên tục */}
            <text className="curved-loop-text">
              <textPath
                ref={textPathRef}
                href={`#${pathId}`}
                startOffset={`${-spacing}px`}
                method="align"
                spacing="exact"
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
