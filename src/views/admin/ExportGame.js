import React from 'react';
import { useEffect, useMemo, useState } from "react";
import {elvesAbi, elvesContract, lookupMultipleElves, nftContract, polygonContract, lookupMultipleOrcs, orcsCastle } from "../../utils/interact"
import { useMoralis } from "react-moralis";
import { CSVLink } from "react-csv";



const ExportGame = ({text, size}) => {

	const { Moralis, authenticate, isAuthenticated, user} = useMoralis();
	const [csvReport, setCsvReport] = useState([1,2,3])
	const [loading, setLoading] = useState(true)
	const [progress, setProgress] = useState(0)

	const Elves = Moralis.Object.extend("ElvesAdmin");





	const updateElf = async () => {

		let i = 1;


		for(i = 1; i<=6667; i++){

		let tokenId = i
		const pElves = await polygonContract.methods.elves(tokenId).call();
		const eElves = await nftContract.methods.elves(tokenId).call();
		let chain = "";
	  
		if(pElves.owner === eElves.owner) {
			if(pElves.owner === "0x0000000000000000000000000000000000000000" && eElves.owner === "0x0000000000000000000000000000000000000000") {
				chain = "eth";
				console.log("unstaked in eth")
			}else{
				chain = "polygon";
			}
			
		}
	  
		let elf 
		let elfOwner 
		let elfAttributes 
		let elfTokenURI 
	  
		if(chain === "polygon"){
			 elf = pElves
			 elfOwner = await polygonContract.methods.ownerOf(tokenId).call();
			 elfAttributes = await polygonContract.methods.attributes(tokenId).call();
			 elfTokenURI = await polygonContract.methods.tokenURI(tokenId).call();
		}else{
			 elf = eElves
			 elfOwner = await nftContract.methods.ownerOf(tokenId).call();
			 elfAttributes = await nftContract.methods.attributes(tokenId).call();
			 elfTokenURI = await nftContract.methods.tokenURI(tokenId).call();
		}
		  
		
		let b = elfTokenURI.split(",")
		const elfTokenObj = JSON.parse(atob(b[1]))  
		
		const elfClass = elfTokenObj.attributes[0].value
		const elfRace = elfTokenObj.attributes[1].value 
		const elfHair = elfTokenObj.attributes[2].value
		const elfWeapon = elfTokenObj.attributes[3].value
		const elfWeaponTier = elfTokenObj.attributes[4].value 
		const elfAccessories = elfTokenObj.attributes[5].value
		const elfLevel = elfTokenObj.attributes[6].value
		const elfAp = elfTokenObj.attributes[7].value
		const elfHp = elfTokenObj.attributes[8].value
		const elfInventory = elfAttributes.inventory
		const elfAction = elf.action
		const timestamp = elf.timestamp
		 
		let elfFromOwnerOf = elfOwner.toLowerCase()//actual owner
		let elfFromElves = elf.owner.toLowerCase()//recorded owner
		let tokenHolder = elfFromElves
		let elfStatus = "staked"
		
		if(elfFromElves === "0x0000000000000000000000000000000000000000"){
		  tokenHolder = elfFromOwnerOf
		  elfStatus = "unstaked"
		}
		  tokenHolder = tokenHolder.toLowerCase();
		
		const Elves = Moralis.Object.extend("ElvesAdmin");
		let query = new Moralis.Query(Elves);  
		query.equalTo("token_id", tokenId);
		  
		const res = await query.first();
		  
	  
			res.set("owner_of", tokenHolder);
			res.set("elf_status", elfStatus)
			res.set("elf_class", elfClass)
			res.set("elf_race", elfRace)
			res.set("elf_hair", elfHair)
			res.set("elf_weapon", elfWeapon)
			res.set("elf_weaponTier", elfWeaponTier)
			res.set("elf_inventory", elfInventory)
			res.set("elf_accessories", elfAccessories)
			res.set("elf_level", elfLevel)
			res.set("elf_ap", elfAp)
			res.set("elf_hp", elfHp)
			res.set("elf_action", elfAction)
			res.set("elf_timestamp", timestamp)
			res.set("chain", "eth")
			res.save().then((obj) => {
				console.log("updated elf", obj.id)
			}, (error) => {
				console.log("error updating elf", error)
			});
			console.log(i)
	  }
	}
	  
	  

/*

const getElfMetaData = async () => {

	setProgress(1)
	setLoading(true)
	await Moralis.enableWeb3();     
	const totalSupply = 6666
	
	let results = []
	
	let start = 1
	let supply = totalSupply//parseInt(cloudSupply.supply) ///tokenSupply
	let stop = 0
	let steps = supply < 44 ? supply : 44
  
   
	let counter = 0
	let i = 0
  
	while(counter<supply){
		   
	  start = i*steps + 1
	  stop = start + steps - 1
  
	  const tokenArray = []
		for (var j = start; j <= stop; j++) {
		  tokenArray.push(j);
		  counter++
		}
	
	const params = {array: tokenArray, chain: "eth"}
	  
	 results = await lookupMultipleElves(params)
	 console.log(results)
	 results.map(async (elf)=>{
	  
	  let query = new Moralis.Query(Elves);  
	  query.equalTo("token_id", elf.id);
	  const res = await query.first();
	  if(!res){
		const elvesObject = new Elves();
		elvesObject.set("token_id", elf.id)
		elvesObject.set("owner_of", elf.owner)
		elvesObject.set("status", elf.elfStatus)
		elvesObject.set("timestamp", elf.time)
		elvesObject.set("action", elf.action)
		elvesObject.set("actionString", elf.actionString)
		elvesObject.set("level", elf.level)
		elvesObject.set("class", elf.classString)
		elvesObject.set("inventory", elf.inventoryString)
		elvesObject.set("weapon", elf.primaryWeapon)
		elvesObject.set("weaponTier", elf.weaponTier)
		elvesObject.set("attack", elf.attack)
		elvesObject.set("accessories", elf.accessories)
		elvesObject.set("health", elf.health)
		elvesObject.set("attributes", elf.attributes)

		elvesObject.save() 
		console.log("object created")
		}else{
			res.set("owner_of", elf.owner)
			res.set("status", elf.elfStatus)
			res.set("timestamp", elf.time)
			res.set("action", elf.action)
			res.set("actionString", elf.actionString)
			res.set("level", elf.level)
			res.set("class", elf.classString)
			res.set("inventory", elf.inventoryString)
			res.set("weapon", elf.primaryWeapon)
			res.set("weaponTier", elf.weaponTier)
			res.set("attack", elf.attack)
			res.set("accessories", elf.accessories)
			res.set("health", elf.health)
			res.set("attributes", elf.attributes)
		  res.save()
		  console.log("object saved")
		}
  
	  // const elves = new Elves();
	  // updateMoralisDb({elf, elves}) 
	  })
	 
	  setProgress(counter/supply*100)
	  i++
	}
   
  setProgress(100)
  setLoading(false)
	
  };
*/
  

const getOrcMetaData = async () => {

	setProgress(1)
	setLoading(true)
	await Moralis.enableWeb3();     

	
	let results = []
	
	let start = 1
	let supply = 5050//parseInt(cloudSupply.supply) ///tokenSupply
	let stop = 0
	let steps = 50
  
   
	let counter = 0
	let i = 0
  
	while(counter<=supply){
		   
	  start = i*steps + 1
	  stop = start + steps - 1
  
	  const tokenArray = []
		for (var j = start; j <= stop; j++) {
		  tokenArray.push(j);
		  counter++
		}
	
	const params = {array: tokenArray}
	  
	 results = await lookupMultipleOrcs(params)
	 console.log(results)
	 results.map(async (orc)=>{
	  
	  let query = new Moralis.Query("ElvesAdmin");  
	  query.equalTo("token_id", orc.id);
	  const res = await query.first();

	  if(orc.owner === "0x2f3f840d17eb61020680c1f4b00510c3caa7df63"){
		orc.owner = await orcsCastle.methods.orcOwner(orc.id).call()
		orc.owner = orc.owner.toLowerCase()
	  }
	  
	  res.set("orc_owner_of", orc.owner)
	  console.log(orc.owner)
			
			
		  res.save()
		  console.log("object saved")
		})
  

	 
	  setProgress(counter/supply*100)
	  i++
	}
   
  setProgress(100)
  setLoading(false)
	
  };

  
/*
const getpElfMetaData = async () => {

	setProgress(1)
	setLoading(true)
	await Moralis.enableWeb3();     
	const totalSupply = 6666
	
	let results = []
	
	let start = 1
	let supply = totalSupply//parseInt(cloudSupply.supply) ///tokenSupply
	let stop = 0
	let steps = supply < 44 ? supply : 44
  
   
	let counter = 0
	let i = 0
  
	while(counter<supply){
		   
	  start = i*steps + 1
	  stop = start + steps - 1
  
	  const tokenArray = []
		for (var j = start; j <= stop; j++) {
		  tokenArray.push(j);
		  counter++
		}
	
	const params = {array: tokenArray, chain: "polygon"}
	  
	 results = await lookupMultipleElves(params)
	 console.log(results)
	 results.map(async (elf)=>{
	  
	  let query = new Moralis.Query(Elves);  
	  query.equalTo("token_id", elf.id);
	  const res = await query.first();
	  if(!res){
		const elvesObject = new Elves();
		elvesObject.set("token_id", elf.id)
		elvesObject.set("owner_of", elf.owner)
		elvesObject.set("status", elf.elfStatus)
		elvesObject.set("timestamp", elf.time)
		elvesObject.set("action", elf.action)
		elvesObject.set("actionString", elf.actionString)
		elvesObject.set("level", elf.level)
		elvesObject.set("class", elf.classString)
		elvesObject.set("inventory", elf.inventoryString)
		elvesObject.set("weapon", elf.primaryWeapon)
		elvesObject.set("weaponTier", elf.weaponTier)
		elvesObject.set("attack", elf.attack)
		elvesObject.set("accessories", elf.accessories)
		elvesObject.set("health", elf.health)
		elvesObject.set("attributes", elf.attributes)

		elvesObject.save() 
		console.log("object created")
		}else{
			res.set("owner_of", elf.owner)
			res.set("status", elf.elfStatus)
			res.set("timestamp", elf.time)
			res.set("action", elf.action)
			res.set("actionString", elf.actionString)
			res.set("level", elf.level)
			res.set("class", elf.classString)
			res.set("inventory", elf.inventoryString)
			res.set("weapon", elf.primaryWeapon)
			res.set("weaponTier", elf.weaponTier)
			res.set("attack", elf.attack)
			res.set("accessories", elf.accessories)
			res.set("health", elf.health)
			res.set("attributes", elf.attributes)
		  res.save()
		  console.log("object saved")
		}
  
	  // const elves = new Elves();
	  // updateMoralisDb({elf, elves}) 
	  })
	 
	  setProgress(counter/supply*100)
	  i++
	}
  
  setProgress(100)
 // setLoading(false)
	
  };
*/

	const exportData = async () => {
		
		const ElvesWhiteList = Moralis.Object.extend("ElvesAdmin");
		const query = new Moralis.Query(ElvesWhiteList);
		let limit = 100

		//page through the results
		let results = []
		let hasMore = true
		let page = 1
		while (hasMore) {

			query.limit(limit);
			query.skip(limit * (page - 1));
			query.withCount();
			const response = await query.find();
			let currentIndex = limit * (page)
			currentIndex > response.count ? hasMore = false : hasMore = true
			page++
			setProgress(currentIndex / response.count * 100)
			
			console.log(hasMore, response)
			results = results.concat(response.results)
			
		}

		//const results = await query.find();


		const headers = [
			{ label: "token_id", key: "token_id" },
			{ label: "owner_of", key: "owner_of" },
			{ label: "orc_owner_of", key: "orc_owner_of" },
			{ label: "elf_hair", key: "elf_hair"},
			{ label: "elf_level", key: "elf_level"},
			{ label: "elf_hp", key: "elf_hp"},
			{ label: "elf_ap", key: "elf_ap"},
			{ label: "elf_accessories", key: "elf_accessories"},
			{ label: "elf_race", key: "elf_race"},
			{ label: "elf_timestamp", key: "elf_timestamp"},
			{ label: "elf_action", key: "elf_action"},
			{ label: "elf_class", key: "elf_class"},
			{ label: "elf_weapon", key: "elf_weapon"},
			{ label: "elf_inventory", key: "elf_inventory"},
			{ label: "elf_weaponTier", key: "elf_weaponTier"},
			{ label: "elf_status", key: "elf_status"},
			/*
			{ label: "status", key: "status" },
			{ label: "timestamp", key: "timestamp" },
			{ label: "action", key: "action" },
			{ label: "actionString", key: "actionString"},
			{ label: "level", key: "level"},
			{ label: "class", key: "class" },
			{ label: "inventory", key: "inventory"},
			{ label: "weapon", key: "weapon"},
			{ label: "weaponTier", key: "weaponTier" },
			{ label: "attack", key: "attack"},
			{ label: "accessories", key: "accessories"},
			{ label: "health", key: "health" },*/
			
		
		]

		alert("Successfully retrieved " + results.length + " ids.");
		let arrObj = []
// Do something with the returned Moralis.Object values
			for (let i = 0; i < results.length; i++) {

			const object = results[i];
			arrObj.push({
				token_id: 		 object.get('token_id'),
				owner_of: 		 object.get('owner_of'),
				orc_owner_of:    object.get('orc_owner_of'),
				elf_hair: 		 object.get('elf_hair'),
				elf_level: 		 object.get('elf_level'),
				elf_hp: 		 object.get('elf_hp'),
				elf_ap: 		 object.get('elf_ap'),
				elf_accessories: object.get('elf_accessories'),
				elf_race: 		 object.get('elf_race'),
				elf_timestamp: 	 new Date(object.get('elf_timestamp')*1000).toLocaleString(), //object.get('timestamp'),
				elf_action:		 object.get("elf_action"),		
				elf_class:		 object.get("elf_class"),		
				elf_weapon:		 object.get("elf_weapon"),		
				elf_inventory:	 object.get("elf_inventory"),		
				elf_weaponTier:	 object.get("elf_weaponTier"),		
				elf_status:		 object.get("elf_status"),		
					
						})
							
						}

			

				let csv = {data: arrObj,
				headers: headers,
				filename: 'Report.csv'}
				setCsvReport(csv) 
				setLoading(false)
				

				}


    
    return (
    
        <>

      
{/*
<button className="btn btn-blue"  onClick={updateElf}>Update Elf2 Data</button>
	<button className="btn btn-blue" onClick={getElfMetaData}>UpdateDB</button>
*/}
	

	<button className="btn btn-blue"  onClick={getOrcMetaData}>Update Orc Owner Data</button>




{!loading && <CSVLink {...csvReport}>Export to CSV</CSVLink> }
{<button className="btn btn-blue" onClick={exportData}>Export Game</button>}

{progress.toFixed(0)}%


        </>         
      );
    };
    
    export default ExportGame;
    
    
    