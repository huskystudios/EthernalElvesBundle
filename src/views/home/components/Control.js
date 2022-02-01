import React, { useState, useEffect } from "react"
import hBar from "../../../assets/images/health_bar.png"
import lBar from "../../../assets/images/level_bar.png"
import Countdown from 'react-countdown';
import { useMoralis } from "react-moralis"

const PAGE_COUNT = 3
const MAX_HEALTH = 100
const MAX_LEVEL = 100

const Control = ({data, activities, onSelect}) => {
    const [currentPage, setCurrentPage] = useState(0)
    const [nfts, setNfts] = useState([])
    const [clicked, setClicked] = useState([]);
    
    const [activeNft, setActiveNft] = useState()
    const [activeNftHealth, setActiveNftHealth] = useState(0)

    const [tooltip, setTooltip] = useState({
        show: false,
        value: null
    })
    const { Moralis } = useMoralis();

    const getLastCampaign = async (tokenId) => {
    console.log(tokenId, "tokenId")
    const ElfCampaigns = Moralis.Object.extend("ElfCampaignsActivity");
    let query = new Moralis.Query(ElfCampaigns);  
    query.equalTo("tokenId", tokenId.toString());
    const res = await query.first();
   // console.log("huh?", tokenId, res.attributes.sector, res.attributes.campaign, Moralis.Units.FromWei(res.attributes.amount))
    if(res){
        return{
            sector: res.get("sector"), //res.attributes.sector,
            campaign: res.get("campaign"), //res.attributes.campaign,
            amount: Moralis.Units.FromWei(res.get("amount")),
            string: "Last Campaign was in camp " + res.get("campaign") + " and in sector " + res.get("sector") + ". You earned " + Moralis.Units.FromWei(res.get("amount")) + " $REN"
        }
    }
    
    


    }

    const toggle = async (character) => {
        
        setActiveNft(character)

                            
        const tOne = new Date(character.time * 1000)
        const tZero = new Date()
        let healthBar = (tOne - tZero)/ 11298185100 * 100
        console.log("health")
        console.log(tOne - tZero)

        healthBar = healthBar < 0 ? 100 : healthBar
        setActiveNftHealth(healthBar)

        
        if(clicked.includes(character)){
            setClicked(clicked.filter(char => char !== character))
            setActiveNft(null)
        } else {
            if(clicked.length <= 7) {
                setClicked([...clicked, character])
            }else{
                    //set status to "You can only select 8 at a time"
            }
        }
  }



    useEffect(() => {
 
        if(PAGE_COUNT * currentPage < data.length){
            const showNfts = data.slice(currentPage * PAGE_COUNT, (currentPage + 1) * PAGE_COUNT)
            setNfts(showNfts);
        }

    }, [currentPage, data, setNfts, clicked])
    const onPageChange = ( value ) => {
        if(value > 0 && PAGE_COUNT * (currentPage + 1) < data.length)
            setCurrentPage(currentPage + 1)
        if(value < 0 && currentPage > 0)
            setCurrentPage(currentPage - 1)

    }
    return (
        <div className="control-panel">
            <span className="btn-select" onClick={() => onSelect(clicked)}>select {clicked.length > 0 ? clicked.length : ""}</span>
            <div className="nft-wrapper">
                {nfts.map((character, index) => {
                    let classes = "nft"

                    if(clicked.includes(character)){
                        classes="nft-selected"
                    }
               
                    return(
                        <div
                        className={classes}
                        key={index}
                        onClick={() => {    
                            toggle(character)                            
                        }}
                        onMouseEnter={async () => {
                            let campaignData = await getLastCampaign(character.id)
                            setTooltip({
                                show: true,
                                value: {
                                    title: `${character.classString} ${character.name}`,
                                    content: `HealthPoints: ${character.health}\nLevel: ${character.level}`, 
                                    timestamp: character.time,
                                    actionString: character.actionString,
                                    lastCampaign: campaignData ? campaignData.string : null
                                }
                            })
                        }}
                        onMouseLeave={() => setTooltip({
                            show: false,
                            value: null
                        })}
                    >
                        <img src={character.image} alt="nft" />
                        <span>#{character.id}</span>
                    </div>
                    )
                }
                
                )}
            </div>
            <div className="inventory-wrapper">
                {
                    clicked?.map(( item, index ) => 
                        <img 
                            key={index}
                            onMouseEnter={() => setTooltip({
                                show: false,
                                value: {
                                    title: item.name,
                                    content: item.description
                                }
                            })}
                            onMouseLeave={() => setTooltip({
                                show: false,
                                value: null
                            })}
                            className="inventory-item"
                            src={item.image}
                            alt="" 
                        />
                    )
                }
            </div>
            {activeNft && <>
            <img className="health-bar" style={activeNft ? {clipPath: `polygon(0 0, ${activeNftHealth / MAX_HEALTH * 100}% 0, ${activeNftHealth / MAX_HEALTH * 100}% 100%, 0% 100%)`} : null} src={hBar} alt="health bar" />
            <img className="level-bar" style={activeNft ? {clipPath: `polygon(0 0, ${activeNft.level / MAX_LEVEL * 100}% 0, ${activeNft.level / MAX_LEVEL * 100}% 100%, 0% 100%)`} : null} src={lBar} alt="level bar" />
            </>}
            { activeNft && <img className="active-thumb" src={activeNft.image} alt="level bar" /> }
            <span className="active-id">{activeNft ? `#${activeNft.id}` : ''}</span>
            <button className="btn-prev" onClick={() => onPageChange(-1)} />
            <button className="btn-next" onClick={() => onPageChange(1)} />
            {tooltip.show && showTooltip(tooltip.value)}
            <pre className="activities">  
                {activeNft ? 
                <>
                {/*<img src={activeNft.image} alt="item" />*/}
                <span>{activeNft.inventoryString}</span>
                <br/>
                <br/>
                <span>{activeNft.inventoryDescription}  </span>
              
                </>
                 :  //should to be changed to the item image
                " "}
            </pre>
        </div>
    )
}

const showTooltip = ({title, content, timestamp, lastCampaign, actionString}) => {

    const date = new Date(timestamp * 1000)
    const isActive = new Date() > date

    let passiveString

    if(actionString === "Sent to Passive Campaign"){
        let timesince = Math.floor(((new Date() - date) / 1000)/(60*60*24))
        passiveString = `Time spent in ${actionString}: ${timesince} days`
    }
    

    return (
        <div className="tooltip">
            <h3>{title}</h3>
            <pre>{content}</pre>
            {passiveString && <pre>{passiveString}</pre>}
            {!isActive &&  <pre>Ready in:{" "}<Countdown date={date} /></pre>}
            <pre>Activity: {actionString}</pre>
            <pre>{lastCampaign}</pre>
        </div>
    )
}
export default Control