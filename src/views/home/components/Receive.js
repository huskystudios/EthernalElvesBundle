import React, { useState, useEffect } from "react"

const Receive = ({onChangeIndex}) => {
    const [confirm, setConfirm] = useState(false)
    const [item, setItem] = useState()
    const handleChangeIndex = (value) => {
        if(value > 0) {
            if(confirm){
                onChangeIndex(value)
            }
            else setConfirm(true)
        }
        else onChangeIndex(-5)
    }
    useEffect(() => {
        setItem({
            image: "https://i.ibb.co/sJjnDKg/Untitled.png",
            name: "spead of meadow"
        })
    }, [])
    return (
        <div className="d-flex flex-column receive-panel">
            <span>You Received</span>
            <img className="item-img" src={item?.image} alt="claim background" />
            <span>{item?.name}</span>
            <div className="d-flex flex-row justify-between">
                <button className={confirm ? "btn btn-blue" :"btn btn-red"} onClick={() => handleChangeIndex(-1)} >{confirm ? "reroll" : "discard"}</button>
                <button className="btn btn-green" onClick={() => handleChangeIndex(1)} >{confirm ? "confirm" : "next"}</button>
            </div>
            {confirm && 
            <div className="reroll-panel">
                <p>Requires: .01ETH</p>
                <p>requires: 20miren</p>
            </div>}
        </div>
    )
}



export default Receive