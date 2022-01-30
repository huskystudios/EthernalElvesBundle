import React, { useEffect, useState } from "react";
import { lookupMultipleElves } from "../../utils/interact"; 
import { useMoralis } from "react-moralis";
import {elvesAbi, elvesContract} from "../../utils/interact"
import './style.css'
import Signature from "./Signature";
import WhitelistExport from "./WhitelistExport";
import AddToWhitelist from "./AddToWhitelist";


const Admin = () => {

const [loading, setLoading] = useState(true);
// const [showData, setShowData] = useState(false);
const [progress, setProgress] = useState(0);
const [cloudSupply, setCloudSupply] = useState(0);
const [gameStatus, setGameStatus] = useState(0);
const { Moralis } = useMoralis();
const Elves = Moralis.Object.extend("Elves");


useEffect(() => {
    async function init() {
      
      setCloudSupply(await Moralis.Cloud.run("getTokenSupply"));
      setGameStatus(await Moralis.Cloud.run("getGameStatus"))
      setLoading(false);


    }
    init();
}, [0])


const refreshMetaData = async () => {
  // set school contract
  setProgress(1)
  setLoading(true)
 

  let results = []

  let start = 1
  let supply = parseInt(cloudSupply.supply) ///tokenSupply
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
    
   results = await lookupMultipleElves(tokenArray)
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

    // const elves = new Elves();
    // updateMoralisDb({elf, elves}) 
    })
   
    setProgress(counter/supply*100)
    i++
  }

setProgress(100)
setLoading(false)
  
};


const flipGameState = async (_index) => {

  await Moralis.enableWeb3();
  const index = parseInt(_index)
      
  const options = {
      contractAddress: elvesContract,
      functionName: index === 1 ? "flipActiveStatus" : index === 2 ? "flipMint" : index === 3 ? "flipWhitelist" ? index === 4 ? "withdrawAll" : "withdrawAll" : "withdrawAll" : "withdrawAll",
      abi: elvesAbi.abi,
     
    };
    
    const tx = await Moralis.executeFunction(options);           
    

}






return (
    <>
       <div className="dark-1000 h-full d-flex home justify-center items-center">
      
            <div className="d-flex flex-column text-white justify-center px-4 text-uppercase dialog">
            <p>ADMIN CONSOLE</p>

            <WhitelistExport />
           
            <div className="mint-instructions">
                <p>Press this button if peoples elves dont show up. It will loop through the current supply so be patient</p>
            </div>
            <div className="d-flex flex-row justify-center">
            {!loading ? ( 
            <button className="btn btn-green" onClick={refreshMetaData}>Update Elf Metadata</button>) : ( 
            <button disabled><div class="animate-bounce">Loading... {progress.toFixed(0)} %</div></button>)}
            </div>
            <div className="mint-instructions">
                <p>$ETH Withdrawal to founders.</p>
            </div>


            <div className="d-flex flex-row justify-center">
            <button className="btn btn-green" onClick={()=> flipGameState(4)}><div class="animate-bounce">Withdraw</div></button>
            </div>

            
                <p>FLIP GAME STATE</p>
            

   

            <div className="justify-center">
            {!loading && 
            <>
             <button className={`btn ${gameStatus.gameActive ? "btn-green" : "btn-red"}`} onClick={()=> flipGameState(1)}><div class="animate-bounce">flip Active... </div></button>
             <div className="mint-instructions">
                <p>{gameStatus.gameActive ? "Game is Active" : "Game is Inactive"}</p>
            </div>
             <button className={`btn ${gameStatus.publicMint ? "btn-green" : "btn-red"}`} onClick={()=> flipGameState(2)}><div class="animate-bounce">flip Mint... </div></button>
             <div className="mint-instructions">
                <p>{gameStatus.publicMint ? "Public Minting is Active" : "Public Minting is Inactive"}</p>
            </div>
             <button className={`btn ${gameStatus.wlMint ? "btn-green" : "btn-red"}`} onClick={()=> flipGameState(3)}><div class="animate-bounce">flip Whitelist... </div></button>
             <div className="mint-instructions">
                <p>{gameStatus.wlMint ? "Whitelist Minting is Active" : "Whitelist Minting is Inactive"}</p>
            </div>
            </>}
            </div>


        
        </div>  

              <AddToWhitelist />

        <Signature />

       



    

        


       


             


                </div>
 </>



  );
};

export default Admin;

