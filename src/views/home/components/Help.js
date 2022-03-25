import React, { useState, useEffect } from "react"
import { useMoralis } from "react-moralis"
import Dropdown from "../../../components/Dropdown/"
import Button from "../../../components/Dropdown/button";
import {
    checkIn,
    unStake,
    polygonContract,
    polyweb3
} from "../../../utils/interact"
import Modal from "../../../components/Modal"
import Loader from "../../../components/Loader";
import thevoid from "../../../assets/images/thevoid.png";
import Countdown from 'react-countdown';
import { actionString, sentinelClass } from "../config";

const Help = ({ consoleOpen, data, toggle, owner, clicked, selectAll, excludeAction, visualMode, setVisualMode, toggleChain, chain, setAlert, setReloadData, reloadData }) => {

    const { Moralis } = useMoralis();
    // console.log(data)
    const [now, setNow] = useState(new Date());
    const [timer, setTimer] = useState(0);
    const [classes, setClasses] = useState([])
    const [actions, setActions] = useState([])
    const [levels, setLevels] = useState([])
    const [weapons, setWeapons] = useState([])
    const [filterdData, setFilteredData] = useState(data)
    const [classCnt, setClassCnt] = useState()
    const [actionCnt, setActionCnt] = useState()
    const [levelCnt, setLevelCnt] = useState()
    const [weaponCnt, setWeaponCnt] = useState()
    const [toggleAll, setToggleAll] = useState(true)
    const [transfersModal, setTransfersModal] = useState(false)
    const [activeNfts, setActiveNfts] = useState(true)
    const [renTransfer, setRenTransfer] = useState("")
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState("")
    const handleClick = (nft) => {
        toggle(nft)
    }
    const getTimeString = (timestamp) => {
        const endTime = new Date(timestamp * 1000)
        const elapsed = endTime.getTime() - now.getTime()
        const seconds = Number(elapsed / 1000);
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor(seconds % (3600 * 24) / 3600);
        const m = Math.floor(seconds % 3600 / 60);
        const s = Math.floor(seconds % 60);
        return d > 0 ? `${d.toString().padStart(2, '0')}:${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` : h > 0 ? `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` : `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }
    useEffect(() => {
        setTimeout(() => {
            setNow(new Date())
            setTimer(timer * -1)
        }, 1000)
    }, [timer])
    useEffect(() => {
        let tmpData = data
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
        setFilteredData(tmpData)
    }, [data, classes, actions, levels, weapons])
    useEffect(() => {
        const countClasses = {}
        const countActions = {}
        const countLevels = {}
        const countWeapons = {}
        data.forEach((nft) => {
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
    }, [data])
    const handleSelectAll = () => {
        if (filterdData.length === 0) return
        selectAll()
        if (toggleAll) selectAll(filterdData)
        setToggleAll(toggle => !toggle)
    }
    useEffect(() => {
        if (clicked.length === filterdData.length) setToggleAll(false)
        else setToggleAll(true)
        if (filterdData.length === 0) setToggleAll(true)
    }, [clicked, filterdData])

    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    const resetVariables = async () => {

        setActiveNfts(!activeNfts)
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
    const renderTransfersModal = () => {
        return (
            <Modal show={transfersModal} setShow={setTransfersModal}>
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


        if (chain === "eth") {
            const params = { ids: ids, renAmount: (renToSend).toString() }

            console.log(params)
            let { success, status, txHash } = await checkIn(params)



            success && setAlert({ show: true, value: { title: "Tx Sent", content: (status) } })

        } else {

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
    return (!loading ?
        <>
            <div className="collection-content d-flex flex-column">
                <div className="flex justify-center p-1 tool-panel">

                    {/*  <button className="btn-whale" onClick={() => setMintModal(!mintModal)}> Mint </button> */}
                    <button className="btn-whale" onClick={() => setTransfersModal(!transfersModal)}> Transfers </button>
                    {chain === "eth" && <button className="btn-whale" onClick={unStakeElf}> Unstake </button>}

                    {/* <button className="btn-whale" onClick={() => setMaximize(!maximize)}> {!maximize ? "expand table" : "minimize table"} </button> */}
                    {/*<button disabled className="btn-whale" onClick={() => setVisualMode(!visualMode)}>Visual mode</button>*/}
                    <button className="btn btn-green" onClick={() => setReloadData(!reloadData)}>Reload Data</button>
                    <button className="btn btn-blue" onClick={toggleChain}>Active: {chain}</button>
                    <button className="btn btn-blue" onClick={() => setVisualMode(!visualMode)}>Visual: {!visualMode ? "Table" : "Card"}</button>
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
                    <span className="total-sentinel">Total Sentinels ({data.length})</span>
                </div>
                <div className={!consoleOpen ? "collection-panel mt-1" : "collection-panel-max mt-1"} >
                    <div className="collection-selection" >
                        <div className="card-grid">
                            {filterdData.map((nft) => (
                                <div className={`character-card ${nft.action === 8 ? "greyout" : ""} ${clicked.includes(nft) ? "active" : ""}`} key={nft.id} onClick={() => { handleClick(nft) }}>
                                    <div className="d-flex justify-between font-size-sm" style={{ width: 180, height: 15 }}>
                                        <span>{nft.actionString}</span>
                                        <span>#{nft.id}</span>
                                    </div>
                                    <img className="character-image" src={nft.image} />
                                    <span>Level: {nft.level}</span>
                                    <div className="d-flex justify-between font-size-xs items-center mt-1">
                                        <span className="props-title">weapon</span>
                                        <span className="props-value">{nft.attributes[3].value}</span>
                                    </div>
                                    <div className="d-flex justify-between font-size-xs items-center mt-1">
                                        <span className="props-title">item</span>
                                        <span className="props-value">{nft.inventoryString}</span>
                                    </div>
                                    <div className="d-flex justify-between font-size-xs items-center mt-1">
                                        <span className="props-title">timer</span>
                                        <span className="props-value">{Date.now() > nft.time * 1000 ? "" : getTimeString(nft.time)}</span>
                                    </div>
                                    <div className="d-flex justify-between font-size-xs items-center mt-1">
                                        <span className="props-title">hp</span>
                                        <span>{nft.health}</span>
                                        <span className="props-title">ap</span>
                                        <span>{nft.attack}</span>
                                    </div>
                                    <div className="d-flex justify-between font-size-xs items-center">
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="card-view">
                    {filterdData.map((line) => {

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
            </div>

            {transfersModal && renderTransfersModal()}
        </> :
        <Loader text={status} />

    )
}

export default Help