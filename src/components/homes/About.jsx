import React from 'react';
import Carousel from './Carousel';
import CircularText from './CircularText';

export const About = ({ className = "" }) => {
  const data = [
    {
      id: 1,
      title: "Who I Am And What I Do",
      para1: "I am extremely fascinated by science, engineering and technology.",
      para2: "I am Dinh Luong Ta. I am a programmer skilled in Software Development, including Web, Android and Application Development.",
      para3: "With technology continuing to evolve at an unprecedented speed, I would like to develop innovative solutions that have beneficial and significant impacts on the world.",
    },
  ];

  return (
    <>
      <Carousel />
      <section className={`about topMargin bottomMargin ${className}`}>
        <div className="container flex">
          {data.map((value) => (
            <React.Fragment key={value.id}>
              <div className="lef mtop">
                <div className="heading">
                  <h3 className="animated-text">About Me</h3>
                  <h1 className="animated-text">{value.title}</h1>
                </div>
                <p>{value.para1}</p>
                <p>{value.para2}</p>
                <p>{value.para3}</p>

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
              <div className="right">
                <CircularText />
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>
    </>
  );
};