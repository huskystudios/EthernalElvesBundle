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

    const { enableWeb3, isWeb3Enabled, Moralis} = useMoralis()

    const [txReceipt, setTxReceipt] = useState();
    const [loading, setLoading] = useState(true);
    // const query = useQuery();
    // const wlflag = query.get("wl");
    // const address = query.get("address");
    // const signature = query.get("signature");

    const [max, setMax] = useState(6666);
    const [supply, setSupply] = useState(0);
    const [init, setInit] = useState(3300);
    const [currentPrice, setCurrentPrice] = useState(0);

    const [status, setStatus] = useState("");


   // let mintcredentials = {role: wlflag, address:address, signature: signature}
   // let wl = wlflag ? true : false;

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

            if(!isWeb3Enabled){
                
                enableWeb3() 
                getMoralisTokenSupply()
            
            }else{
                getMoralisTokenSupply()
            }
      console.log(isWeb3Enabled)
       
    }, [isWeb3Enabled])
    

    const getMoralisTokenSupply = async ()=>{
         
        setStatus("getting current price")
        const price = await Moralis.executeFunction(readOptions("getMintPriceLevel"));
        setStatus("getting total supply")
        const totalSupply = await Moralis.executeFunction(readOptions("totalSupply"));
        setStatus("done")
       
        setSupply(totalSupply);
        setCurrentPrice(price);
        setLoading(false)
              } 
 

 
    
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
        
      
        <>
        
        <div className="d-flex flex-column text-white justify-center px-4 text-uppercase dialog">
            <p>SUMMON ETHERNAL ELF</p>
           
           
            <div className="d-flex flex-row justify-center">
             <button onClick={moralisMint} className="btn btn-green">
           
             Mint with {Moralis.Units.FromWei(currentPrice.mintCost)} $REN
            </button>
            </div>
        <div className="mint-instructions">
            <p>Elves Minted: {parseInt(supply)}/{max}</p>
               
            <p> $REN will be required to spawn the next set of elves.</p>
               
            </div>
    
            {tooltip.show && showAlert(tooltip.value)}
       
        
       
            <p>MINT TABLE</p>
        <div className="table mint-table">
            <table>
                <thead>
                    <tr>
                        <th>Total Supply Under</th>
                        <th>$REN required</th>
                        <th>Starting Level</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>4000</td>
                        <td>60</td>
                        <td>3</td>
                    </tr>
                    <tr>
                        <td>4500</td>
                        <td>180</td>
                        <td>5</td>
                    </tr>
                    <tr>
                        <td>5000</td>
                        <td>360</td>
                        <td>15</td>
                    </tr>
                    <tr>
                        <td>5500</td>
                        <td>600</td>
                        <td>25</td>
                    </tr>
                    <tr>
                        <td>6000</td>
                        <td>900</td>
                        <td>35</td>
                    </tr>
                    <tr>
                        <td>6333</td>
                        <td>1800</td>
                        <td>45</td>
                    </tr>
                    <tr>
                        <td>6666</td>
                        <td>2700</td>
                        <td>60</td>
                    </tr>

                </tbody>
            </table>


        </div>
        </div>



       
      
        </>



    ) : <Loader text={status} />
}

export default Mint

