import React from "react"
import { useState, useEffect } from "react"
import {elvesAbi, elvesContract, withdrawTokenBalance} from "../utils/interact"
import {useMoralis, useChain} from "react-moralis"


const Withdraw = () => {

  const { Moralis } = useMoralis();
  const { account } = useChain();
  const [tooltip, setTooltip] = useState("");
  const [balance, setBalance] = useState(0);
  const [miren, setMiren] = useState(0);


const getRenBalance = async (address) => {
 
  const renBalanceContract = await Moralis.Cloud.run("getBalance", {address});//in contract
  const renBalanceWallet = await Moralis.Cloud.run("getMiren", {address});//in wallet
  
  setBalance(renBalanceContract/1000000000000000000);
  setMiren(renBalanceWallet/1000000000000000000);

}


useEffect( () => {
  const init = async () => {
  
    account &&  await getRenBalance(account)
  }

  init();
  
},[account])



    const showTooltip = (content) => {
      if(content === "") return <></>
      return (
          <div className="ren-tooltip">
              {/* <h3>{title}</h3> */}
             {content} 
          </div>
      )
  }

  
    return (
    <div className="search">
    <button 
    onMouseEnter={() => setTooltip(`Claim ${balance} $REN?`)}
    onMouseLeave={() => setTooltip("")} 
    onClick={withdrawTokenBalance}> {miren + balance} $REN</button>
     {showTooltip(tooltip)}
    </div>
    )
}

export default Withdraw