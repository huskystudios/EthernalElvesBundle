import { useEffect, useState } from "react";
import { getCurrentWalletConnected, connectWallet } from "../utils/interact.js";
import { useMoralis, useChain } from "react-moralis";
import Web3 from "web3";
import eth from "../assets/images/eth.png"
import polygon from "../assets/images/polygon.png"

const Network = {
  1: "Ethereum",
  137: "Polygon"
}
const logo = {
  1: eth,
  137: polygon
}

const ConnectWallet = () => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const { authenticate, isAuthenticated, user, isWeb3Enabled, enableWeb3, Moralis } = useMoralis()
  const [isMetamask, setIsMetamask] = useState(false);
  const [chainId, setChainId] = useState()

  useEffect(() => {
      if (window.ethereum) {
        // use MetaMask's provider
        window.ethereum.enable(); // get permission to access accounts
    
        // detect Metamask account change
        window.ethereum.on('accountsChanged', function (accounts) {
          console.log('accountsChanges', accounts);
    
        });
    
         // detect Network account change
        window.ethereum.on('networkChanged', function(networkId){
          console.log('networkChanged', networkId);
          document.location.reload();
        });
      } else {
        console.warn(
          "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
        );
      }
  }, [])
  
  const authParams = { signingMessage: "Hi Elf, this signature is required to use the Moralis database to fetch your Elves and enable L2 when ready. The dApp will work without this step, but with limited features." }



  /* const unsubscribe = Moralis.onAccountChanged((chain) => {
     setWallet(chain)  
     // returns the new account --> ex. "0x1a2b3c4d..."
   });
   
   // Unsubscribe to onAccountChanged events
   
 */

  useEffect(() => {
    const init = async () => {
      const { address, status } = await getCurrentWalletConnected();
      setWallet(address)

      //  setStatus(status);
      addWalletListener();

    }

    isMetaMaskInstalled();
    // unsubscribe()
    init()
  }, []);


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




  useEffect(() => {

    const getChainId = async () => {
      const chain_id = await new Web3(window.ethereum).eth.getChainId()
      setChainId(chain_id)
    }

    if(walletAddress) getChainId()
 
  }, [walletAddress]);

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
    if (window.ethereum) {
      setIsMetamask(true)
    }
  }

  return (

    <>
      {isMetamask ? (
        <>
          {walletAddress.length > 0 ? (
            <div className="network-info">
              <img src={logo[chainId]} alt="currency" />
              <div className="flex flex-column">
                <span className="font-size-md">{Network[chainId]}</span>
                <span className="font-size-sm">{String(walletAddress).substring(0, 4) + "..." + String(walletAddress).substring(38)}</span>
              </div>
            </div>
          ) : (
            <button variant="light" className="btn-connect" onClick={connectWalletPressed}>
              <span>Connect</span>
            </button>
          )}

        </>

      ) : (

        <button
          variant="light"
          className="btn-connect"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = 'https://metamask.app.link/dapp/app.ethernalelves.com/';
          }}
        >Get Metamask</button>

      )}

    </>

  );
};

export default ConnectWallet;


