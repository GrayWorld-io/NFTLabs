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

  // hashconnect.foundExtensionEvent.on((data) => {
  //   availableExtensions.push(data);
  //   console.log("Found extension", data);
  // })

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

export async function initializeHashPackWallet() {
  hashconnect = new HashConnect(true);
  
  if (!loadLocalData()) {

    const initData = await hashconnect.init(appMetadata);
    saveData.privateKey = initData.privKey;
    //then connect, storing the new topic in localstorage
    const state = await hashconnect.connect();
    saveData.topic = state.topic;
    
    hashconnect.findLocalWallets();
    //generate a pairing string, which you can display and generate a QR code from
    saveData.pairingString = hashconnect.generatePairingString(state, "testnet", false);
    status = "Connected";
  } else {
    await hashconnect.init(appMetadata, saveData.privateKey);
    await hashconnect.connect(saveData.topic, saveData.pairedWalletData);

    status = "Paired";
  }

  setUpEvents();

  return {
    hashConnect: hashconnect,
    saveData: saveData
  }
}

export function buildTransaction(tx, walletData, sendServer) {
  const transaction = {
    topic: walletData.topic,
    byteArray: tx,
    metadata: {
        accountToSign: walletData.pairedAccounts[0],
        returnTransaction: sendServer
    }
  }
  return transaction;
}