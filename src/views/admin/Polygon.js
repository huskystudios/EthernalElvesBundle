import React from "react"
import { useState, useEffect } from "react"
import './style.css'
import {
    web3,polyweb3, polygonContract, nftContract, lookupMultipleElves

} from "../../utils/interact"
import { useMoralis } from "react-moralis"
import Lookup from "../profile/Lookup"

const Polygon = () => {

    const { Moralis } = useMoralis();
    const [tokenId, setTokenId] = useState(0);
    const [showMetaImage, setShowMetaImage] = useState(false)  
    const [elfObject, setElfObject] = useState(null)
    const [showModal, setShowModal] = useState(true)

    const getMeta = async () => {

        let chain = "eth"
        const Elves = Moralis.Object.extend("Elves");
        let query = new Moralis.Query(Elves);
        query.equalTo("token_id", parseInt(tokenId));
        const response = await query.find();
      
        if(response[0].attributes.chain === "polygon"){   
          chain="polygon"
        }
      
        const lookupParams = {array: [parseInt(tokenId)], chain: chain}
        const data = await lookupMultipleElves(lookupParams)
      
        setElfObject(data[0])  
        setShowMetaImage(true)
        setShowModal(!showModal)
        
      }

    const locateElf = async () => {

        const Elves = Moralis.Object.extend("Elves");
        
        let query = new Moralis.Query(Elves);  
        query.equalTo("token_id", parseInt(tokenId));
        const res = await query.first();

        const pElves = await polygonContract.methods.elves(tokenId).call();
        const eElves = await nftContract.methods.elves(tokenId).call();
        let chain = "";

        if(pElves.owner === eElves.owner) {
            if(pElves.owner === "0x0000000000000000000000000000000000000000" && eElves.owner === "0x0000000000000000000000000000000000000000") {
                chain = "eth";
                console.log("unstaked in eth")
            }else{
                chain = "polygon";
            }
            
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
            <Lookup />
          
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

