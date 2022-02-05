import React, { useEffect, useState, useMemo } from "react"
import Loader from "../../components/Loader"
import { useMoralis } from "react-moralis"
import "./style.css"
import { actionString } from "../home/config"
import Countdown from 'react-countdown';
import {elvesAbi, getCampaign, elvesContract, etherscan ,sendCampaign, lookupMultipleElves, getCurrentWalletConnected} from "../../utils/interact"
//import {campaigns} from "../../components/Campaigns"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'


const WhaleMode = () => {
    const [loading, setLoading] = useState(true)
    const { Moralis, authenticate } = useMoralis();
    const [status, setStatus] = useState("")
    const [tryWeapon, setTryWeapon] = useState(false)
    const [tryItem, setTryItem] = useState(false)
    const [useItem, setUseItem] = useState(false)
    const [tryCampaign, setTryCampaign] = useState(1)
    const [trySection, setTrySection] = useState(1)
    
    const [isButtonEnabled, setIsButtonEnabled] = useState({
        unstake: false,
        rerollWeapon: false,
        rerollItem: false,
        sendPassive: false,
        returnPassive: false,
        heal: false,
        sendCampaign: false,
    });
 
    

    const [clicked, setClicked] = useState([]);

    const [data, setData] = useState([])
    const [activeNfts, setActiveNfts] = useState(true)
    const [txreceipt, setTxReceipt] = useState()
    const [alert, setAlert] = useState({show: false, value: null})
    const [campaignModal, setCampaignModal] = useState(false)
    const [modal, setModal] = useState({show: false, content: ""})
    const resetVariables = async () => {
        setClicked([])
        setData([])
        setTxReceipt([])
        setCampaignModal(false)
        setActiveNfts(!activeNfts)

    }
    


    const handleClick = async (id) => {

        if (clicked.includes(id)) {
            setClicked(clicked.filter(item => item !== id))
        } else {
            setClicked([...clicked, id])
        }
    }

    


    useMemo(() => {
        const selectedElves = data?.filter((elf) => clicked.includes(elf.id));

        const isInactive = (elf) => new Date() > new Date(elf.time * 1000);
        const isPassive = (elf) => elf.action === 3;
        const isStaked = (elf) => elf.elfStatus === "staked";
        const reducer = (accumulator, key) => {
            if (selectedElves.length === 0) return {...accumulator, [key]: false};

            let value = false;
            switch (key) {
                case "unstake":
                    value = selectedElves.every((elf) => isInactive(elf) && isStaked(elf));
                    break;
                case "heal":
                    const [druid, target] = selectedElves;
                    value = druid && isInactive(druid) && druid.sentinelClass === 0 && target && !isInactive(target) && target.sentinelClass !== 0;
                    break;
                case "sendPassive":
                case "sendCampaign":
                    value = selectedElves.every((elf) => isInactive(elf) && !isPassive(elf));
                    break;
                case "returnPassive":
                    value = selectedElves.every((elf) => isInactive(elf) && isPassive(elf));
                    break;
                case "rerollWeapon":
                case "rerollItem":
                default:
                    value = selectedElves.every((elf) => !isPassive(elf));
                    break;
            }
            return {...accumulator, [key]: value};
        }

        const buttonEnabledState = Object.keys(isButtonEnabled).reduce(reducer, {});

        setIsButtonEnabled(buttonEnabledState);
    }, [clicked, data]);


    const passiveMode = async (option) => {
      
        await Moralis.enableWeb3();

        const options = {
                contractAddress: elvesContract,
                functionName: option,
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
                setStatus(elves.length + " elves")
                setStatus("done")
                elves.length >= 8 ? setLoading(false) :  setStatus("need 8 or more elves to use whale mode. Whale count: " + elves.length + " elves")
            
    
            }
            
            getData()
          },[activeNfts])



          const sendCampaignFunction = async () => {

            const params = {
                tryTokenids: clicked,
                tryCampaign,
                trySection,
                tryWeapon,
                tryItem,
                useItem,
            };

        
       
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
            if(!campaignModal) return <></>
            return(
                <div className="modal modal-whale-campaign">
                    <div className="modal-content items-center">
                        <span className="close-modal" onClick={() => setCampaignModal(false)}>X</span>
                        <h3>All selected Elves will go to the same campaign</h3>
                        <div className="modal-whale-campaign-grid">
                            <label>Campaign</label>
                            <input type="number" min="1" max="3" value={tryCampaign} onChange={(e) => setTryCampaign(e.target.value)}/>
                            <label>Section</label>
                            <input type="number" min="1" max="5" value={trySection} onChange={(e) => setTrySection(e.target.value)}/>
                            <label>Re-roll Weapon</label>
                            <input type="checkbox" checked={tryWeapon} onChange={(e) => setTryWeapon(!tryWeapon)}/>
                            <label>Re-roll Item</label>
                            <input type="checkbox" checked={tryItem} onChange={(e) => setTryItem(!tryItem)}/>
                            <label>Use Item</label>
                            <input type="checkbox" checked={useItem} onChange={(e) => setUseItem(!useItem)}/>
                        </div>

                        <button
                            className="btn-whale"
                            onClick={sendCampaignFunction}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )
        }



    return !loading ? (
        
        <>

        {alert.show && showAlert(alert.value)}
            <div className="dark-1000 h-full d-flex flex-column profile">           
            <FontAwesomeIcon icon={["far", "coffee"]} />
                <div className="d-flex">      
                    <div className="column">
                  
                        <div className="flex">
                        
                        <h2>Whale Mode</h2>
                       
                        </div>
                    
                    <div className="flex p-10">
                        <button
                            disabled={!isButtonEnabled.unstake}
                            className="btn-whale"
                            onClick={unStake}
                        >
                            Unstake
                        </button>
                        <button
                            disabled={!isButtonEnabled.rerollWeapon}
                            className="btn-whale"
                            onClick={() => reRoll("forging")}
                        >
                            Re-Roll Weapon
                        </button>
                        <button
                            disabled={!isButtonEnabled.rerollItem}
                            className="btn-whale"
                            onClick={() => reRoll("merchant")}
                        >
                            Re-Roll Item
                        </button>
                        <button
                            disabled={!isButtonEnabled.sendPassive}
                            className="btn-whale"
                            onClick={() => passiveMode("passive")}
                        >
                            Send to Passive
                        </button>
                        <button
                            disabled={!isButtonEnabled.returnPassive}
                            className="btn-whale"
                            onClick={() => passiveMode("returnPassive")}
                        >
                            Return from Passive
                        </button>
                        <button
                            disabled={!isButtonEnabled.heal}
                            className="btn-whale"
                            onClick={heal}
                        >
                            Heal
                        </button>
                        <button
                            disabled={!isButtonEnabled.sendCampaign}
                            className="btn-whale"
                            onClick={()=> setCampaignModal(true)}
                        >
                            Send to Campaign
                        </button>
                    </div>     
                
                 
                    
    <div className="table-whale">          
      <table style={{width: '100%'}}>
      <thead style={{textAlign: "left"}}>
        <tr>
        <th></th>
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
                    <td><img src={line.image} alt="Elf" /></td>
                    <td>{line.name}</td>
                    <td>{line.elfStatus}</td>
                    <td>{line.attributes[5].value}</td>
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

                <div>
                    <ul>
                    <li>
                        Healing: click a Druid then click the Ranger or Assassin you want to heal next. Then click heal. You should have selected only two elves.
                        </li>
                        <li>
                        Disclaimer: Function overflows are unchecked - make sure you double check before you send.
                        </li>
                    </ul>
               
                </div>

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