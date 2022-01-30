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


  
    const [discordMeta, setDiscordMeta] = useState({name: null, server: null, roleIndex: null, roleName: null})
    const [loaded, setLoaded] = useState(false)
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
        {`WELCOME ${discordMeta.name}`} <br/><br/>Our time is here. You are on the whitelist with the role {discordMeta.roleName} </p>
        
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
        <p>Use these details to mint your whitelist allocation by clicking <a href={`https://app.ethernalelves.com/mint?wl=${discordMeta.roleIndex}&signature=${discordMeta.signature}&address=${discordMeta.wallet}`} rel={'noreferrer'} target={"_blank"}> here</a></p>
        <p>Pro tip: copy and paste these values as they are here into the mint GUI or the contract</p>
        
        </ div>         
      ) : (
        <div className="d-flex flex-column text-white justify-center px-4 text-uppercase dialog">
          {errorMsg ? <p className="text-xl">{errorMsg}</p> : null}
  
        
              <p>Get your mint credentials <button className="btn btn-blue" onClick={getWLcreds}>Reveal my signature!</button></p>



          
          </div>
      )
    };
    
    export default MintPass;
    
    
    