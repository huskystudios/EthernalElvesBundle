import React, { useEffect, useState } from "react"
import Loader from "../../components/Loader"
import { useMoralis } from "react-moralis"
import "./style.css"
import { actionString } from "../home/config"
import Countdown from 'react-countdown';
import {elvesAbi, getCampaign, elvesContract, etherscan ,sendCampaign, lookupMultipleElves, getCurrentWalletConnected} from "../../utils/interact"
//import {campaigns} from "../../components/Campaigns"


const WhaleMode = () => {
    const [loading, setLoading] = useState(true)
    const { Moralis, authenticate } = useMoralis();
    const [status, setStatus] = useState("")
    const [tryWeapon, setTryWeapon] = useState(false)
    const [tryItem, setTryItem] = useState(false)
    const [useItem, setUseItem] = useState(false)
    const [tryCampaign, setTryCampaign] = useState(1)
    const [trySection, setTrySection] = useState(1)
    
 
    

    const [clicked, setClicked] = useState([]);

    const [data, setData] = useState()
    const [activeNfts, setActiveNfts] = useState()
    const [txreceipt, setTxReceipt] = useState()
    const [alert, setAlert] = useState({show: false, value: null})
    const [healModal, setHealModal] = useState(false)
    const [modal, setModal] = useState({show: false, content: ""})
    const resetVariables = async () => {
        setClicked([])
        setData([])
        setTxReceipt([])
        setActiveNfts([])
    }
    

   
///create a function to add the clicked elf to the array and then remove it from the array when the button is clicked again
    const handleClick = async (id) => {
        if (clicked.includes(id)) {
            setClicked(clicked.filter(item => item !== id))
        } else {
            setClicked([...clicked, id])
        }
    }

    


    


    const passiveMode = async (option) => {
      
        await Moralis.enableWeb3();

        const options = {
                contractAddress: elvesContract,
                functionName: option,
                abi: elvesAbi.abi,
                params: {ids: clicked},
                awaitReceipt: false // should be switched to false
              };

              const tx = await Moralis.executeFunction(options);
              
              tx.on("transactionHash", (hash) => { 
                resetVariables()
                setAlert({show: true, value: {
                    title: "Tx Successful", 
                    content: (<>✅ Check out your transaction on <a target="_blank" rel="noreferrer" href={`https://${etherscan}.io/tx/${hash}`}>Etherscan</a> </>)            
              }})
                
            })
              
              tx.on("receipt", (receipt) => { 

                setTxReceipt(receipt)
                let response

                receipt.events.Action.isArray ? response = `Elf#${ receipt.events.Action.map(nft => {return(nft.returnValues.tokenId)})} have started doing ${actionString[receipt.events.Action[0].returnValues.action].text}`
                : response = `Elf#${receipt.events.Action.returnValues.tokenId} has started doing action ${actionString[receipt.events.Action.returnValues.action].text}`
       
                setAlert({show: true, value: {
                      title: "Tx Successful", 
                      content: response            
                }})
            
            })
                      
        }


        const heal = async () => {
      
            await Moralis.enableWeb3();
    
            const options = {
                    contractAddress: elvesContract,
                    functionName: "heal",
                    abi: elvesAbi.abi,
                    params: {healer: clicked[0], target: clicked[1]},
                    awaitReceipt: false // should be switched to false
                  };
    
                  const tx = await Moralis.executeFunction(options);
                  
                  tx.on("transactionHash", (hash) => { 
                    resetVariables()
                    setAlert({show: true, value: {
                        title: "Tx Successful", 
                        content: (<>✅ Check out your transaction on <a target="_blank" rel="noreferrer" href={`https://${etherscan}.io/tx/${hash}`}>Etherscan</a> </>)            
                  }})
                    
                })
                  
                  tx.on("receipt", (receipt) => { 
    
                    setTxReceipt(receipt)
                    let response
    
                    receipt.events.Action.isArray ? response = `Elf#${ receipt.events.Action.map(nft => {return(nft.returnValues.tokenId)})} have started doing ${actionString[receipt.events.Action[0].returnValues.action].text}`
                    : response = `Elf#${receipt.events.Action.returnValues.tokenId} has started doing action ${actionString[receipt.events.Action.returnValues.action].text}`
           
                    setAlert({show: true, value: {
                          title: "Tx Successful", 
                          content: response            
                    }})
                
                })
                          
            }


    const reRoll = async (option) => {
      
        await Moralis.enableWeb3();

        const options = {
                contractAddress: elvesContract,
                functionName: option,
                abi: elvesAbi.abi,
                params: {ids: clicked},
                msgValue: Moralis.Units.ETH("0.01"),
                awaitReceipt: false // should be switched to false
              };

              const tx = await Moralis.executeFunction(options);
              
              tx.on("transactionHash", (hash) => { 
                resetVariables()
                setAlert({show: true, value: {
                    title: "Tx Successful", 
                    content: (<>✅ Check out your transaction on <a target="_blank" rel="noreferrer" href={`https://${etherscan}.io/tx/${hash}`}>Etherscan</a> </>)            
              }})
                
            })
              
              tx.on("receipt", (receipt) => { 

                setTxReceipt(receipt)
                let response

                receipt.events.Action.isArray ? response = `Elf#${ receipt.events.Action.map(nft => {return(nft.returnValues.tokenId)})} have started doing ${actionString[receipt.events.Action[0].returnValues.action].text}`
                : response = `Elf#${receipt.events.Action.returnValues.tokenId} has started doing action ${actionString[receipt.events.Action.returnValues.action].text}`
       
                setAlert({show: true, value: {
                      title: "Tx Successful", 
                      content: response            
                }})
            
            })
                      
        }



    const unStake = async (option) => {
      
        await Moralis.enableWeb3();

        const options = {
                contractAddress: elvesContract,
                functionName: "unStake",
                abi: elvesAbi.abi,
                params: {ids: clicked},
                awaitReceipt: false 
              };

              const tx = await Moralis.executeFunction(options);
              
              tx.on("transactionHash", (hash) => { 
                resetVariables()
                setAlert({show: true, value: {
                    title: "Tx Successful", 
                    content: (<>✅ Check out your transaction on <a target="_blank" rel="noreferrer" href={`https://${etherscan}.io/tx/${hash}`}>Etherscan</a> </>)            
              }})
                
            })
              
              tx.on("receipt", (receipt) => { 

                setTxReceipt(receipt)
                let response

                receipt.events.Action.isArray ? response = `Elf#${ receipt.events.Action.map(nft => {return(nft.returnValues.tokenId)})} have started doing ${actionString[receipt.events.Action[0].returnValues.action].text}`
                : response = `Elf#${receipt.events.Action.returnValues.tokenId} has started doing action ${actionString[receipt.events.Action.returnValues.action].text}`
               
                setAlert({show: true, value: {
                      title: "Tx Successful", 
                      content: response            
                }})
            
            })
                      
        }
        
    

    
        useEffect(() => {
            const getData = async () => {
                const {address} = await getCurrentWalletConnected();
                setStatus("connected to address: " + address)
     
               await Moralis.enableWeb3();
     
    
    
                const params =  {address: address}
                const userTokenArray = await Moralis.Cloud.run("getElvesFromDb", params);
                setStatus("army of elves")
                const elves = await lookupMultipleElves(userTokenArray)
                elves.sort((a, b) => a.time - b.time) 
                console.log(elves)
                setData(elves)        

                setStatus("done")
                elves && setLoading(false)
            
    
            }
            
            getData()
          },[])



          const sendCampaignFunction = async (params) => {

           /// value > 0 && onSendCampaign({tryTokenids, tryCampaign, trySection, tryWeapon, tryItem, useItem})

        
            console.log("sendCampaignFunction", params)
            let {success, status, txHash} = await sendCampaign(params)
    
            success && resetVariables()
    
            setAlert({show: true, value: {
                title: "Tx Sent", 
                content: (status)            
          }})
            
        
    
            console.log("sendCampaign", params)
            
       
            }
    


          const showAlert = ({title, content}) => {

            return (
                <div className="alert">
                    <h3>{title}</h3>
                    <pre>{content}</pre>
                    <button className="btn btn-red" onClick={()=>setAlert({show: false})}>close</button>
                </div>
            )
        }


        const renderModal = () => {
            if(!healModal) return <></>
            return(
                <div className="modal">
                    <div className="modal-content items-center">
                        <span className="close-modal" onClick={() => setHealModal(false)}>X</span>
                        <h3>All selected Elves will go to the same campaign</h3>
                        <div className="flex">
                            <div className="flex-1">
                                <label>Campaign</label>
                                <input type="text" value={tryCampaign} onChange={(e) => setTryCampaign(e.target.value)}/>
                            </div>
                            <div className="flex-1">
                                <label>Section</label>
                                <input type="text" value={trySection} onChange={(e) => setTrySection(e.target.value)}/>
                            </div>
                            <div className="flex-1">
                                <label>Weapon</label>
                                <input type="text" value={tryWeapon} onChange={(e) => setTryWeapon(e.target.value)}/>
                            </div>
                         </div>          

                       
                        
                      
                    </div>
                </div>
            )
        }



    return !loading ? (
        
        <>

        {alert.show && showAlert(alert.value)}
            <div className="dark-1000 h-full d-flex flex-column profile">           

                <div className="d-flex">      
                    <div className="column">
                    <p>Disclaimer: Function overflows are unchecked - make sure you double check before you send.</p>
                        <div className="flex">
                        
                        <h2>Whale Mode</h2>
                       
                        </div>
                    
                    <div className="flex p-10">
                    <button className="btn-whale" onClick={unStake}>Unstake</button>
                    <button className="btn-whale" onClick={() => reRoll("forging")}>Re-Roll Weapon</button>
                    <button className="btn-whale" onClick={() => reRoll("merchant")}>Re-Roll Item</button>
                    <button className="btn-whale" onClick={() => passiveMode("passive")}>Send to Passive</button>
                    <button className="btn-whale" onClick={() => passiveMode("returnPassive")}>Return from Passive</button>
                    
                    <button className="btn-whale" onClick={heal}>Heal</button>
                   
                 <button className="btn-whale" onClick={()=> setHealModal(true)}>Send to Campaign</button>
                
                    </div>     
                
                  
                    
    <div className="table-whale">          
      <table style={{width: '100%'}}>
      <thead style={{textAlign: "left"}}>
        <tr>
        <th>NAME</th>
        <th>Location</th>
        <th>Inventory</th>
        {/*<th>Weapon Index</th>*/}
        <th>Weapon Name</th>
         {/*<th>Weapon Tier</th>*/}
         <th>hp+</th>
         <th>ap+</th>
        <th>level</th>
        <th>class</th>
        <th>Action Taken</th>
        <th>Cooldown (-) / Passive (+)</th>
        </tr>
      </thead>
      <tbody>
          

            {data.map((line, index) => {


                const date = new Date(line.time * 1000)
                const isActive = new Date() > date
                let passiveString = ""
                
                let passiveFlag = false
                
                    ///turn date in tto hours if less than 24 then into days    
                    if(line.action === 3){
                        let timesince = Math.floor(((new Date() - date) / 1000)/(60*60))
                        if(timesince < 24){
                            passiveString = `${timesince} hours`
                        }else{
                            let timesince = Math.floor(((new Date() - date) / 1000)/(60*60*24))
                            passiveString = `${timesince} days`
                        }
                    }
                
                    let rowSelected = clicked.includes(parseInt(line.id)) ? "rowSelected" : ""

                    let healer = line.class === "Druid" ? "healer" : ""

                    //change background color if the elf is active or not
                    


                return( <tr key={index} className={`${rowSelected} row`} onClick={()=> handleClick(parseInt(line.id))}  > 
                    <td>{line.name}</td>
                    <td>{line.elfStatus}</td>
                    <td>{line.inventoryString}</td>
                    {/*<td>{line.primaryWeapon}</td>        */} 
                    <td>{line.attributes[3].value} +{line.weaponTier}</td>        
                    <td>{line.health}</td>        
                    <td>{line.attack}</td>        
                    
                    <td>{line.level}</td>
                    <td>{line.classString}</td>
                    <td>{line.actionString}</td>
                    <td>{!isActive &&  !passiveFlag && <Countdown date={date} />}
                    {passiveString}
                    
                    
                    </td>
                </tr>)
            }
             
               
             
            )}
       

            
                </tbody>
                </table>

                <div className="flex flex-wrap">
                {clicked.map((id, index) => {
                    const elf = data.find(line => line.id === id)
                  
                    return(
                        <div className="whale-thumb" key={index}>
                            <img src={elf.image} alt="elf" />
                          
                         </div>   
                    )})}

              </div>


            </div>

     
      </div>
            
                
</div>

</div>
{renderModal()}
        </>
        
     
    ) : <Loader text={status} />
}

export default WhaleMode