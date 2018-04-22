import web3 from './web3';

//access our local copy to contract deployed on Ropsten testnet
//use your own contract address
const address = '0x3c631df844c08c2a2b460aedab741d43d77eb53c';
//use the ABI from your contract
const abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_imageLink",
				"type": "bytes32"
			},
			{
				"name": "_postTextLink",
				"type": "bytes32"
			},
			{
				"name": "_hashtag1",
				"type": "string"
			},
			{
				"name": "_hashtag2",
				"type": "string"
			},
			{
				"name": "_hashtag3",
				"type": "string"
			}
		],
		"name": "makeGram",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_posterAddress",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_userName",
				"type": "string"
			},
			{
				"indexed": true,
				"name": "_postId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "_postTextLink",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "_imageLink",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "_hashtag1",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_hashtag2",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_hashtag3",
				"type": "string"
			}
		],
		"name": "gram",
		"type": "event"
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