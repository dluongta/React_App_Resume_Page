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
      title: "Performance Optimization",
      desc: "Improving website performance for better user experience.",
      cover: bannerImage,
    },
    {
      id: 4,
      title: "Updates & Support",
      desc: "Providing continuous improvements, updates and reliable technical support for users.",
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