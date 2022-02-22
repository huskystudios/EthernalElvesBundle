import { useState, useMemo } from "react";
import React from 'react';
import { toPng } from 'html-to-image';
import {lookupMultipleElves} from '../../utils/interact'
import Countdown from "react-countdown";
import "./style.css"
import { useMoralis } from "react-moralis"
import Modal from "../../components/Modal"

function Lookup() {

const [textAreaSample, setTextArea] = useState(69)
const { Moralis } = useMoralis();
const [showMetaImage, setShowMetaImage] = useState(false)  
const [elfObject, setElfObject] = useState(null)
const [showModal, setShowModal] = useState(true)

const getMeta = async () => {

  let chain = "eth"
  const Elves = Moralis.Object.extend("Elves");
  let query = new Moralis.Query(Elves);
  query.equalTo("token_id", parseInt(textAreaSample));
  const response = await query.find();

  if(response[0].attributes.chain === "polygon"){   
    chain="polygon"
  }

  const lookupParams = {array: [parseInt(textAreaSample)], chain: chain}
  const data = await lookupMultipleElves(lookupParams)

  setElfObject(data[0])  
  setShowMetaImage(true)
  setShowModal(!showModal)
  
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
        value={textAreaSample}
        type="number"
        onChange={(e) => setTextArea(e.target.value)}
        id="text"
      />
      <button className="btn btn-green" onClick={() => getMeta()}>Fetch Elf</button>{"  "}
  
  
      </div>

    <div className="flex flex-wrap">
      
      
      {showMetaImage &&
      <Modal show={showModal}>
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


      </Modal>}

      
      
      
      </div>
      
      </div>





  )
}

export default Lookup;

