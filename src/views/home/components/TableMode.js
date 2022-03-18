import React, { useEffect, useState, useMemo } from "react"
import { useMoralis } from "react-moralis"
import "./../style.css"
import Countdown from 'react-countdown';
import {
    checkIn,
    unStake,
    polygonContract,
    polyweb3
} from "../../../utils/interact"

import Modal from "../../../components/Modal"
import Mint from "../../mint";
import Loader from "../../../components/Loader";
import thevoid from "../../../assets/images/thevoid.png";
import Dropdown from "../../../components/Dropdown/";
import Button from "../../../components/Dropdown/button";
import { actionString, sentinelClass } from "../config";

const allowedWallets = ["0xccb6d1e4acec2373077cb4a6151b1506f873a1a5"]


const TableMode = ({ consoleOpen, setAlert, nftData, owner, clicked, selectAll, toggle, chain, toggleChain, setVisualMode, visualMode, reloadData, setReloadData, polyBalance }) => {


    const { Moralis } = useMoralis();
    const [sortBy, setSortBy] = useState({ value: "cooldown", order: "desc" });
    const [renTransfer, setRenTransfer] = useState("")
    const [allowed, setAllowed] = useState(false)
    // const [maximize, setMaximize] = useState(false)

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
    //  const [alert, setAlert] = useState({show: false, value: null})
    const [mintModal, setMintModal] = useState(false)
    const [transfersModal, setTransfersModal] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState("")

    const [classes, setClasses] = useState([])
    const [actions, setActions] = useState([])
    const [levels, setLevels] = useState([])
    const [weapons, setWeapons] = useState([])
    // const [filterdData, setFilteredData] = useState(data)
    const [classCnt, setClassCnt] = useState()
    const [actionCnt, setActionCnt] = useState()
    const [levelCnt, setLevelCnt] = useState()
    const [weaponCnt, setWeaponCnt] = useState()
    const [toggleAll, setToggleAll] = useState(true)
    useEffect(() => {
        const countClasses = {}
        const countActions = {}
        const countLevels = {}
        const countWeapons = {}
        nftData.forEach((nft) => {
            // console.log(nft)
            const actionText = actionString.filter((item) => item.action === nft.action)[0].text
            countClasses[nft.classString] = (countClasses[nft.classString] || 0) + 1
            countActions[actionText] = (countActions[actionText] || 0) + 1
            countLevels[nft.level] = (countLevels[nft.level] || 0) + 1
            if (nft.attributes) countWeapons[nft.attributes[3].value] = (countWeapons[nft.attributes[3].value] || 0) + 1
        })
        setClassCnt(countClasses)
        setActionCnt(countActions)
        setLevelCnt(countLevels)
        setWeaponCnt(countWeapons)
    }, [nftData])
    const resetVariables = async () => {

        setNfts([])
        setTxReceipt([])
        setActiveNfts(!activeNfts)

    }

    useEffect(() => {
        if (allowedWallets.includes(owner)) {
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
            if (selectedElves.length === 0) return { ...accumulator, [key]: false };

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
            return { ...accumulator, [key]: value };
        }

        const buttonEnabledState = Object.keys(isButtonEnabled).reduce(reducer, {});

        setIsButtonEnabled(buttonEnabledState);
    }, [clicked, nftData]);

    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
      }

    const sendGaslessFunction = async (params) => {

        setLoading(true)
        setStatus("Loading...")
        let tx

        try {
            tx = await Moralis.Cloud.run("defenderRelayDev", params)

            console.log(tx)
            if (tx.data.status) {

                let fixString = tx.data.result.replaceAll("\"", "")

                let txHashLink = `https://polygonscan.com/tx/${fixString}`
                let successMessage = <>Check out your transaction on <a target="_blank" href={txHashLink}>Polyscan</a> </>

                await sleep(7000)
                let transactionReceipt = null
                 
                  while (transactionReceipt == null) { // Waiting expectedBlockTime until the transaction is mined
                      transactionReceipt = await polyweb3.eth.getTransactionReceipt(fixString);
                      setStatus("Waiting for transaction to be mined...")
                      await sleep(2000)
                  }
                  setStatus("Transaction mined...")


                resetVariables()
                setAlert({ show: true, value: { title: "Tx Sent", content: (successMessage) } })
            }


        } catch (e) {
            console.log(e)
        }
        setLoading(false)
    }
    const checkinElf = async () => {
        // get cooldown from clicked and get action from clicked
        ///get ids that have cooldown from clicked
        let cooldownIds = clicked.filter(elf => elf.cooldown === true)
        if (cooldownIds.length > 0) {
            setAlert({ show: true, value: { title: "Cooldown", content: "You can't check in elves that are on cooldown" } })
            setTransfersModal(!transfersModal)
            return
        }
        //get ids that have action 2 from clicked
        let action2Ids = clicked.filter(elf => elf.action === 3)
        console.log(action2Ids, cooldownIds)
        if (action2Ids.length > 0) {
            setTransfersModal(!transfersModal)
            setAlert({ show: true, value: { title: "Action", content: "You can't check in elves that are on passive" } })
            return
        }
        let renToSend = renTransfer === "" ? 0 : renTransfer
        console.log(renToSend, renTransfer)
        let ids = clicked.map((elf) => elf.id)
        renToSend = Moralis.Units.ETH(renToSend)
           

        if(chain === "eth"){
            const params =  {ids: ids, renAmount: (renToSend).toString()}

            console.log(params)
            let {success, status, txHash} = await checkIn(params)

            
     
            success && setAlert({show: true, value: {title: "Tx Sent", content: (status)}})

        }else{

            /*if(Moralis.Units.ETH(polyBalance) < renToSend){
                setAlert({show: true, value: {title: "Not enough REN", content: (`You need ${(renToSend -polyBalance)/1000000000000000000 } more REN`)}})
                return
            }*/
            const params = { functionCall: polygonContract.methods.checkIn(ids, 0, owner).encodeABI() }
            console.log(renToSend, params)
            
            sendGaslessFunction(params)
        }
        setTransfersModal(!transfersModal)
    }

    const unStakeElf = async () => {
        if (chain === "polygon") {
            setAlert({ show: true, value: { title: "Not supported", content: "Unstaking is not supported on Polygon" } })
            return
        }
        if (clicked.length === 0) {
            setAlert({ show: true, value: { title: "No Elves", content: "You need to select at least one elf" } })
            return
        }
        let ids = clicked.map((elf) => elf.id)
        const params = { ids: ids }
        let { success, status, txHash } = await unStake(params)
        success && resetVariables()
        setAlert({ show: true, value: { title: "Tx Sent", content: (status) } })
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
        let tmpData = nftData
        if (classes.length) {
            tmpData = tmpData.filter(element => classes.includes(element.classString))
        }
        if (actions.length) {
            let actionIds = actions.map((action) => {
                return actionString.filter(item => item.text === action)[0].action
            })
            tmpData = tmpData.filter(element => actionIds.includes(element.action))
        }
        if (levels.length) {
            tmpData = tmpData.filter(element => levels.includes(element.level.toString()))
        }
        if (weapons.length) {
            tmpData = tmpData.filter(element => weapons.includes(element.attributes[3]?.value))
        }
        setSortedElves([...tmpData?.sort(sortByFunction)]);
    }, [nftData, sortBy, classes, actions, levels, weapons]);

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

    const showAlert = ({ title, content }) => {
        return (
            <div className="alert">
                <h3>{title}</h3>
                <pre>{content}</pre>
                <button className="btn btn-red" onClick={() => setAlert({ show: false })}>close</button>
            </div>
        )
    }

    const renderMintModal = () => {
        return (
            <Modal show={mintModal}>
                <Mint />
            </Modal>
        )
    }

    const renderTransfersModal = () => {
        return (
            <Modal show={transfersModal}>
                <h4>Prism Transfer Module</h4>
                <img src={thevoid} alt="elfTerminus" />
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
                <div className="flex items-center mt-1 flex-wrap justify-center gap-1">
                    {chain === "eth" && <input type={"text"} placeholder={"Ren To Transfer"} value={renTransfer} onChange={(e) => setRenTransfer(e.target.value)} />}
                    <button className="btn-whale" onClick={checkinElf}>
                        Confirm Transfer
                    </button>
                </div>
            </Modal>

        )
    }
    const handleSelectAll = () => {
        if (sortedElves.length === 0) return
        selectAll()
        if (toggleAll) selectAll(sortedElves)
        // console.log("toggle all")
        setToggleAll(toggle => !toggle)
    }
    return !loading ? (
        <>
            <div className="flex justify-center p-1 tool-panel">
                
              {/*  <button className="btn-whale" onClick={() => setMintModal(!mintModal)}> Mint </button> */}
              <button className="btn-whale" onClick={() => setTransfersModal(!transfersModal)}> Transfers </button>
               {chain === "eth" && <button className="btn-whale" onClick={unStakeElf}> Unstake </button>}
               
                {/* <button className="btn-whale" onClick={() => setMaximize(!maximize)}> {!maximize ? "expand table" : "minimize table"} </button> */}
                {/*<button disabled className="btn-whale" onClick={() => setVisualMode(!visualMode)}>Visual mode</button>*/}
                <button className="btn btn-green" onClick={() => setReloadData(!reloadData)}>Reload Data</button>
                <button className="btn btn-blue" onClick={toggleChain}>Active: {chain}</button>
            </div>
            <div className="mobile-footer">
                <button className="btn btn-blue mobile" onClick={toggleChain}>Active: {chain}</button>
                <button className="btn btn-blue mobile" onClick={() => setTransfersModal(!transfersModal)}>Transfers</button>
            </div>
            
            <div className="filter-panel justify-center p-1">
                <Dropdown title="Action" options={["unstake", "stake", "campaign", "passive mode", "return", "re-roll weapon", "re-roll item", "healing", "polygon", "synergize", "bloodthirst"]} count={actionCnt} onChange={setActions} selected={actions} />
                <Dropdown title="Class" options={["Assassin", "Druid", "Ranger"]} onChange={setClasses} selected={classes} count={classCnt} />
                <Dropdown title="Level" options={levelCnt ? Object.keys(levelCnt) : []} onChange={setLevels} selected={levels} count={levelCnt} />
                {/* <Button onClick={handleSelectAll} value={toggleAll ? "Select All" : "Deselect All"} /> */}
                <Dropdown title="Weapon" options={weaponCnt ? Object.keys(weaponCnt) : []} onChange={setWeapons} selected={weapons} count={weaponCnt} />
                <span className="total-sentinel">Total Sentinels ({nftData.length})</span>
            </div>
            <div className={!consoleOpen ? "collection-panel mt-2" : "collection-panel-max mt-2"} >
                <div className="collection-selection" >

                    <div className="table-whale">
                        <table className="dark-1000" style={{ width: '100%' }}>
                            <thead style={{ textAlign: "left" }}>
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
                                            <span>Accessories / Morphs</span>                                           
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

                                    let showTier = line.sentinelClass !== 0 ? true : false

                                    if (line.action === 3) {
                                        const hours = Math.floor(((new Date() - date) / 1000) / (60 * 60))
                                        let timesince = hours

                                       
                                        if (timesince < 24) {
                                            passiveString = `${timesince} hours`
                                        } else {
                                            let timesince = Math.floor(((new Date() - date) / 1000) / (60 * 60 * 24))
                                            passiveString = `${timesince} days ${hours % 24} hours`
                                        }
                                    }

                                    let rowSelected = clicked.includes(line) ? "rowSelected" : ""

                                    return (<tr key={line.id} className={`${rowSelected} row`} onClick={() => handleClick(line)}  >
                                        <td>
                                            {line.image && <img src={line.image} alt="elf" />}
                                        </td>
                                        <td>{line.name}</td>
                                        <td>{line.elfStatus}</td>
                                        <td>
                                            {line.inventoryString !== "Empty" ? (
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
                                        <td>
                                            <div className="acc-info">
                                            <strong>{line.accessoriesName}</strong>
                                            <br/>
                                            {line.accessoriesAbility && <span>{line.accessoriesAbility}</span>}
                                            <br/>
                                            {showTier && <span>Tier: {line.accessoriesTier}</span>}
                                            </div>
                                        </td>
                                        <td>{line.health}</td>
                                        <td>{line.attack}</td>
                                        <td>{line.level}</td>
                                        <td>{line.classString}</td>
                                        <td>{line.actionString}</td>
                                        <td>{!isActive && !passiveFlag && <Countdown date={date} />}
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
            <div className="card-view">
                {sortedElves.map((line) => {

                    const date = new Date(line.time * 1000)
                    const isActive = new Date() > date
                    let passiveString = ""

                    let passiveFlag = false

                    ///turn date in tto hours if less than 24 then into days    
                    if (line.action === 3) {
                        let timesince = Math.floor(((new Date() - date) / 1000) / (60 * 60))
                        if (timesince < 24) {
                            passiveString = `${timesince} hours`
                        } else {
                            let timesince = Math.floor(((new Date() - date) / 1000) / (60 * 60 * 24))
                            passiveString = `${timesince} days`
                        }
                    }

                    let rowSelected = clicked.includes(line) ? "active" : ""

                    return (<div key={line.id} className={`${rowSelected} card-rect`} onClick={() => handleClick(line)}  >
                        {line.image && <img className="card-image" src={line.image} alt="elf" />}
                        <div className="card-attr">
                            <div><span>name:</span><span>{line.name}</span></div>
                            <div><span>Location:</span><span>{line.elfStatus}</span></div>
                            <div>
                                <span>Inventory</span>
                                <span>{line.inventoryString !== "Empty" ? (
                                    <div className="item-info">
                                        {line.inventoryImage && <img src={line.inventoryImage} alt="Item" />}
                                        <strong>{line.inventoryString}</strong>
                                        {line.inventoryDescription && <span>{line.inventoryDescription}</span>}
                                    </div>
                                ) : (
                                    <strong>-</strong>
                                )}</span>
                            </div>
                            {/*<div>{line.primaryWeapon}</div>        */}
                            <div><span>Weapon:</span><span>{line.attributes && line.attributes[3].value} +{line.weaponTier}</span></div>
                            <div>
                                <span>HP:</span>
                                <span>{line.health}</span>
                                <span>AP:</span>
                                <span>{line.attack}</span>
                                <span>Level:</span>
                                <span>{line.level}</span>
                            </div>
                            <div><span>Class:</span><span>{line.classString}</span></div>
                            <div><span>Action Taken:</span><span>{line.actionString}</span></div>
                            <div>
                                <span>Cooldown(-)/<br />Passive(+):</span><span>{!isActive && !passiveFlag && <Countdown date={date} />}
                                    {passiveString}
                                </span>
                            </div>
                        </div>
                    </div>)
                }
                )}
            </div>
            {renderMintModal()}
            {renderTransfersModal()}
            {/*alert.show && showAlert(alert.value)*/}
        </>
    ) : <Loader text={status} />
}

export default TableMode