import React from "react"
import { useEffect, useMemo, useState } from "react";
import './style.css'
import {
    // getTokenSupply, 
    elvesAbi, 
    elvesContract,
    etherscan

} from "../../utils/interact"
import { useMoralis } from "react-moralis"
import WhitelistMint from "./whitelist"
import Loader from "../../components/Loader"
import {
    BrowserRouter as Router,
    Link,
    useLocation
  } from "react-router-dom";


  function useQuery() {
    const { search } = useLocation();
    
    return useMemo(() => new URLSearchParams(search), [search]);
    }

const Mint = () => {

    const { Moralis } = useMoralis();
    const [supply, setSupply] = useState("...");
    const [txReceipt, setTxReceipt] = useState();
    const [loading, setLoading] = useState(false);
    const query = useQuery();
    const wlflag = query.get("wl");
    const address = query.get("address");
    const signature = query.get("signature");

    let mintcredentials = {role: wlflag, address:address, signature: signature}

    let wl = wlflag ? true : false;

    const [tooltip, setTooltip] = useState({
        show: false,
        value: {title: "...", content: "..."}
    })
   

    const moralisMint = async () => {

        await Moralis.enableWeb3();
            
        const options = {
            contractAddress: elvesContract,
            functionName: "mint",
            abi: elvesAbi.abi   ,
            msgValue: Moralis.Units.ETH(Moralis.Units.FromWei(".088")), //parseInt(supply.current) <= parseInt(supply.initial) ?  Moralis.Units.ETH(Moralis.Units.FromWei(supply.mintPrice)) : null,
            awaitReceipt: false // should be switched to false
          };
          
          const tx = await Moralis.executeFunction(options);
          
          tx.on("transactionHash", (hash) => { 

            setTooltip({show: true, value: {
                title: "Tx Sent", 
                content: (<>✅ Check out your transaction on <a target="_blank" rel="noreferrer" href={`https://${etherscan}.io/tx/${hash}`}>Etherscan</a> </>)            
          }})
            
        })
          
          tx.on("receipt", (receipt) => { 
              setTxReceipt(receipt) 
             
              setTooltip({show: true, value: {
                  title: "Mint Successful", 
                  content: `Elf#${receipt.events.Transfer.returnValues.tokenId} has been minted`            
            }})
        
        })
                  
          

    }

    
 /*   useEffect(() => {      
        
        const getMoralisTokenSupply = async ()=>{
            await Moralis.enableWeb3();
            //let tokenSupply = await getTokenSupply()      use as a failsafe
            const response = await Moralis.Cloud.run("getTokenSupply");
            console.log(response)
            setSupply({current: response.supply, total: response.maxSupply, initial: response.initialSupply, mintPrice: response.mintPrice})
            setLoading(false)
        } 
        getMoralisTokenSupply()       
        
    }, [txReceipt]);

  */
    
    const showAlert = ({title, content}) => {

        return (
            <div className="alert">
                <h3>{title}</h3>
                <pre>{content}</pre>
                <button className="btn btn-red" onClick={()=>setTooltip({show: false})}>close</button>
            </div>
        )
    }
   
   
    
        
    

                        


    return !loading ? (
        
        wl ? <WhitelistMint mintcreds={mintcredentials}/> :
        <>
        
        <div className="d-flex flex-column text-white justify-center px-4 text-uppercase dialog">
            <p>SUMMON ETHERNAL ELF</p>
           
           
            <div className="d-flex flex-row justify-center">
             <button onClick={moralisMint} className="btn btn-green">
                 Mint with .088 ETH
             {/*parseInt(supply.current) <= parseInt(supply.initial) ? `Mint with ${ Moralis.Units.FromWei(supply.mintPrice)} Eth` : `Mint with ${ Moralis.Units.FromWei(supply.mintPrice)} $REN`*/}
            </button>
            </div>
      {/*   <div className="mint-instructions">
            <p>Elves Minted: {supply.current}/{supply.total}</p>
                <p>the first {supply.initial} elves will be minted with Eth.</p>
                <p>$REN will be required to spawn the next set of elves. Look up the cost in FAQ's.</p>
            </div>
    */}   
            {tooltip.show && showAlert(tooltip.value)}
        </div>        
      
        </>



    ) : <Loader />
}

export default Mint

