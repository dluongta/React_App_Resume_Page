import React from 'react'
import PropTypes from 'prop-types'
import './steps.css'

const Steps = (props) => {
  return (
    <div className="steps-container1">
      <div className="steps-max-width thq-section-max-width">
        <div className="steps-container2">
          
          {/* CỘT TRÁI: NỘI DUNG GIỚI THIỆU */}
          <div className="steps-section-header">
            <h2 className="steps-heading">Discover the Power of Our Products</h2>
            <p className="steps-description">
              My products always offer high quality and utility.
            </p>
            <div className="steps-actions">
              <button className="steps-button thq-button-filled">Main action</button>
            </div>
          </div>

          {/* CỘT PHẢI: CÁC THẺ GRADIENT CHỒNG LÊN NHAU */}
          <div className="steps-container3">
            <div className="step-card-wrapper steps-container4">
              <h2 className="card-title">{props.step1Title}</h2>
              <p className="card-desc">{props.step1Description}</p>
              <label className="steps-label">01</label>
            </div>

            <div className="step-card-wrapper steps-container5">
              <h2 className="card-title">{props.step2Title}</h2>
              <p className="card-desc">{props.step2Description}</p>
              <label className="steps-label">02</label>
            </div>

            <div className="step-card-wrapper steps-container6">
              <h2 className="card-title">{props.step3Title}</h2>
              <p className="card-desc">{props.step3Description}</p>
              <label className="steps-label">03</label>
            </div>

            <div className="step-card-wrapper steps-container7">
              <h2 className="card-title">{props.step4Title}</h2>
              <p className="card-desc">{props.step4Description}</p>
              <label className="steps-label">04</label>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

Steps.defaultProps = {
  step1Title: 'Browse our selection',
  step1Description: 'Explore our wide range of technology devices including computers, phones, tablets, and more.',
  step2Title: 'Choose your favorite',
  step2Description: 'Select the device that best fits your needs and preferences from our curated collection.',
  step3Title: 'Place your order',
  step3Description: "Once you've made your decision, simply add the item to your cart and proceed to checkout.",
  step4Title: 'Enjoy your new device',
  step4Description: 'Receive your technology device and start enjoying its features and capabilities right away.',
}

export default Steps