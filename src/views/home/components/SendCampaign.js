import React, { useState } from "react"
//import { doAction } from "../../../utils/interact"
//import { useMoralis } from "react-moralis"


const SendCampaign = ({options, onChangeIndex, sendCampaign }) => {

    const [confirm, setConfirm] = useState(false)

 
    const handleChangeIndex = async (value) => {
        if(confirm) {
            if(value > 0) {
               
                onChangeIndex(-300)
            }
            else {
                setConfirm(false)
            }
        }
        else {
            if(value > 0) {
                setConfirm(true);
                sendCampaign();
            }
            else {
                onChangeIndex(value)
            }
        }
    }

    return (
        <div className="d-flex flex-column">
            
            <p className="confirm-desc">Please confirm</p>
            

            <div className="d-flex flex-row justify-around">
                <button className="btn btn-red" onClick={() => handleChangeIndex(-1)} >back</button>
                <button className="btn btn-green" onClick={() => handleChangeIndex(1)} >{confirm ? 'next' : 'send'}</button>
            </div> 

        </div>
    )
}

export default SendCampaign