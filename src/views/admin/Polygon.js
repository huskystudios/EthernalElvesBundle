import React from "react"
import { useState, useEffect } from "react"
import './style.css'
import {
    // getTokenSupply, 
    elvesAbi, 
    elvesContract,
    etherscan

} from "../../utils/interact"
import { useMoralis } from "react-moralis"


const Polygon = () => {

    const { Moralis } = useMoralis();
    const [tokenId, setTokenId] = useState();
    const [toWallet, setToWallet] = useState("0xe7AF77629e7ECEd41C7B7490Ca9C4788F7c385E5");
    const [sentinelDna, setSentinelDna] = useState();
    const [signature, setSignature] = useState();


    const getSignature = async () => {
    const params =  {wallet: toWallet, tokenId: tokenId, sentinel: sentinelDna}
    let response = await Moralis.Cloud.run("signForEthReturn", params)

    console.log(response)

   
    
}



  //


    

   

   

    return (
        <>


        
        <div className="d-flex flex-column text-white justify-center px-4 text-uppercase wl-dialog">
            <p>Generate Player Mint Signature</p>
            
          
            TokenId
            <div className="wl-role">
            <input type="text" value={tokenId} onChange={(e)=>setTokenId(e.target.value)}/>
            </div>
            
            <div className="wl-sig">
            Wallet Address: <br/><input type="text" value={toWallet} onChange={(e)=>setToWallet(e.target.value)}/>
            </div>

            <div className="wl-sig">
            Sentinel DNA: <br/><input type="text" value={sentinelDna} onChange={(e)=>setSentinelDna(e.target.value)}/>
            </div>


                <br/>
            <div className="d-flex flex-row justify-center">
             <button onClick={getSignature} className="btn btn-green">
                Generate Signature
            </button>
            </div>
            
         
            
         
         

        </div>        
        
        

        </>



    )
}

export default Polygon

