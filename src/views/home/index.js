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
import Rampage from "./components/Rampage"

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
    polyweb3,
    balanceOf
} from "../../utils/interact"


import { useMoralis, useMoralisQuery } from "react-moralis";
import Staking from "./components/Staking"
import Help from "./components/Help"
import TableMode from "./components/TableMode"
import Bloodthirst from "./components/Bloodthirst"
import Modal from "../../components/Modal"
import Heal from "./components/Heal"
import InstantKill from "./components/InstantKill"
import Info from "./components/Info"


const Home = () => {


    const [chain, setChain] = useState("eth")
    const [excludeAction, setExcludeAction] = useState(8)
    const [blockscan, setBlockscan] = useState("etherscan.io")
    const [ethElves, setEthElves] = useState()
    const [polyElves, setPolyElves] = useState()


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
    const [polyBalance, setPolyBalance] = useState(0)
    const [balance, setBalance] = useState(0);
    const [miren, setMiren] = useState(0);
    const [consoleOpen, setConsoleOpen] = useState(false);
    
    const [modalActions, setModalActions] = useState({ show: false, value: null })    
    const [chainModal, setChainModal] = useState(false)
  
  
    const {authenticate, isAuthenticated, account, user, setUserData, chainId, userError, isUserUpdating,  isWeb3Enabled, enableWeb3, Moralis  } = useMoralis()
   
   /* const [limit, setLimit] = useState(3);
const { data, error, isLoading } = useMoralisQuery(
  "Elves",
  query =>
    query
      .greaterThanOrEqualTo("score", 100)
      .descending("score")
      .limit(limit),
  [limit],
  {
    live: true,
  },
);
  */

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
  
    const getRenBalance = async (address) => {

        let allbalances = await balanceOf(address);

        setBalance(allbalances.contractRen / 1000000000000000000);
        setMiren(allbalances.miren / 1000000000000000000);
        setPolyBalance(allbalances.polyMiren / 1000000000000000000);

        setUserData({
            ownerBalances: allbalances,
          })

    }




    const sendGaslessFunction = async (params) => {


        let tx
        setLoading(true)
        setLoadingText("Sending transaction...")
        try {

            let sender = {sender: wallet}

            //add sender to params
            params = {...params, ...sender}

            console.log("params", params)
            tx = await Moralis.Cloud.run("sendGaslessFunction", params)

            console.log("tx response:", tx)
            if (tx.data.status) {

               
            let polyTxHash = tx.data.result.replaceAll("\"", "")
            let txHashLink = `https://polygonscan.com/tx/${polyTxHash}`
            let successMessage = <>Check out your transaction on <a target="_blank" href={txHashLink}>Polyscan</a> </>
            
            setLoadingText(successMessage)
            await sleep(7000)
            let transactionReceipt = null
             
              while (transactionReceipt == null) { // Waiting expectedBlockTime until the transaction is mined
                  transactionReceipt = await polyweb3.eth.getTransactionReceipt(polyTxHash);
                  setLoadingText("Waiting for tx to be mined...")
                  await sleep(12000)
              }

            
            setAlert({show: true, value: {title: "Tx Sent", content: (successMessage)}})
            setReloadData(!reloadData)
            setClicked([]);
            setIndex(0)
            }           


        } catch (e) {
            console.log(e)
        }
        setLoading(false)


    }


    /////////////////////////////



    const sendCampaignFunction = async (params) => {

        //list clicked items who have cooldown
        let cooldown = clicked.filter(item => item.cooldown === true)
        if (cooldown.length > 0) {
            setAlert({ show: true, value: { title: "Cooldown", content: "You have cooldown on some elves. Please reselect elves with no cooldown." } })
            return
        }


        if (chain === "eth") {
            console.log("sendCampaignFunction", params)
            let { success, status, txHash } = await sendCampaign(params)

            success && resetVariables()

            setAlert({
                show: true, value: {
                    title: "Tx Sent",
                    content: (status)
                }
            })

        } else {
            const polyParams = { functionCall: polygonContract.methods.sendCampaign(params.tryTokenids, params.tryCampaign, params.trySection, params.tryWeapon, params.tryItem, params.useItem, params.address).encodeABI() }
            await sendGaslessFunction(polyParams)
        }

        console.log("sendCampaign", params)


    }

    const bloodthirstFunction = async (params) => {

        const btParams = { functionCall: polygonContract.methods.bloodThirst(params.tryTokenids, params.tryItem, params.useItem, params.address).encodeABI() }
        await sendGaslessFunction(btParams)

    }

    const rampage = async (params) => {

        //list clicked items who have cooldown
        let cooldown = clicked.filter(item => item.cooldown === true)
        if (cooldown.length > 0) {
            setAlert({ show: true, value: { title: "Cooldown", content: "You have cooldown on some elves. Please reselect elves with no cooldown." } })
            return
        }     
            const polyParams = { functionCall: polygonContract.methods.rampage(params.tryTokenids, params.tryCampaign, params.tryWeapon, params.tryAccessories, params.useItem, params.address).encodeABI() }
            await sendGaslessFunction(polyParams)
       

    }

    const healing = async () => {

        if (healers.length !== targets.length) {
            setAlert({ show: true, value: { title: "Error", content: "Please the same number of healers and targets" } })
            setModalActions({ show: !modalActions.show, value: null })
            return
        }

        let healer = healers[0].id
        let target = targets[0].id

        if (chain === "eth") {
            const params = { healer: healer, target: target }
            let { success, status, txHash } = await heal(params)

            success && resetVariables()
            setAlert({ show: true, value: { title: "Tx Sent", content: (status) } })

        } else {
            console.log(healer, target, wallet)
            const params = { functionCall: polygonContract.methods.heal(healer, target, wallet).encodeABI() }
            sendGaslessFunction(params)
            resetVariables()
        }
        console.log(healer, target, wallet)

    }

    const healMany = async () => {
        let healerIds = healers.map(el => el.id)
        let targetIds = targets.map(el => el.id)

        if (healerIds.length === 0 || targetIds.length === 0) {
            setAlert({ show: true, value: { title: "Error", content: "Please select at least one healer and one target" } })
            setModalActions({ show: !modalActions.show, value: null })
            return
        }
        if (healers.length !== targets.length) {
            setAlert({ show: true, value: { title: "Error", content: "Please the same number of healers and targets" } })
            setModalActions({ show: !modalActions.show, value: null })
            return
        }

        const params = { functionCall: polygonContract.methods.healMany(healerIds, targetIds, wallet).encodeABI() }
        console.log(healers, targets, wallet)
        sendGaslessFunction(params)
        resetVariables()
        setHealModal(false)

    }


    const reRoll = async (option) => {

        let rollerIds = clicked.map(el => el.id)
        const cost = rollCosts.find(cost => cost.action === option)

        if (rollerIds.length === 0) {
            setAlert({ show: true, value: { title: "Error", content: "Please select at least one elf" } })
            return
        }


        if (chain === "eth") {
            const params = { ids: rollerIds }
            let { success, status, txHash } = option === "forging" ? await forging(params) : await merchant(params)

            setAlert({ show: true, value: { title: "Tx Sent", content: (status) } })
        }
        else {
            if (parseInt(polyBalance) < parseInt(cost.ren)) {
                setAlert({ show: true, value: { title: "Error", content: "You require more ren to perform this action" } })
                return
            }

            if (option === "forging") {
                //check rollerIds.weaponTier greater than 3 
                let weaponTier = clicked.map(el => el.weaponTier)
                let weaponTierMax = weaponTier.reduce((a, b) => Math.max(a, b))
                console.log(weaponTierMax, weaponTier)
                if (weaponTierMax > 3) {
                    setAlert({ show: true, value: { title: "Error", content: "You can only forge with a current weapon tier of 3 or less" } })
                    return
                }

            }

            if (option === "synergize") {
                //check rollerIds.sentinelClass to see if druid
                console.log(clicked)
                let sentinelClass = clicked.map(el => el.sentinelClass)
                let sentinelClassMax = sentinelClass.reduce((a, b) => Math.max(a, b))
                console.log(sentinelClassMax, sentinelClass)
                if (sentinelClassMax !== 0) {
                    setAlert({ show: true, value: { title: "Error", content: "You can only synergize with druids" } })
                    return
                }

                let time = clicked.map(el => el.time)
                let timeMax = time.reduce((a, b) => Math.max(a, b))

                //timemax to date
                let cooldownEnd = new Date(timeMax * 1000)
                let now = new Date()
                let diff = cooldownEnd - now
                //diff in hours
                let diffHours = Math.floor(diff / 1000 / 60 / 60)
                console.log(diffHours)


                if (diffHours > 13) {
                    setAlert({ show: true, value: { title: "Error", content: "You can only synergize with a time of 12 hours or less" } })
                    return
                }





            }

            const params = {
                functionCall: option === "forging" ? polygonContract.methods.forging(rollerIds, wallet).encodeABI() :
                    option === "merchant" ? polygonContract.methods.merchant(rollerIds, wallet).encodeABI() : polygonContract.methods.synergize(rollerIds, wallet).encodeABI()
            }
            
            sendGaslessFunction(params)
        }

        setModal({ show: false, content: "" })

    }


    const doAction = async (option) => {

        const ids = activeNfts.map(nft => { return (nft.id) })
        console.log(option)
        //require ids cooldown to be false
        let cooldown = activeNfts.filter(item => item.cooldown === true)
        if (ids.length === 0) {
            setAlert({ show: true, value: { title: "Error", content: "Please select at least one elf" } })
            return
        }
        if (cooldown.length > 0) {
            setAlert({ show: true, value: { title: "Cooldown", content: "You have cooldown on some elves. Please reselect elves with no cooldown." } })
            return
        }

        if (chain === "eth") {
            if (option.action === "sendPassive") {
                const params = { ids: ids }
                let { success, status, txHash } = await sendPassive(params)
                success && resetVariables()
                setAlert({ show: true, value: { title: "Tx Sent", content: (status) } })

            } else if (option.action === "returnPassive") {
                const params = { ids: ids }
                let { success, status, txHash } = await returnPassive(params)
                success && resetVariables()
                setAlert({ show: true, value: { title: "Tx Sent", content: (status) } })

            }


        } else {
            if (option.action === "sendPassive") {
                const params = { functionCall: polygonContract.methods.passive(ids, wallet).encodeABI() }
                await sendGaslessFunction(params)


            } else if (option.action === "returnPassive") {
                const params = { functionCall: polygonContract.methods.returnPassive(ids, wallet).encodeABI() }
                await sendGaslessFunction(params)

            }

        }


    }



    function handleMoralisError(err) {
        switch (err.code) {
            case Moralis.Error.INVALID_SESSION_TOKEN:
                Moralis.User.logOut();
                // If web browser, render a log in screen
                // If Express.js, redirect the user to the log in route
                console.log("ok")
                break;

            // Other Moralis API errors that you want to explicitly handle
        }
    }



    const getElvesfromMoralis = async (address) => {

        let activeChain = user.attributes.ownerChainPref ? user.attributes.ownerChainPref : "eth"
        setLoading(true)
        setClicked([])
        console.log("1")
        setLoadingText(`25% Fetching elves for address ${address}`)

        const Elves = Moralis.Object.extend("Elves");

        let query = new Moralis.Query(Elves);
        query.equalTo("owner_of", address);

        let limit = 50

        //page through the results
        let results = []
        let hasMore = true
        let page = 1
        try {
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
        } catch (e) {

            results = await query.find().then(function (results) {

                return results

            }, function (err) {
                handleMoralisError(err);
            });

        }





        let array = []
        let polyArray = []



        results.map((elf) => {

            if (elf.get("chain") === "polygon") {
                polyArray.push(elf.attributes.token_id)
            } else {
                array.push(elf.attributes.token_id)
            }
        })

        setLoadingText(`Army of ${results.length} Elves.. Getting metadata from ethereum`)


        let ethParams = { array: array, chain: "eth" }
        const elves = await lookupMultipleElves(ethParams)
        elves.sort((a, b) => a.id - b.id)
        setEthElves(elves)

        setLoadingText(`75% Getting metadata from polygon`)

        let polyParams = { array: polyArray, chain: "polygon" }
        const polyElves = await lookupMultipleElves(polyParams)
        polyElves.sort((a, b) => a.id - b.id)
        let polyfiltered = polyElves.filter(item => item.action !== 0)
        setPolyElves(polyfiltered)


        console.log("elves", elves)
        console.log("pelves", polyElves)
        // console.log("active chain", activeChain)
        activeChain !== "polygon" ? setData(elves) : setData(polyElves)
        // setData(elves)
        let resolveEns
        try {
             resolveEns = await Moralis.Web3API.resolve.resolveAddress({ address: address });
             console.log("welcome!", resolveEns.name)
        } catch (e) {
            console.log(e)
        }


        setUserData({
            ownerElves: results.length,
            ensName: resolveEns ? resolveEns.name : "",            
          })

        setLoadingText(`100% Done!`)
        setLoading(false)

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

    const toggleChain = async () => {

        //const { address } = await getCurrentWalletConnected()

        const address = user.get("ethAddress")
        
        
        if (chain === "eth") {
            setChain("polygon")
            setBlockscan("polyscan.com")
            setExcludeAction(0)
            setData(polyElves)
            setClicked([])
            setUserData({ ownerChainPref: "polygon" })
            //Moralis.Cloud.run("updateUser", { ownerAddress: address, ownerChainPref: "polygon" })

        } else {
            setChain("eth")
            setBlockscan("etherscan.io")
            setExcludeAction(8)
            setData(ethElves)
            setClicked([])
            setUserData({ ownerChainPref: "eth" })
            //Moralis.Cloud.run("updateUser", { ownerAddress: address, ownerChainPref: "eth" })
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
            //const { address } = await getCurrentWalletConnected();
           
            

            if(isAuthenticated){ 

                const address = user?.attributes.ethAddress

            setWallet(address)
            getRenBalance(address)
            console.log("Corrected address:", address)
            //let userData = await Moralis.Cloud.run("getUserData", { ownerAddress: address })
            user.get("ownerChainPref") ? setChain(user.get("ownerChainPref")) : setChain("eth")

            address && setLoadingText(`10% Wallet connected`)
            address && await getElvesfromMoralis(address)
            }
            
        }

        getData()
    }, [txreceipt, reloadData, isAuthenticated])

    const resetVariables = async () => {
        setIndex(0)
        setActiveNfts(null)
        setCampaign(campaigns[0])
        setSector(1)
        setSuccess(false)
        setClicked([])
        setHealers([])
        setTargets([])
        setModalActions({ show: !modalActions.show, value: null })
    }


    const showAlert = ({ title, content }) => {

        return (
            <div className="alert-bar" >
                <img src={data[0]?.image} alt="alert" />
                <h3>{title}</h3>
                <pre>{content}</pre>
                <div className="close-modal" onClick={() => setAlert({ show: false })}>X</div>
            </div>
        )
    }

    const [clicked, setClicked] = useState([]);
    const toggle = (character) => {
        if (clicked.includes(character)) {
            setClicked(clicked.filter(char => char !== character))
        } else {
            if (clicked.length <= 19) {
                setClicked([...clicked, character])
            }
            else {
                setAlert({
                    show: true, value: {
                        title: "Too many elves",
                        content: "You can only select 20 eleves at a time"
                    }
                })

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
    const [modal, setModal] = useState({ show: false, content: "" })
    const [tokenId, setTokenId] = useState("")

    const [multi, setMulti] = useState(false)
    // const [warning, setWarning] = useState(false)
    const [healers, setHealers] = useState([])
    const [targets, setTargets] = useState([])

    const renderHealModal = () => {
        if (!healModal) return <></>
        const handleChange = (e) => {
            setTokenId(e.target.value)
        }
        const heal = () => {
            if (multi) {
                console.log("heal many")
                if (healers.length !== targets.length) {
                    setAlert({
                        show: true, value: {
                            title: "Error",
                            content: "Mismatch in healers and targets"
                        }
                    })
                    return
                }
                healMany()
            } else {

                if (clicked[0].classString !== "Druid") {
                    setAlert({
                        show: true, value: {
                            title: "Error",
                            content: "You can only heal with Druids"
                        }
                    })
                    return
                }

                if (clicked[0].cooldown === true) {
                    setAlert({
                        show: true, value: {
                            title: "Error",
                            content: "Druid in cooldown!"
                        }
                    })
                    return

                }
                if (clicked[1].cooldown === false) {
                    setAlert({
                        show: true, value: {
                            title: "Error",
                            content: "Target is not in cooldown!"
                        }
                    })
                    return
                }
                healing()
                console.log("heal someoone", tokenId)

                setHealModal(false)
                setMulti(false)
            }
        }
        const handleMulti = () => {
            setMulti(multi => !multi)
        }
        const handleClickHealer = (nft) => {
            if (healers.includes(nft)) setHealers(healers.filter(item => item !== nft))
            else setHealers(state => [...state, nft])
        }
        const handleClickTarget = (nft) => {
            if (targets.includes(nft)) setTargets(targets.filter(item => item !== nft))
            else setTargets(state => [...state, nft])
        }
        //filter druids whos have no cooldown
        let healerSelect = data.filter(item => item.cooldown === false && item.classString === "Druid")
        let targetSelect = data.filter(item => item.cooldown === true && item.classString !== "Druid")

        return (
            <div className="modal">
                <div className="modal-content items-center">
                    <span className="close-modal" onClick={() => { setHealModal(false); setMulti(false) }}>X</span>
                    <h3>Confirm Heal</h3>
                    {!multi ? <>Heal {clicked[1].classString} #{clicked[1].id} with {clicked[0].classString} #{clicked[0].id}?</> :
                        <div className="flex flex-column w-full items-center">
                            <h4>Select healers</h4>
                            <div className="nft-grid">
                                {healerSelect.map((nft) =>
                                    <img onClick={() => handleClickHealer(nft)} className={healers.includes(nft) ? "active" : null} src={nft.image} alt={nft.id} key={nft.id} />
                                )}
                            </div>
                            <h4>Select targets</h4>
                            <div className="nft-grid">
                                {targetSelect.map((nft) =>
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
        if (!modal.show) return <></>
        const handleEthClick = () => {
            reRoll(modal.action)
        }
        //get object from rollcosts that matches modal.action
        const cost = rollCosts.find(cost => cost.action === modal.action)
        console.log(cost, modal.action)
        let costString = chain === "polygon" ? `${cost.ren} REN` : `${cost.eth} ETH`
        console.log(cost)
        return (
            <div className="modal">
                <div className="modal-content">
                    <span className="close-modal" onClick={() => setModal({ show: false, content: "" })}>X</span>
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
                            <p>there is 10% chance you will reduce your druid cooldown by 50% and a 60% chance to reduce cooldown by 33%. There is a 30% chance you'll get a 5 minute penalty.</p>
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
    const renderChainModal = () => {
        return (
            <Modal show={chainModal}>
                <h4>Please switch chains</h4>
               
              
                <div className="flex flex-column w-full items-center">
                    <h4>You need to be connected to Ethereum</h4>
                
                </div>
                <div className="flex items-center mt-1 flex-wrap justify-center gap-1">
               {/* <button className="btn btn-connect" onClick={switchChains}>
                  Switch Chains
                </button> */}
                </div>
            </Modal>
      
        )
      }
    return isAuthenticated ? (

        
        <>
             {/*<div className="info">
                    <button onClick={() => setModalActions({show: !modalActions.show, action: "info", value: 0})}>INFO</button>
           </div>*/}
            {loading ? <Loader text={loadingText} /> :
                <>
                    <div className="dark-1000 h-full d-flex home justify-center">
                        <div className="flex-column w-full">
                            {alert.show && showAlert(alert.value)}
                            {visualMode ?
                                <>
                                    {index === 0 && <Help chain={chain} data={data} toggle={toggle} clicked={clicked} selectAll={selectAll} />}
                                </> : <>
                                    {index === 0 && <TableMode
                                        setAlert={setAlert}
                                        chain={chain}
                                        nftData={data}
                                        toggle={toggle}
                                        visualMode={visualMode}
                                        setVisualMode={setVisualMode}
                                        clicked={clicked}
                                        toggleChain={toggleChain}
                                        selectAll={selectAll}
                                        reloadData={reloadData}
                                        setReloadData={setReloadData}
                                        polyBalance={polyBalance}
                                        owner={wallet}
                                        consoleOpen={consoleOpen}
                                    />}
                                </>}
                            <Modal show={modalActions.show}>
                                {modalActions.value === 0 && <Info />}
                                {modalActions.value === 1 && <Staking nft={activeNfts} onRunWeb3={doAction} onChangeIndex={onChangeIndex} />}
                                {modalActions.value === 2 && <Sector chain={chain} campaign={campaign} data={activeNfts} onSendCampaign={sendCampaignFunction} onChangeIndex={onChangeIndex} />}
                                {modalActions.value === 3 && <Bloodthirst setAlert={setAlert} chain={chain} campaign={campaign} data={activeNfts} onSendCampaign={bloodthirstFunction} onChangeIndex={onChangeIndex} />}
                                {modalActions.value === 4 &&
                                    <Heal
                                        clicked={clicked}
                                        setAlert={setAlert}
                                        chain={chain}
                                        data={data}
                                        healing={healing}
                                        healMany={healMany}
                                        healers={healers}
                                        targets={targets}
                                        setHealers={setHealers}
                                        setTargets={setTargets}
                                    />}
                                {modalActions.value === 5 && <Rampage polyBalance={polyBalance} data={activeNfts} onRampage={rampage}/>}
                            </Modal>
                            {/* 
                        {index === 1 && activeNfts.length > 1 ? <Collection nft={activeNfts} onChangeIndex={onChangeIndex} /> : null}
                        {index === 1 && activeNfts.length === 1 ? <Overview nft={activeNfts} onRunWeb3={doAction} onChangeIndex={onChangeIndex} /> : null}
                        {index === 2 && <Actions doAction={doAction} actions={actions} onChangeIndex={onChangeIndex} setGameMode={setGameMode} />}
                        {index === 3 && <Staking nft={activeNfts} onRunWeb3={doAction} onChangeIndex={onChangeIndex} />}                      
                        {index === 4 && <Sector chain={chain} campaign={campaign} data={activeNfts} onSendCampaign={sendCampaignFunction} onChangeIndex={onChangeIndex} mode={gameMode} />}
                        {index === 5 && <Success success={success} sector={sector} campaign={campaign} data={activeNfts} chain={chain} onChangeIndex={onChangeIndex} />}
                        {index === 6 && <Bloodthirst chain={chain} campaign={campaign} data={activeNfts} onSendCampaign={sendCampaignFunction} onChangeIndex={onChangeIndex} mode={gameMode} />}
                        {index === 7 && <Receive onChangeIndex={onChangeIndex} />}
                    */}
                        </div>
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
                                onForge={() => setModal({ show: true, action: "forging", heading: "DO YOU WANT TO FORGE A NEW WEAPON?", content: "forge" })}
                                onMerchant={() => setModal({ show: true, action: "merchant", heading: "DO YOU WANT TO TRY FOR A NEW ITEM?", content: "buy" })}
                                onRampage={() => setModalActions({ show: !modalActions.show, action: "rampage", value: 5 })}
                                onHeal={() => setModalActions({ show: !modalActions.show, action: "bloodthirst", value: 4 })}
                                onBloodthirst={() => setModalActions({ show: !modalActions.show, action: "bloodthirst", value: 3 })}
                                onCampaign={() => setModalActions({ show: !modalActions.show, action: "campaign", value: 2 })}
                                onPassiveMode={() => setModalActions({ show: !modalActions.show, action: "passive", value: 1 })}
                                onSynergize={() => setModal({ show: true, action: "synergize", heading: "DO YOU WANT TO SYNERGIZE?", content: "synergize" })}
                                chain={chain}
                                consoleOpen={consoleOpen}
                                setConsoleOpen={setConsoleOpen}
                                onInfo={() => setModalActions({show: !modalActions.show, action: "info", value: 0})}
                            />
                        </div>}
                </>
            }
            {renderModal()}
            {renderHealModal()}
            {/*wallet && <InstantKill  setAlert={setAlert} owner={wallet} />*/}
        </>
    ) : <>
     <div className="dark-1000 h-full d-flex home justify-center">
                        <div className="flex-column w-full">
                          <div className="d-flex justify-center items-center">
                              <br />
                              <br />
                              <br />
                            Please connect wallet 
                            </div>
                            </div>
    </div>
    </>
}

export default Home
