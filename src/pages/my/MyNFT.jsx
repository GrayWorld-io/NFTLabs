import React, { useEffect, useState } from 'react';
import { useAsync } from "react-async"
import axios from 'axios';
import { useMetamask } from "use-metamask";
import { ethers } from "ethers";
import { Transaction } from 'ethereumjs-tx'
import Web3 from 'web3';

import './mynft.css';

import { buildTransaction } from '../../wallet/hedera/hashpack';

const BASE_URL = process.env.REACT_APP_BASE_URL
const BRIDGE_BASE_URL = process.env.REACT_APP_BRIDGE_BASE_URL
let projectName = 'gray_freshman';

let currentAccount = null;

const getMyNFTList = async (accountId) => {
  const checkMintUrl = `${BASE_URL}/my/nft`
  const checkMintData = {
    network: "hedera",
    accountId: accountId.accountId,
    tokenId: '0.0.34812542',
  }
  let res = {};
  let ownAssetResult = await axios.post(checkMintUrl, checkMintData, {
    headers: { "Content-Type": `application/json` }
  });
  res['own'] = ownAssetResult.data.result;
  const getLockAssetsUrl = `${BRIDGE_BASE_URL}/bridge/getLockAssets`
  let lockAssetsResult = await axios.post(getLockAssetsUrl, checkMintData, {
    headers: { "Content-Type": `application/json` }
  });
  res['lock'] = lockAssetsResult.data.result;
7
  return res;
}

function MyNFT({ login, wallet, logout, walletData }) {
  // const [myNFTList, setMyNFTList] = useState({});

  const { connect, metaState }              = useMetamask();
  const [ web3interface, setWeb3Interface ] = useState("web3");


  if (walletData.pairedAccounts.length > 0) {
    currentAccount = walletData.pairedAccounts[0];
  }
  const { data, error, isLoading } = useAsync({ promiseFn: getMyNFTList, accountId: currentAccount });
  const mintETH = async (item) => {
    let web3 = new Web3(window.ethereum);
    let signature = null;
    const account = await window.ethereum.request({ method: "eth_requestAccounts" });
    const getMessageUrl = `${BRIDGE_BASE_URL}/bridge/getMessage`
    const requestEthMessageData = {
      network: "eth",
      project: 'gray_freshman',
      account: account[0],
      metadata: 'ipfs://bafybeigiqknw2jzef35qdsf4jxjbm6oqj6p764qei3mce7bpt67ty4pq2i/metadata/5.json',
    }
    let res = await axios.post(getMessageUrl, requestEthMessageData, {
      headers: { "Content-Type": `application/json` }
    });
    const result = res.data.result;
    if (result.code.code !== 1) {
      return;      
    }
    signature = await web3.eth.personal.sign(result.message, account[0]);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const getMintTxUrl = `${BRIDGE_BASE_URL}/bridge/getMintTx`
    const requestEthMintData = {
      network: "eth",
      project: 'gray_freshman',
      account: account[0],
      metadata: item.metadata,
      signature: signature,
    }
    res = await axios.post(getMintTxUrl, requestEthMintData, {
      headers: { "Content-Type": `application/json` }
    });
    const result2 = res.data.result;
    console.log(result2);
    if (result2.code.code !== 1) {
      return;      
    }
    await web3.eth.sendTransaction(result2.tx);
    window.location.reload();
  }

  const withdrawFromHederaContract = async (item) => {
    const getTxUrl = `${BRIDGE_BASE_URL}/bridge/getWithdrawTx`
    const requestHederaLockData = {
      network: "hedera",
      project: 'gray_freshman',
      accountId: walletData.pairedAccounts[0],
      tokenId: item.tokenId,
      serial: item.serial
    }
    let res = await axios.post(getTxUrl, requestHederaLockData, {
      headers: { "Content-Type": `application/json` }
    });
    const result = res.data.result;
    if (result.code.code == 1) {
      const rawTx = result.tx;
      const tx = buildTransaction(rawTx, walletData, true);
      const signedTx = await wallet.sendTransaction(walletData.topic, tx);
      const requestMintUrl = `${BRIDGE_BASE_URL}/bridge/sendLockTx`
      const sendMintData = {
        network: "hedera",
        project: projectName,
        accountId: walletData.pairedAccounts[0],
        tokenId: item.tokenId,
        serial: item.serial,
        signedTx: signedTx
      }
      await axios.post(requestMintUrl, sendMintData, {
        headers: { "Content-Type": `application/json` }
      });
      // const mintResult = res.data.result;
      window.location.reload();
    }
  }

  const lockToHederaContract = async (item) => {
    const getTxUrl = `${BRIDGE_BASE_URL}/bridge/getLockTx`
    const requestHederaLockData = {
      network: "hedera",
      project: 'gray_freshman',
      accountId: walletData.pairedAccounts[0],
      tokenId: item.tokenId,
      serial: item.serial
    }
    let res = await axios.post(getTxUrl, requestHederaLockData, {
      headers: { "Content-Type": `application/json` }
    });
    const result = res.data.result;
    if (result.code.code == 1) {
      const rawTx = result.tx;
      const tx = buildTransaction(rawTx, walletData, true);
      const signedTx = await wallet.sendTransaction(walletData.topic, tx);
      const requestMintUrl = `${BRIDGE_BASE_URL}/bridge/sendLockTx`
      const sendMintData = {
        network: "hedera",
        project: projectName,
        accountId: walletData.pairedAccounts[0],
        tokenId: item.tokenId,
        serial: item.serial,
        signedTx: signedTx
      }
      await axios.post(requestMintUrl, sendMintData, {
        headers: { "Content-Type": `application/json` }
      });
      // const mintResult = res.data.result;
      window.location.reload();
    }
  }
  function OwnItem(props) {
    return (
      <div className='content'>
        <h1>{props.tokenId}</h1>
        <h2>{props.serial}</h2>
        <img src={props.imageUrl} />
        <div className="actionButtonWrapper">
          <button onClick={() => lockToHederaContract(props)}>Lock</button>
        </div>
      </div>
    );
  }
  function LockItem(props) {
    return (
      <div className='content'>
        <h1>{props.tokenId}</h1>
        <h2>{props.serial}</h2>
        <img src={props.imageUrl} />
        <div className="actionButtonWrapper">
          <button onClick={() => withdrawFromHederaContract(props)}>Withdraw</button>
          <button onClick={() => mintETH(props)}>To ETH</button>
        </div>
      </div>
    );
  }
  if (data) {
    console.log(data)
    const ownNFTList = data.own.list;
    const lockNFTList = data.lock.list;
    return (
      <div>
        <div className='content' style={{ paddingTop: '60px' }}>
          <h1>OWN NFT</h1>
          {ownNFTList.map(item => (
            <OwnItem key={item} tokenId={item.tokenId} serial={item.serial} imageUrl={item.imageUrl}  />
          ))}
          <div className='content' style={{ paddingTop: '60px' }}></div>
          <h1>LOCK NFT</h1>
          {lockNFTList.map(item => (
            <LockItem key={item} tokenId={item.tokenId} serial={item.serial} imageUrl={item.imageUrl} metadata={item.metadata}  />
          ))}
        </div>
      </div>
    );
  } else {
    return null;
  }

}

export default MyNFT;
