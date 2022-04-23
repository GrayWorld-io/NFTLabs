import React, { useEffect, useState } from 'react';
import { useAsync } from "react-async"
import axios from 'axios';
import './mint.css';
import nft_1 from '../../assets/header-assets/1.png'
// import * as nearAPI from 'near-api-js';
import getConfig from '../../config'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { buildTransaction } from '../../wallet/hedera/hashpack';
import { RiAlignVertically } from 'react-icons/ri';

const toastId = "preventDuplicateId"

const mintData = {
    name: "GrayWorld Freshman",
    description: "This is GrayWorld NFT!"
}

let currentAccount = null;

const checkMintable = async (accountId) => {
    const checkMintUrl = 'http://localhost:9092/mint/checkMintable'
    const checkMintData = {
        network: "hedera",
        project: "freshman",
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
        const getTxUrl = 'http://localhost:9092/token/getAssociateTx'
        const requestMintData = {
            network: "hedera",
            project: "freshman",
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
        const getTxUrl = 'http://localhost:9092/mint/claim'
        const requestMintData = {
            network: "hedera",
            project: "freshman",
            accountId: walletData.pairedAccounts[0]
        }
        let res = await axios.post(getTxUrl, requestMintData, {
            headers: { "Content-Type": `application/json` }
        });
        console.log(res);
        const rawTx = res.data.tx;
        const tx = buildTransaction(rawTx, walletData, false);
        const claimResult = await wallet.sendTransaction(walletData.topic, tx);
        // console.log(claimResult);
        if (claimResult.success) {
            const updateClaimStatusUrl = 'http://localhost:9092/mint/claim/status'
            const requestUpdateClaimStatusData = {
                network: "hedera",
                project: "freshman",
                accountId: walletData.pairedAccounts[0],
                status: true
            }
            axios.post(updateClaimStatusUrl, requestUpdateClaimStatusData, {
                headers: { "Content-Type": `application/json` }
            });
            window.location.reload();
        }
    }

    // When user clicks mint button
    const handleMint = async () => {
        const getTxUrl = 'http://localhost:9092/mint/getTx'
        const requestMintData = {
            network: "hedera",
            project: "freshman",
            accountId: walletData.pairedAccounts[0]
        }
        let res = await axios.post(getTxUrl, requestMintData, {
            headers: { "Content-Type": `application/json` }
        });
        console.log(res);
        const rawTx = res.data.tx;
        const tx = buildTransaction(rawTx, walletData, true);
        const signedTx = await wallet.sendTransaction(walletData.topic, tx);
        const requestMintUrl = 'http://localhost:9092/mint/sendTx'
        const sendMintData = {
            network: "hedera",
            project: "freshman",
            accountId: walletData.pairedAccounts[0],
            signedTx: signedTx
        }
        await axios.post(requestMintUrl, sendMintData, {
            headers: { "Content-Type": `application/json` }
        });
        // const mintResult = res.data.result;
        window.location.reload();
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
                    <img src={nft_1} alt={mintData.name} height='560px' width='560px' />
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
