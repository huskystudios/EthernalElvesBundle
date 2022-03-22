import { useEffect, useState } from "react";
import {  getCurrentWalletConnected, connectWallet} from "../utils/interact.js";
import { useMoralis, useChain } from "react-moralis";
import eth from "../assets/images/eth.png"
import polygon from "../assets/images/polygon.png"
import Modal from "../components/Modal/index.js";

const Network = {
  1: "Ethereum",
  137: "Polygon"
}
const logo = {
  1: eth,
  137: polygon
}

const mainnet = "0x1"; //Ethereum Mainnet
const polygonS ="0x89"//PolygonChain


const Authenticate = () => {
 
  //State variables
  const {authenticate, isAuthenticated, user, setUserData, userError, isUserUpdating, logout,  isWeb3Enabled, enableWeb3, Moralis  } = useMoralis()
 
  const authParams = {signingMessage: "Hi Elf, this signature is required to confirm that you own the wallet you are trying to connect with. We need to know this to prevent misuse of gasless functions" }
  const { switchNetwork, chainId, chain, account } = useChain();
  const [chainInt, setChainInt] = useState() 
  const [chainModal, setChainModal] = useState(false)
  
  
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

const switchChains = async () => {
  
  await switchNetwork("0x1")
  
  setChainModal(!chainModal)
  console.log(chainId)
 
}

function addWalletListener() {
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {      
        window.location.reload(false);
        logout()	
      }
    });
  }
}






useEffect(() => {
  addWalletListener()
}, [])



if (!isAuthenticated) {
  return (
    <>
    <button    
    className="btn-connect"onClick={()=> authenticate(authParams) }>Connect Wallet</button>
    
    </>
  );
}

return (
  <>
<button  className="btn-connect"onClick={()=> logout()}>Logout ...{String(user.get("ethAddress")).substring(38)}</button>
</>

);
};

export default Authenticate;


