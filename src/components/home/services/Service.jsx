import React from "react";
import bannerImage from "../../../assets/banner-bg.png";

export const Service = ({ className = "" }) => {
  const servicesData = [

    {
      id: 1,
      title: "UI/UX Design",
      desc: "Creating intuitive and visually appealing user experiences.",
      cover: bannerImage,
    },
    {
      id: 2,
      title: "Frontend Development",
      desc: "Building responsive interfaces with modern web technologies.",
      cover: bannerImage,
    },
    {
      id: 3,
      title: "Backend Development",
      desc: "Developing secure and scalable server-side solutions.",
      cover: bannerImage,
    },
    {
      id: 4,
      title: "Website Enhancement",
      desc: "Keeping websites updated, stable, and running smoothly.",
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
      title: "Technical Solutions",
      desc: "Providing expert guidance for digital project success.",
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