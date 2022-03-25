import { useState, useMemo } from "react";
import React from 'react';
import { toPng } from 'html-to-image';
import {lookupMultipleElves, polygonContract, nftContract} from '../../utils/interact'
import Countdown from "react-countdown";
import "./style.css"
import { useMoralis } from "react-moralis"
import Modal from "../../components/Modal"
import Loader from "../../components/Loader";

function Lookup() {

const [tokenId, setTokenId] = useState(69)
const { Moralis } = useMoralis();
const [elfObject, setElfObject] = useState(null)
const [showModal, setShowModal] = useState(true)
const [loading, setLoading] = useState(true)
const [loadingText , setLoadingText] = useState("")

const getMeta = async () => {
  setShowModal(!showModal)
  setLoading(true)
  
  setLoadingText("Locating elf...")
  let chain = "eth" //set default chain to eth
  //find out what the Dapp sees...
  const Elves = Moralis.Object.extend("Elves");
  let query = new Moralis.Query(Elves);
  query.equalTo("token_id", parseInt(tokenId));
  const response = await query.first();
  setLoadingText("Dapp sees elf in " + response.attributes.chain + ". Confirming with chain...")
  //look up token Id on both chains to determine what chain the elf is on
  const pElves = await polygonContract.methods.elves(tokenId).call();
  setLoadingText("Checked Polygon, checking Eth...")
  const eElves = await nftContract.methods.elves(tokenId).call();
  console.log("db response:", response)
  console.log("pElves:", pElves)
  console.log("eElves:", eElves)

  if(pElves.owner === eElves.owner) {//if owners match and are not equal to null address then the elf must be on polygon
      if(pElves.owner === "0x0000000000000000000000000000000000000000" && eElves.owner === "0x0000000000000000000000000000000000000000") {
        //since owners match but are equal to null address then the elf is unstaked in eth  
          chain = "eth";
          console.log("unstaked in eth")
          setLoadingText("Found Elf unstaked in eth")
      }else{
          chain = "polygon";
          console.log("active in polygon")
          setLoadingText("Found Elf Active in Polygon")
      }
      
  }

  const lookupParams = {array: [parseInt(tokenId)], chain: chain}
  setLoadingText("Getting elf data from chain...")
  const data = await lookupMultipleElves(lookupParams)
  
 

  //after idenifying the chain, lookup the elf on that chain to confirm that the owner is correct
  response.set("owner_of", data[0].owner);
  response.set("chain", chain);
  response.save().then((obj) => {
      let message = `${tokenId} is now on ${chain}`
     // alert(message)
         console.log("object saved") 
         console.log("chain:", chain, pElves.owner, eElves.owner, "owner:", data[0].owner)
         console.log("lookup Elf data", data[0])
          setLoadingText("Updating elf data on dApp... Done.")
  })

  setElfObject(data[0])  
  setLoading(false)
  
}

 


function GetAttributes({elfData}) {

  let attributesSection =  elfData.attributes.map((a, i)=>{
 
       return(<div key={elfData.name + i}>
       <div className="flex justify-between mt-1">
       <div className="text-sm capitalize">{a['trait_type'] /*//fix this laer */}</div> 
       <div className="font-semibold text-sm">{a.value}</div>
       
       </div>  
       </div>)
       })
     
       return(attributesSection)
     }
     

     const raceClassName = useMemo(() => {
      switch(elfObject?.race) {
        case 3:
          return "race-woodborne";
        case 2:
          return "race-primeborne";
        case 1:
          return "race-lightborne";
        case 0:
        default:
          return "race-darkborne";
      }
     }, [elfObject]);

     const ownerTruncated = 
      elfObject?.owner.slice(0, 6) +
      "..." +
      elfObject?.owner.slice(-4);

return (
  <div className="dark-1000 h-full d-flex flex-column profile">           

      <h2>Look up Elf</h2>

      
      <div className="flex mb-1">
       
      <input
        value={tokenId}
        type="number"
        onChange={(e) => setTokenId(e.target.value)}
        id="text"
      />
      <button className="btn btn-green" onClick={() => getMeta()}>Fetch Elf</button>{"  "}
  
  
      </div>

    <div className="flex flex-wrap">
      
      
 
      <Modal show={showModal} setShow={setShowModal}>
        {!loading ?
        <>
      <div id="elf" className={`w-25 mh-auto ${raceClassName}`}>
      <h2 className="text-center">{elfObject.name}</h2>
      <img src={elfObject.image}/>
      <GetAttributes elfData={elfObject} />     
      <br/>
      <div className="flex justify-between mt-1">
      <div className="font-semibold text-sm">Cooldown in?</div>
      <div className="font-semibold text-sm"><Countdown date={new Date(elfObject.time)*1000} /></div>
      </div>

      <div className="flex justify-between mt-1">
      <div className="font-semibold text-sm">Last Action</div>
      <div className="font-semibold text-sm">{elfObject.actionString}</div>
      </div>

        <div className="flex justify-between mt-1">
        <div className="font-semibold text-sm">Owner</div>
        <div className="font-semibold text-sm">{ownerTruncated}</div>
        </div>

        <div className="flex justify-between mt-1">
        <div className="font-semibold text-sm">Status</div>
        <div className="font-semibold text-sm">{elfObject.elfStatus}</div>        
        </div>

        <div className="flex justify-between mt-1">
        <div className="font-semibold text-sm">Item</div>
        <div className="font-semibold text-sm">{elfObject.inventoryString}</div>        
        </div>

        <div className="flex justify-between mt-1">
        <div className="font-semibold text-sm">Chain</div>
        <div className="font-semibold text-sm">{elfObject.chain}</div>        
        </div>
      </div>

      <button className="btn btn-blue" onClick={() => {
      toPng(document.getElementById('elf')).then(dataUrl => {
        const link = document.createElement('a');
        link.download = 'image.png';
        link.href = dataUrl;
        link.click();
      });
    }}>Download</button>
      </> : <Loader text={loadingText} />}

      </Modal>

      
      
      
      </div>
      
      </div>





  )
}

export default Lookup;

