import React, { useState } from 'react';
import './header.css';
import ImageSlider from '../common-components/image-slider/ImageSlider';
import { SliderData } from './SliderData';
import { useHistory } from "react-router-dom";

function Header({ showOptionsFunc }) {
  const history = useHistory();
  function showApplyDialog() {
    // let path = '/mint/gray_seminar_1'
    // history.push(path);
    alert("Please email to gray@grayworld.io")
  }


  return (
    <div className="very-near__header section__padding" id="header">
      <div className="very-near__header-content">
        <h1 style={{ color: "#fff" }}>NFT Labs on <span className="gradient__text" >GrayWorld</span></h1>
        <p>Get started with launching your NFT project with  <span className="gradient__text" >GrayWorld</span></p>
        <div className="very-near__header-content__input">
          <button type="button" onClick={showApplyDialog}>Apply</button>
        </div>
      </div>
      <div className='very-near__header-image'>
        <ImageSlider slides={SliderData} showOptionsFunc={showOptionsFunc}/>
      </div>
    </div>
  )
};

export default Header