import React, { useEffect, useState } from "react"
import {campaigns} from "../config" 
import {getCampaign, sendCampaign, getCurrentWalletConnected} from "../../../utils/interact"

const Bloodthirst = ({onChangeIndex, onSendCampaign, data, chain}) => {

    const [rerollWeapon, setRerollWeapon] = useState(false);
    const [rerollItem, setRerollItem] = useState(false);
    const [useItemValue, setUseItemValue] = useState(false);
    const [sector, setSector] = useState(1)
    const [tooltip, setTooltip] = useState("");
    const [modal, setModal] = useState({show: false, nft: null})
    const [creatureHealth, setCreatureHealth] = useState(400)

    const [alert, setAlert] = useState({ show: false, value: null })




    const handleChangeIndex = async (value) => {


        let {address} = await getCurrentWalletConnected()
       
        
        let tryTokenids //= data.map(nft => {return(nft.id)})
           // get ids from data where cooldown is false
        tryTokenids = data.filter(nft => {
            return nft.cooldown === false
        }).map(nft => {
            return nft.id
                
        })

        let tryItem = rerollItem
        let useItem = useItemValue

        console.log(tryTokenids)

        if(chain === "polygon"){
            onSendCampaign({tryTokenids, tryItem, useItem, address})
        }
        
        onChangeIndex(value)
    }



    const showTooltip = (content) => {
        if(content === "") return <></>
        return (
            <div className="sector-tooltip">
                {/* <h3>{title}</h3> */}
                <pre>{content}</pre>
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
                    
                      <div>

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
                      </div>

                 <div>
                                 
                    
                    {showTooltip(tooltip)}
                   
                    <>
                    <div style={{width: 380}}>
                    <p>weapons &amp; items - look for new stuff when you campaign?</p>
                    </div>
                    
                    <div className="d-flex items-center">
                        <div 
                            className={rerollWeapon ? "btn-sector-option active" : "btn-sector-option"} 
                            onClick={() => setRerollWeapon(state => !state)}
                            onMouseEnter={() => setTooltip("Do you want to roll a new Weapon?")}
                            onMouseLeave={() => setTooltip("")}
                        >
                            weapon
                        </div>
                        <div 
                            className={rerollItem ? "btn-sector-option active" : "btn-sector-option"} 
                            onClick={() =>  setRerollItem(state => !state)} 
                            onMouseEnter={() => setTooltip("Do you want to roll a new Item?")}
                            onMouseLeave={() => setTooltip("")} 
                        >
                            item
                        </div>
                        </div>
                        <div className="d-flex items-center">
                        <div 
                            className={useItemValue ? "btn-sector-option active" : "btn-sector-option"} 
                            onClick={() => setUseItemValue(state => !state)}
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
                 
                    <button className="btn btn-green" onClick={() => handleChangeIndex(1)}>Confirm</button>
            </div>
            
            {renderModal(modal)}
            {alert.show && showAlert(alert.value)}
        </div>
        
    ) 
}



export default Bloodthirst