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

	<button className="btn btn-blue" onClick={getElfMetaData}>UpdateDB</button>
	<button className="btn btn-blue"  onClick={getOrcMetaData}>Update Orc Owner Data</button>
*/}
	



	<button className="btn btn-blue"  onClick={getOrcMetaData}>Update Orc Owner Data</button>

{!loading && <CSVLink {...csvReport}>Export to CSV</CSVLink> }
{<button className="btn btn-blue" onClick={exportData}>Export Game</button>}

{progress.toFixed(0)}%


        </>         
      );
    };
    
    export default ExportGame;
    
    
    