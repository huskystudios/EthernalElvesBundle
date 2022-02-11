import { useEffect, useState } from "react";
//import {  getCurrentWalletConnected, connectWallet} from "../utils/interact.js";
import { useMoralis, useChain } from "react-moralis";


const ConnectWallet = ({onSetWallet, setStatus}) => {
 
  //State variables
  const [walletAddress, setWallet] = useState("");
  const {authenticate, isAuthenticated, user, isWeb3Enabled, enableWeb3, Moralis  } = useMoralis()
  const [isMetamask, setIsMetamask] = useState(false);

  const authParams = {signingMessage: "Hi Elf, this signature is required to use the Moralis database to fetch your Elves and enable L2 when ready. The dApp will work without this step, but with limited features." }



  

  useEffect(() => {
    const init = async () => {
    //  const {address, status} = await getCurrentWalletConnected();
   //   onSetWallet(address);
   //   setWallet(address)
    //  setStatus(status);
     // addWalletListener(); 
     if(!isWeb3Enabled){await enableWeb3()}
     const currentUser = Moralis.User.current();

       
   //  Moralis.User.enableUnsafeCurrentUser()

    
      if (currentUser) {
      
        setWallet(currentUser.attributes.ethAddress)  
      } else {
        authenticate(authParams).then((user)=>{
         
          setWallet(user.attributes.ethAddress);
          onSetWallet(user.attributes.ethAddress);    
           
          })
      }


  
    
     
  }
    isMetaMaskInstalled();
    init()
}, []);

  
const connectWalletPressed = async () => {
 // const walletResponse = await connectWallet();
 
  if(isAuthenticated){

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


