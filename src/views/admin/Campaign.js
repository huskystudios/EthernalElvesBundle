import React, { useEffect, useState } from "react"
import {campaigns} from "../home/config"
import {getCampaign} from "../../utils/interact"

const CampaignAdmin = () => {
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
                 
                    }

                    campaignArry.push(camoObj)
                })
            }
            setCampaignArray(campaignArry)
         
        }
        getCampaignData()
    }, [])


     return campaignArray ? (
        
        <>
        Campaigns
        {campaignArray.map((campaign, index) => {
                        
            return(
                <>
                <div key={index} className="flex text-sm">
                {campaign.id}. {campaign.name}: {campaign.creatureCount} left
                 </div>
                
                </>
            )
        })}
        
        </>
        
    ) : null
}



export default CampaignAdmin