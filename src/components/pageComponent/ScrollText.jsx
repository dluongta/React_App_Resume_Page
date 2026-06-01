import React, { useEffect, useRef } from 'react';
import styles from './ScrollText.module.css';

export const ScrollText = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !containerRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();

const start = window.innerHeight * 0.2;
const end =
  sectionRef.current.offsetHeight - window.innerHeight;

let overallProgress =
  (-rect.top - start) / (end - start);

overallProgress = Math.max(0, Math.min(1, overallProgress));

      const lines = containerRef.current.querySelectorAll(`.${styles.revealLine}`);
      const numLines = lines.length;
lines.forEach((line, index) => {
  const segment = 1 / numLines;

  const vhPerLine = 1 / numLines;

const start = index * vhPerLine;
const end = start + vhPerLine;

let lineProgress =
  (overallProgress - start) / vhPerLine;

  line.style.setProperty(
    '--line-progress',
    `${lineProgress * 100}%`
  );
});
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className={styles.scrollTextSection}>
      <div className={styles.stickyWrapper}>
        <div ref={containerRef} className={styles.textContainer}>
          <div className={styles.revealLine}>SKILLED PROGRAMMER</div>
          <div className={styles.revealLine}>SOFTWARE DEVELOPER</div>
          <div className={styles.revealLine}>HARDWARE ENGINEER</div>
        </div>
      </div>
    </section>
  );
};