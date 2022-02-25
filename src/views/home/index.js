import React, { useEffect, useMemo, useState } from "react"
import Loader from "../../components/Loader"
import './style.css'
import Control from "./components/Control"
import Overview from "./components/Overview"
import { campaigns, actions, actionString, rollCosts } from "./config"
import Actions from "./components/Actions"
import Receive from "./components/Receive"
import Sector from "./components/Sector"
import Success from "./components/Success"
import Collection from "./components/Collection"

import {
    elvesAbi,
    elvesContract,
    etherscan,
    checkIn,
    sendCampaign, 
    sendPassive, 
    returnPassive, 
    unStake, 
    merchant, 
    forging,
    heal, 
    lookupMultipleElves, 
    getCurrentWalletConnected,
    polygonContract, 
    polyweb3
} from "../../utils/interact"


import { useMoralis } from "react-moralis";
import Staking from "./components/Staking"
import Help from "./components/Help"
import TableMode from "./components/TableMode"

const Home = () => {


    const [chain, setChain] = useState("eth")
    const [excludeAction, setExcludeAction] = useState(8)
    const [blockscan, setBlockscan] = useState("etherscan.io")


    const [loading, setLoading] = useState(true)
    const [index, setIndex] = useState(0)
    const [data, setData] = useState()
    const [activeNfts, setActiveNfts] = useState()
    const [campaign, setCampaign] = useState(campaigns[0])
    const [sector, setSector] = useState(1)
    const [success, setSuccess] = useState()
    const [txreceipt, setTxReceipt] = useState()
    const [alert, setAlert] = useState({ show: false, value: null })
    const [wallet, setWallet] = useState()
    const [status, setStatus] = useState()
    const [loadingText, setLoadingText] = useState()
    const [visualMode, setVisualMode] = useState(false)
    const [reloadData, setReloadData] = useState(false)



    const [gameMode, setGameMode] = useState("");

    const { Moralis } = useMoralis();

    ////////////////////////////




    const sendGaslessFunction = async (params) => {

        let tx 
        try{
            tx = await Moralis.Cloud.run("defenderRelay", params) 

            console.log(tx)
            if(tx.data.status){

            let fixString = tx.data.result.replaceAll("\"", "")
            let txHashLink = `https://polygonscan.com/tx/${fixString}`
            let successMessage = <>Check out your transaction on <a target="_blank" href={txHashLink}>Polyscan</a> </>
            
            setAlert({show: true, value: {title: "Tx Sent", content: (successMessage)}})
            }           


        }catch(e){
            console.log(e)
        }        

    }


    /////////////////////////////



    const sendCampaignFunction = async (params) => {

        if(chain === "eth"){
            console.log("sendCampaignFunction", params)
        let { success, status, txHash } = await sendCampaign(params)

        success && resetVariables()

        setAlert({
            show: true, value: {
                title: "Tx Sent",
                content: (status)
            }
        })

        }else{
            const polyParams =  {functionCall: polygonContract.methods.sendCampaign(params).encodeABI()}
            await sendGaslessFunction(polyParams)
        }
        
        console.log("sendCampaign", params)
     

    }

    const healing = async () => {
        if(chain === "eth"){
         const params =  {healer: clicked[0].id, target: clicked[1].id}
         let {success, status, txHash} = await heal(params)
    
         success && resetVariables()
         setAlert({show: true, value: {title: "Tx Sent", content: (status)}})   
        
        }else{
            console.log(clicked[0].id, clicked[1].id, wallet)
            const params =  {functionCall: polygonContract.methods.heal(clicked[0].id, clicked[1].id, wallet).encodeABI()}
            sendGaslessFunction(params)
        }
        
                          
    }

    const healMany = async () => {       
        let healerIds = healers.map(el => el.id)
        let targetIds = targets.map(el => el.id)

        const params =  {functionCall: polygonContract.methods.healMany(healerIds, targetIds, wallet).encodeABI()}
        console.log(healers, targets, wallet)
        sendGaslessFunction(params)
                          
    }


    const reRoll = async (option) => {

        let rollerIds = clicked.map(el => el.id)
               
        if(chain === "eth"){              
        const params =  {ids: rollerIds}
        let {success, status, txHash} = option === "forging" ? await forging(params) : await merchant(params)
     
        setAlert({show: true, value: {title: "Tx Sent", content: (status)}})  
        }
        else{
            if(option === "forging"){
            //check rollerIds.weaponTier greater than 3 
            let weaponTier = clicked.map(el => el.weaponTier)
            let weaponTierMax = weaponTier.reduce((a, b) => Math.max(a, b))
            console.log(weaponTierMax, weaponTier)
            if(weaponTierMax > 3){
                setAlert({show: true, value: {title: "Error", content: "You can only forge with a current weapon tier of 3 or less"}})
                return
            }
            }
            if(option === "synergize"){
                //check rollerIds.sentinelClass to see if druid
                let sentinelClass = clicked.map(el => el.sentinelClass)
                let sentinelClassMax = sentinelClass.reduce((a, b) => Math.max(a, b))
                console.log(sentinelClassMax, sentinelClass)
                if(sentinelClassMax !== 0){
                    setAlert({show: true, value: {title: "Error", content: "You can only synergize with druids"}})
                    return
                }
                
            }
            
        const params =  {functionCall: option === "forging" ? polygonContract.methods.forging(rollerIds, wallet).encodeABI() : 
        option === "merchant" ? polygonContract.methods.merchant(rollerIds, wallet).encodeABI() : polygonContract.methods.synergize(rollerIds, wallet).encodeABI()}
        console.log(params, wallet, rollerIds)
        sendGaslessFunction(params)   
        }

        setModal({show: false, content: ""})
                          
    }

    



    //////////////////////////   




    /////////////////////////


    const doAction = async (option) => {

        await Moralis.enableWeb3();

        const first = activeNfts.map(nft => { return (nft.id) })

        const rerollParams = { ids: activeNfts.map(nft => { return (nft.id) }), action_: option.toString() }
        const healParams = { healer: first[0], target: option.healIds }
        let value = option.action === "forging" || option.action === "merchant" ? Moralis.Units.ETH("0.01") : Moralis.Units.ETH("0")
        let params = option.action === "heal" ? healParams : rerollParams

        console.log(healParams)

        const options = {
            contractAddress: elvesContract,
            functionName: option.action,
            abi: elvesAbi.abi,
            params: params,
            msgValue: value,
            awaitReceipt: false // should be switched to false
        };

        const tx = await Moralis.executeFunction(options);

        tx.on("transactionHash", (hash) => {
            resetVariables()
            setAlert({
                show: true, value: {
                    title: "Tx Successful",
                    content: (<>✅ Check out your transaction on <a target="_blank" rel="noreferrer" href={`https://${etherscan}.io/tx/${hash}`}>Etherscan</a> </>)
                }
            })

        })

        tx.on("receipt", (receipt) => {

            setTxReceipt(receipt)
            let response

            receipt.events.Action.isArray ? response = `Elf#${receipt.events.Action.map(nft => { return (nft.returnValues.tokenId) })} have started doing ${actionString[receipt.events.Action[0].returnValues.action].text}`
                : response = `Elf#${receipt.events.Action.returnValues.tokenId} has started doing action ${actionString[receipt.events.Action.returnValues.action].text}`





            setAlert({
                show: true, value: {
                    title: "Tx Successful",
                    content: response
                }
            })

        })

    }



    const getElvesfromMoralis = async (address) => {

        setLoading(true)
        setClicked([])
        const params = { address: address }
        setLoadingText(`25% Fetching elves for address ${address}`)
        const array = await Moralis.Cloud.run("getElvesFromDb", params);

        setLoadingText(`50% Getting metadata from the blockchain`)
        const elves = await lookupMultipleElves({array, chain})
        elves.sort((a, b) => a.id - b.id)

        

        const filteredElves = elves.filter((elf) => elf.action !== excludeAction)

        console.log("elves", filteredElves)
        setData(filteredElves)

      
        setLoadingText(`100% Done!`)
        elves && setLoading(false)

    }

    const onSelect = (nfts) => {

        if (nfts.length > 1) {
            setActiveNfts(nfts)

            setIndex(2)
        } else if (nfts.length === 1) {
            setActiveNfts(nfts)
            setIndex(2)
        }
    }

    const toggleChain = () => {

        if(chain === "eth"){
            setChain("polygon")
            setBlockscan("polyscan.com")
            setExcludeAction(0)
        
        }else{
            setChain("eth")
            setBlockscan("etherscan.io")
            setExcludeAction(8)
        }

    }



    const onChangeIndex = (value) => {

        if (index + value < 0) resetVariables()
        else setIndex(index + value)
    }

    const getActivities = useMemo(() => {
        if (!campaign) return null
        if (index === 3) {
            const txt = `campaign: ${campaign.name}\ntime: ${campaign.time}`;
            return txt
        }
        return null
    }, [campaign, index])



    useEffect(() => {
       
        const getData = async () => {
            const { address } = await getCurrentWalletConnected();
            setWallet(address)
            address && setLoadingText(`10% Wallet connected`)
            address && await getElvesfromMoralis(address)
        }

        getData()
    }, [txreceipt, chain, reloadData])

    const resetVariables = async () => {
        setIndex(0)
        setActiveNfts(null)
        setCampaign(campaigns[0])
        setSector(1)
        setSuccess(false)
    }


    const showAlert = ({ title, content }) => {

        return (
            <div className="alert">
                <h3>{title}</h3>
                <pre>{content}</pre>
                <button className="btn btn-red" onClick={() => setAlert({ show: false })}>close</button>
            </div>
        )
    }

    const [clicked, setClicked] = useState([]);
    const toggle = (character) => {
        if (clicked.includes(character)) {
            setClicked(clicked.filter(char => char !== character))
        } else {
            if (clicked.length <= 9) {
                setClicked([...clicked, character])
            }
            else {
                //set status to "You can only select 8 at a time"
            }
        }
    }
    const selectAll = (characters = []) => {
        const selected = characters.filter(chr => chr.action !== 8).slice(0, 8)
        setClicked(selected)
    }
    useEffect(() => {
        setActiveNfts(clicked)
    }, [clicked])
    const [healModal, setHealModal] = useState(false)
    const [modal, setModal] = useState({show: false, content: ""})
    const [tokenId, setTokenId] = useState("")

    const [multi, setMulti] = useState(false)
    // const [warning, setWarning] = useState(false)
    const [healers, setHealers] = useState([])
    const [targets, setTargets] = useState([])

    const renderHealModal = () => {
        if(!healModal) return <></>
        const handleChange = (e) => {
            setTokenId(e.target.value)
        }
        const heal = () => {
            if(multi) {
                console.log("heal many")
                if(healers.length !== targets.length) {
                    setAlert({
                        show: true, value: {
                            title: "Error",
                            content: "Mismatch in healers and targets"
                        }})  
                        return
                }
                healMany()
            } else {

              

                if(clicked[0].classString !== "Druid") {
                    setAlert({
                        show: true, value: {
                            title: "Error",
                            content: "You can only heal with Druids"
                        }})  
                        return
                }

                if(clicked[0].cooldown === true) {
                    setAlert({
                        show: true, value: {
                            title: "Error",
                            content: "Druid in cooldown!"
                        }})  
                        return                        

                }
                if(clicked[1].cooldown === false) {
                    setAlert({
                        show: true, value: {
                            title: "Error",
                            content: "Target is not cooldown!"
                        }})  
                        return
                }

                healing()
                console.log("heal someoone", tokenId)
                //doAction({action:"heal", healIds: tokenId})
                setHealModal(false)
                setMulti(false)
            }
        }
        const handleMulti = () => {
            setMulti(multi => !multi)
        }
        const handleClickHealer = (nft) => {
            if(healers.includes(nft)) setHealers(healers.filter(item => item !== nft))
            else setHealers(state => [...state, nft])
        }
        const handleClickTarget = (nft) => {
            if(targets.includes(nft)) setTargets(targets.filter(item => item !== nft))
            else setTargets(state => [...state, nft])
        }
        return(
            <div className="modal">
                <div className="modal-content items-center">
                    <span className="close-modal" onClick={() => {setHealModal(false); setMulti(false)}}>X</span>
                    <h3>Confirm Heal</h3>
                   
                    {!multi ? <>Heal {clicked[0].classString} #{clicked[1].id} with Druid #{clicked[0].id}?</> :
                    <div className="flex flex-column w-full items-center">
                        <h4>Select healers</h4>
                        <div className="nft-grid">
                        {data.filter(nft => nft.classString === "Druid").map((nft) => 
                            <img onClick={() => handleClickHealer(nft)} className={healers.includes(nft) ? "active" : null} src={nft.image} alt={nft.id} key={nft.id} />
                        )}
                        </div>
                        <h4>Select targets</h4>
                        <div className="nft-grid">
                        {data.filter(nft => nft.cooldown === true ).map((nft) => 
                            <img onClick={() => handleClickTarget(nft)} className={targets.includes(nft) ? "active" : null} src={nft.image} alt={nft.id} key={nft.id} />
                        )}
                        </div>
                        <p className="text-danger">(The number of healers needs to match the number of targets.)</p>
                    </div>}
                    <div className="flex mt-1">
                        <button className="btn-modal" onClick={heal}>CONFIRM</button>
                        {chain === "polygon" && <button className="btn-modal" onClick={handleMulti}>{!multi ? "HEAL MANY" : "HEAL ONE"}</button>}
                    </div>
                </div>
            </div>
        )
    }
    const renderModal = () => {
        if(!modal.show) return <></>
        const handleEthClick = () => {
            reRoll(modal.action)         
        }

        //get object from rollcosts that matches modal.action
        const cost = rollCosts.find(cost => cost.action === modal.action)

        let costString = chain === "polygon" ? `${cost.ren} REN` : `${cost.eth} ETH`

        console.log(cost)

        return (
            <div className="modal">
                <div className="modal-content">
                    <span className="close-modal" onClick={() => setModal({show: false, content: ""})}>X</span>
                    <h3>{modal.heading}</h3>
                    {modal.action === "forging" && 
                        <>
                        <p>there is 20% chance you will get a higher tier weapon, 10% chance you will get downgraded and 70% chance you get a different weapon within the same tier.</p>
                        <p>you cannot roll T4 & T5 weapons</p>                        
                         </>
                    }
                    {modal.action === "merchant" && 
                        <>
                        <p>there is 20% chance you will get a new item..</p>
                        </>
                    }
                    {modal.action === "synergize" && 
                        <>
                        <p>there is 10% chance you will reduce you're druid cooldown by 50% and a 60% chance to reduce cooldown by 33%. There is a 30% chance you'll get a 5 minute pentaly.</p>
                        </>
                    }

                        <div className="d-flex flex-row justify-around align-center">
                         <div className="d-flex flex-column">
             
                             <span>{costString}</span>
                             <button className="btn-modal" onClick={handleEthClick} >{modal.content} </button>
                         </div>
                         </div>
                   

                   
                </div>
            </div>
        )
    }
    return (
        <>
            {loading ? <Loader text={loadingText} /> :
                <>

               
                    <div className="dark-1000 h-full d-flex home justify-center items-center">
                        {alert.show && showAlert(alert.value)}

                        
                      {visualMode ?
                      <>
                      {index === 0 && <Help chain={chain} data={data} toggle={toggle} clicked={clicked} selectAll={selectAll}  />}
                      </> : <>
                      {index === 0 && <TableMode  
                                            chain={chain} 
                                            data={data} 
                                            toggle={toggle} 
                                            visualMode={visualMode} 
                                            setVisualMode={setVisualMode} 
                                            clicked={clicked} 
                                            toggleChain={toggleChain} 
                                            selectAll={selectAll}  
                                            reloadData={reloadData}
                                            setReloadData={setReloadData}
                                            />}</>}
                                              

                       

                        {index === 1 && activeNfts.length > 1 ? <Collection nft={activeNfts} onChangeIndex={onChangeIndex} /> : null}
                        {index === 1 && activeNfts.length === 1 ? <Overview nft={activeNfts} onRunWeb3={doAction} onChangeIndex={onChangeIndex} /> : null}
                        {index === 2 && <Actions doAction={doAction} actions={actions} onChangeIndex={onChangeIndex} setGameMode={setGameMode} />}
                        {index === 3 && <Staking nft={activeNfts} onRunWeb3={doAction} onChangeIndex={onChangeIndex} />}                      
                        {index === 4 && <Sector campaign={campaign} data={activeNfts} onSendCampaign={sendCampaignFunction} onChangeIndex={onChangeIndex} mode={gameMode} />}
                        {index === 5 && <Success success={success} sector={sector} campaign={campaign} data={activeNfts} chain={chain} onChangeIndex={onChangeIndex} />}
                        {index === 6 && <Receive onChangeIndex={onChangeIndex} />}
                      

                    </div>
                    {index === 0 && data && wallet && 
                     <div className="d-flex justify-center items-center">
                            <Control 
                                data={data} 
                                clicked={clicked} 
                                activities={getActivities} 
                                toggleChain={toggleChain}
                                onRunWeb3={doAction} 
                                onSelect={onSelect} 
                                onChangeIndex={onChangeIndex} 
                                onForge={() => setModal({show: true, action:"forging", heading:"DO YOU WANT TO FORGE A NEW WEAPON?", content:"forge"})}
                                onMerchant={() => setModal({show: true, action:"merchant", heading:"DO YOU WANT TO TRY FOR A NEW ITEM?", content:"buy"})}
                                onHeal={() => setHealModal(true)}
                                onSynergize={() => setModal({show: true, action:"synergize", heading:"DO YOU WANT TO SYNERGIZE?", content:"synergize"})}
                                chain={chain}
                            />
                           </div> }

                </>
            }
            {renderModal()}
            {renderHealModal()}
        </>
    )
}

export default Home
