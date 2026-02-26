import React, { useState, useEffect, useRef } from "react";

export const Skill = ({ className }) => {

  // ✅ Custom hook nên đặt ngoài component con
  const useInView = () => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setInView(true);
        },
        { threshold: 0.3 }
      );

      const current = ref.current;
      if (current) observer.observe(current);

      return () => {
        if (current) observer.unobserve(current);
        observer.disconnect();
      };
    }, []);

    return [ref, inView];
  };

  const Progress = ({ done, title }) => {
    const [ref, inView] = useInView();
    const [width, setWidth] = useState("0%");
    const [count, setCount] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
      if (inView) {
        setWidth(`${done}%`);

        intervalRef.current = setInterval(() => {
          setCount((prev) => {
            if (prev >= done) {
              clearInterval(intervalRef.current);
              return done;
            }
            return prev + 1;
          });
        }, 10);
      }

      return () => clearInterval(intervalRef.current);
    }, [inView, done]);

    return (
      <div className="progress" ref={ref}>
        <div
          className="progress-done"
          style={{ width, opacity: inView ? 1 : 0 }}
        >
          <span>{title}</span>
          <span>{count}%</span>
        </div>
      </div>
    );
  };

  const data = [
    {
      title: "Every Day is a New Challenge",
      para: "I am a programmer skilled at Web Developer, Android Developer.",
      para1: "I also learning about Artificial Intelligence And Hardware.",
    },
  ];

  return (
    <section className={`skill ${className}`}>
      <div className="container">
        <div className="heading">
          <h3>WHY CHOOSE ME</h3>
          <h1>Some of my skills</h1>
        </div>

        <div className="content flex">
          <div className="left topMargin">
            <Progress done={80} title="HTML" />
            <Progress done={90} title="CSS" />
            <Progress done={90} title="JAVASCRIPT" />
            <Progress done={80} title="REACT JS" />
          </div>

          <div className="right mtop">
            {data.map((val, index) => (
              <div key={index}>
                <h1>{val.title}</h1>
                <p>{val.para}</p>
                <p>{val.para1}</p>

                <div className="btn-pulse-wrapper">
                  <span className="pulse-third"></span>
                  <button className="primary-btn btn-led">
                    Contact Me
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>

                    {/* ✅ sửa class */}
                    <span className="line2"></span>
                    <span className="line2"></span>
                    <span className="line2"></span>
                    <span className="line2"></span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="timeline-section">
          <div className="timeline">
            {[
              {
                year: "2021",
                title: "Bắt đầu học HTML/CSS",
                desc: "Nắm vững kiến thức nền tảng về cấu trúc và thiết kế web.",
              },
              {
                year: "2022",
                title: "Học JavaScript",
                desc: "Phát triển kỹ năng logic và hiệu ứng.",
              },
              {
                year: "2023",
                title: "React JS & API",
                desc: "Xây dựng ứng dụng và làm việc với REST API.",
              },
              {
                year: "2024",
                title: "Nâng cao & AI",
                desc: "Tìm hiểu trí tuệ nhân tạo & kết hợp phần cứng.",
              },
            ].map((item, i) => (
              <div className="timeline-item" key={i}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>{item.year} - {item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};