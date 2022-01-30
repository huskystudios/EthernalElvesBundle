import React from 'react';
import { useEffect, useMemo, useState } from "react";
import { useMoralis } from "react-moralis";


const CheckWhitelist = () => {
	
    const [loading, setLoading] = useState(false)
	
	const { Moralis} = useMoralis();


    
   
    const [errorMsg, setErrorMsg] = useState(false)
    const [response, setResponse] = useState(false)
    const [wallet, setWallet] = useState("")


    ////create a function to accept three text inputs and a button to submit

    
const checkWhitelist = async () => {

        setLoading(true)
		try {
            
			const params =  {wallet: wallet}
		
            const  response = await Moralis.Cloud.run("checkWhitelist", params);            
            setResponse(response)          
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
          {errorMsg ? <p className="text-xl">{errorMsg}</p> : null}
         
          <div className="d-flex flex-column text-white justify-center px-4 text-uppercase wl-dialog">
               <p>Check Whitelist</p>
                <div className="flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center justify-center">
                        <label className="text-xl">Wallet Address</label>
                        <input className="w-full p-2 border border-gray-500" type="text" value={wallet} onChange={e => setWallet(e.target.value)}/>
                    </div>
                
                    <div className="flex flex-col items-center justify-center">
                        {!loading && <button className="btn btn-green" onClick={checkWhitelist}>Submit</button>}
                    </div>
                    <div>
                        {response ? response.message : null}
                    </div>
                </div>  

            </div>
            </>

              
      )
    };
    
    export default CheckWhitelist;
    
    
    