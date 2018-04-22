import React, { Component } from 'react';
import installmetamask from './nometamask.png';

class Metamaskdefined extends Component {
    render() {
        return(
            <div >
           <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"><img src={installmetamask}/></a>

            </div>
        )
        
    }
}

export default Metamaskdefined;