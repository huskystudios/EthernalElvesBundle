import React, { useEffect, useState } from "react"
import {campaigns} from "../views/home/config"
import {getCampaign} from "../utils/interact"

const Campaigns = () => {
    const [campaign, setCampaign] = useState(0)
    const [campaignArray, setCampaignArray] = useState()
    
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
            setCampaignArray(campaignArry)
           
        }
        getCampaignData()
    }, [campaign])


     return campaignArray ? (
        <div className="d-flex flex-column campaign-panel">
            <div className="d-flex flex-column">
               
                <div className="carousel">
                    <button className="btn_prev" onClick={() => setCampaign(campaign === 0 ? campaignArray.length - 1 : campaign - 1)} />
                    <div className="campaign-slide-passive">
                        <img className="campaign-thumb-passive" src={campaignArray[campaign === 0 ? campaignArray.length - 1 : campaign - 1].image} alt="campaign" />
                    </div>
                    <div className="campaign-slide">
                        <img className="campaign-thumb" src={campaignArray[campaign].image} alt="campaign" />
                        <div className="campaign-title">{campaignArray[campaign].name}
                        </div>
                       <div className="campaign-tip">
                        <div> Creatures remaining: {campaignArray[campaign].creatureCount}</div>
                        <div> Minimum Reward:  {campaignArray[campaign].baseRewads}</div>
                        <div> Min Creature Health: {campaignArray[campaign].creatureHealth}</div>
                        <div> Min Level Required: {campaignArray[campaign].minLevel}</div>
                        {campaignArray[campaign].maxLevel && <div> Max Level Allowed: {campaignArray[campaign].maxLevel}</div>}
                        
                       </div>
                        
                       
                        
                        
                        
                        
                    </div>
                    <div className="campaign-slide-passive">
                        <img className="campaign-thumb-passive" src={campaignArray[(campaign + 1) % campaignArray.length].image} alt="campaign" />
                    </div>
                    <button className="btn_next" onClick={() => setCampaign((campaign + 1) % campaignArray.length)} />
                </div>
                
            </div>
            <div className="d-flex flex-row justify-between">
              
            </div>
        </div>
    ) : null
}



export default Campaigns