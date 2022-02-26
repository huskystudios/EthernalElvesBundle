import React, { useEffect, useState, useMemo } from "react"
import { useMoralis } from "react-moralis"
import "./../style.css"
import Countdown from 'react-countdown';
import {
    checkIn,
    unStake, 
    polygonContract, 
} from "../../../utils/interact"

import Modal from "../../../components/Modal"
import Mint from "../../mint";
import Loader from "../../../components/Loader";
import thevoid from "../../../assets/images/thevoid.png";

const allowedWallets = ["0xccfb66d52076a8295592642068c45d06fa6e36f6", "0xccb6d1e4acec2373077cb4a6151b1506f873a1a5"]


const TableMode = ({nftData, owner, clicked, toggle, chain, toggleChain, setVisualMode, visualMode, reloadData, setReloadData, polyBalance}) => {

    
    const { Moralis } = useMoralis();
    const [sortBy, setSortBy] = useState({ value: "cooldown", order: "desc" });
    const [renTransfer, setRenTransfer] = useState("")
    const [allowed, setAllowed] = useState(false)
    
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
 
  
    const [sortedElves, setSortedElves] = useState([])
    const [activeNfts, setActiveNfts] = useState(true)
    const [nfts, setNfts] = useState([])
    const [txreceipt, setTxReceipt] = useState()
    const [alert, setAlert] = useState({show: false, value: null})
    const [mintModal, setMintModal] = useState(false)
    const [transfersModal, setTransfersModal] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
   
    const resetVariables = async () => {     
  
        setNfts([])
        setTxReceipt([])      
        setActiveNfts(!activeNfts)

    }

    useEffect(() => {
        if(allowedWallets.includes(owner)) {
            setAllowed(true)
        }
    }, [owner])

    
    
 
   const handleClick = async (nft) => {
    toggle(nft)
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

        setLoading(true)
        let tx     
        
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

    }



    const checkinElf = async () => {

        // get cooldown from clicked and get action from clicked
        
       ///get ids that have cooldown from clicked
         let cooldownIds = clicked.filter(elf => elf.cooldown === true)

         if(cooldownIds.length > 0){
            setAlert({show: true, value: {title: "Cooldown", content: "You can't check in elves that are on cooldown"}})
            return
            }

            //get ids that have action 2 from clicked
            let action2Ids = clicked.filter(elf => elf.action === 3)

            console.log(action2Ids, cooldownIds)

            if(action2Ids.length > 0){
                setAlert({show: true, value: {title: "Action", content: "You can't check in elves that are on passive"}})
                return
            }


        

        let renToSend = renTransfer === "" ? 0 : renTransfer
        
        let ids = clicked.map((elf) => elf.id)

        renToSend = Moralis.Units.ETH(renToSend)
        console.log(renToSend, ids)

        if(chain === "eth"){
            const params =  {ids: ids, renAmount: (renToSend).toString()}
            let {success, status, txHash} = await checkIn(params)
     
            setAlert({show: true, value: {title: "Tx Sent", content: (status)}})

        }else{

            if(Moralis.Units.ETH(polyBalance) < renToSend){
                setAlert({show: true, value: {title: "Not enough REN", content: (`You need ${(renToSend -polyBalance)/1000000000000000000 } more REN`)}})
                return
            }

            const params =  {functionCall: polygonContract.methods.checkIn(ids, renToSend, owner).encodeABI()}
            await sendGaslessFunction(params)
            setRenTransfer(!renTransfer)
        }                      
    }

       

             const unStakeElf = async () => {

                if(chain === "polygon"){
                    setAlert({show: true, value: {title: "Not supported", content: "Unstaking is not supported on Polygon"}})
                    return
                }
                if(clicked.length === 0){
                    setAlert({show: true, value: {title: "No Elves", content: "You need to select at least one elf"}})
                    return
                }

                let ids = clicked.map((elf) => elf.id)
                
                const params =  {ids: ids}
                let {success, status, txHash} = await unStake(params)
           
                success && resetVariables()            
         
                setAlert({show: true, value: {title: "Tx Sent", content: (status)}})
                              
                }
        



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

     
       
        const renderMintModal = () => {           
            return(
                 <Modal show={mintModal}>
                     
                        <Mint />
                    
                </Modal>
            
            )
        }

        const renderTransfersModal = () => {           
            
            
            return(
                 
                 
                 <Modal show={transfersModal}>
                    
                    
                <h4>Prism Transfer Module</h4>                        
                       
                        <img src={thevoid} alt="elfTerminus" className="w-3/4"/>
                       
                   
                    <p className="text-danger">(Using the Elf Terminus can result in losing access to your elf. Please read instructions carefully.)</p>

                    <div className="flex flex-column w-full items-center">
                        <h4>Travellers Selected</h4>
                        <div className="nft-grid">
                        {clicked.map((nft) => 
                            <div className="nft-card" key={nft.id}>
                            <img src={nft.image} alt={nft.id} key={nft.id} />
                            <div className="nft-card-info">
                              
                                <p>{nft.name}</p>
                              
                            </div>
                            </div>
                        )}
                    </div>
                        
                    </div>
                    <div className="flex mt-1">
                    <input type={"text"} placeholder={"Ren To Transfer"} value={renTransfer} onChange={(e) => setRenTransfer(e.target.value)}/>
                    <button className="btn-whale"  onClick={checkinElf}>
                        Confirm Transfer
                     </button>
                    </div>
                    
                     
                
                </Modal>
            
            )
        }





    return !loading ? (
        
        <>
         <div className="d-flex">      
                    <div className="column">             

                            <div className="flex justify-center p-2">
                                    
                            {allowed && <button className="btn-whale"  onClick={()=> setTransfersModal(!transfersModal)}> Transfers </button>}
                            <button className="btn-whale" onClick={unStakeElf}> Unstake </button>
                            <button className="btn-whale" onClick={()=> setMintModal(!mintModal)}> Mint </button>
                           
                            <button disabled className="btn-whale" onClick={() => setVisualMode(!visualMode)}>Visual mode</button>
                            <button className="btn btn-green" onClick={() => setReloadData(!reloadData)}>Reload Data</button>
                            <button className="btn btn-blue" onClick={toggleChain}>Active: {chain}</button>
                            </div>      
    
        <div className="collection-panel">
             <div className="collection-selection" >
             
    <div className="table-whale">          
      <table className="dark-1000" style={{width: '100%'}}>
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
                
                    let rowSelected = clicked.includes(line) ? "rowSelected" : ""

                   


                    return( <tr key={line.id} className={`${rowSelected} row`} onClick={()=> handleClick(line)}  > 
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

            
            </div>
          </div>
      </div>
                
</div>

</div>
{renderMintModal()}
{renderTransfersModal()}
{alert.show && showAlert(alert.value)}

        </>
        
     
    ) : <Loader />
}

export default TableMode