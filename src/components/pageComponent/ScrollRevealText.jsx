import React, { useEffect, useRef } from 'react';
import styles from './ScrollRevealText.module.css';

export const ScrollRevealText = () => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !textRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;

      /**
       * Sticky logic chuẩn:
       * - start: khi section chạm top viewport
       * - end: khi section đi hết sticky
       */
      const start = rect.top - 80;
      const end = rect.bottom - vh + 180;

      let progress = (0 - start) / (end - start);
      progress = Math.min(Math.max(progress, 0), 1)*3;

      textRef.current.style.setProperty(
        '--scroll-pos',
        `${progress * 100}%`
      );
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className={styles.scrollTextSection}>
      <div className={styles.stickyWrapper}>
        <div ref={textRef} className={styles.revealText}>
          PROFICIENT PROGRAMMER <br />
          SOFTWARE DEVELOPER <br />
          HARDWARE ENGINEER
        </div>
      </div>
    </section>
  );
};
