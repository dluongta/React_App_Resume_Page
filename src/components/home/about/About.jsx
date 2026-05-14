import React from 'react';
import contactImage from '../../../assets/contact-img.png';
import Carousel from './Carousel';

export const About = ({ className = "" }) => {
  const data = [
    {
      id: 1,
      title: "Who I Am And What I Do",
      desc: "I'm a skilled programmer, fascinated by science, engineering and technology.",
      cover: contactImage,
    },
  ];

  return (
    <>
      <Carousel />

      <section className={`about topMargin ${className}`}>
        <div className="container flex">
          {data.map((value) => (
            <React.Fragment key={value.id}>

              <div className="left mtop">
                <div className="heading">
                  <h3 className="animated-text">About Me</h3>
                  <h1 className="animated-text">{value.title}</h1>
                </div>

                <p>{value.desc}</p>



                <button className="primary-btn btn-led">
                  Contact Me

                  {/* LED animation spans */}
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>

                  {/* fixed class -> className */}
                  <span className="line2"></span>
                  <span className="line2"></span>
                  <span className="line2"></span>
                  <span className="line2"></span>
                </button>
              </div>


              <div className="right">
                <div className="img">
                  <img
                    src={value.cover}
                    alt="about"
                    width="500"
                    height="400"
                  />
                </div>
              </div>

            </React.Fragment>
          ))}
        </div>
      </section>
    </>
  );
};