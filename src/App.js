import 'regenerator-runtime/runtime'
import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './components/navbar/Navbar';
import { Home, Create, Mint } from './pages'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './App.css';
import './index.css';

export default function App({ wallet, walletData }) {

  const [showOptions, setShowOptions] = useState(false);
  let availableExtensions = [];
  wallet.findLocalWallets();

  wallet.foundExtensionEvent.on((data) => {
    availableExtensions.push(data);
    console.log("Found extension", data);
  })
  const login = async () => {
    
    if (availableExtensions.length == 0) {
      prompt('not found hashpack \n go to download', 'https://chrome.google.com/webstore/detail/hashpack/gjagmgiddbbciopjhllkdnddhcglnemk    ')
    } else {
      wallet.connectToLocalWallet(walletData.pairingString);
    }
  }
  
  const logout = () => {
    localStorage.removeItem("hashconnectData");
    window.location.reload();
  }

  const checkMintable = async () => {
    const checkMintUrl = 'http://localhost:9092/mint/checkMintable'
    const checkMintData = {
        network: "hedera",
        project: "freshman",
        accountId: walletData.pairedAccounts[0]
    }
    let res = await axios.post(checkMintUrl, checkMintData, {
        headers: { "Content-Type": `application/json` }
    });
    return res.data.result;
  }
  
  return (
    <div className='App'>
      <Router>
        <div className='brown__bg'>
          <Navbar showOptions={showOptions} showOptionsFunc={setShowOptions} login={login} logout={logout} />
        </div>

        <Switch>
          <Route path="/" exact><Home showOptions={showOptions}  showOptionsFunc={setShowOptions} login={login} /></Route>
          <Route path="/create"><Create /></Route>
          <Route path="/mint/freshman"><Mint login={login} wallet={wallet} logout={logout} walletData={walletData}/></Route>
        </Switch>
      </Router>
    </div>
  )
};