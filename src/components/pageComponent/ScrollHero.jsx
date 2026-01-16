import React, { useEffect, useState, useRef } from 'react';

const ScrollHero = () => {
    const [progress, setProgress] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            const totalAvailableScroll = rect.height - windowHeight;
            const currentScroll = -rect.top;

            const currentProgress = Math.min(
                Math.max(currentScroll / totalAvailableScroll, 0),
                1
            );
            setProgress(currentProgress);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const styles = {
        container: {
            height: '250vh',
            background: 'linear-gradient(180deg, #f8fbff, #eef2ff)',
            position: 'relative',
        },
        stickyWrapper: {
            position: 'sticky',
            top: 0,
            height: '100vh',
            width: '100%',
            overflow: 'hidden',
        },

        /* Layer dưới */
        baseLayer: {
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: '#fff',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },

        /* Layer trên (bị cắt dần) */
        overlayLayer: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${(1 - progress) * 100}%`,
            background: 'linear-gradient(135deg, #ffffff, #f3f6ff)',
            zIndex: 2,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
        },

        contentBox: {
            width: '100%',
            height: '100vh',
            padding: '0 10%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flexShrink: 0,
        },

        titleGradientDark: {
            fontSize: 'clamp(42px, 10vw, 120px)',
            fontWeight: 900,
            lineHeight: 0.9,
            margin: 0,
            textTransform: 'uppercase',
            background: 'linear-gradient(90deg, #ffffff, #e0e7ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
        },

        titleGradientLight: {
            fontSize: 'clamp(42px, 10vw, 120px)',
            fontWeight: 900,
            lineHeight: 0.9,
            margin: 0,
            textTransform: 'uppercase',
            background: 'linear-gradient(90deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
        },

        descriptionDark: {
            fontSize: 'clamp(16px, 2vw, 24px)',
            marginTop: '30px',
            maxWidth: '720px',
            lineHeight: 1.6,
            color: '#f1f5ff',
        },

        descriptionLight: {
            fontSize: 'clamp(16px, 2vw, 24px)',
            marginTop: '30px',
            maxWidth: '720px',
            lineHeight: 1.6,
            color: '#4a5568',
        },
    };

    return (
        <div style={styles.container} ref={containerRef}>
            <div style={styles.stickyWrapper}>

                {/* Layer dưới */}
                <div style={styles.baseLayer}>
                    <div style={styles.contentBox}>
                        <h1 style={styles.titleGradientDark}>
                            DIGITAL<br />TRANSFORMATION
                        </h1>
                        <p style={styles.descriptionDark}>
                            Xây dựng nền tảng công nghệ vững chắc cho sự tăng trưởng bền vững.
                            Giải pháp phần mềm đóng góp cho sự phát triển của doanh nghiệp.
                        </p>
                    </div>
                </div>

                {/* Layer trên */}
                <div style={styles.overlayLayer}>
                    <div style={styles.contentBox}>
                        <h1 style={styles.titleGradientLight}>
                            INNOVATION<br />SYSTEMS
                        </h1>
                        <p style={styles.descriptionLight}>
                            Chúng tôi kiến tạo các giải pháp phần mềm chuyên sâu, giúp doanh nghiệp
                            đột phá trong kỷ nguyên trí tuệ nhân tạo và chuyển đổi số.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ScrollHero;
