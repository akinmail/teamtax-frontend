// //overrides metamask v0.2 for our 1.0 version.  
//1.0 lets us use async and await instead of promises

import Web3 from 'web3';
//overrides metamask v0.2 for our v 1.0
var web3;
if (typeof window.web3 == 'undefined') {
    // You have a web3 browser! Continue below!
         alert("please install metamask chrome extension and make sure to signin if you already have it installed")
         
  } else{
      web3 = new Web3(window.web3.currentProvider);

  }



export default web3;