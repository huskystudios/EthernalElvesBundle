import React, { useEffect, useState } from "react";
import { lookupMultipleElves } from "../../utils/interact"; 
import { useMoralis } from "react-moralis";
import {elvesAbi, elvesContract} from "../../utils/interact"
import './style.css'
import WhitelistExport from "./WhitelistExport";
import AddToWhitelist from "./AddToWhitelist";
import CheckWhitelist from "./CheckWhitelist";
import ExportGame from "./ExportGame";
import CampaignAdmin from "./Campaign";
import Loader from "../../components/Loader";
import PendingTransfers from "./PendingTransfers";
import PendingRenTransfers from "./PendingRenTransfers";
import Lookup from "../profile/Lookup";
import ExportOwners from "./ExportOwners";
import RampageFix from "./RampageFix";


const Admin = () => {

const [loading, setLoading] = useState(true);
const [loading1, setLoading1] = useState(true);
// const [showData, setShowData] = useState(false);
const [progress, setProgress] = useState(0);

const [setWL, getWL] = useState(0);
const { Moralis } = useMoralis();
const [max, setMax] = useState(0);
const [tokenSupply, setTokenSupply] = useState(0);
const [init, setInit] = useState(0);
const [currentPrice, setCurrentPrice] = useState(0);
const [renSupply, setRenSupply] = useState(0);
const [ownerCount, setOwnerCount] = useState(0);
const [ownerTable, setOwnerTable] = useState([]);
const [levelDistribution, setLevelDistribution] = useState([]);
const [actionDistribution, setActionDistribution] = useState([]);





function readOptions(contractMethod) {

const options = {
contractAddress: elvesContract,
functionName: contractMethod,
abi: elvesAbi.abi

};

return options
}







useEffect(() => {
    async function init() {

    const ownerCount = await Moralis.Cloud.run("getAllOwners")
    const totalRenSupply = 0 //await Moralis.executeFunction(readOptions("totalRenSupply"));
    
    setRenSupply(totalRenSupply);
    setOwnerCount(ownerCount.length)
    setActionDistribution(await Moralis.Cloud.run("getActions"))
   
    
    console.log(ownerCount.length)
    console.log(ownerCount.sort((a, b) => b.tokens - a.tokens))

    setLoading(false);


    }
    init();
}, [])






return (
<>
       <div className="dark-1000 h-full d-flex home justify-center items-center black">
      

            <div className="d-flex flex-column text-white justify-center px-4 text-uppercase dialog">
            <p>ADMIN CONSOLE</p>

           
            <div className="d-flex flex-row justify-center">
            {/*!loading ? ( 
            <button className="btn btn-blue" onClick={refreshMetaData}>Update Elf Metadata</button>) : ( 
            <button disabled><div className="animate-bounce">Loading... {progress.toFixed(0)} %</div></button>)*/}
            </div>
    
            <ExportGame />
            <ExportOwners />

            

        
        </div>  

             
        <div className="d-flex flex-column text-white justify-center px-4 text-uppercase dialog">
         
              <p>HODLERS:  {ownerCount && ownerCount}</p>
             

              <Lookup />  

          
          </div>

      
            
           
         


         
          



       
</div>

 </>



  ) 
};

export default Admin;


