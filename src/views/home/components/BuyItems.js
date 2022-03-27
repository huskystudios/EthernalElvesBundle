import React, { useEffect, useState } from "react"
import { getPawnItems, sendCampaign, getCurrentWalletConnected } from "../../../utils/interact"
import Loader from "../../../components/Loader";

const BuyItems = ({ selected, onTrade, polyBalance}) => {

    const [alert, setAlert] = useState({ show: false, value: null })

    const [campaign, setCampaign] = useState(0)
    const [activeItem, setactiveItem] = useState(0)
    const [itemArray, setitemArray] = useState(0)
    const [loadingStatus, setLoadingStatus] = useState(true)

     
    const handleChangeIndex = async (trade) => {


        let { address } = await getCurrentWalletConnected()
        let tryTokenids = selected[0].id
        let itemIndex = activeItem.id.toString()
        console.log(polyBalance, selected)
        if(trade === "buy"){

            //validations

            if (parseInt(activeItem.currentInventory) === 0) {
                setAlert({
                    show: true, value: {
                        title: "No items left",
                        content: `There are no items left in the store`
                    }
                })
                return
            }

            if (parseInt(polyBalance) < parseInt(activeItem.buyPrice)) {
                setAlert({ show: true, value: { title: "Error", content: "You require more ren to perform this action" } })
                return
            }

            
        }else if(trade === "sell"){
            itemIndex = selected[0].inventory[0].toString()
            if (itemIndex === "0") {
                setAlert({
                    show: true, value: {
                        title: "No Item!",
                        content: `You don't have any items to sell`
                    }
                })
                return
            }
            if (itemIndex === "6") {
                setAlert({
                    show: true, value: {
                        title: "Cant sell this item",
                        content: `This item cannot be bought or sold`
                    }
                })
                return
            }
            if (activeItem.maxSupply === activeItem.currentInventory) {
                setAlert({
                    show: true, value: {
                        title: "Cant sell this item",
                        content: `This items stores are full`
                    }
                })
                return
            }
        }

      
        onTrade({trade, itemIndex, tryTokenids, address})
     

        // onChangeIndex(value)
    }



    const handleCampaignChange = async (value) => {
        setCampaign(value)
        setactiveItem(itemArray[value])
        

    }



    useEffect(() => {
        const getCampaignData = async () => {
            const itemsArray = []
            setLoadingStatus("finding items in store")
            for (let i = 1; i < 6; i++) {

                await getPawnItems(i).then(res => {
                    setLoadingStatus("found item " + res.inventoryString, " with ", res.currentInventory, " units in stock." )
                    itemsArray.push(res)
                })
            }

            console.log(itemsArray)
            //initialize campaign array
            setitemArray(itemsArray)
            setactiveItem(itemsArray[campaign])
            setLoadingStatus("done")

        }
        getCampaignData()
    }, [])

    const showAlert = ({ title, content }) => {

        return (
            <div className="alert">
                <h3>{title}</h3>
                <pre>{content}</pre>
                <button className="btn btn-red" onClick={() => setAlert({ show: false })}>close</button>
            </div>
        )
    }

    return itemArray ? (
        <div>

            <div className="d-flex flex-column overview-content">
                <div className="sector-panel">
                    <div className="carousel">
                        <button className="btn_prev" onClick={() => handleCampaignChange(campaign === 0 ? itemArray.length - 1 : campaign - 1)} />
                        <div className="campaign-slide-passive">
                            <img className="campaign-thumb-passive" src={itemArray[campaign === 0 ? itemArray.length - 1 : campaign - 1].image} alt="campaign" />
                        </div>
                        <div className="campaign-slide">
                            <img className="campaign-thumb" src={itemArray[campaign].image} alt="campaign" />
                            <div className="campaign-title">{itemArray[campaign].inventoryString}</div>
                            <span style={{fontSize: 12, paddingLeft:10}}>{itemArray[campaign].inventoryDescription}</span>

                        </div>
                        <div className="campaign-slide-passive">
                            <img className="campaign-thumb-passive" src={itemArray[(campaign + 1) % itemArray.length].image} alt="campaign" />
                        </div>
                        <button className="btn_next" onClick={() => handleCampaignChange((campaign + 1) % itemArray.length)} />
                    </div>

                    

                        
                </div>
            </div>

            <div className="d-flex justify-center items-center flex-column" >
                                <div className="d-flex flex-column" >
                                <span> SELL FOR $REN {activeItem.buyPrice}</span>
                                <span> BUY FOR $REN {activeItem.sellPrice}</span>
                                <br/>
                                <span> Current Stock: {activeItem.currentInventory} items(s)</span>
                                <br/>
                                <span> MAX ITEM SUPPLY: {activeItem.maxSupply}</span>
                                </div>
                                
           
            </div>    

            <div className="d-flex justify-center items-center p-2" >
                       
                                
                                 <div className="d-flex justify-center flex-column" >
                                 <span>Elf# {selected[0].id},  {selected[0].classString}</span>
                                 <span>Level: {selected[0].level}</span>     
                                    <div className="d-flex p-1" style={{width: "200px"}}>
                                        <img src={selected[0].image} />
                                    </div>
                               
                                                         
                                </div>                          

                                <div className="d-flex justify-center flex-column" >
                              
                                    <span>Item equipped: {selected[0].inventoryString}</span>
                                   
                                {selected[0].inventoryImage && <img style={{width: "150px"}} src={selected[0].inventoryImage} />}
                              
                                    
                                
                                </div>
                                
                                
                       
                            
            </div>


            <div className="d-flex flex-row justify-around">
                <button className="btn btn-green" onClick={() => handleChangeIndex("buy")}>Buy Item</button>
                <button className="btn btn-red" onClick={() => handleChangeIndex("sell")}>Sell Item</button>
            </div>
                      

      
            {alert.show && showAlert(alert.value)}
        </div>

    ) : <Loader text={loadingStatus} />
}



export default BuyItems