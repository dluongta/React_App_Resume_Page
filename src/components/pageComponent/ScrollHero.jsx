import React, { useEffect, useState, useRef } from 'react';

const ScrollHero = () => {
    const [progress, setProgress] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Tính toán vùng hoạt động của hiệu ứng
            // 0: Bắt đầu chạm đỉnh, 1: Đã cuộn qua hết container
            const totalAvailableScroll = rect.height - windowHeight;
            const currentScroll = -rect.top;

            const currentProgress = Math.min(Math.max(currentScroll / totalAvailableScroll, 0), 1);
            setProgress(currentProgress);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Chạy lần đầu để set state
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const styles = {
        container: {
            height: '250vh', // Độ dài để người dùng cuộn tạo hiệu ứng
            backgroundColor: '#000',
            position: 'relative',
        },
        stickyWrapper: {
            position: 'sticky',
            top: 0,
            height: '100vh',
            width: '100%',
            overflow: 'hidden',
        },
        // Nội dung đen (Nằm dưới)
        blackLayer: {
            position: 'absolute',
            inset: 0,
            backgroundColor: '#000',
            color: '#fff',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        // Nội dung trắng (Nằm trên, bị cắt dần)
        whiteLayer: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${(1 - progress) * 100}%`, // Chiều cao giảm dần
            backgroundColor: '#fff',
            color: '#000',
            zIndex: 2,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'flex-start', // Quan trọng để giữ nội dung không trượt theo
            justifyContent: 'center',
        },
        // Container chứa Text để đảm bảo 2 lớp chữ giống hệt vị trí nhau
        contentBox: {
            width: '100%',
            height: '100vh',
            padding: '0 10%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flexShrink: 0, // Không cho nội dung bị bóp méo khi lớp cha thu nhỏ
        },
        title: {
            fontSize: 'clamp(40px, 10vw, 120px)',
            fontWeight: 900,
            lineHeight: 0.9,
            margin: 0,
            textTransform: 'uppercase',
        },
        description: {
            fontSize: 'clamp(16px, 2vw, 24px)',
            marginTop: '30px',
            maxWidth: '700px',
            lineHeight: 1.5,
        }
    };

    return (
        <div style={styles.container} ref={containerRef}>
            <div style={styles.stickyWrapper}>

                <div style={styles.blackLayer}>
                    <div style={styles.contentBox}>
                        <h1 style={styles.title}>DIGITAL<br />TRANSFORMATION</h1>
                        <p style={styles.description}>
                            Xây dựng nền tảng công nghệ vững chắc cho sự tăng trưởng bền vững.
                            Giải pháp phần mềm may đo theo nhu cầu riêng biệt của từng doanh nghiệp.
                        </p>
                    </div>
                </div>

                <div style={styles.whiteLayer}>
                    <div style={styles.contentBox}>
                        <h1 style={styles.title}>INNOVATION<br />SYSTEMS</h1>
                        <p style={styles.description}>
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