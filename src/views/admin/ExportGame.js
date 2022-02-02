import React from 'react';
import { useEffect, useMemo, useState } from "react";
import {
    BrowserRouter as Router,
    Link,
    useLocation
  } from "react-router-dom";

import { useMoralis } from "react-moralis";
import { CSVLink } from "react-csv";
require('dotenv').config();


const WhitelistExport = ({text, size}) => {

	const { Moralis, authenticate, isAuthenticated, user} = useMoralis();
	const [csvReport, setCsvReport] = useState([1,2,3])
	const [loading, setLoading] = useState(true)
	const [progress, setProgress] = useState(0)

	const getData = async () => {
		
		const ElvesWhiteList = Moralis.Object.extend("ElvesWhitelist");
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
			{ label: "createdAt", key: "createdAt" },
			{ label: "roleIndex", key: "roleIndex" },
			{ label: "roleName", key: "roleName" },
			{ label: "username", key: "username" },
			{ label: "walletAddress", key: "walletAddress"},
			{ label: "signature", key: "signature"},
		]

		alert("Successfully retrieved " + results.length + " ids.");
		let arrObj = []
// Do something with the returned Moralis.Object values
			for (let i = 0; i < results.length; i++) {

			const object = results[i];
			arrObj.push({
							roleIndex: object.get('roleIndex'),
							roleName: object.get('roleName'),
							username: object.get('username'),
							walletAddress: object.get('walletAddress'),
							createdAt: object.createdAt,
							signature: object.get('signature'),
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

      
	


{!loading ? <CSVLink {...csvReport}>Export to CSV</CSVLink> : <button className="btn btn-blue" onClick={getData}>Get Whitelist</button>}
{progress.toFixed(0)}%


        </>         
      );
    };
    
    export default WhitelistExport;
    
    
    