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

        const Elves = Moralis.Object.extend("Elves");
        
        let query = new Moralis.Query(Elves);  
        query.equalTo("token_id", parseInt(tokenId));
        const res = await query.first();

        const pElves = await polygonContract.methods.elves(tokenId).call();
        const eElves = await nftContract.methods.elves(tokenId).call();
        let chain = "";

        if(pElves.owner === eElves.owner) {
            chain = "polygon"
        }

        res.set("chain", chain);
        res.save().then((obj) => {
            let message = `${tokenId} is now on ${chain}`
            alert(message)
               console.log("object saved")
       
               console.log(chain, pElves.owner, eElves.owner)

            console.log("saved")
        })
    }


   

    return (
        <>


        
        <div className="d-flex flex-column text-white justify-center px-4 text-uppercase wl-dialog">
            
          
            Locate and save chain
            <div className="wl-role">
            <input type="text" value={tokenId} onChange={(e)=>setTokenId(e.target.value)}/>
            </div>
            
            

            <button onClick={locateElf} className="btn btn-blue">
           Update Chain
            </button>


            

         

        </div>        
        
        

        </>



    )
}

export default Polygon

