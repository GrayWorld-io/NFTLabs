import React from 'react'
import ReactDOM from 'react-dom'
import { MetamaskStateProvider } from "use-metamask";
import App from './App'

import {initializeHashPackWallet} from './wallet/hedera/hashpack'
import { HashConnect, HashConnectTypes, MessageTypes } from 'hashconnect';

let hashconnect;
const appMetadata = {
  name: "GrayWorld",
  description: "GrayWorld Launchpad",
  icon: "https://absolute.url/to/icon.png"
};

let status = "Initializing";

let saveData = {
  topic: "",
  pairingString: "",
  privateKey: undefined,
  pairedWalletData: undefined,
  pairedAccounts: []
}

function saveDataInLocalstorage() {
  const data = JSON.stringify(saveData);

  localStorage.setItem("hashconnectData", data);
}

function setUpEvents() {

  hashconnect.foundExtensionEvent.on((data) => {
    availableExtensions.push(data);
    console.log("Found extension", data);
  })

  // hashconnect.transactionResponseEvent.on((data) => {
  //   // console.log("transaction response", data)
  //   if (data.success && !data.signedTransaction)
  //     console.log(TransactionReceipt.fromBytes(data.receipt as Uint8Array));
  //   else if (data.success && data.signedTransaction)
  //     console.log(Transaction.fromBytes(data.signedTransaction as Uint8Array));
  // })

  // hashconnect.additionalAccountResponseEvent.on((data) => {
  //   console.log("Received account info", data);

  //   data.accountIds.forEach(id => {
  //     if (saveData.pairedAccounts.indexOf(id) == -1)
  //       saveData.pairedAccounts.push(id);
  //   })
  // })

  hashconnect.pairingEvent.on((data) => {
    console.log("Paired with wallet", data);
    status = "Paired";
    window.location.reload();
    saveData.pairedWalletData = data.metadata;

    data.accountIds.forEach(id => {
      if (saveData.pairedAccounts.indexOf(id) == -1)
        saveData.pairedAccounts.push(id);
    })

    saveDataInLocalstorage();
  });
  hashconnect.transactionEvent.on((data) => {
    //this will not be common to be used in a dapp
    console.log("transaction event callback");
  });

}

function loadLocalData() {
  const foundData = localStorage.getItem("hashconnectData");

  if (foundData) {
    saveData = JSON.parse(foundData);
    console.log("Found local data", saveData)
    return true;
  }
  else
    return false;
}

// Initialize contract & set global variables
export async function initializeWallet() {
  const hashPack = await initializeHashPackWallet();
  hashconnect = hashPack.hashConnect;
  saveData = hashPack.saveData;
  // Get network configuration values from config.js
  // const nearConfig = getConfig('development')

  return { hashconnect, saveData }
}

window.nearInitPromise = initializeWallet()
  .then(({ }) => {
    ReactDOM.render(
      <MetamaskStateProvider>

      <App
        wallet={hashconnect}
        walletData={saveData}
      />
      </MetamaskStateProvider>

      ,
      document.querySelector('#root')
    )
  })
  .catch(console.error)
