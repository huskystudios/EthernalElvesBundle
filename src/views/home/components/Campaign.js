import React, { useEffect, useState } from "react"
import {campaigns} from "../config" 
import {getCampaign} from "../../../utils/interact"

const Campaign = ({onChangeIndex, onSetCampaign}) => {
    const [campaign, setCampaign] = useState(0)
    const [campaignArray, setCampaignArray] = useState()
     

    const handleChangeIndex = (value) => {
        onChangeIndex(value)
    }
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
                 
                    }

                    campaignArry.push(camoObj)
                })
            }
            setCampaignArray(campaignArry)
            onSetCampaign(campaignArry[campaign])
        }
        getCampaignData()
    }, [campaign, onSetCampaign])


     return campaignArray ? (
        <div className="d-flex flex-column campaign-panel">
            <div className="d-flex flex-column">
                <span>{"Where would you like to campaign???"}</span>
                <div className="carousel">
                    <button className="btn_prev" onClick={() => setCampaign(campaign === 0 ? campaignArray.length - 1 : campaign - 1)} />
                    <div className="campaign-slide-passive">
                        <img className="campaign-thumb-passive" src={campaignArray[campaign === 0 ? campaignArray.length - 1 : campaign - 1].image} alt="campaign" />
                    </div>
                    <div className="campaign-slide">
                        <img className="campaign-thumb" src={campaignArray[campaign].image} alt="campaign" />
                        <div className="campaign-title">{campaignArray[campaign].name}</div>
                       <div className="campaign-tip">
                        <div> Creatures remaining: {campaignArray[campaign].creatureCount}</div>
                        <div> Minimum Reward:  {campaignArray[campaign].baseRewads}</div>
                        <div> Min Creature Health: {campaignArray[campaign].creatureHealth}</div>
                        <div> Min Level Required: {campaignArray[campaign].minLevel}</div>
                       </div>
                        
                       
                        
                        
                        
                        
                    </div>
                    <div className="campaign-slide-passive">
                        <img className="campaign-thumb-passive" src={campaignArray[(campaign + 1) % campaignArray.length].image} alt="campaign" />
                    </div>
                    <button className="btn_next" onClick={() => setCampaign((campaign + 1) % campaignArray.length)} />
                </div>
                
            </div>
            <div className="d-flex flex-row justify-between">
                <button className="btn btn-red" onClick={() => handleChangeIndex(-2)} >back</button>
                <button className="btn btn-green" onClick={() => handleChangeIndex(1)} >next</button>
            </div>
        </div>
    ) : null
}



export default Campaign