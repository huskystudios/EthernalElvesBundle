import React from "react"
import { useState, useEffect } from "react"
import {elvesAbi, elvesContract} from "../utils/interact"
import {useMoralis} from "react-moralis"
import {
  getCurrentWalletConnected, //import here

} from "../utils/interact.js";


const Withdraw = () => {

  const { Moralis } = useMoralis();
  const [tooltip, setTooltip] = useState("");
  const [balance, setBalance] = useState(0);
  const [miren, setMiren] = useState(0);
  const [txReceipt, setTxReceipt] = useState();

const getRenBalance = async (address) => {
  await Moralis.enableWeb3();
  const renBalanceContract = await Moralis.Cloud.run("getBalance", {address});//in contract
  const renBalanceWallet = await Moralis.Cloud.run("getMiren", {address});//in wallet

  
  setBalance(renBalanceContract/1000000000000000000);
  setMiren(renBalanceWallet/1000000000000000000);

}


useEffect( () => {
  const init = async () => {
  const {address} = await getCurrentWalletConnected();
  getRenBalance(address)
  }

  init();
  
},[txReceipt])


   

    const showTooltip = (content) => {
      if(content === "") return <></>
      return (
          <div className="ren-tooltip">
              {/* <h3>{title}</h3> */}
             {content} 
          </div>
      )
  }


    


    const withdrawTokenBalance = async () => {

      await Moralis.enableWeb3();
      
      const options = {
        contractAddress: elvesContract,
        functionName: "withdrawTokenBalance",
        abi: elvesAbi.abi   ,
        awaitReceipt: false // should be switched to false
      };
      
      
      const tx = await Moralis.executeFunction(options);       
      
      tx.on("transactionHash", (hash) => { 
            console.log(hash)  
      })
     

      tx.on("receipt", (receipt) => { 
        setTxReceipt(receipt)
        getRenBalance()
        console.log(receipt)
      })
                  
    }  

  
    return (
    <>
    <button 
    onMouseEnter={() => setTooltip(`Claim ${balance} $REN?`)}
    onMouseLeave={() => setTooltip("")} 
    onClick={withdrawTokenBalance}> {miren + balance} $REN</button>
     {showTooltip(tooltip)}
    </>
    )
}

export default Withdraw