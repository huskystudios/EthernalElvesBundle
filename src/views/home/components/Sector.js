import React, { useEffect, useState } from "react"
import {campaigns} from "../config" 
import {getCampaign} from "../../../utils/interact"

const Sector = ({onChangeIndex, onSendCampaign, data, mode}) => {
    const [confirm, setConfirm] = useState(false);
    const [rerollWeapon, setRerollWeapon] = useState(false);
    const [rerollItem, setRerollItem] = useState(false);
    const [useItemValue, setUseItemValue] = useState(false);
    const [sector, setSector] = useState(1)
    const [tooltip, setTooltip] = useState("");
    const [modal, setModal] = useState({show: false, nft: null})
    const [creatureHealth, setCreatureHealth] = useState("")
    const [mirenRewards, setMirenRewards] = useState("")

    const [campaign, setCampaign] = useState(0)
    const [activeCampaign, setActiveCampaign] = useState(0)
    const [campaignArray, setCampaignArray] = useState(0)

    const setSectorChange = (value) => {
    
    setSector(value)
    setMirenRewards(parseInt(activeCampaign.baseRewads) + (2 * (parseInt(value) - 1)))
    setCreatureHealth(((parseInt(value) - 1) * 12) + parseInt(activeCampaign.creatureHealth))
    
    }
    const handleChangeIndex = async (value) => {
        console.log(activeCampaign)
        let tryTokenids = data.map(nft => {return(nft.id)})
        let tryCampaign = activeCampaign.id.toString()
        let trySection = sector.toString()
        let tryWeapon = rerollWeapon
        let tryItem = rerollItem
        let useItem = useItemValue


        const params = {
            ids: data.map(nft => {return(nft.id)}),
            campaign_: activeCampaign.id.toString(),
            sector_: sector.toString(),
            rollWeapons_: rerollWeapon ? true : false,
            rollItems_: rerollItem ? true : false,
            useitem_: useItemValue ? true : false,
        }

       value > 0 && onSendCampaign({tryTokenids, tryCampaign, trySection, tryWeapon, tryItem, useItem})

        
        //value > 0 && await sendCampaign({tryTokenids, tryCampaign, trySection, tryWeapon, tryItem, useItem})


      

        onChangeIndex(value)
    }
    const showTooltip = (content) => {
        if(content === "") return <></>
        return (
            <div className="sector-tooltip">
                {/* <h3>{title}</h3> */}
                <pre>{mode !== "campaign" ? "You can't click on bloodthirst mode!" : content}</pre>
            </div>
        )
    }
    const renderModal = (modal) => {
        if(!modal.show) return <></>
        return (
            <div className="modal">
                <div className="modal-content">
                    <span className="close-modal" onClick={() => setModal({show: false, nft: null})}>X</span>
                    <h3>{`${modal.nft.classString} ${modal.nft.name}`}</h3>
                    <p>{`Health: ${modal.nft.health}\nLevel: ${modal.nft.level}`}</p>
                </div>
            </div>
        )
    }

        useEffect(() => {
            setSectorChange(1)
        }, [0])

        useEffect(() => {
            const getCampaignData = async() => {
                const campaignArry = []
                for(let i = 0; i < campaigns.length; i++){
    
                    await getCampaign(campaigns[i].id).then(res => {
    
                    const camoObj = {
                            name: campaigns[i].name,
                            id: campaigns[i].id,
                            time: campaigns[i].time,
                            image: campaigns[i].image,
                            baseRewads: res.baseRewads,
                            creatureCount: res.creatureCount,
                            creatureHealth: res.creatureHealth,
                            minLevel: res.minLevel,
                            maxLevel: campaigns[i].maxLevel,
                     
                        }
    
                        campaignArry.push(camoObj)
                    })
                }

                console.log(campaignArry)

                setCampaignArray(campaignArry)
                setActiveCampaign(campaignArry[campaign])
            }
            getCampaignData()
        }, [campaign, setCampaign])



    return campaignArray ? (
        <div>

            <div className="d-flex flex-column overview-content">         

                        <div>{"Where would you like to campaign?"}</div>
                         
                         <div className="carousel">
                             <button className="btn_prev" onClick={() => setCampaign(campaign === 0 ? campaignArray.length - 1 : campaign - 1)} />
                             <div className="campaign-slide-passive">
                                 <img className="campaign-thumb-passive" src={campaignArray[campaign === 0 ? campaignArray.length - 1 : campaign - 1].image} alt="campaign" />
                             </div>
                             <div className="campaign-slide">
                                 <img className="campaign-thumb" src={campaignArray[campaign].image} alt="campaign" />
                                 <div className="campaign-title">{campaignArray[campaign].name}</div>
                                 
                             </div>
                             <div className="campaign-slide-passive">
                                 <img className="campaign-thumb-passive" src={campaignArray[(campaign + 1) % campaignArray.length].image} alt="campaign" />
                             </div>
                             <button className="btn_next" onClick={() => setCampaign((campaign + 1) % campaignArray.length)} />
                         </div>


                 <div className="sector-panel">
  
                   
                    <div className="game-info">
                        {console.log(campaign)}
                        <span>{`Game Mode: ${mode}`}</span>
                        <span>{`sector: ${sector}`}</span>
                        <span>
                            reroll weapon:
                            {" "}
                            {rerollWeapon ? <b>YES</b> : <strong>NO</strong>}
                        </span>
                        <span>
                            reroll item: 
                            {" "}
                            {rerollItem ? <b>YES</b> : <strong>NO</strong>}
                        </span>
                        <span>
                            use item:
                            {" "}
                            {useItemValue ? <b>YES</b> : <strong>NO</strong>}
                        </span>
                        <br/>
                      

                        <span> Creatures remaining: {activeCampaign.creatureCount}</span>
                        <span>{`miren rewards: ${mirenRewards}`} $REN</span>
                        <span>{`creature health: ${creatureHealth}`}</span>
                                 <span> Min Level Required: {activeCampaign.minLevel}</span>
                                 {activeCampaign.maxLevel && <span> Max Level Allowed: {activeCampaign.maxLevel}</span>}
                  
                     
                    </div>
             
                    <div className="elves-panel">
                        {data.map((character) => {
                         
                            let attackTime = creatureHealth/parseInt(character.attack);
                            attackTime = attackTime > 0 ? attackTime * 1 : 0;
                            
                            let time = (300/(parseInt(character.health))) +  attackTime;
                            time = Math.ceil(time)
                            
                            
                            
                           return(
                            
                            <div key={character.id} className="elf-rect">
                                <img src={character.image} 
                                onMouseEnter={() => setTooltip(`Expected regeneration time: ${time} hours`)}
                                onMouseLeave={() => setTooltip("")} 
                                alt="elf" onClick={() => setModal({show: true, nft: character})} />
                            </div>
                            )}   
                        )}
                    </div>
                    <p className="choose-sector">choose sector</p>
                    <div className="d-flex">
                        {[1,2,3,4,5].map((value) => {
                            return (
                                <span key={value}className={sector === value ? "btn-sector active" : "btn-sector"} onClick={() => setSectorChange(value)}
                                onMouseEnter={() => setTooltip(`Creature health is ${((parseInt(value) - 1) * 12) + parseInt(campaign.creatureHealth)}hp in section ${value}. Earn ${(parseInt(campaign.baseRewads) + (2 * (parseInt(value) - 1)))} $REN`)}
                                onMouseLeave={() => setTooltip("")} 
                                >
                                    {value}
                                </span>
                            )


                        }
                        )
                        }

                      
                    </div>
                    {showTooltip(tooltip)}
                    <div style={{width: 380}}>
                    <p>weapons &amp; items - look for new stuff when you campaign?</p>
                    </div>
                    
                    <div className="d-flex items-center">
                        <div 
                            className={rerollWeapon ? "btn-sector-option active" : "btn-sector-option"} 
                            onClick={() => mode === "campaign" && setRerollWeapon(state => !state)}
                            onMouseEnter={() => setTooltip("Do you want to roll a new Weapon?")}
                            onMouseLeave={() => setTooltip("")}
                        >
                            weapon
                        </div>
                        <div 
                            className={rerollItem ? "btn-sector-option active" : "btn-sector-option"} 
                            onClick={() => mode === "campaign" && setRerollItem(state => !state)} 
                            onMouseEnter={() => setTooltip("Do you want to roll a new Item?")}
                            onMouseLeave={() => setTooltip("")} 
                        >
                            item
                        </div>
                        </div>
                        <div className="d-flex items-center">
                        <div 
                            className={useItemValue ? "btn-sector-option active" : "btn-sector-option"} 
                            onClick={() => mode === "campaign" && setUseItemValue(state => !state)}
                            onMouseEnter={() => setTooltip(`Do you use your item in {${"item in stash"}}?`)}
                            onMouseLeave={() => setTooltip("")}
                        >
                            use item
                        </div>
                    </div>
                </div>                
            
            </div>
            <div className="d-flex flex-row justify-around">
                    <button className="btn btn-red" onClick={() => confirm ? setConfirm(false) : handleChangeIndex(mode === "campaign" ? -1 : -3)} >back</button>
                    <button className="btn btn-green" onClick={() => handleChangeIndex(1)}>"next"</button>
            </div>
            {renderModal(modal)}
        </div>
        
    ) : <></>
}



export default Sector