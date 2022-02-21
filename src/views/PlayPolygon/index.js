import React, { useEffect, useState, useMemo } from "react"
import Loader from "../../components/Loader"
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis"
import "./style.css"
import { actionString, campaignsPoly } from "../home/config"
import Countdown from 'react-countdown';
import {elvesAbi, getCampaign, elvesContract, etherscan,
    checkIn,
    sendCampaign, sendPassive, returnPassive, unStake, merchant, forging,
    heal, lookupMultipleElves, getCurrentWalletConnected, polygonContract} from "../../utils/interact"
import Mint from "../mint"


const PlayPolygon = () => {
    const [loading, setLoading] = useState(true)
    const { Moralis } = useMoralis();
    const [status, setStatus] = useState("")
    const [tryWeapon, setTryWeapon] = useState(false)
    const [tryItem, setTryItem] = useState(false)
    const [useItem, setUseItem] = useState(false)
    const [sortBy, setSortBy] = useState({ value: "cooldown", order: "desc" });
    const [tryCampaign, setTryCampaign] = useState(1)
    const [trySection, setTrySection] = useState(1)

    const owner = window.ethereum.selectedAddress

    const [renTransfer, setRenTransfer] = useState("")
    
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

    const [nftData, setNftData] = useState([])
    const [sortedElves, setSortedElves] = useState([])
    const [activeNfts, setActiveNfts] = useState(true)
    const [txreceipt, setTxReceipt] = useState()
    const [alert, setAlert] = useState({show: false, value: null})
    const [campaignModal, setCampaignModal] = useState(false)
    const [campaignBTModal, setCampaignBTModal] = useState(false)
   
    const resetVariables = async () => {
        setClicked([])
        setNftData([])
        setTxReceipt([])
        setCampaignModal(false)
        setActiveNfts(!activeNfts)

    }
    
   // const { data, error, fetch, isFetching, isLoading } = useWeb3ExecuteFunction();


    const handleClick = async (id) => {

        if (clicked.includes(id)) {
            setClicked(clicked.filter(item => item !== id))
        } else {
            setClicked([...clicked, id])
        }
    }

    


    useMemo(() => {
        const selectedElves = nftData?.filter((elf) => clicked.includes(elf.id));

        const isInactive = (elf) => new Date() > new Date(elf.time * 1000);
        const isPassive = (elf) => elf.action === 3;
        const isStaked = (elf) => elf.elfStatus === "staked";
        const reducer = (accumulator, key) => {
            if (selectedElves.length === 0) return {...accumulator, [key]: false};

            let value = false;
            switch (key) {
                case "unstake":
                    value = selectedElves.every((elf) => isInactive(elf) && !isPassive(elf) && isStaked(elf));
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
    }, [clicked, nftData]);


    
    const sendGaslessFunction = async (params) => {

        setLoading(true)
        setCampaignModal(false)
  
        setStatus("Sending gasless transaction... waiting for response. Please do not close the window.")

        let response = await Moralis.Cloud.run("operatorTransactor", params)

        if(response.status){

            let txHashLink = `https://polygonscan.com/tx/${response.transaction.transactionHash}`
            let successMessage = <>Check out your transaction on <a target="_blank" href={txHashLink}>Polyscan</a> </>
            resetVariables()     
            setAlert({show: true, value: {title: "Tx Sent", content: (successMessage)}})

        }else{
            setAlert({show: true, value: {title: "Error", content: ("Something went wrong")}})
        }
        

        console.log(response)

        setLoading(false)

    }

    const sendCampaignFunction = async () => {
           
        const params =  {functionCall: polygonContract.methods.sendCampaign(clicked, tryCampaign, trySection, tryWeapon, tryItem, useItem, owner).encodeABI()}
        await sendGaslessFunction(params)
        
    }

    const bloodthirstFunction = async () => {
           
        const params =  {functionCall: polygonContract.methods.bloodThirst(clicked, tryCampaign, trySection, owner).encodeABI()}
        await sendGaslessFunction(params)
        
    }


    const checkinElf = async () => {

        let renToSend = renTransfer === "" ? 0 : renTransfer
        
        const params =  {functionCall: polygonContract.methods.checkIn(clicked, (renToSend*1000000000000000000).toString(), owner).encodeABI()}
        await sendGaslessFunction(params)
                      
    }

    const reRoll = async (option) => {
       // let reRollPrice = .01 * 10**18
       // let hexString = reRollPrice.toString(16);
        
        const params =  {
            functionCall: option === "forging" ? polygonContract.methods.forging(clicked, owner).encodeABI() : polygonContract.methods.merchant(clicked, owner).encodeABI() }
        await sendGaslessFunction(params)          
                      
        }


    const passiveMode = async (option) => {

        const params =  {functionCall: option === "passive" ? polygonContract.methods.passive(clicked, owner).encodeABI() : polygonContract.methods.returnPassive(clicked, owner).encodeABI() }
        await sendGaslessFunction(params)       
                      
        }


    const healing = async () => {

        const params =  {functionCall: polygonContract.methods.heal(clicked[0], clicked[1], owner).encodeABI()}
        await sendGaslessFunction(params)
                          
         }


    
        useEffect(() => {
            const getData = async () => {
                const {address} = await getCurrentWalletConnected();
                setStatus("connected to address: " + address)
     
           //    await Moralis.enableWeb3();

               const Elves = Moralis.Object.extend("Elves");
                let query = new Moralis.Query(Elves);
                query.equalTo("owner_of", address);
                query.equalTo("chain", "polygon");
                let limit = 50

                //page through the results
                let results = []
                let hasMore = true
                let page = 1
		while (hasMore) {

			query.limit(limit);
			query.skip(limit * (page - 1));
			query.withCount();
			const response = await query.find();
			let currentIndex = limit * (page)
			currentIndex > response.count ? hasMore = false : hasMore = true
			page++
			setStatus(currentIndex / response.count * 100)
			
			results = results.concat(response.results)
			
		}      
        
        const tokenArr = [];
                                    
                    results.map((elf) => {
                    tokenArr.push(elf.attributes.token_id)
                    })
                        

                setStatus("army of elves")
                const lookupParams = {array: tokenArr, chain: "polygon"}

                const elves = await lookupMultipleElves(lookupParams)
                elves.sort((a, b) => a.time - b.time) 
               
                setNftData(elves)        
                setStatus(elves.length + " elves")
                setStatus("done")
                          
               setLoading(false)
            }
            
            getData()
          },[activeNfts, txreceipt]);


        useEffect(() => {
            const attributeMap = {
                name: "id",
                location: "elfStatus",
                weapon: "weaponTier",
                hp: "health",
                ap: "attack",
                level: "level",
                cooldown: "time",
                class: "classString",
                action: "actionString",
            };
            const isDesc = sortBy.order === "desc";
            const attribute = attributeMap[sortBy.value];
            const sortByFunction = (a, b) => {
                switch (sortBy.value) {
                    case "inventory":
                        return isDesc
                            ? a.inventory[0] - b.inventory[0]
                            : b.inventory[0] - a.inventory[0];
                    case "class":
                    case "action":
                    case "elfStatus":
                        return isDesc
                            ? a[attribute].localeCompare(b[attribute])
                            : b[attribute].localeCompare(a[attribute]);
                    default:
                        return isDesc
                            ? a[attribute] - b[attribute]
                            : b[attribute] - a[attribute];
                }
            };
            setSortedElves([...nftData?.sort(sortByFunction)]);
        }, [nftData, sortBy]);

        const SortColumnButtons = (props) => {
          const ascActiveClass = (sortBy?.value === props?.value
              && sortBy?.order === "asc") ? "active" : "";
          const descActiveClass = (sortBy?.value === props?.value
              && sortBy?.order === "desc") ? "active" : "";
          return (
              <div className="sort-buttons">
                  <button
                      className={`sort-button ${ascActiveClass}`}
                      onClick={() => setSortBy({
                          value: props?.value,
                          order: "asc",
                      })}
                  >
                      &#x25B2;
                  </button>
                  <button
                      className={`sort-button ${descActiveClass}`}
                      onClick={() => setSortBy({
                          value: props?.value,
                          order: "desc",
                      })}
                  >
                      &#x25BC;
                  </button>
              </div>
          );
        };




    


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
                            <select value={tryCampaign} onChange={(e) => setTryCampaign(e.target.value)}>
                                {campaignsPoly.map((campaign) => {
                                    let label = `${campaign.id}. ${campaign.name}`;
                                    return (
                                        <option value={campaign.id}>{label}</option>
                                    );
                                })}
                            </select>
                            <label>Section</label>
                            <input type="number" min="1" max="5" value={trySection} onChange={(e) => setTrySection(e.target.value)}/>
                            <label>Re-roll Weapon</label>
                            <input type="checkbox" checked={tryWeapon} onChange={(e) => setTryWeapon(!tryWeapon)}/>
                            <label>Re-roll Item</label>
                            <input type="checkbox" checked={tryItem} onChange={(e) => setTryItem(!tryItem)}/>
                            <label>Use Item</label>
                            <input type="checkbox" checked={useItem} onChange={(e) => setUseItem(!useItem)}/>
                        </div>
                    
                        <div className="flex">
                        <button
                            className="btn-whale"
                            onClick={sendCampaignFunction}
                        >
                            campaign
                        </button>
                        </div>
                        
                    </div>
                </div>
            )
        }

        
        const renderBTModal = () => {
            if(!campaignBTModal) return <></>
            return(
                <div className="modal modal-whale-campaign">
                    <div className="modal-content items-center">
                        <span className="close-modal" onClick={() => setCampaignBTModal(false)}>X</span>
                        <h3>All selected Elves will go to the same campaign</h3>
                        <div className="modal-whale-campaign-grid">
                            <label>Campaign</label>
                            <select value={tryCampaign} onChange={(e) => setTryCampaign(e.target.value)}>
                                {campaignsPoly.map((campaign) => {
                                    let label = `${campaign.id}. ${campaign.name}`;
                                    return (
                                        <option value={campaign.id}>{label}</option>
                                    );
                                })}
                            </select>
                            <label>Section</label>
                            <input type="number" min="1" max="5" value={trySection} onChange={(e) => setTrySection(e.target.value)}/>
                        </div>
                    
                        <div className="flex">

                        <button
                            className="btn-whale"
                            onClick={bloodthirstFunction}
                        >
                            bloodthirst
                        </button>
                        </div>
                        
                    </div>
                </div>
            )
        }







    return !loading ? (
        
        <>

        
            <div className="dark-1000 h-full d-flex flex-column profile">           
           
                <div className="d-flex">      
                    <div className="column">
                  
                        <div className="flex">
                                               
                        <h2>GamePlay</h2>
                       
                        </div>
                    
                    <div className="flex p-10">
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
                            onClick={healing}
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
                        <button
                            disabled={!isButtonEnabled.sendCampaign}
                            className="btn-whale"
                            onClick={()=> setCampaignBTModal(true)}
                        >
                            Bloodthirst
                        </button>

                        
                    </div>   
            <div>
                <div>Elf Terminus</div>

            <div className="flex p-10">
                       
                       <div>
                    
                       <input type={"text"} placeholder={"Ren To Transfer"} value={renTransfer} onChange={(e) => setRenTransfer(e.target.value)}/>
          
                      
                       </div>
                     
                       
                        <button
                            /*disabled={!isButtonEnabled.unstake}*/
                            className="btn-whale"
                            onClick={checkinElf}
                        >
                            Send to Ethereum
                        </button>


                    </div>      
                
            </div>
                
                 
                    
    <div className="table-whale">          
      <table style={{width: '100%'}}>
      <thead style={{textAlign: "left"}}>
        <tr>
        <th></th>
        <th>
            <div className="flex">
                <span>Name</span>
                <SortColumnButtons value="name" />
            </div>
        </th>
        <th>
            <div className="flex">
                <span>Location</span>
                <SortColumnButtons value="location" />
            </div>
        </th>
        <th>
            <div className="flex">
                <span>Inventory</span>
                <SortColumnButtons value="inventory" />
            </div>
        </th>
        <th>
            <div className="flex">
                <span>Weapon Name</span>
                <SortColumnButtons value="weapon" />
            </div>
        </th>
        <th>
            <div className="flex">
                <span>HP+</span>
                <SortColumnButtons value="hp" />
            </div>
        </th>
        <th>
            <div className="flex">
                <span>AP+</span>
                <SortColumnButtons value="ap" />
            </div>
        </th>
        <th>
            <div className="flex">
                <span>Level</span>
                <SortColumnButtons value="level" />
            </div>
        </th>
        <th>
            <div className="flex">
                <span>Class</span>
                <SortColumnButtons value="class" />
            </div>
        </th>
        <th>
            <div className="flex">
                <span>Action Taken</span>
                <SortColumnButtons value="action" />
            </div>
        </th>
        <th>
            <div className="flex">
                <span>Cooldown (-) /<br />Passive (+)</span>
                <SortColumnButtons value="cooldown" />
            </div>
        </th>
        </tr>
      </thead>
      <tbody>
     

            {sortedElves.map((line, index) => {


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

                                       


                return( <tr key={index} className={`${rowSelected} row`} onClick={()=> handleClick(parseInt(line.id))}  > 
                    <td>
                    {line.image && <img src={line.image} alt="elf" />}
                    </td>
                    <td>{line.name}</td>
                    <td>{line.elfStatus}</td>
                    <td>
                        { line.inventoryString !== "Empty" ? (
                        <div className="item-info">
                            {line.inventoryImage && <img src={line.inventoryImage} alt="Item" />}
                            <strong>{line.inventoryString}</strong>
                            {line.inventoryDescription && <span>{line.inventoryDescription}</span>}
                        </div>
                        ) : (
                            <strong>-</strong>
                        )}
                    </td>
                    {/*<td>{line.primaryWeapon}</td>        */} 
                    <td>{line.attributes && line.attributes[3].value} +{line.weaponTier}</td>        
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
                    const elf = nftData.find(line => line.id === id)
                  
                    return(
                        
                            <div className="whale-thumb" key={index}>
                            {elf.image && <img src={elf.image} alt="elf" />}
                            </div>
                    )})}

              </div>


            </div>

     
      </div>
            
                
</div>

</div>
{renderModal()}
{renderBTModal()}
{alert.show && showAlert(alert.value)}

        </>
        
     
    ) : <Loader text={status} />
}

export default PlayPolygon