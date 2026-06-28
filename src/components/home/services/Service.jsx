import React from "react";
import bannerImage from "../../../assets/banner-bg.png";

export const Service = ({ className = "" }) => {
  const servicesData = [
    {
      id: 1,
      title: "Frontend Development",
      desc: "Building responsive and interactive user interfaces with modern web technologies.",
      cover: bannerImage,
    },
    {
      id: 2,
      title: "Backend Development",
      desc: "Developing flexible and scalable server-side infrastructure.",
      cover: bannerImage,
    },
    {
      id: 3,
      title: "Full-Stack Development",
      desc: "Building complete web applications from client-side to server and database.",
      cover: bannerImage,
    },
    {
      id: 4,
      title: "Website Responsive",
      desc: "Creating responsive websites with an intuitive user interface for every device.",
      cover: bannerImage,
    },
    {
      id: 5,
      title: "Website Optimization",
      desc: "Enhancing speed, efficiency, and overall user experience.",
      cover: bannerImage,
    },
    {
      id: 6,
      title: "Website Development",
      desc: "Building and deploying websites with a focus on quality and performance.",
      cover: bannerImage,
    },
  ];

  return (
    <section className={`services topMargin ${className}`}>
      <div className="container">
        <div className="heading animated-text">
          <h1 className="animated-text normal-text-2 normal-text-3">My Services</h1>
          <h1 className="animated-text normal-text-2 normal-text-4">Interactive Services Offered By Me</h1>
        </div>

        <div className="contain grid topMargin">
          {servicesData.map(({ id, title, desc, cover }) => (
            <div className="box" key={id}>
              <div className="img">
                <img src={cover} alt={title} />
              </div>

              <div className="text">
                <h2>{title}</h2>
                <h4>{desc}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};