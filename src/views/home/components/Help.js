import React, { useState } from "react"
import assassinHelp from "../../../assets/images/help/assassin.png"
import druidHelp from "../../../assets/images/help/druids.png"
import rangerHelp from "../../../assets/images/help/rangers.png"
import gameModes from "../../../assets/images/help/gamemodes.png"
import items from "../../../assets/images/help/items.png"
import rewards from "../../../assets/images/help/rewards.png"
import utility from "../../../assets/images/help/utility.png"
import creatureHeal from "../../../assets/images/help/creatureHeal.png";

const characters = [{src:assassinHelp, name:"Assassins"}, {src:druidHelp, name:"Druids"}, {src:rangerHelp, name:"Rangers"}] 
const gamemodes = [{src:gameModes, name:"Game Modes"}, {src:items, name:"Items"}, {src:rewards, name:"Rewards"}, {src:utility, name:"Utility"}, {src:creatureHeal, name:"Creature \n\n Health"}]

const Help = () => {

    const [modal, setModal] = useState({show: false, content: ""})

   

    const renderModal = () => {
        if(!modal.show) return <></>

        return (
            <div className="modal">
                <div className="image-modal-content">
                    <span className="close-modal" onClick={() => setModal({show: false, content: ""})}>X</span>
                    <h3>{modal.heading}</h3>
                    
                    <div className="image-container">
                    <img  className="responsive" src={modal.src} />
                    </div>
                   

                    <div className="d-flex flex-row justify-around align-center">
                        <div className="d-flex flex-column">
            
                            
                            <button className="btn-modal" onClick={() => setModal({show: false, content: ""})}>close</button>
                        </div>

                    </div>
                </div>
            </div>
        )
    }


    return (

        <>

               <div className="collection-content d-flex flex-column">
                    <div className="collection-panel">


                        <div className="collection-selection" >
                            
                            <div className="collection-heading">
                              Game Guide
                            </div>
                <h1>Sentinels</h1>
                <div className="d-flex flex-row justify-around flex-wrap p-">
                {characters.map((character, index) => {

                    return(
                        <div className="collection-image"  key={index}>
                            <img width={100} src={character.src} alt={character.name} onClick={() => setModal({show: true, heading: character.name, src:character.src})}/>
                            <h2>{character.name}</h2>
                        </div>
                    )})}

                </div>
         
                <h1>Gameplay</h1>
    
                <div className="d-flex flex-row justify-around flex-wrap ">
            {gamemodes.map((gamemode, index) => {
                        return(
                            <div className="collection-image" key={index}>
                                <img width={100} src={gamemode.src} alt="assassin" onClick={() => setModal({show: true, heading: gamemode.name, src:gamemode.src})}/>
                                <h2>{gamemode.name}</h2>
                            </div>
                        )
                })}

                </div>
  
       
       
             </div> 
        </div>
     </div>





            {renderModal()}
          
        
        </>
        
    )
}

export default Help