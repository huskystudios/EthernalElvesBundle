import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import Loader from "../../components/Loader";
import { useMoralisWeb3Api } from "react-moralis";





const actionString = ["unstaked", "staked", "campaign", "passive mode", "idle", "re-rolled weapon", "re-rolled item", "healing", "polygon", "synergize", "bloodthirst", "rampage"]

const Stats = () => {

const [loading, setLoading] = useState(true);

const { Moralis } = useMoralis();
const [renSupply, setRenSupply] = useState(0);
const [ownerCount, setOwnerCount] = useState(0);
const [levelDistribution, setLevelDistribution] = useState([]);
const [weaponTierDistribution, setWeaponTierDistribution] = useState([]);
const [actionDistribution, setActionDistribution] = useState([]);
const [inPolygon, setInPolygon] = useState([]);
const [staked, setStaked] = useState([]);
const [contractRen, setContractRen] = useState([]);
const [status, setStatus] = useState("");
const [renPrice, setRenPrice] = useState();
const [nftTrades, setNftTrades] = useState([]);

const Web3Api = useMoralisWeb3Api();

const fetchPairAddress = async () => {
  const options = {
    address: "0xE6b055ABb1c40B6C0Bf3a4ae126b6B8dBE6C5F3f",
    exchange: "uniswapv3",
    chain: "eth",
  };
  const pairAddress = await Web3Api.token.getTokenPrice(options);
  setRenPrice(pairAddress.usdPrice);
  
};

const fetchNFTTrades = async () => {
    const options = {
      address: "0xA351B769A01B445C04AA1b8E6275e03ec05C1E75",
      limit: "10",
      chain: "eth",
    };
    const trades = await Web3Api.token.getNFTTrades(options);
    console.log(trades);
    setNftTrades(trades);
  };


//Ren Supply {!loading && renSupply.toFixed()}  

useEffect(() => {
    async function init() {


    await Moralis.enableWeb3(); 
    setStatus("getting NFT Trades and price data")  
   // fetchPairAddress();    
    fetchNFTTrades();
    const ownerCount = await Moralis.Cloud.run("getAllOwners")  
    setStatus("getting owners " + ownerCount.length)  
    const dailyRen = await Moralis.Cloud.run("renEconomy", {frequency: "daily"});
    setStatus("getting ren economy " + dailyRen.net)  
    let actions = await Moralis.Cloud.run("getActions")    
    let staked = await Moralis.Cloud.run("getStaked")    
    setStatus("getting weapon distribution ")
    let weaponTierDistribution = await Moralis.Cloud.run("weaponTierDistribution")
    let getPolygonCount = await Moralis.Cloud.run("getPolygonCount")
    const renSupply = await Moralis.Cloud.run("renEconomy");
        
    

    weaponTierDistribution.sort(function(a, b) {
      return a.objectId - b.objectId;
    });

    
    
    let levels = await Moralis.Cloud.run("levelDistribution")
    let levelTiers = []
      //sort levels by objectId
      levels.sort(function(a, b) {
        return a.objectId - b.objectId;
      });

     
     //count tokens if objectID less than 20
        let tokenCount = 0
        for (let i = 0; i < levels.length; i++) {
            if (levels[i].objectId < 20) {
                tokenCount += levels[i].tokens
            }
        }

        levelTiers.push(tokenCount)
        tokenCount = 0
     //count tokens if objectID less than 40 but higher than 20
        for (let i = 0; i < levels.length; i++) {
            if (levels[i].objectId < 40 && levels[i].objectId > 20) {
                tokenCount += levels[i].tokens 
            }
        }
        levelTiers.push(tokenCount)
        //count tokens if objectID less than 60 but higher than 40
        tokenCount = 0
        for (let i = 0; i < levels.length; i++) {
            if (levels[i].objectId < 60 && levels[i].objectId > 40) {
                tokenCount += levels[i].tokens 
            }
        }
        levelTiers.push(tokenCount)
        //count tokens if objectID less than 80 but higher than 60
        tokenCount = 0
        for (let i = 0; i < levels.length; i++) {
            if (levels[i].objectId < 80 && levels[i].objectId > 60) {
                tokenCount += levels[i].tokens 
            }
        }
        levelTiers.push(tokenCount)
        
        //count tokens if objectID less than 100 but higher than 80
        tokenCount = 0
        for (let i = 0; i < levels.length; i++) {
            if (levels[i].objectId < 101 && levels[i].objectId > 80) {
                tokenCount += levels[i].tokens 
            }
        }
        levelTiers.push(tokenCount)



        let actionUnstaked = 0
        let actionStaked = 0
        let actionCampaign = 0
        let actionPassive = 0
        let actionIdle = 0
        let actionRerollWeapon = 0
        let actionRerollItem = 0
        let actionHealing = 0
        let actionPolygon = 0
        let actionBloodthirst = 0
        let actionSynergize = 0
        let actionRampage = 0


        actions.map(action => {

            let actionIndex = parseInt(action.objectId)

            if(actionIndex === 0) {
                actionIdle += action.tokens

            }
            if(actionIndex === 1) {
                actionIdle += action.tokens
            }
            if(actionIndex === 2) {
                actionCampaign += action.tokens
            }
            if(actionIndex === 3) {
                actionPassive += action.tokens
            }
            if(actionIndex === 4) {
                actionIdle += action.tokens
            }
            if(actionIndex === 5) {
                actionRerollWeapon += action.tokens
            }
            if(actionIndex === 6) {
                actionRerollItem += action.tokens
            }
            if(actionIndex === 7) {
                actionHealing += action.tokens
            }
            if(actionIndex === 8) {
                actionPolygon += action.tokens
            }
            if(actionIndex === 9) {
                actionBloodthirst += action.tokens
            }
            if(actionIndex === 10) {
                actionSynergize += action.tokens
            }
            if(actionIndex === 11) {
                actionRampage += action.tokens
            }

        })          
        
        

        let actionArray = [{objectId: 2, tokens: actionCampaign}, 
            {objectId: 3, tokens: actionPassive}, 
            {objectId: 4, tokens: actionIdle}, 
            {objectId: 5, tokens: actionRerollWeapon}, 
            {objectId: 6, tokens: actionRerollItem}, 
            {objectId: 7, tokens: actionHealing}, 
            {objectId: 9, tokens: actionBloodthirst}, 
            {objectId: 10, tokens: actionSynergize},
            {objectId: 11, tokens: actionRampage}]

        let polyCount = getPolygonCount.filter(poly => poly.objectId === "polygon")
       

        //filter objectId = "staked" in staked
        let stakedArray = staked.filter(stake => stake.objectId === "staked")



        setActionDistribution(actionArray)
        setInPolygon(polyCount[0].tokens)
        setWeaponTierDistribution(weaponTierDistribution)
        setLevelDistribution(levelTiers)
        setOwnerCount(ownerCount.length)
        setStaked(stakedArray[0].tokens)
        setContractRen(dailyRen)
        setRenSupply(renSupply)
        console.log( weaponTierDistribution, levelTiers)
       
    
    setLoading(false);


    }


    init();
}, [])






return !loading ? (
    <>

    
<div className="d-flex statistic justify-start">
<div className="d-flex flex-column">
    <span>$REN Daily supply</span>
    <span>{contractRen.issue.toLocaleString()}</span>
</div>
<div className="d-flex flex-column">
    <span>$REN Daily Burn</span>
    <span>{contractRen.burn.toLocaleString()}</span>
</div>
<div className="d-flex flex-column">
    <span>$REN Daily Net +/-</span>
    <span>{contractRen.net.toLocaleString()}</span>
</div>
<div className="d-flex flex-column">
    <span>$REN in circulation:</span>
    <span>{renSupply.net.toLocaleString()}</span>
</div>
<div className="d-flex flex-column">
    <span>$USD/$REN</span>
    <span>{renPrice.toFixed(4)}</span>
</div>



<div className="d-flex flex-column">
    <span>owner count:</span>
    <span>{ownerCount}</span>
</div>
<div className="d-flex flex-column">
    <span>staked in gameplay:</span>
    <span>{staked}</span>
</div>
<div className="d-flex flex-column">
    <span>on L2</span>
    <span>{inPolygon}</span>
</div>
</div>

<div className="d-flex">
                
        <div className="d-flex flex-column">
        <h3>Current Activity</h3>
                    {actionDistribution && actionDistribution.map((level, index) => {
                            const text = actionString[parseInt(level.objectId)]
                                    return (
                        <div key={index} className="flex">
                            <div>{text}: {level.tokens} </div>
                        </div> )})}

        <h3>Level Tier distribution</h3>
                    {levelDistribution && levelDistribution.map((level, index) => {
                        return (
                        <div key={index} className="flex">
                            <div>Level Tier {index + 1}: {level}</div>
                        </div> )})}


        <h3>Weapon Tier  distribution</h3>
                    {weaponTierDistribution && weaponTierDistribution.map((weapon, index) => {
                        return (
                        <div key={index} className="flex">
                            <div>Level Tier {weapon.objectId}: {weapon.tokens}</div>
                        </div> )})}
        </div>

       {/* <div className="d-flex flex-column">
        <h3>Recent NFT trades</h3>
        
                            {nftTrades.result.map((trade, index) => {
                return (
                            <div key={index} className="flex">
                                <div>Price: {trade.price/1000000000000000000} eth</div>
                                <br/>
                                <br/>
                                
                                <div>
                                <br/>
                                {trade.token_ids.map((token, index) => {
                                    return (
                                    <div key={index}>Token ID:{token}</div> )})}

                                    </div>
                            </div> )})}

                                    </div>   */}


        

</div>




 {/*
 

  
<div className="stats d-flex flex-column">
<span className="stats-label">stats</span>
<div className="d-flex justify-between w-full flex-wrap">
    <span>miren bank:</span>
    <span>{"miren bank"}</span>
</div>
<div className="d-flex justify-between w-full flex-wrap">
    <span>wallet:</span>
    <span>{"wallet"}</span>
</div>
<div className="d-flex justify-between w-full flex-wrap">
    <span>total characters:</span>
    <span>{"total"}</span>
</div>
<div className="d-flex justify-between w-full flex-wrap">
    <span>druids:</span>
    <span>{"druids"}</span>
</div>
<div className="d-flex justify-between w-full flex-wrap">
    <span>assasins:</span>
    <span>{"assasins"}</span>
</div>
<div className="d-flex justify-between w-full flex-wrap">
    <span>rangers:</span>
    <span>{"rangers"}</span>
</div>
<div className="d-flex justify-between w-full flex-wrap">
    <span>daily $ren:</span>
    <span>{"daily ren"}</span>
</div>
</div>

                */}


</>


  ) : <Loader text={status} />
};

export default Stats;






