

import mount from "../../assets/images/mount.png"
import woods from "../../assets/images/woods.png"
import meadows from "../../assets/images/meadows.png"
import campaignImg from "../../assets/images/campaign.png"
import stakeImg from "../../assets/images/stake.png"
import bloodImg from "../../assets/images/bloodthirst.png"
import cove from "../../assets/images/cove.png"
import mammon from "../../assets/images/mammon.png"
import fallout from "../../assets/images/fallout.png"

export const sentinelClass = ["Druid", "Assassin", "Ranger"] 

export const actions = 
[
    {id: 0, text: 'passive', image: stakeImg},
    {id: 1, text: 'campaign', image: campaignImg},
    {id: 2, text: 'bloodThirst', image: bloodImg}
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
    {item: 0, text: 'Empty', description: ""},
    {item: 1, text: 'Talisman of Enragement', description: "Increase total attack points 2x"},
    {item: 2, text: 'Moon Elixir', description: "Increase health points by 2x"},
    {item: 3, text: 'Midas Ring', description: "Double Rewards"},
    {item: 4, text: 'Spirit Band', description: "Double xp (level)"},
    {item: 5, text: 'Aura of Immunity', description: "Eliminates HP Regeneration"},
    {item: 6, text: 'Demonic Rupture', description: "Increase attack points by 3x"}
]
 
export const campaigns =

[
    {
        "id": 1,
        "name": "Whispering Woods",
        "image": woods,
        "time": 1.2,
        "maxLevel": 100
    },
    {
        "id": 2,
        "name": "Enchanted Meadows",
        "image": meadows,
        "time": 1.5,
        "maxLevel": 100
    },
    {
        "id": 3,
        "name": "Mount Eluna",
        "image": mount,
        "time": 0.6,
        "maxLevel": 100
    },
    {
        "id": 4,
        "name": "Northern Fallout",
        "image": fallout,
        "time": 0.6,
        "maxLevel": 30
    },
    {
        "id": 5,
        "name": "Cove of Samim",
        "image": cove,
        "time": 0.6,
        "maxLevel": 50
    },
    {
        "id": 6,
        "name": "Mammon's Lair",
        "image": mammon,
        "time": 0.6,
        "maxLevel": 100
    }
]

