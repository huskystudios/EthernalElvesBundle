import React, { useEffect, useState } from "react"

import { useMoralisQuery } from "react-moralis"
import Modal from "../../../components/Modal";

const InstantKill = ({owner, setAlert}) => {

    const [modal, setModal] = useState({show: false, nft: null})
    const [limit, setLimit] = useState(1)
   const { data, error, isLoading } = useMoralisQuery(
     "ElfBloodthirstPolygon",
     query =>
       query   
         .equalTo("owner", owner)      
         .descending("updatedAt")
         .limit(limit),
        [limit],
     {
       live: true,
     },
   );

   let latestIndex = data.length - 1
   console.log("run", data[latestIndex].get("tokenId"))
     if(latestIndex > 1 && !isLoading){
            console.log("run", data[latestIndex].get("tokenId"))
            let successMessage = "Successfully slayed creature with one blow with Elf #" + data[latestIndex].get("tokenId") +"!"
            setAlert({show: true, value: {title: "Instant Kill!", content: (successMessage)}})
     }



   
      
    return (
        
            <>
           Creature Slayer
           
        </>
        
    ) 
}



export default InstantKill