import React, { useEffect, useMemo, useState } from "react"
import Loader from "../../components/Loader"
import Control from "./components/Control"
import Overview from "./components/Overview"
import './style.css'
import { campaigns } from "./config"
import SelectToken from "./components/SelectToken"
import Actions from "./components/Actions"
import Campaign from "./components/Campaign"
import Receive from "./components/Receive"
import Sector from "./components/Sector"
import Success from "./components/Success"
import Collection from "./components/Collection"
import { actions, actionString } from "./config"
import { elvesAbi, elvesContract, etherscan, sendCampaign, lookupMultipleElves, getCurrentWalletConnected } from "../../utils/interact"
import { useMoralis } from "react-moralis";
import Staking from "./components/Staking"
import Help from "./components/Help"

const Home = () => {
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



    const [gameMode, setGameMode] = useState("");

    const { Moralis } = useMoralis();


    /////////////////////////////



    const sendCampaignFunction = async (params) => {

        console.log("sendCampaignFunction", params)
        let { success, status, txHash } = await sendCampaign(params)

        success && resetVariables()

        setAlert({
            show: true, value: {
                title: "Tx Sent",
                content: (status)
            }
        })

        //   

        console.log("sendCampaign", params)
        /* 

        await Moralis.enableWeb3();
        const options = {
                contractAddress: elvesContract,
                functionName: "sendCampaign",
                abi: elvesAbi.abi,
                params: params,
                awaitReceipt: false // should be switched to false
              };

           const tx = await Moralis.executeFunction(options);
             
              tx.on("transactionHash", (hash) => { 
                resetVariables()
                setAlert({show: true, value: {
                    title: "Tx Sent", 
                    content: (<>✅ Check out your transaction on <a target="_blank" href={`https://${etherscan}.io/tx/${hash}`}>Etherscan</a> </>)            
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
                     
           */

    }



    //////////////////////////   


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


        const params = { address: address }
        setLoadingText(`25% Fetching elves for address ${address}`)
        const userTokenArray = await Moralis.Cloud.run("getElvesFromDb", params);

        setLoadingText(`50% Getting metadata from the blockchain`)
        const elves = await lookupMultipleElves(userTokenArray)
        elves.sort((a, b) => a.id - b.id)

        setData(elves)


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
    }, [txreceipt])

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
            if (clicked.length <= 7) {
                setClicked([...clicked, character])
            }
            else {
                //set status to "You can only select 8 at a time"
            }
        }
    }
    const selectAll = (characters = []) => {
        const selected = characters.filter(chr => chr.actionString.toLowerCase() !== "unknown").slice(0, 8)
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
            } else {
                console.log("heal someoone", tokenId)
                doAction({action:"heal", healIds: tokenId})
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
                    <h3>who do you wish to heal?</h3>
                   
                    {!multi ? <input placeholder="1017" className="heal-input" value={tokenId} onChange={handleChange} /> :
                    <div className="flex flex-column w-full items-center">
                        <h4>Select healers</h4>
                        <div className="nft-grid">
                        {data.filter(nft => nft.classString === "Druid").map((nft) => 
                            <img onClick={() => handleClickHealer(nft)} className={healers.includes(nft) ? "active" : null} src={nft.image} alt={nft.id} key={nft.id} />
                        )}
                        </div>
                        <h4>Select targets</h4>
                        <div className="nft-grid">
                        {data.filter(nft => nft.classString !== "Druid").map((nft) => 
                            <img onClick={() => handleClickTarget(nft)} className={targets.includes(nft) ? "active" : null} src={nft.image} alt={nft.id} key={nft.id} />
                        )}
                        </div>
                        <p className="text-danger">(The number of healers needs to match the number of targets.)</p>
                    </div>}
                    <div className="flex mt-1">
                        <button className="btn-modal" onClick={heal}>CONFIRM</button>
                        <button className="btn-modal" onClick={handleMulti}>{!multi ? "HEAL MANY" : "HEAL ONE"}</button>
                    </div>
                </div>
            </div>
        )
    }
    const renderModal = () => {
        if(!modal.show) return <></>
        const handleEthClick = () => {
            doAction({action:modal.action})
            setModal({show: false, content: ""})
        }
        const handleMirenClick = () => {
            setModal({show: false, content: ""})
        }
        return (
            <div className="modal">
                <div className="modal-content">
                    <span className="close-modal" onClick={() => setModal({show: false, content: ""})}>X</span>
                    <h3>{modal.heading}</h3>
                    {modal.action === "forging" && 
                        <>
                        <p>there is 20% chance you will get a higher tier weapon, 10% chance you will get downgraded and 70% chance you get a different weapon within the same tier.</p>
                        </>
                    }
                    {modal.action === "merchant" && 
                        <>
                        <p>there is 20% chance you will get a new item..</p>
                        </>
                    }
                    <div className="d-flex flex-row justify-around align-center">
                        <div className="d-flex flex-column">
            
                            <span>0.01 eth</span>
                            <button className="btn-modal" onClick={handleEthClick} >{modal.content} with eth</button>
                        </div>
                       {/* <div className="d-flex flex-column">
                            <span>10 miren</span>
                            <button disabled className="btn-modal" onClick={handleEthClick}>{modal.content} with $ren</button>
                        </div>*/}
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


                        {index === 0 && <Help data={data} toggle={toggle} clicked={clicked} selectAll={selectAll}  />}

                        {index === 1 && activeNfts.length > 1 ? <Collection nft={activeNfts} onChangeIndex={onChangeIndex} /> : null}
                        {index === 1 && activeNfts.length === 1 ? <Overview nft={activeNfts} onRunWeb3={doAction} onChangeIndex={onChangeIndex} /> : null}
                        {index === 2 && <Actions doAction={doAction} actions={actions} onChangeIndex={onChangeIndex} setGameMode={setGameMode} />}
                        {index === 3 && <Staking nft={activeNfts} onRunWeb3={doAction} onChangeIndex={onChangeIndex} />}
                        {index === 4 && <Campaign onSetCampaign={setCampaign} onChangeIndex={onChangeIndex} />}
                        {index === 5 && <Sector campaign={campaign} data={activeNfts} onSendCampaign={sendCampaignFunction} onChangeIndex={onChangeIndex} mode={gameMode} />}
                        {index === 6 && <Success success={success} sector={sector} campaign={campaign} data={activeNfts} onChangeIndex={onChangeIndex} />}
                        {index === 7 && <Receive onChangeIndex={onChangeIndex} />}
                        {index === 0 && data && wallet && 
                            <Control 
                                data={data} 
                                clicked={clicked} 
                                activities={getActivities} 
                                onRunWeb3={doAction} 
                                onSelect={onSelect} 
                                onChangeIndex={onChangeIndex} 
                                onForge={() => setModal({show: true, action:"forging", heading:"DO YOU WANT TO FORGE A NEW WEAPON?", content:"forge"})}
                                onMerchant={() => setModal({show: true, action:"merchant", heading:"DO YOU WANT TO TRY FOR A NEW ITEM?", content:"buy"})}
                                onHeal={() => setHealModal(true)}
                            />}

                    </div>
                    <div className="dark-1000 h-full d-flex home-mobile justify-center items-center">
                        <div className="btn-lounge" onClick={() => window.location.href = "/profile"}>Whitelist Mint</div>
                        <div className="btn-lounge" onClick={() => window.location.href = "/mint"}>Mint</div>
                    </div>

                </>
            }
            {renderModal()}
            {renderHealModal()}
        </>
    )
}

export default Home
