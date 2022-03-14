import React, { useEffect, useState, useMemo } from "react"
import { useMoralis, useMoralisQuery } from "react-moralis"
import "./../style.css"
import Countdown from 'react-countdown';
import {
    checkIn,
    unStake,
    polygonContract,
} from "../../../utils/interact"

import Modal from "../../../components/Modal"
import Mint from "../../mint";
import Loader from "../../../components/Loader";
import thevoid from "../../../assets/images/thevoid.png";
import Dropdown from "../../../components/Dropdown/";
import Button from "../../../components/Dropdown/button";
import { actionString, items  } from "../config";

const Explore = ({  }) => {


    const { Moralis } = useMoralis();
    const [clicked, setClicked] = useState(["Druid" , "Ranger", "Assassin","Primeborne", "Woodborne", "Lightborne", "Darkborne", "eth", "polygon" ]);

    const [limit, setLimit] = useState(25);
    const [skip, setSkip] = useState(0);
    const [weaponTierMin, setWeaponTierMin] = useState(0);
    const [weaponTierMax, setWeaponTierMax] = useState(5);
    const [levelMin, setLevelMin] = useState(1);
    const [levelMax, setLevelMax] = useState(100);

    const sentinelClassList = ["Druid" , "Ranger", "Assassin"]
    const raceList = ["Primeborne", "Woodborne", "Lightborne", "Darkborne"]
    const chainList = ["eth", "polygon"]

    const [sentinelClass, setSentinelClass] = useState(["Druid" , "Ranger", "Assassin"]);
    const [race, setRace] = useState(["Primeborne", "Woodborne", "Lightborne", "Darkborne"])
    const [chain, setChain] = useState(["eth", "polygon"])

    const handleClick = (clickedItem)=> {
        console.log(clickedItem, sentinelClass)
        //if clickedItem is in clicked, remove it, else add it
        if(clicked.includes(clickedItem)){
            setClicked(clicked.filter(item => item !== clickedItem))
        } else {
            setClicked([...clicked, clickedItem])
        }
       //if clickedItem contained in sentinelClassList, add it to sentinelClass. if already in sentinelClass, remove it
         if (sentinelClassList.includes(clickedItem)) {
            if (sentinelClass.includes(clickedItem)) {
                setSentinelClass(sentinelClass.filter(item => item !== clickedItem))
            } else {
                setSentinelClass([...sentinelClass, clickedItem])
            }
        }
          //if clickedItem contained in chainList, add it to chain. if already in chain, remove it
            if (chainList.includes(clickedItem)) {
                if (chain.includes(clickedItem)) {
                    setChain(chain.filter(item => item !== clickedItem))
                } else {
                    setChain([...chain, clickedItem])
                }
            }
         //if clickedItem contained in raceList, add it to race. if already in race, remove it   
         if (raceList.includes(clickedItem)) {
            if (race.includes(clickedItem)) {
                setChain(race.filter(item => item !== clickedItem))
            } else {
                setChain([...race, clickedItem])
            }
        }

    }


    const { data, error, isLoading, fetch } = useMoralisQuery(
      "ElvesAdmin",
      query =>
        query
          .greaterThanOrEqualTo("elf_weaponTier", parseInt(weaponTierMin))
          .lessThanOrEqualTo("elf_weaponTier", parseInt(weaponTierMax))
          .greaterThanOrEqualTo("elf_level", parseInt(levelMin))
          .lessThanOrEqualTo("elf_level", parseInt(levelMax))
          .containedIn("elf_class", sentinelClass)
          .containedIn("elf_race", race)
          .containedIn("chain", chain)
          .descending("token_id")
          .limit(limit)
          .withCount()
          .skip(skip),
      [limit, weaponTierMin, weaponTierMax, levelMin, levelMax, sentinelClass,race, chain, skip],
      { autoFetch: false },
    );

    
    

    

    return !isLoading ? (
        <>
          <div className="dark-1000 h-full justify-center black">
        <div>

        </div>
          <div className="flex">
              <div className="p-1">
              <label>Min Level</label>
              <input value={levelMin} onChange={(e) => setLevelMin(e.target.value)}/>
              <label>Max Level</label>
              <input value={levelMax} onChange={(e) => setLevelMax(e.target.value)}/>          
              </div>
                <div>
                <label>Min Weapon Tier</label>
                <input value={weaponTierMin} onChange={(e) => setWeaponTierMin(e.target.value)}/>
                <label>Max Weapon Tier</label>
                <input value={weaponTierMax} onChange={(e) => setWeaponTierMax(e.target.value)}/>
                </div>
          

        <div className="flex flex-wrap justify-center">
           {sentinelClassList.map((sentinel)=>{

                let rowSelected = clicked.includes(sentinel) ? "dropdown-btn p-1" : "p-1"

            return(<>
                     <div className={rowSelected} onClick={()=> handleClick(sentinel)}>
                    {sentinel}
                    </div>
                    </>)

           })}   
           </div>
           <div className="flex flex-wrap justify-center">
           {raceList.map((sentinel)=>{

                let rowSelected = clicked.includes(sentinel) ? "dropdown-btn p-1" : "p-1"

            return(<>
                     <div className={rowSelected} onClick={()=> handleClick(sentinel)}>
                    {sentinel}
                    </div>
                    </>)

           })}   
           </div>
           <div className="flex flex-wrap justify-center">
           {chainList.map((sentinel)=>{

                let rowSelected = clicked.includes(sentinel) ? "dropdown-btn p-1" : "p-1"

            return(<>
                     <div className={rowSelected} onClick={()=> handleClick(sentinel)}>
                    {sentinel}
                    </div>
                    </>)

           })}   
           </div>
        

              <div className="flex">
              <button
                  className="btn btn-grey"
                  onClick={fetch}
                 
              >
                  Filter
             
              </button>
              </div>

            </div>


                <div className="collection-selection">

                <div className="explore-view">
                {data.results && data.results.map((line) => {

                    const date = new Date(line.get("elf_timestamp") * 1000)
                    const isActive = new Date() > date
                    let passiveString = ""

                    let passiveFlag = false

                    let action = parseInt(line.get("elf_action"))

                    //get text from actionString where action is the key
                    actionString.forEach((item) => {
                        if(item.action === action){
                            action = item.text
                            //passiveFlag = true
                        }
                    })

                    let inventory = parseInt(line.get("elf_inventory"))
                    let inventoryString
                   
                    let inventoryDescription
                    items.forEach((item) => {
                        if(item.item === inventory){
                            inventoryDescription = item.description
                            inventoryString = item.text
                          
                        }
                    })

                    console.log(line, action, date)

                    ///turn date in tto hours if less than 24 then into days    
                    if (parseInt(line.get("elf_action")) === 3) {
                        let timesince = Math.floor(((new Date() - date) / 1000) / (60 * 60))
                        if (timesince < 24) {
                            passiveString = `${timesince} hours`
                        } else {
                            let timesince = Math.floor(((new Date() - date) / 1000) / (60 * 60 * 24))
                            passiveString = `${timesince} days`
                        }
                    }

                    let owner = line.get("owner_of")

                    const ownerTruncated = 
                    owner.slice(0, 6) +
                    "..." +
                    owner.slice(-4);

                    return (
                    
                    <div key={line.get("token_id")} className={`card-rect`}>
                        <img className="card-image" src={line.get("elf_image")} alt="elf" />
                        <div className="card-attr">
                            
                            <div><span>Status:</span><span>{line.get("elf_status")}</span></div>
                            <div>
                                <span>Inventory</span>
                                <span>{inventoryString !== "Empty" ? (
                                    <div className="item-info">
                                       
                                        <strong>{inventoryString}</strong>
                                        {inventoryDescription && <span>{inventoryDescription}</span>}
                                    </div>
                                ) : (
                                    <strong>-</strong>
                                )}</span>
                            </div>
                            {/*<div>{line.primaryWeapon}</div>        */}
                            <div><span>Weapon:</span><span>{line.get("elf_weapon")} +{line.get("elf_weaponTier")}</span></div>
                            <div>
                                <span>HP:</span>
                                <span>{line.get("elf_hp")}</span>
                            </div>
                            <div>    
                                <span>AP:</span>
                                <span>{line.get("elf_ap")}</span>
                            </div>
                            <div>    
                                <span>Level:</span>
                                <span>{line.get("elf_level")}</span>
                            </div>
                            <div><span>Class:</span><span>{line.get("elf_class")}</span></div>
                            <div><span>Last Action Taken:</span><span>{action}</span></div>
                            <div>
                                <span>Cooldown(-)/<br />Passive(+):</span><span>{!isActive && !passiveFlag && <Countdown date={date} />}
                                    {passiveString}
                                </span>
                            </div>
                            <div>    
                                <span>Owner:</span>
                                <span><a href={`https://etherscan.io/address/${owner}`}>{ownerTruncated}</a> </span>
                            </div>
                        </div>
                    </div>)
                }
                )}
                {data.count && <>Total items {data.count}</>}
            </div>


</div>
</div>

        </>
    ) : <Loader />
}

export default Explore