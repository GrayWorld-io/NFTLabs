import React from 'react';
import NFTContainer from '../common-components/NFT-Container/NFTContainer';
import listOfNFTs from './imports';

const LabsNFT = ({ showOptionsFunc }) => {
 
  return (
  <div id="labs-nft">
    <NFTContainer images={listOfNFTs} title="Labs NFT" showOptionsFunc={showOptionsFunc} />
  </div>
  );
};

export default LabsNFT;
