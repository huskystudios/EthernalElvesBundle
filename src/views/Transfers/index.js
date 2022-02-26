import React, { useEffect, useState, useMemo } from "react"
import Loader from "../../components/Loader"
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis"
import { actionString, campaigns } from "../home/config"
import Countdown from 'react-countdown';
import {elvesAbi, getCampaign, elvesContract, etherscan,
    checkIn, checkOut, checkOutRen, usedRenSignatures,
    sendCampaign, sendPassive, returnPassive, unStake, merchant, forging,
    heal, lookupMultipleElves, getCurrentWalletConnected, checkRenTransfersIn} from "../../utils/interact"
import TransfersToEth from "./TransfersToEth"
import TransfersToPolygon from "./TransfersToPolygon"


const Transfers = () => {
    const [loading, setLoading] = useState(true)
    const { Moralis } = useMoralis();
    const [status, setStatus] = useState("")


 
    


    return (
        
        <>

        
            <div className="dark-1000 h-full d-flex flex-column profile">           
            <div className="table-whale">  

                    <div className="flex">
                                                    
                    <h2>Pending Transfers</h2>
                    
                    </div>
            <TransfersToEth />
            <br/>
            <br/>
            <br/>
            <TransfersToPolygon/>
            </div>
            </div>

        </>
        
     
    ) 
}

export default Transfers