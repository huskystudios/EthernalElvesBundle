import { useState, useEffect, useMemo } from "react";
import React, { useCallback, useRef } from 'react';
import { toPng } from 'html-to-image';
import {lookupMultipleElves} from '../../utils/interact'
import Countdown from "react-countdown";
import "./style.css"
import { actionString } from "../home/config"


function ImageApp() {

//const apiURI = "https://api.sheety.co/cdbe00a0eadb9d00b13bfd323a812783/inventory/inventory"

const [textAreaSample, setTextArea] = useState(69)


const [showImage, setShowImage] = useState(false)  
const [showMetaImage, setShowMetaImage] = useState(false)  

const [elfObject, setElfObject] = useState(null)







const getMeta = async () => {


  const data = await lookupMultipleElves([parseInt(textAreaSample)])
  console.log(data[0])
  setElfObject(data[0])  
  setShowMetaImage(true)
  



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

      <h1 className="text-center">Look up Elf</h1>

      
      <div className="flex mh-auto mb-1">
       
      <input
        value={textAreaSample}
        type="number"
        onChange={(e) => setTextArea(e.target.value)}
        id="text"
      />
      <button className="btn btn-green" onClick={getMeta}>Fetch Elf</button>{"  "}
      <button className="btn btn-blue" onClick={() => {
      toPng(document.getElementById('elf')).then(dataUrl => {
        const link = document.createElement('a');
        link.download = 'image.png';
        link.href = dataUrl;
        link.click();
      });
    }}>Download</button>
      </div>

    <div className="flex flex-wrap">
      
      
      {showMetaImage &&
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


      </div>


      </>}

      
      
      
      </div>
      
      </div>





  )
}

export default ImageApp;

