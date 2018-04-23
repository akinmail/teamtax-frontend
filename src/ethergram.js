import web3 from './web3';

//access our local copy to contract deployed on Ropsten testnet
//use your own contract address
const address = '0x45471f3eec57e6c46b5aa1144d4054fcdd7d9577';
//use the ABI from your contract
const abi = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "_taxid",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "_hash",
          "type": "string"
        }
      ],
      "name": "vaids",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_taxid",
          "type": "string"
        },
        {
          "name": "_hash",
          "type": "string"
        }
      ],
      "name": "createVaids",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
var x;
if (typeof window.web3 == 'undefined') {
    // You have a web3 browser! Continue below!
         alert("please install metamask chrome extension and make sure to signin if you already have it installed")
         
  } else{
      
	  x = new web3.eth.Contract(abi, address)
  }

export default x;