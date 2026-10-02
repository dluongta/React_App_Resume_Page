import { useRef, useEffect, useState, useMemo, useId } from 'react';
import './CurvedLoop.css';

const CurvedLoop = ({
  marqueeText = "BE ✦ CREATIVE ✦ WITH ✦ DLUONGTA ✦ TSCEND ✦ ",
  speed = 1.8,
  mobileSpeed = 3.8,
}) => {
  const text = useMemo(() => {
    const cleanText = marqueeText.replace(/\s+$/, '');
    return cleanText + '\u00A0';
  }, [marqueeText]);

  const measureRef = useRef(null);
  const textPathRef = useRef(null);

  const [spacing, setSpacing] = useState(0);

  const offsetRef = useRef(0);
  const lastTimeRef = useRef(null);

  const uid = useId();
  const pathId = `curve-${uid.replace(/:/g, '')}`;

  const pathD = `M-100,220 Q720,20 1540,220`;

  /*
   * ==========================================
   * ĐO CHÍNH XÁC 1 CHU KỲ TEXT
   * ==========================================
   */
  useEffect(() => {
    const measureText = () => {
      if (!measureRef.current) return;

      const length =
        measureRef.current.getComputedTextLength();

      if (length > 0) {
        setSpacing(length);
      }
    };

    measureText();

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        requestAnimationFrame(measureText);
      });
    }

    window.addEventListener('resize', measureText);

    return () => {
      window.removeEventListener('resize', measureText);
    };
  }, [text]);

  /*
   * ==========================================
   * LẶP TEXT RẤT DÀI
   * ==========================================
   *
   * Không để text chỉ dài 3000px nữa.
   *
   * 100 pattern giúp chạy rất lâu mà không
   * bao giờ thấy khoảng trống.
   */
  const totalText = useMemo(() => {
    if (!spacing) return text;

    return Array(100)
      .fill(text)
      .join('');
  }, [text, spacing]);

  const ready = spacing > 0;

  /*
   * ==========================================
   * SEAMLESS MARQUEE
   * ==========================================
   */
  useEffect(() => {
    if (!ready || !spacing || !textPathRef.current) {
      return;
    }

    let animationFrame;

    offsetRef.current = -spacing;
    lastTimeRef.current = null;

    const animate = (time) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }

      const delta = Math.min(
        time - lastTimeRef.current,
        50
      );

      lastTimeRef.current = time;

      const isMobile =
        window.innerWidth <= 768;

      const currentSpeed =
        isMobile
          ? mobileSpeed
          : speed;

      /*
       * Tốc độ theo thời gian thực.
       */
      const movement =
        currentSpeed *
        (delta / 16.6666667);

      offsetRef.current += movement;

      /*
       * ======================================
       * SEAMLESS RESET
       * ======================================
       *
       * Không reset thẳng về -spacing.
       *
       * Giữ lại phần dư:
       *
       *  0.8
       *
       * sẽ thành:
       *
       * -spacing + 0.8
       *
       * thay vì:
       *
       * -spacing
       *
       * Điều này tránh mất pixel khi FPS
       * không đúng 60fps.
       */
      if (offsetRef.current >= 0) {
        offsetRef.current -= spacing;
      }

      if (textPathRef.current) {
        textPathRef.current.setAttribute(
          'startOffset',
          `${offsetRef.current}px`
        );
      }

      animationFrame =
        requestAnimationFrame(animate);
    };

    animationFrame =
      requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      lastTimeRef.current = null;
    };
  }, [
    ready,
    spacing,
    speed,
    mobileSpeed,
  ]);

  return (
    <div
      className="curved-loop-jacket"
      style={{
        visibility: ready
          ? 'visible'
          : 'hidden',
      }}
    >
      <svg
        className="curved-loop-svg"
        viewBox="0 0 1440 260"
      >
        <defs>
          <path
            id={pathId}
            d={pathD}
            fill="none"
          />
        </defs>

        {/* =================================
            MEASURE
        ================================= */}

        <text
          ref={measureRef}
          className="curved-loop-measure"
          xmlSpace="preserve"
          aria-hidden="true"
        >
          {text}
        </text>

        {ready && (
          <>
            {/* =================================
                ORANGE CURVE
            ================================= */}

            <use
              href={`#${pathId}`}
              fill="none"
              stroke="#ff5a00"
              strokeWidth="130"
              strokeLinecap="round"
            />

            {/* =================================
                INFINITE MOVING TEXT
            ================================= */}

            <text
              className="curved-loop-text"
              xmlSpace="preserve"
              fill="#FFFFFF"
              dominantBaseline="central"
              fontWeight="900"
            >
              <textPath
                ref={textPathRef}
                href={`#${pathId}`}
                startOffset={`${-spacing}px`}
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
