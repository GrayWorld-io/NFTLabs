import React, { useEffect, useState } from 'react';
import { useAsync } from "react-async"
import axios from 'axios';
import './mint.css';
import getConfig from '../../config'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { buildTransaction } from '../../wallet/hedera/hashpack';
import { RiAlignVertically } from 'react-icons/ri';

const BASE_URL = process.env.REACT_APP_BASE_URL
const toastId = "preventDuplicateId"
let mintData = {
    name: "코인의 모든 것 세미나 수강 기념 NFT",
    description: "2022년 Gray의 LG전자 코인의 모든 것 세미나 참에 참석해주신 것을 기념하여 NFT를 발행하여 나눠드립니다. \n 이는 최대 150개(골드50, 실버100)까지만 발행됩니다."
}

let currentAccount = null;
let projectName = 'gray_seminar_2';
const checkMintable = async (accountId) => {
    const checkMintUrl = `${BASE_URL}/mint/checkMintable`
    const checkMintData = {
        network: "hedera",
        project: projectName,
        accountId: accountId.accountId
    }
    let res = await axios.post(checkMintUrl, checkMintData, {
        headers: { "Content-Type": `application/json` }
    });
    return res.data.result;
}
const Mint = ({ login, wallet, logout, walletData }) => {
    const [nftMedia, setNftMedia] = useState('')
    const [mintable, setMintable] = useState(false);
    const urlPath = window.location.pathname;
    console.log("MINT");
    if (urlPath == '/mint/gray_seminar_1') {
        // alert('1')
        mintData.name = "NFT의 모든 것 세미나 수강 기념 NFT",
        mintData.description = "2021년 Gray의 LG전자 NFT의 모든 것 세미나 참에 참석해주신 것을 기념하여 NFT를 발행하여 나눠드립니다.\n 이는 저의 첫 NFT로서 최대 70개(골드20, 실버50)까지만 발행됩니다.\nNFT를 소유하고 계신 분들께 앞으로 저의 행보에 일어날 많은 이벤트들에 우선권을 드리겠습니다."
        projectName = 'gray_seminar_1';
    } else if (urlPath == '/mint/gray_seminar_2') {
        mintData.name = "코인의 모든 것 세미나 수강 기념 NFT",
        mintData.description = "2022년 Gray의 LG전자 코인의 모든 것 세미나 참에 참석해주신 것을 기념하여 NFT를 발행하여 나눠드립니다. \n 이는 최대 150개(골드50, 실버100)까지만 발행됩니다."
        projectName = 'gray_seminar_2';
    } else if (urlPath == '/mint/gray_freshman') {
        mintData.name = "This is first Gray' NFT",
        mintData.description = "FreshMan is saver on GrayWorld"
        projectName = 'gray_freshman';
    }
    // const nearConfig = getConfig('development')
    if (walletData.pairedAccounts.length > 0) {
        currentAccount = walletData.pairedAccounts[0];
    }
    const { data, error, isLoading } = useAsync({ promiseFn: checkMintable, accountId: currentAccount });
    useEffect(() => {
        setMintable(data);
    })

    const handleConnectWallet = () => {
        if (walletData.pairedAccounts.length < 1) {
            login()
        }
        else {
            logout()
        }
    }

    const handleAssociate = async () => {
        const getTxUrl = `${BASE_URL}/token/getAssociateTx`
        const requestMintData = {
            network: "hedera",
            project: projectName,
            accountId: walletData.pairedAccounts[0]
        }
        let res = await axios.post(getTxUrl, requestMintData, {
            headers: { "Content-Type": `application/json` }
        });
        console.log(res);
        const rawTx = res.data.tx;
        const tx = buildTransaction(rawTx, walletData, false);
        await wallet.sendTransaction(walletData.topic, tx);
    }

    // const account = wallet.account();
    const handleClaim = async () => {
        const getTxUrl = `${BASE_URL}/mint/claim`
        const requestMintData = {
            network: "hedera",
            project: projectName,
            accountId: walletData.pairedAccounts[0]
        }
        let res = await axios.post(getTxUrl, requestMintData, {
            headers: { "Content-Type": `application/json` }
        });
        console.log(res);
        const rawTx = res.data.tx;
        const tx = buildTransaction(rawTx, walletData, false);
        const claimResult = await wallet.sendTransaction(walletData.topic, tx);
        console.log(claimResult);
        if (claimResult.success) {
            const updateClaimStatusUrl = `${BASE_URL}/mint/claim/status`
            const requestUpdateClaimStatusData = {
                network: "hedera",
                project: projectName,
                accountId: walletData.pairedAccounts[0],
                status: true
            }
            axios.post(updateClaimStatusUrl, requestUpdateClaimStatusData, {
                headers: { "Content-Type": `application/json` }
            });
            window.location.reload();
        }
        confirmClaimResult();
    }

    const confirmClaimResult = async () => {
        const updateClaimStatusUrl = `${BASE_URL}/mint/claim/status`
        const requestUpdateClaimStatusData = {
            network: "hedera",
            project: projectName,
            accountId: walletData.pairedAccounts[0],
            status: true
        }
        axios.post(updateClaimStatusUrl, requestUpdateClaimStatusData, {
            headers: { "Content-Type": `application/json` }
        });
    }
    // When user clicks mint button
    const handleMint = async () => {
        const getTxUrl = `${BASE_URL}/mint/getTx`
        const requestMintData = {
            network: "hedera",
            project: projectName,
            accountId: walletData.pairedAccounts[0]
        }
        let res = await axios.post(getTxUrl, requestMintData, {
            headers: { "Content-Type": `application/json` }
        });
        console.log(res);
        const result = res.data.result;
        if (result.code == 301) {
            alert("WhiteList에 없습니다.\nEmail: gray@grayworld.io \nDiscord: https://discord.com/channels/960074482863730729/967525879267864697\n로 문의주세요.")
            return;
        } else if (result.code.code == 101) {
            alert('Minting은 1개만 가능합니다');
            return;
        } else if (result.code.code == 100) {
            const rawTx = result.tx;
            const tx = buildTransaction(rawTx, walletData, true);
            const signedTx = await wallet.sendTransaction(walletData.topic, tx);
            const requestMintUrl = `${BASE_URL}/mint/sendTx`
            const sendMintData = {
                network: "hedera",
                project: projectName,
                accountId: walletData.pairedAccounts[0],
                signedTx: signedTx
            }
            await axios.post(requestMintUrl, sendMintData, {
                headers: { "Content-Type": `application/json` }
            });
            // const mintResult = res.data.result;
            window.location.reload();
        }
        
    }

    return (
        <div className='very-near__mint section__padding'>
            <div className='content'>
                <h1>{mintData.name}</h1>
                {/* <div className='poweredBy'>
                    <button>Powered by <span className="gradient__text" >VeryNear</span></button>
                </div> */}
                <p>{mintData.description}</p>
                {currentAccount !== null ? (
                    <>
                        <div className="actionButtonWrapper">
                            <button onClick={() => handleAssociate()}>Token Associate</button>
                        </div>
                        <div className="actionButtonWrapper">
                            {
                                mintable === true ?
                                    <button onClick={() => handleMint()}>{'Mint'}</button>
                                    :
                                    <button onClick={() => handleClaim()}>{'Claim'}</button>
                            }
                        </div>
                    </>
                ) : (
                    <div className="actionButtonWrapper">
                        <button onClick={() => handleConnectWallet()}>Connect Wallet</button>
                    </div>
                )}
                {/* <a href='https://uphold.com/en-us/assets/crypto/buy-near' className='buyNearLink' target="_blank">No NEAR? Buy here.</a> */}
            </div>

            { nftMedia ? (
                <div className='very-near__mint-image'>
                    <img src={`https://cloudflare-ipfs.com/ipfs/` + nftMedia} alt={mintData.name} height='560px' width='560px' />
                </div>
            ) : (
                <div className='very-near__mint-image'>
                    <img src='https://cloudflare-ipfs.com/ipfs/bafybeigfzgkephmjllnrthwtgkbptejv7qupstacsiavq2u5jgcsmtjzdm/images/1.png' alt={mintData.name} height='560px' width='560px' />
                </div>
            )}
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </div>
    );
};

export default Mint;
