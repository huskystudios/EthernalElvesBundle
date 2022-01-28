import React, { useState } from "react"


const SelectToken = () => {
    const [current, setCurrent] = useState(-1)
    const onPageChange = ( value ) => {
    }
    return (
        <div className="collection-content d-flex flex-column">
        <div className="collection-panel">
         <div className="d-flex flex-row justify-around flex-wrap collection-selection" >
             <div className="collection-heading">
             Welcome Sentinels    
             </div>
         <p>
             Some instructions. How to play the game?
           
         </p>
         <pre>
                 UX TESTERS - THIS IS NOT PROD
             </pre>
         </div> 
      </div>

     </div>
    )
}



export default SelectToken