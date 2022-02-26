import { useEffect, useState } from "react";
import {  getCurrentWalletConnected, connectWallet} from "../utils/interact.js";
import { useMoralis, useChain } from "react-moralis";


const ConnectWallet = () => {
 
  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const {authenticate, isAuthenticated, user, isWeb3Enabled, enableWeb3, Moralis  } = useMoralis()
  const [isMetamask, setIsMetamask] = useState(false);

  const authParams = {signingMessage: "Hi Elf, this signature is required to use the Moralis database to fetch your Elves and enable L2 when ready. The dApp will work without this step, but with limited features." }



 /* const unsubscribe = Moralis.onAccountChanged((chain) => {
    setWallet(chain)  
    // returns the new account --> ex. "0x1a2b3c4d..."
  });
  
  // Unsubscribe to onAccountChanged events
  
*/
  

  useEffect(() => {
    const init = async () => {
      const {address, status} = await getCurrentWalletConnected();
     setWallet(address)
    //  setStatus(status);
    addWalletListener(); 

    }
    
    isMetaMaskInstalled();
   // unsubscribe()
    init()
}, []);

function addWalletListener() {
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        setWallet(accounts[0]);
        window.location.reload(false);
        setStatus("");
      } else {
        setWallet("");
        setStatus("🦊 Connect to Metamask using the top right button.");
      }
    });
  } else {
    setStatus(
      <p>
        {" "}
        🦊{" "}
        <a target="_blank" href={`https://metamask.io/download.html`}>
          You must install Metamask, a virtual Ethereum wallet, in your
          browser.
        </a>
      </p>
    );
  }
}


  
const connectWalletPressed = async () => {
  const walletResponse = await connectWallet();
  setWallet(walletResponse.address);
  window.location.reload(false);
/*  if(isAuthenticated){

    window.location.reload(false);
  // setStatus(user.attributes.ethAddress);
  // setWallet(user.attributes.ethAddress);
  // onSetWallet(user.attributes.ethAddress);
  // getChainInfo()
  // switchChain()
  
   
  }else{
    authenticate(authParams).then((user)=>{
    setWallet(user.attributes.ethAddress);
    onSetWallet(user.attributes.ethAddress);
    
     
  })

  }
*/

  
};



const isMetaMaskInstalled = async () => {
  if (window.ethereum){     
    setIsMetamask(true)
  }
}

return (
   
    <>
{isMetamask ? (
<>
<button variant="light" className="btn-connect" onClick={connectWalletPressed}>
{walletAddress.length > 0 ? (
  
  String(walletAddress).substring(0, 4) +
  "..." +
  String(walletAddress).substring(38)

) : (
  <span>Connect</span>
)}
</button>

</>

    ) : (

      <button 
      variant="light"
      className="btn-connect"
      onClick={(e) => {
        e.preventDefault();
        window.location.href='https://metamask.app.link/dapp/app.ethernalelves.com/';
        }}
  >Get Metamask</button>

    ) }




</>  

  );
};

export default ConnectWallet;


