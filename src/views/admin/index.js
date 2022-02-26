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


const Elves = Moralis.Object.extend("Elves");


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


      await Moralis.enableWeb3();     
      //console.log(await Moralis.Cloud.run("ownersAndBalances"))

    const initsupply = await Moralis.executeFunction(readOptions("INIT_SUPPLY"));
    const maxSupply = await Moralis.executeFunction(readOptions("maxSupply"));
    const price = await Moralis.executeFunction(readOptions("getMintPriceLevel"));
    const totalSupply = await Moralis.executeFunction(readOptions("totalSupply"));
    const ownerCount = await Moralis.Cloud.run("getAllOwners")
    const totalRenSupply = 0 //await Moralis.executeFunction(readOptions("totalRenSupply"));
    
    setInit(parseInt(initsupply));
    setMax(parseInt(maxSupply));
    setTokenSupply(parseInt((totalSupply)))
    setCurrentPrice(price);
    setRenSupply(totalRenSupply);
    setOwnerCount(ownerCount.length)
     setActionDistribution(await Moralis.Cloud.run("getActions"))

    //console.log(await Moralis.Cloud.run("getOwnerBalances"))
    
   
    let levels = await Moralis.Cloud.run("levelDistribution")

      //sort levels by objectId
      levels.sort(function(a, b) {
        return a.objectId - b.objectId;
      });

      console.log(ownerCount)

setLevelDistribution(levels)
    
    console.log(ownerCount.sort((a, b) => b.tokens - a.tokens))

    setLoading(false);


    }
    init();
}, [])


const refreshMetaData = async () => {
  // set school contract
  setProgress(1)

 

  let results = []

  let start = 1
  let supply = tokenSupply//parseInt(cloudSupply.supply) ///tokenSupply
  let stop = 0
  let steps = supply < 44 ? supply : 44

 
  let counter = 0
  let i = 0

  while(counter<supply){
         
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


const remoteTx = async () => {
    
  let response = await Moralis.Cloud.run("dbQ")
  console.log(response)

   //  <button className="btn btn-blue" onClick={remoteTx}>HUSKY TEST</button>

}



return (
<>
       <div className="dark-1000 h-full d-flex home justify-center items-center black">
      

            <div className="d-flex flex-column text-white justify-center px-4 text-uppercase dialog">
            <p>ADMIN CONSOLE</p>

            <div>Sentinel Supply: {tokenSupply} <br/> Current Price:{currentPrice.mintCost/1000000000000000000}</div>
            <div>$REN in circulation{renSupply}</div>
            <div className="mint-instructions">
                <p>Press this button if peoples elves dont show up. It will loop through the current supply so be patient</p>
            </div>
            <div className="d-flex flex-row justify-center">
            {!loading ? ( 
            <button className="btn btn-blue" onClick={refreshMetaData}>Update Elf Metadata</button>) : ( 
            <button disabled><div className="animate-bounce">Loading... {progress.toFixed(0)} %</div></button>)}
            </div>
    
            <ExportGame />

            

        
        </div>  

             
        <div>
        <div className="d-flex flex-column text-white justify-center px-4 text-uppercase dialog">
              <CampaignAdmin />

              <p>HODLERS</p>
              {ownerCount && ownerCount}
             
          </div>

        




          </div>



          <div className="d-flex flex-column text-white justify-center px-4 text-uppercase dialog">
          <p>Actions</p>
             {actionDistribution && actionDistribution.map((level, index) => {
                return (
                  <div key={index} className="flex">
                    <div>{level.objectId}: {level.tokens.length}</div>
                   </div> )})}

             
          </div>

          


        
          {/*ownerTable && ownerTable.map((owner, index) => (
                <div key={index} className="flex">
                  <div>{owner.objectId}</div>
                  Tokens
                  <div>{owner.tokens.length}</div>
                </div>
          ))*/}
  <div>


          </div>

       
       
</div>
<PendingTransfers />

<div className="d-flex flex-column text-white justify-center px-4 text-uppercase dialog">
        <p>Level distro</p>
             {levelDistribution && levelDistribution.map((level, index) => {
                return (
                  <div key={index} className="flex">
                    <div>Level {level.objectId}: {level.tokens.length}</div>
                   </div> )})}

             
          </div>
 </>



  ) 
};

export default Admin;


