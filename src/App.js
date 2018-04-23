import {Table, Grid, Button, Form } from 'react-bootstrap';
import React, { Component } from 'react';
import Metamaskdefined from './metamaskdefined';
//import './App.css';
import web3 from './web3';
import ipfs from './ipfs';
import ethergram from './ethergram';
import ethergraminfura from './ethergraminfura';
import akinyemi from './akinyemi.jpg';
import iconcollaboratemywork from './icon-collaborate-mywork.svg';
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
      var divStyle = {
  width: '75px'
};
      if(this.state.isMetamask){
        return <Metamaskdefined /> 
        
      }else 
      
      return (
        <div className="App">
        
    <div className="main-container">
        <section className="intro">
            <div className="container">
                <div className="row">
                    <div className="col-md-5">
                        <div className="clearfix"></div>
                        <img src="iconcollaboratemywork" style={divStyle} alt=""></img>
                        <h1 className="small-title mb8">About the Company</h1>
                        <p>
                            TIMs is a solution for entrepreneurs, financial and tax consultants, translators, tutors and everyone whose business is based upon time rate payments of remote consulting sermvices
                        </p>
                        <hr></hr>
                        <h5 className="mb8">Have a question? Speak to a tax consultant</h5>
                        <p className="mb8">Want to know the status of your VAIDS or just have general enquiries about VAIDS</p>
                        <p>
                            <i className="fa fa-phone"></i> <strong>0800-Call-VAIDS (08002255824)</strong> - Toll Free
                            <br></br>Mondays - Fridays 
                            <br></br>8am - 6pm (Excluding Public Holidays)
                        </p>
                    </div>
                    <div className="col-md-7">
                        <form method="post" action="">
                            <ul id="progressbar" className="text-center">
                                <li className="active">About the BUsiness</li>
                                <li>Nature of the Business</li>
                                <li>About Business Tax History</li>
                            </ul>
                            <fieldset>
                                <ul className="layout">
                                    <li className="full">
                                        <label for="business_name" className="required">Company/Business Name <span>*</span></label>
                                        <input type="text" name="business_name" placeholder="What is your company/business name?" value=""></input>
                                    </li>
                                    <li className="full">
                                        <label for="main_address" className="required">Main Address <span>*</span></label>
                                        <input type="text" name="main_address" placeholder="Main Address" value=""></input>
                                    </li>
                                    <li className="half">
                                        <label for="rc_number" className="required">RC Number <span>*</span></label>
                                        <input type="text" name="rc_number" placeholder="RC Number*" required="required" value=""></input>
                                    </li>
                                    <li className="half">
                                        <label for="last_name" className="required">Email <span>*</span></label>
                                        <input type="email" name="email" placeholder="Email Address*" required="required" value=""></input>
                                    </li>
                                    <li className="half">
                                        <label for="phone_number_1" className="required">Phone Number 1<span>*</span></label>
                                        <input type="tel" name="phone_number_1" placeholder="Enter Phone Number 1" required="required" value=""></input>
                                    </li>
                                    <li className="half">
                                        <label for="phone_number_2" className="">Phone Number 2</label>
                                        <input type="tel" name="phone_number_2" placeholder="Enter Phone Number 2" value=""></input>
                                    </li>
                                    <li className="full">
                                        <label for="website" className="">Website</label>
                                        <input type="text" name="website" placeholder="Website (e.g www.mybusinessname.com)?" value=""></input>
                                    </li>
                                    <li className="full">
                                        <label for="tin_number" className="required">Tax Identification Number <span>*</span></label>
                                        <input type="text" name="tin_number" placeholder="" required="required" value=""></input>
                                    </li>
                                    <li>
                                        <input type="button" name="next" className="next action-button" value="Next"></input>
                                    </li>
                                </ul>
                            </fieldset>

                            <fieldset>
                                <ul className="layout">
                                    <li className="">
                                        <label for="business_name" className="">Select Industry</label>
                                        <select className="select-multiple form-control" multiple="multiple">
                                            <option value="FS">Financial Services</option>
                                            <option value="TR">Trading</option>
                                            <option value="PS">Professional Services</option>
                                            <option value="RE">Real Estate</option>
                                            <option value="IT">Telecommunications/ICT</option>
                                            <option value="OG">Oil and Gas</option>
                                            <option value="MG">Manufacturing</option>
                                        </select>
                                    </li>
                                    <li className="full">
                                        <label for="other_business" className="">Others (Specify)</label>
                                        <input type="text" name="other_business" placeholder="" value=""></input>
                                    </li>
                                    <li className="full">
                                        <label for="business_name" className="">Select Tax Year</label>
                                        <select className="select-single form-control">
                                            <option value="">2016</option>
                                            <option value="">2015</option>
                                            <option value="">2014</option>
                                            <option value="">2013</option>
                                            <option value="">2012</option>
                                            <option value="">2011</option>
                                            <option value="">Pre 2011</option>
                                        </select>
                                    </li>
                                    <li className="full">
                                        <label for="equity" className="">Equity</label>
                                        <input type="text" name="equity" placeholder="" value=""></input>
                                    </li>
                                    <li className="full">
                                        <label for="shareholders_deposit" className="">Shareholders Deposit</label>
                                        <input type="text" name="shareholders_deposit" placeholder="" value=""></input>
                                    </li>
                                    <li className="full">
                                        <label for="preference_shares" className="">Preference Shares</label>
                                        <input type="text" name="preference_shares" placeholder="" value=""></input>
                                    </li>
                                    <li className="full">
                                        <label for="debt" className="">Debt</label>
                                        <input type="text" name="debt" placeholder="" value=""></input>
                                    </li>
                                    <li className="full">
                                        <label for="gift" className="">Gift (State Source)</label>
                                        <input type="text" name="gift" placeholder="" value=""></input>
                                    </li>
                                    <li className="full">
                                        <label for="retained_profit" className="">Retained Profit</label>
                                        <input type="text" name="retained_profit" placeholder="" value=""></input>
                                    </li>
                                    <li className="full">
                                        <label for="other_income" className="">Others (Specify)</label>
                                        <input type="text" name="other_income" placeholder="" value=""></input>
                                    </li>
                                    <li>
                                        <input type="button" name="previous" className="previous action-button-previous" value="Previous"></input>
                                        <input type="button" name="next" className="next action-button" value="Next"></input>
                                    </li>
                                </ul>
                            </fieldset>

                            <fieldset>
                                <ul className="layout">
                                    <li className="full">
                                        <label for="business_name" className="">Select Tax Year</label>
                                        <select className="select-single form-control">
                                            <option value="">2016</option>
                                            <option value="">2015</option>
                                            <option value="">2014</option>
                                            <option value="">2013</option>
                                            <option value="">2012</option>
                                            <option value="">2011</option>
                                            <option value="">Pre 2011</option>
                                        </select>
                                    </li>
                                    <li className="full">
                                        <label for="corporate_income_tax" className="">Corporate Income Tax</label>
                                        <input type="text" name="corporate_income_tax" placeholder="" value=""></input>
                                    </li>
                                    <li className="full">
                                        <label for="shareholders_deposit" className="">Capital Gains Tax</label>
                                        <input type="text" name="shareholders_deposit" placeholder="" value=""></input>
                                    </li>
                                    <li className="full">
                                        <label for="preference_shares" className="">Value Added Tax</label>
                                        <input type="text" name="preference_shares" placeholder="" value=""></input>
                                    </li>
                                    <li className="full">
                                        <label for="debt" className="">NITDA Levy</label>
                                        <input type="text" name="debt" placeholder="" value=""></input>
                                    </li>
                                    <li className="full">
                                        <label for="gift" className="">Education Tax</label>
                                        <input type="text" name="gift" placeholder="" value=""></input>
                                    </li>
                                    <li className="full">
                                        <label for="retained_profit" className="">PAYE taxes of Staff Paid</label>
                                        <input type="text" name="retained_profit" placeholder="" value=""></input>
                                    </li>
                                    <li className="full">
                                        <label for="retained_profit" className="">Vendors WHT Paid</label>
                                        <input type="text" name="retained_profit" placeholder="" value=""></input>
                                    </li>
                                    <li className="full">
                                        <label for="retained_profit" className="">Import and Excise Duties</label>
                                        <input type="text" name="retained_profit" placeholder="" value=""></input>
                                    </li>
                                    <li className="full">
                                        <label for="other_income" className="">Others (Specify)</label>
                                        <input type="text" name="other_income" placeholder="" value=""></input>
                                    </li>
                                    <li>
                                        <input type="button" name="previous" className="previous action-button-previous" value="Previous"></input>
                                        <input type="submit" name="submit" className="submit action-button" value="Submit"></input>
                                    </li>
                                </ul>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    

     </div></div>
      );
    } //render
}

export default App;

