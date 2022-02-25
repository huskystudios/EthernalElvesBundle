import React from 'react';
import { useEffect, useMemo, useState } from "react";
import {elvesAbi, elvesContract, lookupMultipleElves} from "../../utils/interact"
import { useMoralis } from "react-moralis";
import { CSVLink } from "react-csv";




  


const ExportGame = ({text, size}) => {

	const { Moralis, authenticate, isAuthenticated, user} = useMoralis();
	const [csvReport, setCsvReport] = useState([1,2,3])
	const [loading, setLoading] = useState(true)
	const [progress, setProgress] = useState(0)
const [tokenSupply, setTokenSupply] = useState(0);
	const Elves = Moralis.Object.extend("ElvesAdmin");

	function readOptions(contractMethod) {

		const options = {
	  contractAddress: elvesContract,
	  functionName: contractMethod,
	  abi: elvesAbi.abi
	  
	  };
	  
	  return options
	  }
	  





const getElfMetaData = async () => {

	setProgress(1)
	setLoading(true)
	await Moralis.enableWeb3();     
	const totalSupply = await Moralis.executeFunction(readOptions("totalSupply"));
	
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
 // setLoading(false)
	
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
			{ label: "health", key: "health" },
			{ label: "attributes", key: "attributes"},
		]

		alert("Successfully retrieved " + results.length + " ids.");
		let arrObj = []
// Do something with the returned Moralis.Object values
			for (let i = 0; i < results.length; i++) {

			const object = results[i];
			arrObj.push({
				token_id: object.get('token_id'),
				owner_of: object.get('owner_of'),
				status: object.get('status'),
				timestamp: new Date(object.get('timestamp')*1000).toLocaleString(), //object.get('timestamp'),
				action: object.get('action'),
				actionString: object.get('actionString'),				
				level: object.get('level'),
				class: object.get('class'),
				inventory: object.get('inventory'),
				weapon: object.get('weapon'),
				weaponTier: object.get('weaponTier'),				
				attack: object.get('attack'),
				accessories: object.get('accessories'),
				health: object.get('health'),
				attributes: object.get('attributes'),						
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

      
	


{!loading ? <CSVLink {...csvReport}>Export to CSV</CSVLink> : <button className="btn btn-blue" onClick={getElfMetaData}>UpdateDB</button>}
{<button className="btn btn-blue" onClick={exportData}>Export Game</button>}

{progress.toFixed(0)}%


        </>         
      );
    };
    
    export default ExportGame;
    
    
    