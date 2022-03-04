import { useEffect, useState } from "react";
import {  getCurrentWalletConnected, connectWallet} from "../utils/interact.js";
import { useMoralis, useChain } from "react-moralis";


const Authenticate = () => {
 
  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const {authenticate, isAuthenticated, user, isWeb3Enabled, enableWeb3, Moralis  } = useMoralis()
  const [isMetamask, setIsMetamask] = useState(false);

  const authParams = {signingMessage: "Hi Elf, this signature is required to confirm that you own the wallet you are trying to connect with. We need to know this to prevent misuse of gasless functions" }

  const { authenticate, isAuthenticated, user } = useMoralis();



function handleMoralisError(err) {
  switch (err.code) {
    case Moralis.Error.INVALID_SESSION_TOKEN:
      Moralis.User.logOut();
      // If web browser, render a log in screen
      // If Express.js, redirect the user to the log in route
      console.log("ok")
      break;

    // Other Moralis API errors that you want to explicitly handle
  }
}


  


  
const connectWalletPressed = async () => {
  
  if(isAuthenticated){

    window.location.reload(false);

  
   
  }else{
    authenticate(authParams).then((user)=>{
    setWallet(user.attributes.ethAddress);
    onSetWallet(user.get("ethAddress"));
    
     
  })

  }


  
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

export default Authenticate;


