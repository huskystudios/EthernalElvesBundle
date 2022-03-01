import React from "react"
import { useState, useEffect } from "react"
import './style.css'
import {
    web3,polyweb3, polygonContract, nftContract

} from "../../utils/interact"
import { useMoralis } from "react-moralis"


const Polygon = () => {

    const { Moralis } = useMoralis();
    const [tokenId, setTokenId] = useState(0);

    const locateElf = async () => {

        const pElves = await polygonContract.methods.elves(tokenId).call();
        const eElves = await nftContract.methods.elves(tokenId).call();
        let chain = "";

        if(pElves.owner === eElves.owner) {
            chain = "polygon"
        }
    
    }    

   

   

    return (
        <>


        
        <div className="d-flex flex-column text-white justify-center px-4 text-uppercase wl-dialog">
            <p>Finding Neo</p>
            
          
            TokenId
            <div className="wl-role">
            <input type="text" value={tokenId} onChange={(e)=>setTokenId(e.target.value)}/>
            </div>
            
            

            <button onClick={locateElf} className="btn btn-blue">
            find that beast
            </button>


            

         

        </div>        
        
        

        </>



    )
}

export default Polygon

