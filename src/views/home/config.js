

import campaignImage1 from "../../assets/images/camp1.png"
import campaignImage2 from "../../assets/images/camp2.png"
import campaignImage3 from "../../assets/images/camp3.png"
import campaignImg from "../../assets/images/campaign.png"
import stakeImg from "../../assets/images/stake.png"
import bloodImg from "../../assets/images/bloodthirst.png"

export const sentinelClass = ["Druid", "Assassin", "Ranger"] 

export const actions = 
[
    {id: 0, text: 'Passive', image: stakeImg},
    {id: 1, text: 'Campaign', image: campaignImg},
    {id: 2, text: 'Blood Thirst', image: bloodImg, disabled: true}
]

export const actionString =
 [{action: 0, text: 'unstake'},
  {action: 1, text: 'stake'},
  {action: 2, text: 'campaign'},
  {action: 3, text: 'passive mode'},
  {action: 4, text: 'return'},
  {action: 5, text: 're-roll weapon'},
  {action: 6, text: 're-roll item'},
  {action: 7, text: 'healing'}
]

export const items =
[
    {item: 0, text: 'Empty', description: "Nothing to see here"},
    {item: 1, text: 'Talisman of Enragement', description: "Increase total attack points 2x"},
    {item: 2, text: 'Moon Elixir', description: "Increase health points by 2x"},
    {item: 3, text: 'Midas Ring', description: "Double Rewards"},
    {item: 4, text: 'Spirit Band', description: "Double xp (level)"},
    {item: 5, text: 'Aura of Immunity', description: "No cooldown"},
    {item: 6, text: 'Demonic Rupture', description: "Increase attack points by 3x"}
]
 
export const campaigns =

[
    {
        "id": 1,
        "name": "Mount Eluna",
        "image": campaignImage1,
        "time": 1.2
    },
    {
        "id": 2,
        "name": "enchanted forest",
        "image": campaignImage2,
        "time": 1.5
    },
    {
        "id": 3,
        "name": "Whispering Woods",
        "image": campaignImage3,
        "time": 0.6
    }
]

