import React from 'react';
import { useEffect, useMemo, useState } from "react";
import {elvesAbi, elvesContract, lookupMultipleElves, nftContract, polygonContract, lookupMultipleOrcs, orcsCastle } from "../../utils/interact"
import { useMoralis } from "react-moralis";
import { CSVLink } from "react-csv";



const ExportOwners = ({text, size}) => {

	const { Moralis, authenticate, isAuthenticated, user} = useMoralis();
	const [csvReport, setCsvReport] = useState([1,2,3])
	const [loading, setLoading] = useState(true)
	const [progress, setProgress] = useState(0)


	const exportData = async () => {
		
		const results = await Moralis.Cloud.run("getAllUsers")
		
		

		const headers = [
			{ label: "owner", key: "owner" },
			{ label: "ensName", key: "ensName" },
			{ label: "discordUser", key: "discordUser" },
			{ label: "miren", key: "miren" },
			{ label: "contractRen", key: "contractRen" },
			{ label: "polyRen", key: "polyRen"},
			{ label: "elvesCount", key: "elvesCount"},
			
		
		]

		alert("Successfully retrieved " + results.length + " ids.");
		let arrObj = []
// Do something with the returned Moralis.Object values
			for (let i = 0; i < results.length; i++) {				

			const object = results[i];
			let allRen = object.get('ownerBalances')

			console.log(allRen)

			arrObj.push({
				owner: 		  object.get('ethAddress'),
				miren: 		  allRen?.miren/1000000000000000000,
				contractRen:  allRen?.contractRen/1000000000000000000,  
				polyRen: 	  allRen?.polyMiren/1000000000000000000,		
				elvesCount:   object.get('ownerElves'),	
				discordUser:   object.get('discordUser'),	
				ensName:  	  object.get('ensName'),
					
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
	

	



{!loading && <CSVLink {...csvReport}>Export to CSV</CSVLink> }
{<button className="btn btn-blue" onClick={exportData}>Export Owners</button>}




        </>         
      );
    };
    
    export default ExportOwners;
    
    
    