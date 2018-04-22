import {Table, Grid, Button, Form } from 'react-bootstrap';
import React, { Component } from 'react';
import Metamaskdefined from './metamaskdefined';
import './App.css';
import web3 from './web3';
import ipfs from './ipfs';
import ethergram from './ethergram';
import ethergraminfura from './ethergraminfura';
import akinyemi from './akinyemi.jpg';
import { Connect } from 'uport-connect'
import axios from 'axios';

const uport = new Connect('MyDApp')
/*const uport = new Connect('MyDApp', {
  clientId: 'YOUR APPLICATION ID FROM APP MANAGER',
  signer: SimpleSigner('YOUR SIGNING KEY FROM APP MANAGER')
})*/
var ethers = require('ethers');



class App extends Component {
 
 constructor(props){
   super(props)
   this.state = {
      ipfsHash:null,
      buffer:'',
      ethAddress:'',
      blockNumber:'',
      transactionHash:'',
      gasUsed:'',
      txReceipt: '',
      textInput: '',
      events: [],
      isMetamask:false 
    };

 }

 
  componentWillMount(){
    const req = { requested: ['name', 'country','taxid'], verified: ['GithubUser']}
      uport.requestCredentials().then((credentials) => {
  console.log(credentials)
  this.state.taxId=credentials.taxid
})


    if (typeof ethergram == 'undefined') {
    // You have a web3 browser! Continue below!
      this.state.isMetamask=true;         
  } 
        console.log(ethergram)
    console.log(ethergraminfura)
      ethergraminfura.events.gram({
    fromBlock: 0
}, function(error, event){ 
  if (error) {
          console.log(error)
        return;
        }
  console.log(event); })
.on('data', function(event){
    console.log(event); // same results as the optional callback above
})
.on('changed', function(event){
    // remove event from local database
})
.on('error', console.error);
      
  }
    
   str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
    captureFile(event){
        event.stopPropagation()
        event.preventDefault()
        const file = event.target.files[0]
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => this.convertToBuffer(reader)    
      }

    async convertToBuffer(reader){
      //file is converted to a buffer to prepare for uploading to IPFS
        const buffer = await Buffer.from(reader.result);
      //set this buffer -using es6 syntax
        this.state.buffer =buffer;
    };

    async onClick (){

    try{
        this.state.blockNumber="waiting..";
        this.state.gasUsed="waiting...";

        // get Transaction Receipt in console on click
        // See: https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt
        await web3.eth.getTransactionReceipt(this.state.transactionHash, (err, txReceipt)=>{
          console.log(err,txReceipt);
          this.state.txReceipt=txReceipt;
        }); //await for getTransactionReceipt

        await this.setState({blockNumber: this.state.txReceipt.blockNumber});
        await this.setState({gasUsed: this.state.txReceipt.gasUsed});    
      } //try
    catch(error){
        console.log(error);
      } //catch
  } //onClick

    async onSubmit(event) {
      event.preventDefault();
      //event.
      //bring in user's metamask account address
      const accounts = await web3.eth.getAccounts();
     
      console.log('Sending from Metamask account: ' + accounts[0]);

      //obtain contract address from ethergram.js
      const ethAddress= await ethergram.options.address;
      this.state.ethAddress=ethAddress;

      //save document to IPFS,return its hash#, and set hash# to state
      //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 
      console.log(this.state.buffer)
      console.log(ethergram)
      var obj = {"taxid":"akinyemi", "firstname":"akin"};
      axios.post('http://teamtax-backend.herokuapp.com/data', this.state)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

      await ipfs.add(this.state, (err, ipfsHash) => {
        console.log(err,ipfsHash);
        if (err) {
          console.log(err)
        return;
        }
        //setState by setting ipfsHash to ipfsHash[0].hash 
        this.state.ipfsHash=ipfsHash[0].hash;

        // call Ethereum contract method "sendHash" and .send IPFS hash to etheruem contract 
        //return the transaction hash from the ethereum contract
        //see, this https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send
        console.log(this.state.ipfsHash);
        var a =this.web3StringToBytes32(this.state.ipfsHash);
        var b=this.web3StringToBytes32(this.state.textInput.split("#")[0]);
        var hashtag1=web3.utils.fromAscii(this.state.textInput.split("#")[1]);
        var hashtag2=web3.utils.fromAscii(this.state.textInput.split("#")[2]);
        var hashtag3=web3.utils.fromAscii(this.state.textInput.split("#")[3]);
        console.log('a=',a)
        console.log('b',b)
        ethergram.methods.makeGram("0x00",'0x00',hashtag1,hashtag2,hashtag3).send({
          from: accounts[0] 
        }, (error, transactionHash) => {
          console.log(transactionHash);
          this.state.transactionHash=transactionHash;
        }); //ethergram 
      }) //await ipfs.add 
    }; //onSubmit 

    handleTextChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  web3StringToBytes32(text) {
    var result = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(text));
    //while (result.length < 66) { result += '0'; }
    //if (result.length !== 66) { throw new Error("invalid web3 implicit bytes32"); }
    return result.substring(0,66);
}
    
   
  
    render() {
      if(this.state.isMetamask){
        return <Metamaskdefined /> 
        
      }else 
      
      return (
        <div className="App">
        
          <div className="header">
      <div className="container">
        <div className="row">
          <div className="col-xs-2">
            <h1>TeamTax</h1>
          </div>
          <div className="col-xs-7">
          </div>
          
          <div className="col-xs-2">
            <h1 className="menu">menu</h1>
          </div>
        </div>
      </div>
    </div>
   

  <div className='nav-menu'>
    <div className='container-nav'>
      <ul>
        
      </ul>
      <ul>
        <a href="mailto:akinyemi.akindele95@gmail.com"><li>Tax Calculator</li></a>
        <a href="https://twitter.com/akinmail1"><li>Tax Credit</li></a>
      </ul>
    </div>
  </div>
    
    <Form className="newPost" onSubmit={this.onSubmit.bind(this)}>
      <div className="container">
        <div className="post">
          <input type="text" name="taxid" placeholder="Tax identification No" value={this.state.value} onChange={this.handleTextChange.bind(this)}></input>
          <br></br>
          <input type="text" name="companyname" placeholder="Company Name" value={this.state.value} onChange={this.handleTextChange.bind(this)}></input>
          <br></br>
          <input type="text" name="rcnumber" placeholder="RC Number" value={this.state.value} onChange={this.handleTextChange.bind(this)}></input>
          <br></br>
          <input type="text" name="address" placeholder="Address" value={this.state.value} onChange={this.handleTextChange.bind(this)}></input>
          <br></br>
          <input type="text" name="mainaddress" placeholder="mainAddress" value={this.state.value} onChange={this.handleTextChange.bind(this)}></input>
          <br></br>
          <input type="text" name="telephoneno1" placeholder="Telephone No1" value={this.state.value} onChange={this.handleTextChange.bind(this)}></input>
          <br></br>
          <input type="text" name="telephoneno2" placeholder="Telephone No2" value={this.state.value} onChange={this.handleTextChange.bind(this)}></input>
          <br></br>
          <input type="email" name="email" placeholder="Email" value={this.state.value} onChange={this.handleTextChange.bind(this)}></input>
          <br></br>
          <input type="text" name="website" placeholder="Website" value={this.state.value} onChange={this.handleTextChange.bind(this)}></input>
          <br></br>
          <input type="text" name="listofdirectors" placeholder="List of Directors" value={this.state.value} onChange={this.handleTextChange.bind(this)}></input>
          <br></br>
          <input type="text" name="natureofbusiness" placeholder="Nature of Business" value={this.state.value} onChange={this.handleTextChange.bind(this)}></input>
          
          
          <div className="button-holder">
            <button type="submit" className="btn-post">POST</button>
          </div>
        </div>
      </div>
    </Form>
    <div className="posts">
      <div className="container">

    {this.state.events.map((item,i) => 
    
      
        <div className="post">
          <img className="avatar" src="https://s3.amazonaws.com/codecademy-content/courses/jquery+jfiddle+test/feedster/profile-teal.svg"/>
          <h3>Ivory Breath</h3>
          <p>Buffalo bulgogi, are you kidding me!?! Do yourself a favor and head to this restaurant.</p>
          <button className="btn">+1</button>
        </div>
      
    
    
    
    )}

    </div>
    </div>


     </div>
      );
    } //render
}

export default App;

