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


const Signature = () => {

    const { Moralis } = useMoralis();
    const [roleIndex, setRoleIndex] = useState();
    const [toWallet, setToWallet] = useState();
    const [signature, setSignature] = useState();




    const getSignature = async () => {
    const params =  {address: toWallet, roleIndex: roleIndex}
    setSignature(await Moralis.Cloud.run("getSignature", params))
    
}



  


    

   

   

    return (
        <>


        
        <div className="d-flex flex-column text-white justify-center px-4 text-uppercase wl-dialog">
            <p>Generate Player Mint Signature</p>
            
          
            Role Index: 
            <div className="wl-role">
            <input type="text" value={roleIndex} onChange={(e)=>setRoleIndex(e.target.value)}/>
            </div>
            
            <div className="wl-sig">
            Wallet Address: <br/><input type="text" value={toWallet} onChange={(e)=>setToWallet(e.target.value)}/>
            </div>
                <br/>
            <div className="d-flex flex-row justify-center">
             <button onClick={getSignature} className="btn btn-green">
                Generate Signature
            </button>
            </div>
            <br/>
            <textarea name="Text1" cols="40" rows="5" type="text" value={signature} />
         
            
         
         

        </div>        
        
        

        </>



    )
}

export default Signature

