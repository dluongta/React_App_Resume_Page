import React, { useEffect, useRef, useState } from "react";
import styles from "./CounterSection.module.css";

const counterData = [
    { num: 2999, suffix: "+", text: "ACTIVE CUSTOMERS" },
    { num: 99, suffix: "+", text: "CREATIVE PROJECTS" },
    { num: 99, suffix: "+", text: "DIGITAL PRODUCTS" },
    { num: 99, suffix: "+", text: "SUCCESS SOLUTIONS" },
];

const CountUpNumber = ({ target, duration = 2000, suffix = "" }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime = null;
        let animationFrameId;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;

            const percentage = Math.min(progress / duration, 1);

            const currentVal = Math.floor(target * percentage);

            setCount(currentVal);

            if (progress < duration) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setCount(target);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [target, duration]);

    return (
        <h1 className={styles.animatedNumber}>
            {count}{suffix}
        </h1>
    );
};

export const CounterSection = ({ className = "" }) => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.unobserve(sectionRef.current);
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <section ref={sectionRef} className={`${styles.wrapperOne} ${className}`}>
            <div className={styles.container}>
                {isVisible &&
                    counterData.map((val, index) => (
                        <div className={styles.box} key={index}>
                            <CountUpNumber target={val.num} suffix={val.suffix} duration={2000} />
                            <p className={styles.label}>{val.text}</p>
                        </div>
                    ))}
            </div>
        </section>
    );
};