import { useEffect, useState } from "react";
import {
  getCurrentWalletConnected, //import here
  connectWallet
} from "../utils/interact.js";
import { useMoralis } from "react-moralis";


const ConnectWallet = ({onSetWallet, setStatus}) => {
 
  //State variables
  const [walletAddress, setWallet] = useState("");


  
  const [isMetamask, setIsMetamask] = useState(false);
  const { authenticate, isAuthenticated } = useMoralis();


  useEffect(() => {
    const init = async () => {
      const {address, status} = await getCurrentWalletConnected();
      onSetWallet(address);
      setWallet(address)
      setStatus(status);
      addWalletListener(); 
      isMetaMaskInstalled();
    }
    init()
}, []);

  
const connectWalletPressed = async () => {
  const walletResponse = await connectWallet();
  setStatus(walletResponse.status);
  setWallet(walletResponse.address);
  onSetWallet(walletResponse.address);
  if(!isAuthenticated){
    authenticate({ signingMessage: "Hi Elf, this signature is to use the Moralis database to fetch your Elves. The app will work without this step, but with limited features." })
  }
  window.location.reload(false);

  
};

function addWalletListener() {
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        setWallet(accounts[0]);
        onSetWallet(accounts[0]);
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
        <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
          You must install Metamask, a virtual Ethereum wallet, in your
          browser.
        </a>
      </p>
    );
  }
}

const isMetaMaskInstalled = async () => {
  if (window.ethereum){     
    setIsMetamask(window.ethereum.isMetaMask)
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


