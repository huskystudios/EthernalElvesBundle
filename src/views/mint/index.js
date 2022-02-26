import React from "react"
import { useEffect, useState } from "react";
import './style.css'
import {
    getTokenSupply, 
    getMintPriceLevel,
    mint

} from "../../utils/interact"
import { useMoralis } from "react-moralis"
import Loader from "../../components/Loader"

const Mint = () => {

    const {Moralis} = useMoralis()

    const [txReceipt, setTxReceipt] = useState();
    const [loading, setLoading] = useState(true);
    
    const max = 6666;

    const [supply, setSupply] = useState(5000);
   
    const [currentPrice, setCurrentPrice] = useState(600);

    const [status, setStatus] = useState("");

    const [alert, setAlert] = useState({show: false, value: null})



    const [tooltip, setTooltip] = useState({
        show: false,
        value: {title: "...", content: "..."}
    })


 

 const mintElf = async () => {

      
    let {success, status, txHash} = await mint()

    status && setAlert({show: true, value: {title: "Tx Sent", content: (status)}})
    success && setTxReceipt(txHash)

    }




    useEffect(() => {   

        getTokenSupplyFromChain()

       
    }, [])
    

    const getTokenSupplyFromChain = async ()=>{
        
        setStatus("getting current price")
        setSupply(await getTokenSupply());    
        setStatus("getting total supply")
        setCurrentPrice(await getMintPriceLevel())
        setStatus("done")   
       
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
           
             <button className="btn btn-green" onClick={mintElf}>
            {currentPrice.mintCost && <>Mint with {Moralis.Units.FromWei(currentPrice.mintCost)} $REN</>} 
            </button>
            
            </div>
          
                     
        <div className="mint-instructions">
           {supply && <p>Elves Minted: {parseInt(supply)}/{max}</p>}
               
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

