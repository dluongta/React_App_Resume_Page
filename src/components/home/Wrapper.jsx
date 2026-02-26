import React from "react";

export const Wrapper = ({ className = "" }) => {
  const data = [
    {
      id: 1,
      title: "LOOKING FOR MORE SOLUTIONS",
      heading: "Get The Best For Your Career",
      desc: "I am always looking for jobs and developing my knowledge.",
    },
  ];

  return (
    <section className={`branding wrapper ${className}`}>
      <div className="container">
        {data.map(({ id, title, heading, desc }) => (
          <div className="box" key={id}>
            <h3>{title}</h3>
            <h2>{heading}</h2>
            <p>{desc}</p>

            <button className="primary-btn btn-led">
              Learn About Me

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
    </section>
  );
};