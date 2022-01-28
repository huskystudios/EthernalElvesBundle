import React from "react"
import Countdown from "react-countdown"

const Collection = ({nft, onChangeIndex}) => {

    return (
        <div className="collection-content d-flex flex-column">
           <div className="collection-panel">
            <div className="d-flex flex-row justify-around flex-wrap collection-selection" >
                <div className="collection-heading">
                Sentinels    
                </div>
                {nft.map((char, index) => {

                        const date = new Date(char.time * 1000)
                        const isActive = new Date() > date        

                    return (
                    <div key={char.name} className="collection-item">                  
                        <img src={char.image} alt="active nft" />
                        
                        <pre>{char.classString} {char.name}</pre>
                        <pre>{char.actionString}</pre>
                        <pre>Level: {char.level}</pre>
                        {!isActive &&  <pre>Healtime:<Countdown date={date} /></pre>}
                    </div>
                    )
                })}
            </div> 
         </div>
         <div className="d-flex flex-row justify-around">
                <button className="btn btn-red" onClick={() => onChangeIndex(-1)} >back</button>
                <button className="btn btn-green" onClick={() => onChangeIndex(1)} >actions</button>
               
            </div>
        </div>
    )
}

export default Collection