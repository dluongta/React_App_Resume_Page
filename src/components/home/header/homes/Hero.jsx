import React from 'react'
import PropTypes from 'prop-types'

import './hero.css'
import heroImage1 from '../../../../assets/luen.jpg'
import heroImage2 from '../../../../assets/luen_logo.png'
import heroImage3 from '../../../../assets/hexagon-main.png'

const Hero = ({
  image1Src = heroImage1,
  image1Alt = 'Technology Devices',

  image2Src = heroImage2,
  image2Alt = 'Hero Image',

  image3Src = heroImage3,
  image3Alt = 'Hero Image',

  image4Src = heroImage1,
  image4Alt = 'Hero Image',

  image5Src = heroImage2,
  image5Alt = 'Hero Image',

  image6Src = heroImage3,
  image6Alt = 'Hero Image',

  image7Src = heroImage1,
  image7Alt = 'Hero Image',

  image8Src = heroImage2,
  image8Alt = 'Hero Image',

  image9Src = heroImage3,
  image9Alt = 'Hero Image',

  image10Src = heroImage1,
  image10Alt = 'Hero Image',

  image11Src = heroImage2,
  image11Alt = 'Hero Image',

  image12Src = heroImage3,
  image12Alt = 'Hero Image',
}) => {
  return (
    <div className="hero-header78">
      <div className="hero-content2">

        {/* ROW 1 */}
        <div className="hero-row-container1 thq-animated-group-container-horizontal thq-mask-image-horizontal">
          <div className="thq-animated-group-horizontal">
            <img alt={image1Alt} src={image1Src} className="hero-placeholder-image10 thq-img-scale thq-img-ratio-1-1" />
            <img alt={image2Alt} src={image2Src} className="hero-placeholder-image11 thq-img-scale thq-img-ratio-1-1" />
            <img alt={image3Alt} src={image3Src} className="hero-placeholder-image12 thq-img-scale thq-img-ratio-1-1" />
            <img alt={image4Alt} src={image4Src} className="hero-placeholder-image13 thq-img-scale thq-img-ratio-1-1" />
            <img alt={image5Alt} src={image5Src} className="hero-placeholder-image14 thq-img-scale thq-img-ratio-1-1" />
            <img alt={image6Alt} src={image6Src} className="hero-placeholder-image15 thq-img-scale thq-img-ratio-1-1" />
          </div>

          <div className="thq-animated-group-horizontal">
            <img alt={image1Alt} src={image1Src} className="hero-placeholder-image16 thq-img-scale thq-img-ratio-1-1" />
            <img alt={image2Alt} src={image2Src} className="hero-placeholder-image17 thq-img-scale thq-img-ratio-1-1" />
            <img alt={image3Alt} src={image3Src} className="hero-placeholder-image18 thq-img-scale thq-img-ratio-1-1" />
            <img alt={image4Alt} src={image4Src} className="hero-placeholder-image19 thq-img-scale thq-img-ratio-1-1" />
            <img alt={image5Alt} src={image5Src} className="hero-placeholder-image20 thq-img-scale thq-img-ratio-1-1" />
            <img alt="Hero Image" src={heroImage1} className="hero-placeholder-image21 thq-img-scale thq-img-ratio-1-1" />
          </div>
        </div>

        {/* ROW 2 */}
        <div className="hero-row-container2 thq-animated-group-container-horizontal thq-mask-image-horizontal">
          <div className="thq-animated-group-horizontal-reverse">
            <img alt={image7Alt} src={image7Src} className="hero-placeholder-image22 thq-img-scale thq-img-ratio-1-1" />
            <img alt={image8Alt} src={image8Src} className="hero-placeholder-image23 thq-img-scale thq-img-ratio-1-1" />
            <img alt={image9Alt} src={image9Src} className="hero-placeholder-image24 thq-img-scale thq-img-ratio-1-1" />
            <img alt={image10Alt} src={image10Src} className="hero-placeholder-image25 thq-img-scale thq-img-ratio-1-1" />
            <img alt={image11Alt} src={image11Src} className="hero-placeholder-image26 thq-img-scale thq-img-ratio-1-1" />
            <img alt={image12Alt} src={image12Src} className="hero-placeholder-image27 thq-img-scale thq-img-ratio-1-1" />
          </div>

          <div className="thq-animated-group-horizontal-reverse">
            <img alt={image7Alt} src={image7Src} className="hero-placeholder-image28 thq-img-scale thq-img-ratio-1-1" />
            <img alt={image8Alt} src={image8Src} className="hero-placeholder-image29 thq-img-scale thq-img-ratio-1-1" />
            <img alt={image9Alt} src={image9Src} className="hero-placeholder-image30 thq-img-scale thq-img-ratio-1-1" />
            <img alt={image10Alt} src={image10Src} className="hero-placeholder-image31 thq-img-scale thq-img-ratio-1-1" />
            <img alt={image11Alt} src={image11Src} className="hero-placeholder-image32 thq-img-scale thq-img-ratio-1-1" />
            <img alt="Hero Image" src={heroImage2} className="hero-placeholder-image33 thq-img-scale thq-img-ratio-1-1" />
          </div>
        </div>

      </div>
    </div>
  )
}

Hero.propTypes = {
  image1Src: PropTypes.string,
  image1Alt: PropTypes.string,
  image2Src: PropTypes.string,
  image2Alt: PropTypes.string,
  image3Src: PropTypes.string,
  image3Alt: PropTypes.string,
  image4Src: PropTypes.string,
  image4Alt: PropTypes.string,
  image5Src: PropTypes.string,
  image5Alt: PropTypes.string,
  image6Src: PropTypes.string,
  image6Alt: PropTypes.string,
  image7Src: PropTypes.string,
  image7Alt: PropTypes.string,
  image8Src: PropTypes.string,
  image8Alt: PropTypes.string,
  image9Src: PropTypes.string,
  image9Alt: PropTypes.string,
  image10Src: PropTypes.string,
  image10Alt: PropTypes.string,
  image11Src: PropTypes.string,
  image11Alt: PropTypes.string,
  image12Src: PropTypes.string,
  image12Alt: PropTypes.string,
}

export default Hero