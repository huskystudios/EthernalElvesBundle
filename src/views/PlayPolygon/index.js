import React, { useEffect, useState, useMemo } from "react"
import Loader from "../../components/Loader"
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis"
import Countdown from 'react-countdown';
import {lookupMultipleElves, getCurrentWalletConnected, polygonContract, polyweb3} from "../../utils/interact"
import Modal from "../../components/Modal"
import Sector from "../../views/home/components/Sector"




const PlayPolygon = () => {

    const [loading, setLoading] = useState(true)
    const { Moralis } = useMoralis();
    const [status, setStatus] = useState("")
    const [sortBy, setSortBy] = useState({ value: "cooldown", order: "desc" });
    const [tryItem, setTryItem] = useState(1)
    const [useItem, setUseItem] = useState(1)

    const owner = window.ethereum.selectedAddress

    const [renTransfer, setRenTransfer] = useState("")
    
    const [isButtonEnabled, setIsButtonEnabled] = useState({
        unstake: false,
        rerollWeapon: false,
        rerollItem: false,
        sendPassive: false,
        returnPassive: false,
        heal: false,
        healMany: false,
        sendCampaign: false,
        synergize: false,
    });
 
    

    const [clicked, setClicked] = useState([]);

    const [nftData, setNftData] = useState([])
    const [sortedElves, setSortedElves] = useState([])
    const [activeNfts, setActiveNfts] = useState(true)
    const [nfts, setNfts] = useState([])
    const [txreceipt, setTxReceipt] = useState()
    const [alert, setAlert] = useState({show: false, value: null})
    const [campaignModal, setCampaignModal] = useState(false)
    const [campaignBTModal, setCampaignBTModal] = useState(false)
    const [confirm, setConfirm] = useState(false)
   
    const resetVariables = async () => {
        setClicked([])
        setNftData([])
        setNfts([])
        setTxReceipt([])
        setCampaignModal(false)
        setCampaignModal(!campaignModal)
        setActiveNfts(!activeNfts)

    }
    
 
   const handleClick = async (id) => {

    if (clicked.includes(id.id)) {
        setClicked(clicked.filter(item => item !== id.id))
        setNfts(nfts.filter(item => item !== id))
    } else {

        if(clicked.length <= 9) {
            setClicked([...clicked, id.id])
            setNfts([...nfts, id])
            }else{
                setAlert({show: true, value: {title: "Max selected", content: ("You can only select ten items at a time")}})
            }
        
    }
}


    useMemo(() => {
        const selectedElves = nftData?.filter((elf) => clicked.includes(elf.id));

        const isInactive = (elf) => new Date() > new Date(elf.time * 1000);
        const isPassive = (elf) => elf.action === 3;
        const isStaked = (elf) => elf.elfStatus === "staked";
        const isDruid = (elf) => elf.sentinelClass === 0;
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
                case "synergize":                    
                    value = selectedElves.every((elf) => !isInactive(elf) && isDruid(elf));
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


        let tx 

        setLoading(true)
        setCampaignModal(false)
        
        try{
            tx = await Moralis.Cloud.run("defenderRelay", params) 

            console.log(tx)
            if(tx.data.status){

                let fixString = tx.data.result.replaceAll("\"", "")

            let txHashLink = `https://polygonscan.com/tx/${fixString}`
            let successMessage = <>Check out your transaction on <a target="_blank" href={txHashLink}>Polyscan</a> </>
            resetVariables()     
            setAlert({show: true, value: {title: "Tx Sent", content: (successMessage)}})
            }           


        }catch(e){
            console.log(e)
        }

        setLoading(false)

        console.log(tx)

        /*
        const defenderWebhook = "https://api.defender.openzeppelin.com/autotasks/bd97eb6c-8038-466e-9e15-2e933b927dcb/runs/webhook/c897a8c7-c0e5-45ac-abf5-341f0dec2d40/Hd8ttFMzNMuWa7NSZv6meg"

        try{
            let tx = await fetch(defenderWebhook, {
             method: 'POST',
             body: params.functionCall,
             headers: {
                 'Content-Type': 'application/json'
             },
         });

         console.log(tx)
         }catch(e){
             console.log(e)
             

         }
*/


/*        setLoading(true)
        setCampaignModal(false)
        let response 
  
        setStatus("Getting signed transaction from dApp. Please do not close the window.")

     
        //let response = await Moralis.Cloud.run("operatorTransactor", params)
        let signedTransaction = await Moralis.Cloud.run("operatorTransactorSignedTransaction", params) 

        try{
            setStatus("Got signed transaction from operator... Sending gasless transaction... Please do not close the window.")
            response =  await polyweb3.eth.sendSignedTransaction(signedTransaction.rawTransaction); 
            console.log("SEND HUSKY THIS", response)
        if(response.status){

            let txHashLink = `https://polygonscan.com/tx/${response.transactionHash}`
            let successMessage = <>Check out your transaction on <a target="_blank" href={txHashLink}>Polyscan</a> </>
            resetVariables()     
            setAlert({show: true, value: {title: "Tx Sent", content: (successMessage)}})

        }else{
            setAlert({show: true, value: {title: "Error", content: ("Something went wrong")}})
        }
        }catch(e){
            console.log(e)
            setAlert({show: true, value: {title: "Error", content: ("Something went wrong")}})
        }
        
       
        setLoading(false)*/

    }

    const sendCampaignFunction = async (campParams) => {
           
        //const params =  {functionCall: polygonContract.methods.sendCampaign(clicked, tryCampaign, trySection, tryWeapon, tryItem, useItem, owner).encodeABI()}
        const params =  {functionCall: polygonContract.methods.sendCampaign(clicked, campParams.tryCampaign, campParams.trySection, campParams.tryWeapon, campParams.tryItem, campParams.useItem, owner ).encodeABI()}
        await sendGaslessFunction(params)
        
    }

    const bloodthirstFunction = async () => {
           
        const params =  {functionCall: polygonContract.methods.bloodThirst(clicked, tryItem, useItem, owner).encodeABI()}
        await sendGaslessFunction(params)
        
    }

    const druidSynergize = async () => {
           
        const params =  {functionCall: polygonContract.methods.synergize(clicked, owner).encodeABI()}
        await sendGaslessFunction(params)
        
    }


    const checkinElf = async () => {

        let renToSend = renTransfer === "" ? 0 : renTransfer

        renToSend = Moralis.Units.ETH(renToSend)
        console.log(renToSend)
        
        const params =  {functionCall: polygonContract.methods.checkIn(clicked, renToSend, owner).encodeABI()}
        await sendGaslessFunction(params)
                      
    }

    const reRoll = async (option) => {
      
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

         const healMany = async () => {

            //split the array clicked into two arrays

            let firstHalf = clicked.slice(0, clicked.length/2)
            let secondHalf = clicked.slice(clicked.length/2, clicked.length)

            const params =  {functionCall: polygonContract.methods.healMany(firstHalf, secondHalf, owner).encodeABI()}
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
                        

                setStatus("army of " + tokenArr.length + " elves")
                const lookupParams = {array: tokenArr, chain: "polygon"}

                const elves = await lookupMultipleElves(lookupParams)
                elves.sort((a, b) => a.time - b.time) 
                //filter out elves whos action is ===8 
                const filteredElves = elves.filter((elf) => elf.action !== 0)
                
                setNftData(filteredElves)        
                setStatus(filteredElves.length + " elves")
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

            return(
                <Modal show={campaignModal}>
                        <Sector showpagination={true} chain={"polygon"} data={nfts} onSendCampaign={sendCampaignFunction} onChangeIndex={onChangeIndex} mode={"campaign"} />
                </Modal>
             )
         }


       
       


        
        const onChangeIndex = () => {
      
            return null
        }

        ///create a function to confirm an action



        
        const renderBTModal = () => {
        
            return(
                <Modal show={campaignBTModal}>
                        <h3>Bloodthirst!</h3>
                        
                        Creature Health is 400HP
                        <br/>
                        rewards 
                        <br/>
                        weaponTier 3 is 80 $REN
                        <br/>
                        weaponTier 4 is 95 $REN
                        <br/>
                        weaponTier 5 is 110 $REN
                        <br/>
                       

                        <>
                    <div >
                    <p>items - look for new items?</p>
                    </div>
                    <div className="flex" >
                    <div className="d-flex items-center">
           
                        <div 
                            className={tryItem ? "btn-sector-option active" : "btn-sector-option"} 
                            onClick={() => setTryItem(state => !state)} 
                          
                        >
                            item
                        </div>
                        </div>
                        <div className="d-flex items-center">
                        <div 
                            className={useItem ? "btn-sector-option active" : "btn-sector-option"} 
                            onClick={() => setUseItem(state => !state)}
                          
                        >
                            use item
                        </div>
                    </div>
                    </div>
                    </>
                    
                        <div className="flex">

                        <button
                        
                            className="btn btn-red"
                            onClick={bloodthirstFunction}
                        >
                            bloodthirst
                        </button>
                        </div>
                        </Modal>
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
                            disabled={!isButtonEnabled.synergize}
                            className="btn-whale"
                            onClick={() => druidSynergize()}
                        >
                            Synergize Druid
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
                            //disabled={!isButtonEnabled.healMany}
                            className="btn-whale"
                            onClick={healMany}
                        >
                            Heal Many
                        </button>
                        <button
                            disabled={!isButtonEnabled.sendCampaign}
                            className="btn-whale"
                            onClick={()=> setCampaignModal(!campaignModal)}
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

                                       


                    return( <tr key={index} className={`${rowSelected} row`} onClick={()=> handleClick(line)}  > 
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
                    <li>Healing: click a Druid then click the Ranger or Assassin you want to heal next. Then click heal. You should have selected only two elves.</li>
                    <li>Heal Many: click a few Druids then click the same number of Rangers or Assassins and then click heal many.</li>
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