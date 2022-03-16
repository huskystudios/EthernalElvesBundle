

import mount from "../../assets/images/mount.png"
import woods from "../../assets/images/woods.png"
import meadows from "../../assets/images/meadows.png"
import campaignImg from "../../assets/images/campaign.png"
import stakeImg from "../../assets/images/stake.png"
import bloodImg from "../../assets/images/bloodthirst.png"
import cove from "../../assets/images/cove.png"
import mammon from "../../assets/images/mammon.png"
import fallout from "../../assets/images/fallout.png"

import AuraOfImmunity from "../../assets/images/items/Aura_of_Immunity.png"
import DemonicRupture from "../../assets/images/items/Demonic_Rupture.png"
import MidasRing from "../../assets/images/items/Midas_Ring.png"
import MoonElixir from "../../assets/images/items/Moon_Elixir.png"
import SpiritBand from "../../assets/images/items/Spirit_Band.png"
import TalismanOfEnragement from "../../assets/images/items/Talisman_of_Enragement.png"

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
  {action: 7, text: 'healing'},
  {action: 8, text: 'polygon'},
  {action: 9, text: 'synergize'},
  {action: 10, text: 'bloodthirst'}
]

export const rollCosts =[
    {action:"forging", ren: 200, eth:.04},
    {action:"merchant", ren: 10, eth:.01},
    {action:"synergize", ren: 5, eth:0}

]

export const items = [
    {
        item: 0,
        text: 'Empty',
        description: "",
    },
    {
        item: 1,
        text: 'Talisman of Enragement',
        description: "Increase total attack points 2x",
        image: TalismanOfEnragement,
    },
    {
        item: 2,
        text: 'Moon Elixir',
        description: "Increase health points by 2x",
        image: MoonElixir,
    },
    {
        item: 3,
        text: 'Midas Ring',
        description: "Double Rewards",
        image: MidasRing,
    },
    {
        item: 4,
        text: 'Spirit Band',
        description: "Double XP (level)",
        image: SpiritBand,
    },
    {
        item: 5,
        text: 'Aura of Immunity',
        description: "Eliminates HP Regeneration",
        image: AuraOfImmunity,
    },
    {
        item: 6,
        text: 'Demonic Rupture',
        description: "Increase attack points by 3x",
        image: DemonicRupture,
    },
];
 
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


export const rampages =

[
    {
        "id": 1,
        "name": "Wandering Souls",
        "image": woods,
        "time": 1.2,
        "maxLevel": 100
    },
    {
        "id": 2,
        "name": "Fervorous Hollow",
        "image": meadows,
        "time": 1.5,
        "maxLevel": 100
    },
    {
        "id": 3,
        "name": "Hidden Grove",
        "image": mount,
        "time": 0.6,
        "maxLevel": 100
    },
    {
        "id": 4,
        "name": "Tomb of Vitality",
        "image": fallout,
        "time": 0.6,
        "maxLevel": 30
    },
    {
        "id": 5,
        "name": "Inferno Abyss  ",
        "image": cove,
        "time": 0.6,
        "maxLevel": 50
    },
    {
        "id": 6,
        "name": "Untamed Ether",
        "image": mammon,
        "time": 0.6,
        "maxLevel": 100
    },
    {
        "id": 7,
        "name": " Dark Untamed Ether",
        "image": mammon,
        "time": 0.6,
        "maxLevel": 100
    }

]

export const accessoriesAbilities = [

{
    id: 2,
    name: "Bear",
    ability: "increases attack points by 30+",
    tier: 4,
    image: "https://i.imgur.com/XQZQZqF.png"
},
{
    id: 3,
    name: "Liger",
    ability: "decreases druid heal cooldown to 4 hours",
    tier: 4,
    image: "https://i.imgur.com/XQZQZqF.png"
},
{
    id: 4,
    name: "None",
    ability: "",
    tier: 0,
},
{
    id: 5,
    name: "Claws",
    ability: "cosmetic",
    tier: 1,
},
{
    id: 6,
    name: "Drus Ruler of The Oaks",
    ability: "cosmetic",
    tier: 5,
},
{
    id: 8,
    name: "Necklace",
    ability: "cosmetic",
    tier: 1,
},
{
    id: 9,
    name: "Necklace & Armband",
    ability: "cosmetic",
    tier: 2,
},
{
    id: 10,
    name: "Crown of Dahagon",
    ability: "Increases IK by 15%",
    tier: 3,
},
{
    id: 11,
    name: "Mechadon's Vizard",
    ability: "Increases IK by 25%",
    tier: 4,
},
{
    id: 12,
    name: "Euriel The Protector",
    ability: "Increases IK by 35%",
    tier: 5,
},
{
    id: 13,
    name: "Kidor The Slayer of Demons",
    ability: "Increases IK by 35%",
    tier: 5,
},
{
    id: 14,
    name: "Lord Mecha Aker",
    ability: "Increases IK by 35%",
    tier: 5,
},
{
    id: 15,
    name: "Wristband",
    ability: "cosmetic",
    tier: 1,
},
{
    id: 16,
    name: "Wristband & Necklace",
    ability: "cosmetic",
    tier: 2,
},
{
    id: 17,
    name: "Azrael's Crest",
    ability: "Increases attack points by 15%",
    tier: 3,
},
{
    id: 18,
    name: "El Machina",
    ability: "Increases attack points by 25%",
    tier: 4,
},
{
    id: 19,
    name: "Eriel Angel of Nature",
    ability: "Increases attack points by 35%",
    tier: 5,
},
{
    id: 20,
    name: "Khonsuna Demon Destroyer",
    ability: "Increases attack points by 35%",
    tier: 5,
},
{
    id: 21,
    name: "Lord Machina Ethena",
    ability: "Increases attack points by 35%",
    tier: 5,
}

]