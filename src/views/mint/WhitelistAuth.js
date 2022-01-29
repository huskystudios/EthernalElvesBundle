import React from 'react';
import { useEffect, useMemo, useState } from "react";
import { useMoralis } from "react-moralis";
import {getCurrentWalletConnected} from "../../utils/interact";
import {
    BrowserRouter as Router,
    Link,
    useLocation
  } from "react-router-dom";
import ConnectWallet from "../../wallet/ConnectWallet";
  require('dotenv').config();

function useQuery() {
const { search } = useLocation();

return useMemo(() => new URLSearchParams(search), [search]);
}
  
const WhitelistAuth = () => {
	
	const dev = true;
    const query = useQuery();
    const code = query.get("code");
    const [loading, setLoading] = useState(false)
	
	const { Moralis} = useMoralis();


    const discordLink = dev ? "https://discord.com/api/oauth2/authorize?client_id=926731918790258708&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fwhitelist&response_type=code&scope=identify%20guilds%20guilds.members.read" :
                              "https://discord.com/api/oauth2/authorize?client_id=926731918790258708&redirect_uri=https%3A%2F%2Fethernalelves.com%2Fwhitelist&response_type=code&scope=identify%20guilds%20guilds.members.read"
    
    const redirectURI = dev ? "http://localhost:3000/whitelist" : "https://ethernalelves.com/whitelist"

    const [discordMeta, setDiscordMeta] = useState({name: null, server: null, roleIndex: null, roleName: null})
    const [loaded, setLoaded] = useState(false)
    const [errorMsg, setErrorMsg] = useState(false)

    const clientId = "926731918790258708"
    const clientSecret = process.env.REACT_APP_DISCORD_CLIENTSECRET

                         
    useEffect(async () => {
        if(code){
            await getWL()
        }
    }, [code])

const getWL = async () => {
    if (code) {
        setLoading(true)
		try {

            let oauthResult

            try{
                oauthResult = await fetch('https://discord.com/api/oauth2/token', {
				method: 'POST',
				body: new URLSearchParams({
					client_id: clientId,
					client_secret: clientSecret,
					code,
					grant_type: 'authorization_code',
					redirect_uri: redirectURI,
				}),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
			});
            }catch(e){
                console.log(e)
                console.log("Error getting oauth token, trying proxy")
                oauthResult = await fetch('https://cors-proxy.huskies.workers.dev/corsproxy/?apiurl=https://discord.com/api/oauth2/token', {
                    method: 'POST',
                    body: new URLSearchParams({
                        client_id: clientId,
                        client_secret: clientSecret,
                        code,
                        grant_type: 'authorization_code',
                        redirect_uri: redirectURI,
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Access-Control-Allow-Origin': '*'
                    },
                });

            }
			
	
			const oauthData = oauthResult ? await oauthResult.json() : "error"

           
            const {address} = await getCurrentWalletConnected()
			const params =  {wallet: address, oauthData: oauthData}
			let response 
            
            if(params){
                response = await Moralis.Cloud.run("signMessage", params);
            } 

            console.log(response)

            setDiscordMeta({
                            name: response.username, 
                            roleIndex: response.r, 
                            roleName: response.n, 
                            signature: response.s, 
                            wallet: response.w})

                            console.log(loaded)
           response && setLoaded(true)                
           setLoading(false)

			
		} catch (error) {
			// NOTE: An unauthorized token will not throw an error;
			// it will return a 401 Unauthorized response in the try block above
			console.error(error);
            setErrorMsg("Error. Please screenshot browser console and submit ticket on discord.")
		}
	}

}
	
 
return loaded ? (
    
        <div class="bg-black p-5">
        {/* I'm not Sullof. No easter eggs here*/}
        <p>
           WELCOME {discordMeta.name} <br/><br/>Our time is here. You are on the whitelist with the role {discordMeta.roleName} </p>
        
        <div class="border-2 p-3">
        <div>Mint Credentials</div>

        <div class="break-all">
        <p>Role Index:{" "}
            <b>{discordMeta.roleIndex} </b> 
        </p>
        </div>
        
        <div class="break-all">
        <p>Signature:{" "}
           <b>{discordMeta.signature}</b>
        </p>
        </div>
    
        <div class="break-all">
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
          <>
          {errorMsg ? <p class="text-xl">{errorMsg}</p> : null}
          <p>
            Click on the button below to get your whitelist access credentials. You will need these to mint.  
        </p>
              <p>1. Connect Wallet <ConnectWallet /> </p>
              <br></br>
              <p>2. Get your signature <button variant="primary" 
        onClick={(e) => {
            e.preventDefault();
            window.location.href=discordLink;
            }}
        >Authenticate with Discord</button></p>



          
          </>
      )
    };
    
    export default WhitelistAuth;
    
    
    