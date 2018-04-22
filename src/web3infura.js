// //overrides metamask v0.2 for our 1.0 version.  
//1.0 lets us use async and await instead of promises

import Web3 from 'web3';


var ws_provider = 'wss://ropsten.infura.io/LSyzSip32kjqWW2EXh4N/ws/'
    
//overrides metamask v0.2 for our v 1.0
const web3 = new Web3(new Web3.providers.WebsocketProvider(ws_provider));

export default web3;