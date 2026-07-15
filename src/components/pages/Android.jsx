import React from 'react';
import { Link } from 'react-router-dom';
import './Card.css';

export const Android = () => {
  const data = [
    {
      id: "01",
      link: "https://github.com/luen2003/NoteApp/releases/download/v1.0.0/app-release.apk",
      linkName: "Note App",
    },
    {
      id: "02",
      link: "https://github.com/luen2003/NewsApp/releases/download/v1.0.0/app-release.apk",
      linkName: "News App",
    },
    {
      id: "03",
      link: "https://github.com/luen2003/WeatherApp/releases/download/v1.0.0/app-release.apk",
      linkName: "Weather App",
    }
  ]
  return (

    <>
      <section className='blog'>
        <div className="cards-wrapper">
          {data.map((value) => {
            return (
              <div key={value.id} className="basic-card card">
                <div className="card-content">
                  <h1>{value.linkName}</h1>
                </div>
                <Link
                  className="link"
                  to={value.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  &rarr; {value.link}
                </Link>
              </div>
            );
          })}

        </div>
      </section>
    </>
  )
}