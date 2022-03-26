import React from 'react';

import { useEffect, useMemo, useState } from "react";
import { useMoralis } from "react-moralis";

import {
    BrowserRouter as Router,
    Link,
    useLocation
  } from "react-router-dom";
import Loader from '../../components/Loader';


  require('dotenv').config();

function useQuery() {
const { search } = useLocation();

return useMemo(() => new URLSearchParams(search), [search]);
}
  
const Discord = () => {
	
	const dev = false;

    
    const query = useQuery();
    const code = query.get("code");
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState("")
	
	const { Moralis, setUserData, isAuthenticated, isUserUpdating} = useMoralis();


    const discordLink = dev ? "https://discord.com/api/oauth2/authorize?client_id=926731918790258708&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fdiscord&response_type=code&scope=identify%20guilds%20guilds.members.read" :
                              "https://discord.com/api/oauth2/authorize?client_id=926731918790258708&redirect_uri=https%3A%2F%2Fapp.ethernalelves.com%2Fdiscord&response_type=code&scope=identify%20guilds%20guilds.members.read"
    
    const redirectURI = dev ? "http://localhost:3000/discord" : "https://app.ethernalelves.com/discord"

    const [discordMeta, setDiscordMeta] = useState()
    const [loaded, setLoaded] = useState(false)
    const [errorMsg, setErrorMsg] = useState(false)

    const clientId = "926731918790258708"
    const clientSecret = process.env.REACT_APP_DISCORD_CLIENTSECRET

    const updateMoralis = async () => {
        console.log("hi is a and uu", isAuthenticated, isUserUpdating)
        if(isAuthenticated){
            setUserData(discordMeta).then((item) => {
                console.log(item)
                setStatus("updated")
            }, (err) => {
                setStatus("error")    
                console.log(err)
            })
        }else{
            setStatus("loggedout")
        }

    }
                         
    useEffect(async () => {
        if(code){
            await getWL()
        }
    }, [code, isAuthenticated])

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
            const params =  {oauthData: oauthData}
		   let response 
            
            if(!oauthData?.error){
                response = await Moralis.Cloud.run("connectDiscord", params);
                setDiscordMeta({
                    discordUser: response.data.user.username,
                    discordFlags: response.data.user.public_flags,
                    discordUserId: response.data.user.id,
                    discordRoles: response.data.roles
                })
         
            } 
			
           setLoaded(true)                
           setLoading(false)

			
		} catch (error) {
			// NOTE: An unauthorized token will not throw an error;
			// it will return a 401 Unauthorized response in the try block above
			console.error(error);
            setErrorMsg("Error. Please screenshot browser console and submit ticket on discord.")
		}
	}

}
	
return loading ? <Loader text="Fetching data..." /> : 
loaded ? (
    
    <div className="dark-1000 h-full d-flex flex-column">           
        {/* I'm not Sullof. No easter eggs here*/}
        {errorMsg ? <p class="text-xl">{errorMsg}</p> : null}
        <div>
        Welcome {discordMeta.discordUser}! Click the button below to add your discord details to the Ethernal Elves dApp.
        </div>
        <div>
        <button className='btn btn-green' 
                //disabled={isUserUpdating} 
                onClick={updateMoralis}>Add Credentials to Discord</button>

        </div>
        <div>
        {status === "updated" ? <p class="text-xl">Credentials added to Database!</p> : null}
        {status === "loggedout" ? <p class="text-xl">Login to EE First!</p> : null}
        </div>
        
        
        </ div>         
      ) : (
          <>
      
          {errorMsg ? <p class="text-xl">{errorMsg}</p> : null}
          
                  <p>
                    Click "Sync discord" below to sync your Discord details with Ethernal Elves. This will allow you to get a role on the discord server.
                  </p>
                  <button className='btn btn-green' onClick={(e) => 
                  {
                      e.preventDefault();
                       window.location.href=discordLink;
                                }}
        >Sync Discord</button>



          
          </>
      )
    };
    
    export default Discord;
    
    
    