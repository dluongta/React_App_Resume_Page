import React from 'react'
import { Link } from 'react-router-dom'
import PixelCard from './PixelCard'; // Import PixelCard

export const Mobile = () => {
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
      link: "https://github.com/luen2003/Fingerprint/releases/download/v1.0.0/app-release.apk",
      linkName: "Fingerprint",
    },
    {
      id: "04",
      link: "https://github.com/luen2003/WeatherApp/releases/download/v1.0.0/app-release.apk",
      linkName: "Weather App",
    }
  ]
  return (

    <>
      <section className='blog'>
        {/* <div id="mySidenav" class="sidenav">
          <Link to='/pages' id="pages"> Pages </Link>
          <Link to='/blog' id="blog"> Blog </Link>
          <Link to='/portfolio' id="portfolio"> Portfolio </Link>
          <Link to='/contact' id="contact"> Contact </Link>
          <Link to='/galaxy' id="galaxy"> Galaxy </Link>
        </div> */}
        <div className="cards-wrapper">

          {data.map((value) => {
            return (
              <PixelCard key={value.id} variant="pink" className='card '>
                <div className="card-content" style={{ position: 'absolute', zIndex: 10, width: '100%', top: 0, left: 0 }}>
                  <h1>{value.linkName}</h1>
                </div>
                <Link 
                  className='link' 
                  to={{ pathname: value.link }} 
                  target="_blank"
                  style={{ position: 'absolute', zIndex: 10 }}
                >
                  &rarr; {value.link}
                </Link>
              </PixelCard>
            )
          })}
          
        </div>
      </section>
    </>
  )
}