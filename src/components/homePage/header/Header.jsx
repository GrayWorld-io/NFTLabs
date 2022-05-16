import React, { useState } from 'react';
import './header.css';
import ImageSlider from '../common-components/image-slider/ImageSlider';
import { SliderData } from './SliderData';
import { useHistory } from "react-router-dom";

function Header({ showOptionsFunc }) {
  const CurrentProject = 'gray_freshman';
  const history = useHistory();
  function showPdfDialog() {
    // let path = '/mint/gray_seminar'
    // history.push(path);
    // alert("Please email to gray@grayworld.io")
    window.open('https://drive.google.com/file/d/1IZKCPQs529DuhroQGRtUeOS3MMURFFdC/view?usp=sharing');
  }
  function showVideoDialog() {
    // let path = '/mint/gray_seminar'
    // history.push(path);
    // alert("Please email to gray@grayworld.io")
    window.open('https://www.youtube.com/watch?v=4Cxb-FYPSKM');
  }

  return (
    <div className="very-near__header section__padding" id="header">
      <div className="very-near__header-content">
        <h1 style={{ color: "#fff" }}>NFT Labs on <span className="gradient__text" >GrayWorld</span></h1>
        <p>Get started with launching your NFT project with  <span className="gradient__text" >GrayWorld</span></p>
        <div className="very-near__header-content__input">
          <button type="button" onClick={showPdfDialog}>Minting Guide(pdf)</button>
        </div>
        <div className="very-near__header-content__input">
          <button type="button" onClick={showVideoDialog}>Minting Guide(Video)</button>
        </div>
      </div>
      <div className='very-near__header-image'>
        <ImageSlider project={CurrentProject} slides={SliderData} showOptionsFunc={showOptionsFunc}/>
      </div>
    </div>
  )
};

export default Header