import 'regenerator-runtime/runtime'
import React, { useState } from 'react';
import Navbar from './components/navbar/Navbar';
import { Home, Create, Mint, MyNFT } from './pages'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './App.css';
import './index.css';
import { useMetamask } from "use-metamask";

export default function App({ wallet, walletData }) {
  const [showOptions, setShowOptions] = useState(false);
  const { metaState }              = useMetamask();

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

  return (
    <div className='App'>
      <Router>
        <div className='brown__bg'>
          <Navbar showOptions={showOptions} showOptionsFunc={setShowOptions} login={login} logout={logout} />
        </div>

        <Switch>
          <Route path="/" exact><Home showOptions={showOptions}  showOptionsFunc={setShowOptions} login={login} /></Route>
          <Route path="/create"><Create /></Route>
          <Route path="/mint/gray_seminar_1"><Mint login={login} wallet={wallet} logout={logout} walletData={walletData}/></Route>
          <Route path="/mint/gray_seminar_2"><Mint login={login} wallet={wallet} logout={logout} walletData={walletData}/></Route>
          <Route path="/mint/gray_freshman"><Mint login={login} wallet={wallet} logout={logout} walletData={walletData}/></Route>
          <Route path="/my-nft"><MyNFT login={login} wallet={wallet} logout={logout} walletData={walletData} metaState={metaState}/></Route>
        </Switch>
      </Router>
    </div>
  )
};