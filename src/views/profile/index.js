import React, { useEffect, useState } from "react"
import Loader from "../../components/Loader"
import { useMoralis } from "react-moralis"
import "./style.css"
import { actionString } from "../home/config"
import {lookupMultipleElves, getCurrentWalletConnected} from "../../utils/interact"
import Countdown from 'react-countdown';
import MintPass from "./MintPass"



const Profile = () => {
    const [loading, setLoading] = useState(true)
    const [supply, setSupply] = useState("3000")
    const [totalUnstaked, setTotalUnstaked] = useState("3000")
    const [totalPassive, setTotalPassive] = useState("3000")
    const [totalCampaign, setTotalCampaign] = useState("3000")
    const [totalBloodthirst, setTotalBloodthirst] = useState("3000")
    const [totalStaked, setTotalStaked] = useState("3000")
    const [data, setData] = useState({})
    const [actionData, setActionData] = useState({})
    const { Moralis, authenticate } = useMoralis();
    const [status, setStatus] = useState("")

   

      
    useEffect(() => {      
        
        const getMoralisTokenSupply = async ()=>{
            
            await Moralis.enableWeb3();

            const response = await Moralis.Cloud.run("getTokenSupply");
            console.log(response)
            setSupply({current: response.supply, total: response.maxSupply, initial: response.initialSupply})
           
        } 

        
        getMoralisTokenSupply()       
    }, []);

  

    const getUserData = async (address) => {

        await Moralis.enableWeb3();


        const ElfActions = Moralis.Object.extend("ElfActions");
        const RenTransfers = Moralis.Object.extend("RenTransfers");
        
      
       // await authenticate();
      //  let user = Moralis.User.current();
      //  console.log(user)
       
        let query = new Moralis.Query(ElfActions);  
       
        query.equalTo("from", address.toLowerCase());
        query.limit(25)
        query.descending("createdAt")
        const res = await query.find();

        let queryRen = new Moralis.Query(RenTransfers);  
       
        queryRen.equalTo("owner", address.toLowerCase());
        queryRen.limit(25)
        queryRen.descending("createdAt")

        const ren = await queryRen.find();

        //concat ren and res
        let data = res.concat(ren)

        setStatus("getting actions and transactions")



        ///sort by createdAt
        data.sort((b,a)=>{
            return new Date(a.createdAt) - new Date(b.createdAt)
        })
        //[0].attributes.action
        setActionData(data)
    
        const params =  {address: address}
        const userTokenArray = await Moralis.Cloud.run("getElvesFromDb", params);
        setStatus("army of elves")
        const elves = await lookupMultipleElves(userTokenArray)
        elves.sort((a, b) => a.id - b.id)
        console.log(elves)
        setData(elves)        

        setStatus("done")
        elves && setLoading(false)
    
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
        <th>NAME</th>
        <th>Inventory</th>
        {/*<th>Weapon Index</th>*/}
        <th>Weapon Name</th>
        <th>Weapon Tier</th>
        <th>level</th>
        <th>class</th>
        <th>Action Taken</th>
        </tr>
      </thead>
      <tbody>
          

            {data.map((line, index) => {
/*
if(actionString === "Passive Campaign"){
    let timesince = Math.floor(((new Date() - date) / 1000)/(60*60*24))
    passiveString = `Time spent in ${actionString}: ${timesince} days`
}



{!isActive &&  <pre>Ready in:{" "}<Countdown date={date} /></pre>}
*/

                return( <tr key={index}> 
                    <td>{line.name}</td>
                    <td>{line.inventoryString}</td>
                    {/*<td>{line.primaryWeapon}</td>        */}
                    <td>{line.attributes[3].value}</td>        
                    <td>{line.weaponTier}</td>     
                    <td>{line.level}</td>
                    <td>{line.classString}</td>
                    <td>{line.actionString}</td>
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
        <th>Elf#</th>
        <th>Ren Transaction</th>       
        </tr>
      </thead>
      <tbody>
          

            {actionData.map((line, index) => {
                
                let createDate = new Date( Date.parse(line.createdAt))
                let action = line.attributes.action ? actionString[parseInt(line.attributes.action)] : "$REN Transaction"
                return(
                    <tr key={index}> 
                    <td>{createDate.toGMTString()}</td>
                    <td>{action.text}</td>
                    <td>{line.attributes.tokenId ? `Elf #${line.attributes.tokenId}` : null}</td>
                    <td>{line.attributes.subtract ? "-" : null}{line.attributes.amount ? `${Moralis.Units.FromWei(line.attributes.amount)} $REN` : ""}</td>                  
                    
                   
                   
           
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

                <div className="d-flex statistic justify-start">
                    <div className="d-flex flex-column">
                        <span>current supply:</span>
                        <span>{supply.current}</span>
                    </div>
                    <div className="d-flex flex-column">
                        <span>total supply:</span>
                        <span>{supply.total}</span>
                    </div>
                    <div className="d-flex flex-column">
                        <span>total passive:</span>
                        <span>{null}</span>
                    </div>
                    <div className="d-flex flex-column">
                        <span>total campaign:</span>
                        <span>{null}</span>
                    </div>
                    <div className="d-flex flex-column">
                        <span>total bloodthirst:</span>
                        <span>{null}</span>
                    </div>
                    <div className="d-flex flex-column">
                        <span>total staked:</span>
                        <span>{null}</span>
                    </div>
                </div>

               

   

                <div className="d-flex">           
                <div className="column">
                <h2>My Elves</h2>
                <ShowElfTable  />
                <h2>Activity Log</h2>
                <ShowTransactionTable /> 
                </div>
                <div className="column">
                <MintPass />  

                </div>

                
                </div>

                 
                 

                {/* 
                <div className="elves d-flex">
                    {elves.map((elf) => 
                        <div key={elf.id} className="elf-card d-flex flex-column">
                            <img src={elf.image} />
                            <div className="d-flex justify-between w-full flex-wrap">
                                <span>token id:</span>
                                <span>{elf.id}</span>
                            </div>
                            <div className="d-flex justify-between w-full flex-wrap">
                                <span>class:</span>
                                <span>{elf.class}</span>
                            </div>   
                            <div className="d-flex justify-between w-full flex-wrap">
                                <span>race:</span>
                                <span>{elf.race}</span>
                            </div>   
                            <div className="d-flex justify-between w-full flex-wrap">
                                <span>level:</span>
                                <span>{elf.level}</span>
                            </div>   
                            <div className="d-flex justify-between w-full flex-wrap">
                                <span>weapon:</span>
                                <span>{elf.weapon}</span>
                            </div>
                            <div className="d-flex justify-between w-full flex-wrap">
                                <span>activity:</span>
                                <span>{elf.activity}</span>
                            </div>                    
                        </div>
                    )}
                    
                </div>
      
                <div className="table">
                    {history.map((line, index) => 
                        <div className="d-flex w-full justify-between" key={index}>
                            <span>{line.timestamp}</span>
                            <span>{line.tokenId}</span>
                            <span>{line.class}</span>
                            <span>{line.action}</span>
                            <span>{line.ren}</span>
                            <span>{line.cost}</span>
                            <span>{line.network}</span>
                        </div>
                    )}
                </div>
        
                <div className="stats d-flex flex-column">
                    <span className="stats-label">stats</span>
                    <div className="d-flex justify-between w-full flex-wrap">
                        <span>miren bank:</span>
                        <span>{"miren bank"}</span>
                    </div>
                    <div className="d-flex justify-between w-full flex-wrap">
                        <span>wallet:</span>
                        <span>{"wallet"}</span>
                    </div>
                    <div className="d-flex justify-between w-full flex-wrap">
                        <span>total characters:</span>
                        <span>{"total"}</span>
                    </div>
                    <div className="d-flex justify-between w-full flex-wrap">
                        <span>druids:</span>
                        <span>{"druids"}</span>
                    </div>
                    <div className="d-flex justify-between w-full flex-wrap">
                        <span>assasins:</span>
                        <span>{"assasins"}</span>
                    </div>
                    <div className="d-flex justify-between w-full flex-wrap">
                        <span>rangers:</span>
                        <span>{"rangers"}</span>
                    </div>
                    <div className="d-flex justify-between w-full flex-wrap">
                        <span>daily $ren:</span>
                        <span>{"daily ren"}</span>
                    </div>
                </div>

                    */}
            </div>
        </>
        }
        </>
    )
}

export default Profile