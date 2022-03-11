import React, { useEffect, useState } from "react";
import { lookupMultipleElves } from "../../utils/interact"; 
import { useMoralis } from "react-moralis";
import {elvesAbi, elvesContract} from "../../utils/interact"
import './style.css'
import Signature from "./Signature";
import WhitelistExport from "./WhitelistExport";
import AddToWhitelist from "./AddToWhitelist";
import CheckWhitelist from "./CheckWhitelist";
import ExportGame from "./ExportGame";
import CampaignAdmin from "./Campaign";
import Loader from "../../components/Loader";
import PendingTransfers from "./PendingTransfers";
import PendingRenTransfers from "./PendingRenTransfers";
import Polygon from "./Polygon";
import Lookup from "../profile/Lookup";

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


const refreshMetaData = async () => {

  const Elves = Moralis.Object.extend("Elves");
  setProgress(1)

  let results = []

  let start = 1
  let supply = tokenSupply//parseInt(cloudSupply.supply) ///tokenSupply
  let stop = 0
  let steps = 33

 
  let counter = 0
  let i = 0

  while(counter<6666){
         
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
      elvesObject.set("owner_of", elf.owner)
      elvesObject.set("token_id", elf.id)
      elvesObject.save() 
      console.log("object created")
      }else{
        res.set("owner_of", elf.owner);
        res.save()
        console.log("object saved")
      }

    })
   
    setProgress(counter/supply*100)
    i++
  }

setProgress(100)
setLoading(false)
  
};


const checkElfLocation = async () => {
 

  const ElvesLocation = Moralis.Object.extend("ElvesLocation");
  setProgress(1)

  let results = []

  let start = 1
  let supply = 6666//parseInt(cloudSupply.supply) ///tokenSupply
  

  let i = 1
  
  while(i<6667){

  //  const pElves = await polygonContract.methods.elves(tokenId).call();
 //   const eElves = await nftContract.methods.elves(tokenId).call();
   
    //owner timestamp action
   
    let query = new Moralis.Query(ElvesLocation);  
 //   query.equalTo("token_id", elf.id);
    const res = await query.first();
    if(!res){
      const elvesObject = new ElvesLocation();
  //    elvesObject.set("ownerPoly", pElves.owner)
  //    elvesObject.set("tsPoly", pElves.timestamp)
  //    elvesObject.set("actionPoly", pElves.action)
//
   //   elvesObject.set("token_id", elf.id)
      elvesObject.save() 
      console.log("object created")
      }else{
   //     res.set("owner_of", elf.owner);
        res.save()
        console.log("object saved")
      }

  
   
    setProgress(i/supply*100)
    i++
  }

setProgress(100)
setLoading(false)
  
};






return (
<>
       <div className="dark-1000 h-full d-flex home justify-center items-center black">
      

            <div className="d-flex flex-column text-white justify-center px-4 text-uppercase dialog">
            <p>ADMIN CONSOLE</p>

           
            <div className="d-flex flex-row justify-center">
            {!loading ? ( 
            <button className="btn btn-blue" onClick={refreshMetaData}>Update Elf Metadata</button>) : ( 
            <button disabled><div className="animate-bounce">Loading... {progress.toFixed(0)} %</div></button>)}
            </div>
    
            <ExportGame />

            

        
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


