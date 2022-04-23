import React from 'react';
import NFTContainer from '../common-components/NFT-Container/NFTContainer';
import listOfNFTs from './imports';

const GrayNFT = ({ showOptionsFunc }) => {
 
  return (
  <div id="gray-nft">
    <NFTContainer images={listOfNFTs} title="Gray's NFT" showOptionsFunc={showOptionsFunc} />
  </div>
  );
};

export default GrayNFT;
