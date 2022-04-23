import React from "react";
import Header from "../../components/homePage/header/Header";
import LabsNFT from "../../components/homePage/labs-nft/LabsNFT";
import GrayNFT from '../../components/homePage/gray-nft/GrayNFT';
import PastMints from '../../components/homePage/past-mints/PastMints';
import LauchSteps from '../../components/homePage/launch-steps/LaunchSteps';
import AboutUs from '../../components/homePage/about-us/AboutUs';
import "../../App.css"

function Home({ showOptionsFunc, currentUser, login }) {
  return (
    <div style={{ paddingTop: '46px' }}>
      <Header showOptionsFunc={showOptionsFunc} />
      <GrayNFT showOptionsFunc={showOptionsFunc} />
      <LabsNFT showOptionsFunc={showOptionsFunc} />
    </div>
  );
}

export default Home;