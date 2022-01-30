import React from 'react';
import { useEffect, useMemo, useState } from "react";
import { useMoralis } from "react-moralis";

require('dotenv').config();


const AddToWhitelist = () => {
	
    const [loading, setLoading] = useState(false)
	
	const { Moralis} = useMoralis();


    
   
    const [errorMsg, setErrorMsg] = useState(false)
    const [wallet, setWallet] = useState("")
    const [username, setUsername] = useState("")
    const [roleIndex, setRoleIndex] = useState("")


    ////create a function to accept three text inputs and a button to submit

    
const updateWhiteList = async () => {

        setLoading(true)
		try {
            
			const params =  {wallet: wallet, roleIndex: roleIndex, username: username}
		
            const  response = await Moralis.Cloud.run("addToWhitelist", params);
            
            setErrorMsg(response)
            setWallet("")
            setUsername("")
            setRoleIndex("")
            
          
           setLoading(false)

			
		} catch (error) {
			// NOTE: An unauthorized token will not throw an error;
			// it will return a 401 Unauthorized response in the try block above
			console.error(error);
            setErrorMsg("Error. Please screenshot browser console and submit ticket on discord.")
		}
	

}
	
 
return (
    
       
          <>
       
         
          <div className="d-flex flex-column text-white justify-center px-4 text-uppercase wl-dialog">
                <p>Add to Whitelist</p>
                <div className="flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center justify-center">
                        <label className="text-xl">Wallet Address</label>
                        <input className="w-full p-2 border border-gray-500" type="text" value={wallet} onChange={e => setWallet(e.target.value)}/>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <label className="text-xl">Username</label>
                        <input className="w-full p-2 border border-gray-500" type="text" value={username} onChange={e => setUsername(e.target.value)}/>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <label className="text-xl">Role Index</label>
                        <input className="w-full p-2 border border-gray-500" type="text" value={roleIndex} onChange={e => setRoleIndex(e.target.value)}/>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        {!loading && <button className="btn btn-blue" onClick={updateWhiteList}>Submit</button>}
                    </div>
                </div>  
                {errorMsg ? <p className="text-xl">{errorMsg}</p> : null}
            </div>
            </>

              
      )
    };
    
    export default AddToWhitelist;
    
    
    