import React, { useState } from "react"
import forgeIcon from "../../../assets/images/forge.png";
import merchantIcon from "../../../assets/images/merchant.png";

const Overview = ({nft, onChangeIndex, onRunWeb3}) => {

    const [modal, setModal] = useState({show: false, content: ""})
    const [healModal, setHealModal] = useState(false)
    const [tokenId, setTokenId] = useState("")

    const renderModal = () => {
        if(!modal.show) return <></>
        const handleEthClick = () => {
            onRunWeb3({action:modal.action})
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
    const renderHealModal = () => {
        if(!healModal) return <></>
        const handleChange = (e) => {
            setTokenId(e.target.value)
        }
        const heal = () => {
            console.log("heal someoone", tokenId)
            onRunWeb3({action:"heal", healIds: tokenId})
            setHealModal(false)
        }
        return(
            <div className="modal">
                <div className="modal-content items-center">
                    <span className="close-modal" onClick={() => setHealModal(false)}>X</span>
                    <h3>who do you wish to heal?</h3>
                   
                    <input placeholder="1017" className="heal-input" value={tokenId} onChange={handleChange} />
                    <button className="btn-modal" onClick={heal}>confirm</button>
                </div>
            </div>
        )
    }
    const isInPassive = nft[0].actionString === "Sent to Passive Campaign";
    const isInCooldown = Math.floor(new Date().getTime() / 1000) < nft[0].time;
    const unstakeBtnDisabled = isInCooldown || isInPassive;

    const unStake = () => {
        onRunWeb3({action:"unStake"})
       // console.log("clicked unstake button")
    }
    return (
        <div className="overview-content d-flex flex-column">
            <div className="d-flex flex-column items-center mb-2">
            {nft[0].elfStatus === "staked" && nft[0].actionString !== "On Campaign" &&
                <button className="btn-lounge justify-center" disabled={unstakeBtnDisabled} onClick={() => {unStake()}}>UNSTAKE</button>
            }
                {nft[0].sentinelClass === 0 &&
                <button className="btn-lounge justify-center" onClick={() => {setHealModal(true)}}>HEAL</button> 
        }
            </div>
            <div className="overview-panel">
                <img className="active-img" src={nft[0].image} alt="active nft" />
                <div className="active-attributes-heading">
                Attributes
                </div>
                <div className="active-attributes d-flex flex-column">
                    {nft[0].attributes.map((attribute, index) => {
                        return <div className="d-flex flex-row justify-between" key={index}>
                            <span className="attribute-name">{attribute.trait_type}:</span>
                            <span className="attribute-value">{attribute.value}</span>
                        </div>})}
                    
                </div>  
                <div className="overview-heading">
                {nft[0].classString} {nft[0].name}                 
                </div>

   
                
                <div className="active-actions">
                    <div className="lounge">elven lounge</div>
                    <div className="btn-lounge" onClick={() => {setModal({show: true, action:"forging", heading:"DO YOU WANT TO FORGE A NEW WEAPON?", content:"forge"})}}><img src={forgeIcon} alt="forge icon" />forge</div>
                    <div className="btn-lounge" onClick={() => {setModal({show: true, action:"merchant", heading:"DO YOU WANT TO TRY FOR A NEW ITEM?", content:"buy"})}}><img src={merchantIcon} alt="merchant icon" />merchant</div>
                   
                </div>
                
                
            </div>
            <div className="d-flex flex-row justify-around">
                <button className="btn btn-red" onClick={() => onChangeIndex(-100)} >back</button>
                <button className="btn btn-green" onClick={() => onChangeIndex(1)} >actions</button>
            </div>
            {renderModal()}
            {renderHealModal()}
        </div>
    )
}

export default Overview