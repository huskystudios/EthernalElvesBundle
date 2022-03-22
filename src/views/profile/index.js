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
import ActivityLog from "./ActivityLog"
import GameStats from "./GameStats"

const Profile = () => {
    const [loading, setLoading] = useState(true)
    const [supply, setSupply] = useState("3000")
    const [renTransfers, setRenTransfers] = useState([])
    const [data, setData] = useState({})
    const [actionData, setActionData] = useState({})
    const { Moralis, authenticate } = useMoralis();
    const [status, setStatus] = useState("")
    


    const getUserData = async (address) => {

        
        let q = new Moralis.Query("ElvesAdmin");  
       
        q.equalTo("owner_of", address.toLowerCase());
        setStatus("getting elves")
        const elves = await q.find();
        setStatus("army of " + elves.length + " elves")
        setData(elves)        

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

    const ShowElfTable = () => {



        return(

    <div className="table">          
      <table style={{width: '100%'}}>
      <thead style={{textAlign: "left"}}>
        <tr>
        <th>Token Id</th>
        <th>Inventory</th>
        {/*<th>Weapon Index</th>*/}
        <th>Weapon Name</th>
         {/*<th>Weapon Tier</th>*/}
        <th>level</th>
        <th>class</th>
        
        <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
          

            {data.map((line, index) => {


                        const date = new Date(line.get("elf_timestamp") * 1000)
                        const isActive = new Date() > date
                        let passiveString = ""

                        let passiveFlag = false

                        let action = parseInt(line.get("elf_action"))

                        //get text from actionString where action is the key
                        actionString.forEach((item) => {
                            if(item.action === action){
                                action = item.text
                                //passiveFlag = true
                            }
                        })

                        let inventory = parseInt(line.get("elf_inventory"))
                        let inventoryString

                        let inventoryDescription
                        items.forEach((item) => {
                            if(item.item === inventory){
                                inventoryDescription = item.description
                                inventoryString = item.text
                            
                            }
                        })

                       
                        ///turn date in tto hours if less than 24 then into days    
                        if (parseInt(line.get("elf_action")) === 3) {
                            let timesince = Math.floor(((new Date() - date) / 1000) / (60 * 60))
                            if (timesince < 24) {
                                passiveString = `${timesince} hours`
                            } else {
                                let timesince = Math.floor(((new Date() - date) / 1000) / (60 * 60 * 24))
                                passiveString = `${timesince} days`
                            }
                        }

                  
                return( <tr key={line.id}> 
                    <td>{line.get("token_id")}</td>
                    <td>{inventoryString}</td>
                    {/*<td>{line.primaryWeapon}</td>        */} 
                    <td>{line.get("elf_weapon")} +{line.get("elf_weaponTier")}</td>        
                    
                    <td>{line.get("elf_level")}</td>
                    <td>{line.get("elf_class")}</td>
                   
                    <td>{!isActive &&  !passiveFlag && <pre> {<Countdown date={date} />} </pre>}
                    <pre>{passiveString}</pre>
                    
                    
                    </td>
                </tr>)
            }
             
               
             
            )}
       

            
      </tbody>
      </table>
    </div>

        )
    }


    const ShowTransactionTable = () => {



        return(

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

        )
    }


    return (
        <>

        
        {loading ? <Loader text={status} /> :
        <>


            <div className="dark-1000 h-full d-flex flex-column profile">           

            <h1>Profile</h1>

                <Tabs>
                <TabList>
                <Tab>My Elves</Tab>
                <Tab>Activity Log</Tab>
                <Tab>Statistics & Data</Tab>
                <Tab>Leaderboards</Tab>
                <Tab>Lookup Elf</Tab>
                </TabList>

                <TabPanel>
                <h2>My Elves</h2>
                <ShowElfTable  />
                </TabPanel>
                <TabPanel>
                <h2>Activity Log</h2>
                <ActivityLog />
                </TabPanel>
                <TabPanel>
               <Stats />
               </TabPanel>
               <TabPanel>
               <GameStats />

               </TabPanel>
                
                <TabPanel>               
                <Lookup />
                </TabPanel>
            </Tabs>
    
       
                 

                 

                 
                
              

                    
            </div>
        </>
        }
        </>
    )
}

export default Profile