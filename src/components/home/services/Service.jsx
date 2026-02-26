import React from "react";
import bannerImage from "../../../assets/banner-bg.png";

export const Service = ({ className = "" }) => {
  const servicesData = [
    {
      id: 1,
      title: "Web Design",
      desc: "Designing modern and user-friendly layouts.",
      cover: bannerImage,
    },
    {
      id: 2,
      title: "Web Development",
      desc: "Building fast and responsive web applications.",
      cover: bannerImage,
    },
    {
      id: 3,
      title: "Content Writing",
      desc: "Creating clear and engaging content.",
      cover: bannerImage,
    },
    {
      id: 4,
      title: "Online Support",
      desc: "Providing reliable support for users.",
      cover: bannerImage,
    },
    {
      id: 5,
      title: "Project Planning",
      desc: "Planning projects efficiently before development.",
      cover: bannerImage,
    },
    {
      id: 6,
      title: "Time Management",
      desc: "Managing time effectively to meet deadlines.",
      cover: bannerImage,
    },
  ];

  return (
    <section className={`services topMargin ${className}`}>
      <div className="container">
        <div className="heading">
          <h3>MY SERVICES</h3>
          <h1>Interactive Services Offered By Me</h1>
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