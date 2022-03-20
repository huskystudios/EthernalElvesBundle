import React, { useEffect, useState } from "react"
import Loader from "../../components/Loader"
import { useMoralis } from "react-moralis"
import "./style.css"
import { actionString, items } from "../home/config"
import {lookupMultipleElves, getCurrentWalletConnected, withdrawSomeTokenBalance} from "../../utils/interact"
import Countdown from 'react-countdown';
import Lookup from "./Lookup"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Stats from "./Stats"

const ActivityLog = () => {
    const [loading, setLoading] = useState(true)
    const [supply, setSupply] = useState("3000")
    const [renTransfers, setRenTransfers] = useState([])
    const [data, setData] = useState({})
    const [actionData, setActionData] = useState({})
    const { Moralis, authenticate } = useMoralis();
    const [status, setStatus] = useState("")
    


    const getUserData = async (address) => {

      
        const ElfActions = Moralis.Object.extend("ElfActions");        
        const RenTransfers = Moralis.Object.extend("RenTransfers");
        const ElfActionsPolygon = Moralis.Object.extend("ElfActionsPolygon");
        const RenTransfersPolygon = Moralis.Object.extend("RenTransfersPolygon");
      
        

        let query = new Moralis.Query(ElfActions);  
       
        query.equalTo("from", address.toLowerCase());
        query.limit(25)
        query.descending("createdAt")
        setStatus("getting eth actions")
        const res = await query.find();

        query = new Moralis.Query(RenTransfers);  
       
        query.equalTo("owner", address.toLowerCase());
        query.limit(25)
        query.descending("createdAt")
        setStatus("getting eth REN transfers")
        const ren = await query.find();

        query = new Moralis.Query(ElfActionsPolygon);  
       
        query.equalTo("owner", address.toLowerCase());
        query.limit(25)
        query.descending("createdAt")
        setStatus("getting polygon actions")
        const resPoly = await query.find();

        query = new Moralis.Query(RenTransfersPolygon);  
       
        query.equalTo("owner", address.toLowerCase());
        query.limit(25)
        query.descending("createdAt")
        setStatus("getting polygon REN transfers")
        const renPoly = await query.find();


        //concat ren and res
        let data = res.concat(ren).concat(resPoly).concat(renPoly)
        

        ///sort by createdAt
        data.sort((b,a)=>{
            return new Date(a.createdAt) - new Date(b.createdAt)
        })
        //[0].attributes.action
        setActionData(data)
    
        setStatus("done")
   
        setLoading(false)
    
    }
        
        
        useEffect(() => {
            const getData = async () => {
                const {address} = await getCurrentWalletConnected();
                setStatus("connected to address: " + address)
     
                address && await getUserData(address)
            }
            
            getData()
          },[])

    



    return (
        <>

        
        {loading ? <Loader text={status} /> :
        <>

            
    <div className="table">          
      <table style={{width: '100%'}}>
      <thead style={{textAlign: "left"}}>
        <tr>
        <th>Date/Time</th>
        <th>Last Action</th>
        <th>Elf #</th>
        <th>$REN</th>    
        <th>TX Link</th>       
        <th>TX Chain</th>       
        </tr>
      </thead>
      <tbody>
          
            {actionData.map((line, index) => {
                
                let createDate = new Date( Date.parse(line.createdAt))
                let action = line.attributes.action ? actionString[parseInt(line.attributes.action)] : "$REN Transaction"
                let chain = "eth"
                let txLink = `https://etherscan.io/tx/${line.attributes.transaction_hash}`

                if(line.className === "RenTransfersPolygon" || line.className === "ElfActionsPolygon"){
                    chain = "polygon"
                    txLink = `https://polygonscan.com/tx/${line.attributes.transaction_hash}`
                    
                }
           
                return(
                    <tr key={index}> 
                    <td>{createDate.toGMTString()}</td>
                    <td>{action.text}</td>
                    <td>{line.attributes.tokenId ? `Elf #${line.attributes.tokenId}` : null}</td>
                    <td>{line.attributes.subtract ? "-" : null}{line.attributes.amount ? `${Moralis.Units.FromWei(line.attributes.amount)} $REN` : ""}</td>                  
                    <td><a target="_blank" href={txLink}>View Tx</a></td>
                    <td>{chain}</td>
                   
                   
           
                </tr>
                )
            }
             
             
             
            )}
       

            
      </tbody>
      </table>

     
    </div>

           
       
                
        </>
        }
        </>
    )
}

export default ActivityLog