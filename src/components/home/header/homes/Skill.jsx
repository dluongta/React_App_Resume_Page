import React, { useState, useEffect, useRef } from "react";

export const Skill = ({ className }) => {

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
          style={{
            width: `calc(${width} - 20px)`,
            opacity: inView ? 1 : 0
          }}
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
      para: "I am Dinh Luong Ta. I am a programmer skilled in Software Development, including Web, Android, System Software and Application Development. I am also learning about Artificial Intelligence and Hardware.",
      para1: "I am also learning about Artificial Intelligence and Hardware.",
    },
  ];

  return (
    <section className={`skill ${className}`}>
      <div className="container">
        <div className="heading">
          <div className="animated-text"></div>
          <h3 className="animated-text">Why Choose Me</h3>
          <h1 className="animated-text">Some of my skills</h1>
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
                <h1 className="animated-text">{val.title}</h1>
                <p>{val.para}</p>
                <p>{val.para1}</p>


                  <button className="primary-btn btn-led">
                    Contact Me
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>

                    <span className="line2"></span>
                    <span className="line2"></span>
                    <span className="line2"></span>
                    <span className="line2"></span>
                  </button>
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
                title: "Started learning HTML/CSS",
                desc: "Strengthened my understanding of web structure and design fundamentals.",
              },
              {
                year: "2022",
                title: "Learned JavaScript",
                desc: "Developed logical thinking and interactive effects.",
              },
              {
                year: "2023",
                title: "React JS & API",
                desc: "Built applications and worked with API.",
              },
              {
                year: "2024",
                title: "Advanced & AI",
                desc: "Explored Artificial Intelligence and hardware integration.",
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