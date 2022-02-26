import React, { useEffect, useState } from "react"
import {campaigns} from "../config" 
import {getCampaign, sendCampaign, getCurrentWalletConnected} from "../../../utils/interact"

const Bloodthirst = ({onChangeIndex, onSendCampaign, data, mode, chain}) => {

    const [rerollWeapon, setRerollWeapon] = useState(false);
    const [rerollItem, setRerollItem] = useState(false);
    const [useItemValue, setUseItemValue] = useState(false);
    const [sector, setSector] = useState(1)
    const [tooltip, setTooltip] = useState("");
    const [modal, setModal] = useState({show: false, nft: null})
    const [creatureHealth, setCreatureHealth] = useState("")
    const [mirenRewards, setMirenRewards] = useState("")
    const [alert, setAlert] = useState({ show: false, value: null })

    const [campaign, setCampaign] = useState(0)
    const [activeCampaign, setActiveCampaign] = useState(0)
    const [campaignArray, setCampaignArray] = useState(0)

    const setSectorChange = (value) => {
    
    setSector(value)
    setMirenRewards(parseInt(activeCampaign.baseRewads) + (2 * (parseInt(value) - 1)))
    setCreatureHealth(((parseInt(value) - 1) * 12) + parseInt(activeCampaign.creatureHealth))
    
    }
    const handleChangeIndex = async (value) => {


        let {address} = await getCurrentWalletConnected()
        let levelValidation = []
        
        data.map(item => {
            if (parseInt(item.level) >= parseInt(activeCampaign.minLevel) && parseInt(item.level) <= parseInt(activeCampaign.maxLevel)) {

                
            }else{
                levelValidation.push(item)
            }        
        
        })

        if(levelValidation.length > 0){
            setAlert({show: true, value: {
                title: "Levels not in range", 
                content: `You can't use this campaign because you have anElf with level ${levelValidation[0].level} in this sector and the campaign requires level ${activeCampaign.minLevel} to ${activeCampaign.maxLevel}`
            }})

            return
        }

        if(parseInt(activeCampaign.creatureCount) === 0){
            setAlert({show: true, value: {
                title: "No creatures left", 
                content: `No creatures left in this campaign`
            }})

            return
        }




      
        let tryTokenids = data.map(nft => {return(nft.id)})
        let tryCampaign = activeCampaign.id.toString()
        let trySection = sector.toString()
        let tryWeapon = rerollWeapon
        let tryItem = rerollItem
        let useItem = useItemValue

        if(chain === "polygon"){
            onSendCampaign({tryTokenids, tryCampaign, trySection, tryWeapon, tryItem, useItem, address})
        }else{
            onSendCampaign({tryTokenids, tryCampaign, trySection, tryWeapon, tryItem, useItem})
        }
        
        onChangeIndex(value)
    }



    const handleCampaignChange = async (value) => {
        setCampaign(value)
        setActiveCampaign(campaignArray[value])
        setSectorChange(1)

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

        

        const showAlert = ({ title, content }) => {

            return (
                <div className="alert">
                    <h3>{title}</h3>
                    <pre>{content}</pre>
                    <button className="btn btn-red" onClick={() => setAlert({ show: false })}>close</button>
                </div>
            )
        }
    
        



    return (
        <div>

            <div className="d-flex flex-column overview-content">         
            <div className="sector-panel">
            <div className="overview-heading">
                      Bloodthirst
            </div>
                         
                        
  
                 <div className="sector-options">

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
                       

                     
                    
                      

                 <div>
                                 
                    
                    {showTooltip(tooltip)}
                   
                    <>
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
                    </>
                </div>


                    <div className="game-info">
                     
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
                                onMouseEnter={() => setTooltip(`Expected regeneration time: ${time} hours. Elf level: ${character.level} `)}
                                onMouseLeave={() => setTooltip("")} 
                                alt="elf" onClick={() => setModal({show: true, nft: character})} />
                            </div>
                            )}   
                        )}
                    </div>
                    

                     </div>     
                </div>              
            
            </div>

           
            <div className="d-flex flex-row justify-around">
                    <button className="btn btn-red" onClick={() =>   handleChangeIndex(mode === "campaign" ? -1 : -3)} >back</button>  
                    <button className="btn btn-green" onClick={() => handleChangeIndex(1)}>Confirm</button>
            </div>
            
            {renderModal(modal)}
            {alert.show && showAlert(alert.value)}
        </div>
        
    ) 
}



export default Bloodthirst