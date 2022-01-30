import React from 'react';
import { useEffect, useMemo, useState } from "react";
import { useMoralis } from "react-moralis";
import {getCurrentWalletConnected} from "../../utils/interact"
import {
    BrowserRouter as Router,
    Link,
    useLocation
  } from "react-router-dom";

  require('dotenv').config();


  
const MintPass = () => {
	


    const [loading, setLoading] = useState(false)
	
	const { Moralis} = useMoralis();


  
    const [discordMeta, setDiscordMeta] = useState({name: "Not on whitelist", server: null, roleIndex: null, roleName: "No Role"})
    const [loaded, setLoaded] = useState(false)
    const [showButton, setShowButton] = useState(false)
    const [errorMsg, setErrorMsg] = useState(false)

  
                         
  
const getWLcreds = async () => {
    
        setLoading(true)
		try {
         
            const {address} = await getCurrentWalletConnected()
            console.log(address)
         	const params =  {wallet: address}
         	let response = await Moralis.Cloud.run("getSigDatabase", params);
         
            console.log("This is the screenshot we want to see:", response)
            
            setDiscordMeta({
                            name: response.username, 
                            roleIndex: response.r, 
                            roleName: response.n, 
                            signature: response.s, 
                            wallet: response.w})
        
                        response && setShowButton(true)
           response && setLoaded(true)                
           setLoading(false)

			
		} catch (error) {
			// NOTE: An unauthorized token will not throw an error;
			// it will return a 401 Unauthorized response in the try block above
			console.error(error);
            setErrorMsg("Error. Please screenshot browser console and submit ticket on discord.")
		}
	

}
	
 
return loaded ? (
    
    <div className="d-flex flex-column text-white justify-center px-4 text-uppercase dialog">
        {/* I'm not Sullof. No easter eggs here*/}
        <p>
        {`WELCOME ${discordMeta.name}`} <br/><br/> Whitelist Role: {discordMeta.roleName} </p>
        
        <div className="border-2 p-3">
        <div>Mint Credentials</div>

        <div className="break-all">
        <p>Role Index:{" "}
            <b>{discordMeta.roleIndex} </b> 
        </p>
        </div>
        
        <div className="break-all">
        <p>Signature:{" "}
           <b>{discordMeta.signature}</b>
        </p>
        </div>
    
        <div className="break-all">
        <p>Wallet:{" "}
            <b>{discordMeta.wallet} </b> 
        </p>
        </div>
        </div>
       
        <br />
        <p>Use these details to mint your whitelist allocation by clicking the button below.</p>
        <p>
            
        {showButton && <button className='btn btn-blue' onClick={(e) => {
        e.preventDefault();
        window.location.href=`https://app.ethernalelves.com/mint?wl=${discordMeta.roleIndex}&signature=${discordMeta.signature}&address=${discordMeta.wallet}`;
        }}
            >Go to mint</button>}
        </p>

                
        </ div>         
      ) : (
        <div className="d-flex flex-column text-white justify-center px-4 text-uppercase dialog">
          {errorMsg ? <p className="text-xl">{errorMsg}</p> : null}
  
        
              <button className="btn btn-blue" onClick={getWLcreds}>Reveal my signature!</button>



          
          </div>
      )
    };
    
    export default MintPass;
    
    
    