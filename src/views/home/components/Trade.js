import React, { useEffect, useMemo, useState } from "react"
import BuyItems from "./BuyItems"

const Trade = ({ data, setAlert, polyBalance, clicked, onTrade }) => {

    const [select , setSelect] = useState([])
    
    const [showTrade , setShowTrade] = useState(false)

    const handleClickHealer = (nft) => {

        //add nft to setSelect if empty, else remove nft from setSelect
        if (select.length === 0) {
          
            setSelect([nft])
        }
        else {
            setSelect([])
        }

    }

    const handleNext = () => {
        if(select.length === 0) {
            setAlert({
                show: true, value: {
                    title: "Nothing Selected",
                    content: `Please select atleast one elf`
                }})
        }else{
            setShowTrade(true)
        }
      
    }

    

  /*
  if(nft.inventory[0] === 6){
                setAlert({
                    show: true, value: {
                        title: "Cant trade this item",
                        content: `Cannot trade this item`
                    }})
            }
  */
    let elvesWithItems = data.filter(item => item.inventoryString !== "Empty")
   
    let elvesWithOutItems = data.filter(item => item.inventoryString === "Empty")
            console.log(showTrade)
    return !showTrade ? (
        <>
            <h3>Trade Items</h3>
            <p>
                Click to select an elf with an item to sell it, or the elf you want to buy an item for.
            </p>
            <div className="flex flex-column w-full items-center">
                <h4>Elves With Items</h4>
                <div className="nft-grid">
                {elvesWithItems.map((nft)=> {

                    return(
                
                    <div className="d-flex flex-column">
                    <span>Elf# {nft.id}</span>
                    <span>{nft.classString}</span>
                    <span>Level: {nft.level}</span>
                    <img onClick={() => handleClickHealer(nft)} className={select.includes(nft) ? "active" : null} src={nft.inventoryImage} alt={nft.inventoryString} key={nft.inventoryString} />
                    <span>{nft.inventoryString}</span>
                    </div>
                   
                    
                    )
                    }

                    )}
                </div>
                <h4>Elves Without Items</h4>
                <div className="nft-grid">
                {elvesWithOutItems.map((nft)=> {

                    return(
                    <div className="d-flex flex-column">
                        <span>Elf# {nft.id}</span>
                        <span>{nft.classString}</span>
                        <span>Level: {nft.level}</span>
                    <img onClick={() => handleClickHealer(nft)} className={select.includes(nft) ? "active" : null} src={nft.image} alt={nft.id} key={nft.id} />
                   
                   
                    </div>
                    
                    )
                    }

                    )}
                </div>
                
            <div className="flex mt-1">
                <button onClick={handleNext} className="btn btn-blue">Next</button>               
            </div>
            </div>
           
        </>
    ) : <BuyItems polyBalance={polyBalance} onTrade={onTrade} selected={select}/>
}


export default Trade

