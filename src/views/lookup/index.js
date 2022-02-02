import { useState, useEffect } from "react";
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
       <div className="flex justify-between border-b-2">
       <div className="text-sm capitalize">{a['trait_type'] /*//fix this laer */}</div> 
       <div className="font-semibold text-sm">{a.value}</div>
       
       </div>  
       </div>)
       })
     
       return(attributesSection)
     }







return (
  <div className="dark-1000 h-full d-flex flex-column profile">           

      <h1>Look up Elf</h1>

      
      <div className="flex">
       
      <input value={textAreaSample} onChange={(e) => setTextArea(e.target.value)} id="text" />
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
      <div id="elf" className="w-25">
      <p>{elfObject.name}</p>
      <img src={elfObject.image}/>   
      <GetAttributes elfData={elfObject} />     
      <br/>
      <div className="flex justify-between border-b-2">
      <div className="font-semibold text-sm">Cooldown in?</div>
      <div className="font-semibold text-sm"><Countdown date={new Date(elfObject.time)*1000} /></div>
      </div>

      <div className="flex justify-between border-b-2">
      <div className="font-semibold text-sm">Last Action</div>
      <div className="font-semibold text-sm">{elfObject.actionString}</div>
      </div>

        <div className="flex justify-between border-b-2">
        <div className="font-semibold text-sm">Owner</div>
        <div className="font-semibold text-sm">{elfObject.owner}</div>
        </div>

        <div className="flex justify-between border-b-2">
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

