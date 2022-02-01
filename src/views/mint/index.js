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
    const [txReceipt, setTxReceipt] = useState();
    const [loading, setLoading] = useState(true);
    const query = useQuery();
    const wlflag = query.get("wl");
    const address = query.get("address");
    const signature = query.get("signature");

    const [max, setMax] = useState(0);
    const [supply, setSupply] = useState(0);
    const [init, setInit] = useState(0);
    const [currentPrice, setCurrentPrice] = useState(0);

    const [status, setStatus] = useState("");


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
            msgValue: parseInt(supply) <= parseInt(init) ?  Moralis.Units.ETH(Moralis.Units.FromWei(currentPrice)) : null,
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



    function readOptions(contractMethod) {

  const options = {
            contractAddress: elvesContract,
            functionName: contractMethod,
            abi: elvesAbi.abi
    
        };

return options
    }


   

    useEffect(() => {   
         
    const getMoralisTokenSupply = async ()=>{

      await Moralis.enableWeb3();     
           
      setStatus("getting current supply")
      const initsupply = await Moralis.executeFunction(readOptions("INIT_SUPPLY"));
      const maxSupply = await Moralis.executeFunction(readOptions("maxSupply"));
      setStatus("getting current price")
      const price = await Moralis.executeFunction(readOptions("price"));
      setStatus("getting total supply")
      const totalSupply = await Moralis.executeFunction(readOptions("totalSupply"));
      setStatus("done")
      setInit(initsupply);
      setMax(maxSupply);
      setSupply(totalSupply);
      setCurrentPrice(price);

      

            setLoading(false)
            } 
      
        getMoralisTokenSupply()
    }, [txReceipt])
    
 

 
    
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
             <button onClick={()=> console.log("wait up!")/*moralisMint*/} className="btn btn-red">
              public sale not active
             {/*parseInt(supply) <= parseInt(init) ? `Mint with ${ Moralis.Units.FromWei(currentPrice)} Eth` : `Mint with ${ Moralis.Units.FromWei(currentPrice)} $REN`*/}
            </button>
            </div>
        <div className="mint-instructions">
            <p>Elves Minted: {supply}/{max}</p>
                <p>the first {init} elves will be minted with Eth.</p>
                <p>$REN will be required to spawn the next set of elves. Look up the cost in FAQ's.</p>
            </div>
       
            {tooltip.show && showAlert(tooltip.value)}
        </div>        
      
        </>



    ) : <Loader text={status} />
}

export default Mint

