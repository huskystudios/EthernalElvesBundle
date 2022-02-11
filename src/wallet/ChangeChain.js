import { useEffect, useState } from "react";
import { useMoralis, useChain} from "react-moralis";
import "./style.css"

const ToggleChain = () => {
 
  //State variables
  
  const { switchNetwork, chainId, chain, account } = useChain();

  const mainnet = "0x1"; //Ethereum Mainnet
  const polygon ="0x89"//PolygonChain

const switchChain = async () => {

    
  let toggle  

  if(chainId === mainnet){
    toggle = polygon   
  }else if (chainId === polygon){

    toggle = mainnet  
  } 

  await switchNetwork(toggle);
};


return (
   
 <div className="chain">
      <button onClick={switchChain}>Chain: {chain && chain.shortName}</button>
 </div>

)


    
};

export default ToggleChain;


