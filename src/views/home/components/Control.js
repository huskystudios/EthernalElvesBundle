import React, { useState, useEffect, useRef } from "react"
import hBar from "../../../assets/images/health_bar.png"
import lBar from "../../../assets/images/level_bar.png"
import Countdown from 'react-countdown';
import { useMoralis } from "react-moralis"

const PAGE_COUNT = 3
const MAX_HEALTH = 100
const MAX_LEVEL = 100

const Control = ({ data, activities, onSelect, clicked, onChangeIndex, onRunWeb3, onForge, onMerchant, onHeal, onSynergize, toggleChain, chain,
    onCampaign, onPassiveMode, onBloodthirst
}) => {
    const [currentPage, setCurrentPage] = useState(0)
    const [nfts, setNfts] = useState([])

    const [activeNft, setActiveNft] = useState()
    const [activeNftHealth, setActiveNftHealth] = useState(0)
    const [open, setOpen] = useState(false)
    const [consoleOpen, setConsoleOpen] = useState(true)
    const [tooltip, setTooltip] = useState({
        show: false,
        value: null
    })
    const { Moralis } = useMoralis();

    const getLastCampaign = async (tokenId) => {


        const params = { tokenId: tokenId }
        const lastCamp = await Moralis.Cloud.run("getLastCampaignByUser", params);

        const res = lastCamp[0]

        //   console.log(tokenId, "tokenId", lastCamp)
        //   const ElfCampaigns = Moralis.Object.extend("ElfCampaignsActivity");
        //   let query = new Moralis.Query(ElfCampaigns);  
        //   query.equalTo("tokenId", tokenId.toString());
        //   const res = await query.first();
        // console.log("huh?", tokenId, res.attributes.sector, res.attributes.campaign, Moralis.Units.FromWei(res.attributes.amount))
        if (res) {
            return {
                sector: res.sector, //res.attributes.sector,
                campaign: res.campaign, //res.attributes.campaign,
                amount: Moralis.Units.FromWei(res.amount),
                string: "Last Campaign was in camp " + res.campaign + " and in sector " + res.sector + ". You earned " + Moralis.Units.FromWei(res.amount) + " $REN"
            }
        }




    }
    useEffect(() => {
        if (clicked.length === 0) {
            return setActiveNft(null)
        }
        const character = clicked[clicked.length - 1]
        setActiveNft(character)

        const tOne = new Date(character.time * 1000)
        const tZero = new Date()
        let healthBar = 5

        //time difference in hours
        const diff = Math.abs(tZero.getTime() - tOne.getTime()) / 36e5;

        if (diff < 10) {
            healthBar = 75
        } else if (diff < 16) {
            healthBar = 60
        } else if (diff < 24) {
            healthBar = 20
        } else if (diff < 48) {
            healthBar = 2
        }
        let fullHealth = tZero.getTime() > tOne.getTime() ? true : false

        healthBar = fullHealth ? 100 : healthBar
        setActiveNftHealth(healthBar)
    }, [clicked])

    useEffect(() => {

        if (PAGE_COUNT * currentPage < data.length) {
            const showNfts = data.slice(currentPage * PAGE_COUNT, (currentPage + 1) * PAGE_COUNT)
            setNfts(showNfts);
        }

    }, [currentPage, data, setNfts, clicked])
    const onPageChange = (value) => {
        if (value > 0 && PAGE_COUNT * (currentPage + 1) < data.length)
            setCurrentPage(currentPage + 1)
        if (value < 0 && currentPage > 0)
            setCurrentPage(currentPage - 1)

    }
    const drop = useRef("actions");
    const handleClick = (e) => {
        if(!drop.current) return;
        if (!e.target.closest(`#${drop.current.id}`) && open) {
          setOpen(false);
        }
    }
    React.useEffect(() => {
        document.addEventListener("click", handleClick);
        return () => {
          document.removeEventListener("click", handleClick);
        };
    });
    const handleGameModes = (clicked) => {
        onSelect(clicked)
    }
    return (
        <>
             <span className="btn-select">
                <div className="dropdown" ref={drop} id="actions">
                    <button className="btn btn-blue" onClick={() => setOpen(open => !open)}>Actions</button>
                    {clicked.length > 0 && open && <div className="dropdown-content">
                        
                        <span onClick={onForge}>forge</span>
                        <span onClick={onMerchant}>merchant</span>
                        <span onClick={onCampaign}>campaign</span>
                        {chain === "polygon" && <span onClick={onBloodthirst}>bloodthirst</span>}
                        <span onClick={onPassiveMode}>passive mode</span>
                        {clicked.length > 1 && <span onClick={onHeal}>heal</span>}
                        {chain === "polygon" && <span onClick={onSynergize}>synergize</span>}
                     
                                       
                    </div>}
                </div>
            </span>
            {!consoleOpen && <span className="btn-control-open">                
                        <button className="btn btn-blue" onClick={() => setConsoleOpen(consoleOpen => !consoleOpen)}>Maximize</button>
               </span>
            }
    {consoleOpen &&     
        <div className="control-panel">      

                <span className="btn-control-close">                
                        <button className="dropbtn" onClick={() => setConsoleOpen(consoleOpen => !consoleOpen)}>Minimize</button>
               </span>
            
            <div className="active-attributes d-flex flex-column">
                    {activeNft?.attributes.map((attribute, index) => {
                        if(index < 6) return <div className="d-flex flex-row justify-between" key={index}>
                            <span className="attribute-name">{attribute.trait_type}:</span>
                            <span className="attribute-value">{attribute.value}</span>
                        </div>})}
                    {activeNft && <div className="d-flex flex-row justify-between">
                        <span className="attribute-name">$Ren Earned:</span>
                        <span className="attribute-value">0</span>
                    </div>}
                    {activeNft && <div className="d-flex flex-row justify-between">
                        <span className="attribute-name">Last Action:</span>
                        <span className="attribute-value">0</span>
                    </div>}
                </div>  
            {activeNft && <>
                <img className="health-bar" style={activeNft ? { clipPath: `polygon(0 0, ${activeNftHealth / MAX_HEALTH * 100}% 0, ${activeNftHealth / MAX_HEALTH * 100}% 100%, 0% 100%)` } : null} src={hBar} alt="health bar" />
                <img className="level-bar" style={activeNft ? { clipPath: `polygon(0 0, ${activeNft.level / MAX_LEVEL * 100}% 0, ${activeNft.level / MAX_LEVEL * 100}% 100%, 0% 100%)` } : null} src={lBar} alt="level bar" />
            </>}
            {activeNft && <img className="active-thumb" src={activeNft.image} alt="level bar" />}
            <span className="active-id">{activeNft ? `#${activeNft.id}` : ''}</span>
            <button className="btn-prev" onClick={() => onPageChange(-1)} />
            <button className="btn-next" onClick={() => onPageChange(1)} />
            {tooltip.show && showTooltip(tooltip.value)}
            {activeNft && activeNft.inventoryImage && (
                <div className="activities">
                    <img src={activeNft.inventoryImage} alt="Item" title={`${activeNft.inventoryString}: ${activeNft.inventoryDescription}`} />
                    <strong>{activeNft.inventoryString}</strong>
                    <span>{activeNft.inventoryDescription}</span>
                </div>
            )}           
        </div>
        }
        </>
    )
}

const showTooltip = ({ title, content, timestamp, lastCampaign, actionString }) => {

    const date = new Date(timestamp * 1000)
    const isActive = new Date() > date

    let passiveString

    if (actionString === "Sent to Passive Campaign") {
        let timesince = Math.floor(((new Date() - date) / 1000) / (60 * 60 * 24))
        passiveString = `Time spent in ${actionString}: ${timesince} days`
    }


    return (
        <div className="tooltip">
            <h3>{title}</h3>
            <pre>{content}</pre>
            {passiveString && <pre>{passiveString}</pre>}
            {!isActive && <pre>Ready in:{" "}<Countdown date={date} /></pre>}
            <pre>Activity: {actionString}</pre>
            <pre>{lastCampaign}</pre>
        </div>
    )
}
export default Control